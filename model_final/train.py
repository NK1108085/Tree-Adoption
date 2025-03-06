import os
import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image

# Define paths
TRAIN_PATH = 'Train'
TEST_PATH = 'Test'
RESULT_PATH = 'result'

# Ensure result folder structure
for age_group in ['four-to-six', 'ten-to-twelve', 'sixteen-plus']:
    os.makedirs(os.path.join(RESULT_PATH, age_group), exist_ok=True)

# Prepare dataset: Convert images in Train and Test folders to YOLO format if needed
def prepare_dataset():
    for dataset in [TRAIN_PATH, TEST_PATH]:
        for age_group in ['four-to-six', 'ten-to-twelve', 'sixteen-plus']:
            class_folder = os.path.join(dataset, age_group)
            if not os.path.exists(class_folder):
                print(f"Folder not found: {class_folder}")
                continue

            for image_name in os.listdir(class_folder):
                image_path = os.path.join(class_folder, image_name)
                if not image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    print(f"Skipping non-image file: {image_name}")
                    continue

                # Dummy labels because Train contains only trees
                label_path = image_path.replace('.jpg', '.txt').replace('.png', '.txt').replace('.jpeg', '.txt')
                height, width, _ = cv2.imread(image_path).shape

                # Full image bounding box assuming the whole image is the tree
                with open(label_path, 'w') as f:
                    f.write(f"{['four-to-six', 'ten-to-twelve', 'sixteen-plus'].index(age_group)} 0.5 0.5 1.0 1.0\n")

prepare_dataset()

# Train the YOLO model
model = YOLO('yolov8n.pt')
model.train(data='data.yaml', epochs=10, imgsz=640)

# Load trained model
model = YOLO('runs/detect/train/weights/best.pt')

# Process Test images and detect trees
def process_test_images():
    for age_group in ['four-to-six', 'ten-to-twelve', 'sixteen-plus']:
        class_folder = os.path.join(TEST_PATH, age_group)
        result_folder = os.path.join(RESULT_PATH, age_group)

        for image_name in os.listdir(class_folder):
            image_path = os.path.join(class_folder, image_name)

            if not image_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                print(f"Skipping non-image file: {image_name}")
                continue

            image = cv2.imread(image_path)
            results = model.predict(image, conf=0.4)

            image_rgba = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
            red_overlay = np.full_like(image_rgba, (0, 0, 255, 80))  # Transparent red overlay
            image_rgba = cv2.addWeighted(image_rgba, 1, red_overlay, 0.5, 0)

            for result in results:
                boxes = result.boxes.xyxy.cpu().numpy()  # Bounding boxes
                classes = result.boxes.cls.cpu().numpy()  # Class labels

                for box, cls in zip(boxes, classes):
                    x1, y1, x2, y2 = map(int, box)
                    label = model.names[int(cls)]

                    # Apply transparent blue overlay on detected part
                    blue_overlay = np.full_like(image_rgba[y1:y2, x1:x2], (255, 0, 0, 150))
                    image_rgba[y1:y2, x1:x2] = cv2.addWeighted(image_rgba[y1:y2, x1:x2], 0.5, blue_overlay, 0.5, 0)

                    # Draw a green box around the detected part
                    cv2.rectangle(image_rgba, (x1, y1), (x2, y2), (0, 255, 0, 255), 2)

                    # Extract tree region and save as PNG with transparency
                    tree_region = image_rgba[y1:y2, x1:x2]
                    png_path = os.path.join(result_folder, f"{image_name.split('.')[0]}_cutout.png")
                    Image.fromarray(tree_region).save(png_path)

            # Save annotated image with blue detected part and red background
            output_path = os.path.join(result_folder, image_name.split('.')[0] + '.png')
            Image.fromarray(image_rgba).save(output_path)

process_test_images()
