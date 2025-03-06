import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { useNavigate, useParams } from "react-router-dom";
import "./Update.css";

function UpdatePlantation() {
  const { id } = useParams(); // Get Plantation ID from URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [message, setMessage] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [setShowFailure] = useState(false); // ✅ Fixed state setter
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Starts as true
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(40);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const token = localStorage.getItem("token");
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const stageMapping = {
    0: "four-to-six",
    1: "ten-to-twelve",
    2: "sixteen-plus",
  };

  const fetchStage = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/plantations/stagedefine/${id}`
      );
      setStage(res.data.stage);
      setLoading(false); // ✅ Set loading to false when data is received
    } catch (err) {
      console.error("Error fetching stage:", err);
      setError("Failed to load stage information.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStage();
  }, [fetchStage]);

  // Handle File Input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction("");
      setMessage("");
    }
  };

  // Capture from Webcam
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      console.error("Failed to capture image.");
      return;
    }

    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: mimeString });
    const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

    setSelectedFile(file);
    setPreview(imageSrc);
    setUseCamera(false);
  };

  // Handle Upload & Prediction
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select or capture an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:7000/predict",
        formData
      );
      const predictedValue = response.data.prediction;
      setPrediction(predictedValue);

      const expectedValue = stageMapping[stage];

      if (predictedValue === expectedValue) {
        setMessage("✅ Success! The prediction matches the expected value.");
        setShowRedeem(true);
      } else {
        setMessage(
          "❌ Error! The prediction does not match the expected value."
        );
        setShowFailure(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "⚠️ Prediction failed. The Image Uploaded By you is Not Valid."
      );
    }
  };
  // Timer for redirection
  // Timer effect for redirection
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          alert("Timeout! Redirecting to homepage.");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate]);

  // Redeem Points & Update Stage
  const handleRedeemPoints = async () => {
    if (isRedeemed) return; // Prevent multiple clicks

    if (!id) {
      alert("Plantation ID is missing!");
      return;
    }

    setIsRedeemed(true); // Disable further clicks

    try {
      const response = await axios.post(
        `http://localhost:5000/api/plantations/redeem/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        alert("Failed to redeem points.");
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Something went wrong!");
      setIsRedeemed(false); // Re-enable button if the request fails
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Growth Stage Classification Using Deep Learning</h1>

      <p className="card-text">
        <strong>Plantation ID:</strong> {id}
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p className="card-text">
          <strong>Image of:</strong>{" "}
          {stage !== null ? stageMapping[stage] || `Stage ${stage}` : "Unknown"}
          <strong>After Plantation</strong>{" "}
        </p>
      )}
      <div className="mitanshu">
        <p>The Image Upload Option is for Testing Purpose Only.</p>
        <p>Actual app contains only camera upload Option</p>
        <p>Make sure that the image is uploaded from the ground Only</p>
        <p>Images should be captured at daytime</p>
        <h5>You have to Complete Verification in {timer} seconds</h5>
      </div>

      <input type="file" onChange={handleFileChange} />
      <button onClick={() => setUseCamera(true)} style={{ marginLeft: "10px" }}>
        Use Camera
      </button>
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload & Predict
      </button>

      {preview && (
        <div>
          <h3>Preview:</h3>
          <img
            src={preview}
            alt="Selected"
            style={{ width: "300px", height: "auto", marginTop: "10px" }}
          />
        </div>
      )}

      {useCamera && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            width={400}
            height={300}
          />
          <br />
          <button onClick={capture} style={{ margin: "10px" }}>
            Capture
          </button>
          <button
            onClick={() => setUseCamera(false)}
            style={{ margin: "10px" }}
          >
            Close
          </button>
        </div>
      )}

      {prediction && <h3>Prediction: {prediction}</h3>}
      {message && (
        <h2
          style={{
            color: prediction === stageMapping[stage] ? "green" : "red",
          }}
        >
          {message}
        </h2>
      )}

      {showRedeem && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3>🎉 Success! You earned 200 points!</h3>
          <button onClick={handleRedeemPoints} disabled={isRedeemed}>
            {isRedeemed ? "Redeemed ✅" : "Redeem Points"}
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdatePlantation;
