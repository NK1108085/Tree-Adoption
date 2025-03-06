import os
import cv2
import torch
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Define paths
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
MODEL_PATH = "yolov8n-cls.pt"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Ensure required directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load YOLO classification model
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO(MODEL_PATH)

# Define class labels
class_names = ["neem", "mango"]

# Define overlay colors
color_map = {
    "mango": (0, 255, 0),   # Green
    "neem": (255, 0, 0),    # Blue
    "unknown": (0, 0, 255)  # Red for low confidence cases
}

# Function to apply color overlay
def apply_overlay(image, color, alpha=0.3):
    overlay = np.full_like(image, color, dtype=np.uint8)
    return cv2.addWeighted(image, 1 - alpha, overlay, alpha, 0)

# Function to check file extension
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Image classification route
@app.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Save uploaded image
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Process image with YOLO
    results = model.predict(filepath)
    probs = results[0].probs
    top_class = probs.top1
    top_confidence = probs.data[top_class].item()

    # Determine class label
    confidence_threshold = 0.6
    class_name = "unknown" if top_confidence < confidence_threshold else class_names[top_class] if top_class < len(class_names) else "unknown"

    # Apply overlay and save output image
    image = cv2.imread(filepath)
    overlay_color = color_map.get(class_name, (0, 0, 255))
    output_image = apply_overlay(image, overlay_color)

    output_path = os.path.join(OUTPUT_FOLDER, filename)
    cv2.imwrite(output_path, output_image)

    return jsonify({
        "filename": filename,
        "class": class_name,
        "confidence": round(top_confidence, 2),
        "output_image": f"/output/{filename}"
    })

# Serve processed images
@app.route("/output/<filename>")
def get_output_image(filename):
    return app.send_static_file(os.path.join("output", filename))

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
