import os
import torch
import torchvision.transforms as transforms
import torch.nn as nn
import torchvision.models as models
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# Flask setup
app = Flask(__name__)
CORS(app)

# Dataset and labels
LABELS = ["four-to-six", "ten-to-twelve", "sixteen-plus"]

# Load Trained Neem Classification Model (ResNet-50)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet50(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, len(LABELS))  # 3 classes
model.load_state_dict(torch.load("neem_model.pth", map_location=device))
model.eval()
model = model.to(device)

# Load Pretrained Faster R-CNN for non-tree object detection
object_detection_model = models.detection.fasterrcnn_resnet50_fpn(pretrained=False)
object_detection_model.load_state_dict(torch.load("object_detection_model.pth", map_location=device))
object_detection_model.eval()

# Image Transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Function to detect non-tree objects (humans, mobiles)
def detect_non_tree_objects(image_path):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transforms.ToTensor()(image).unsqueeze(0)

    with torch.no_grad():
        predictions = object_detection_model(image_tensor)

    labels = predictions[0]["labels"].tolist()
    non_tree_classes = [1, 77]  # COCO: 1=Person, 77=Mobile

    return any(label in non_tree_classes for label in labels)

# Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400

    file = request.files["file"]
    img = Image.open(file).convert("RGB")

    # Check for non-tree objects
    temp_path = "temp.jpg"
    img.save(temp_path)
    if detect_non_tree_objects(temp_path):
        return jsonify({"prediction": "It is not Tree"}), 200

    # Predict neem category
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted_idx = torch.max(outputs, 1)
        predicted_label = LABELS[predicted_idx.item()]

    return jsonify({"prediction": predicted_label}), 200

if __name__ == "__main__":
    app.run(debug=True, port=7000)
