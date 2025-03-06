import os
import cv2
import torch
import numpy as np
from ultralytics import YOLO

# Define paths
DATASET_PATH = "C:/Users/mitan/Desktop/aaa/Dataset"
INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"
MODEL_PATH = "yolov8n-cls.pt"  # Model file

# Ensure output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Step 1: Train the YOLOv8 Classification Model
def train_model():
    if not os.path.exists(DATASET_PATH):
        raise ValueError(f"❌ Error: Dataset path {DATASET_PATH} does not exist!")

    model = YOLO("yolov8n-cls.pt")  # Load YOLO classification model

    model.train(data=DATASET_PATH, epochs=10, imgsz=224, batch=16, device=device)
    model.export(format="torchscript")  # Save trained model
    print("✅ Model trained and saved successfully!")

# Step 2: Apply Transparent Color Overlay
def apply_overlay(image, color, alpha=0.3):
    overlay = np.full_like(image, color, dtype=np.uint8)  # Create color overlay
    return cv2.addWeighted(image, 1 - alpha, overlay, alpha, 0)  # Blend image & overlay

# Step 3: Load Model and Classify Images
def classify_images():
    if not os.path.exists(MODEL_PATH):
        print("🚀 Training model...")
        train_model()
    
    model = YOLO(MODEL_PATH)
    class_names = ["neem", "mango"]  # Define class labels
    
    # Define overlay colors
    color_map = {
        "mango": (0, 255, 0),   # Green
        "neem": (255, 0, 0),    # Blue
        "unknown": (0, 0, 255)  # Red (for low confidence cases)
    }

    # Process each image in input folder
    for filename in os.listdir(INPUT_FOLDER):
        img_path = os.path.join(INPUT_FOLDER, filename)
        image = cv2.imread(img_path)

        if image is None:
            print(f"⚠️ Skipping invalid image: {filename}")
            continue  # Skip invalid images

        # Run classification
        results = model.predict(img_path)
        probs = results[0].probs  # Get class probabilities
        top_class = probs.top1  # Most probable class
        top_confidence = probs.data[top_class].item()  # Confidence score

        # Classify only if confidence > threshold (e.g., 60%)
        confidence_threshold = 0.6
        if top_confidence < confidence_threshold:
            class_name = "unknown"
        else:
            class_name = class_names[top_class] if top_class < len(class_names) else "unknown"

        # Apply overlay
        overlay_color = color_map.get(class_name, (0, 0, 255))
        output_image = apply_overlay(image, overlay_color)

        # Save the processed image
        output_path = os.path.join(OUTPUT_FOLDER, filename)
        cv2.imwrite(output_path, output_image)
        print(f"✅ {filename} classified as {class_name} (Confidence: {top_confidence:.2f}) and saved to {output_path}")

# Run the pipeline
if __name__ == "__main__":
    classify_images()
