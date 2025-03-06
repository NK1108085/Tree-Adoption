from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configure Gemini API key (Free Mode)
genai.configure(api_key="AIzaSyBpPqMICSwAotfoziIK2W2aRJxfahyCYcs")
model = genai.GenerativeModel("gemini-1.5-flash")  # Free Model

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    response = model.generate_content(user_message)
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True, port=9000)  # Running on port 9000
