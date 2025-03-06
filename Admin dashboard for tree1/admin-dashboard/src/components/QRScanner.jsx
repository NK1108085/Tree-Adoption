import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";
import "./qrscanner.css";

const QRScanner = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const isScanningRef = useRef(false); // Using ref to avoid unnecessary re-renders
  const [scanResult, setScanResult] = useState("");
  const navigate = useNavigate();

  const handleVideoLoaded = () => {
    isScanningRef.current = true;
    requestAnimationFrame(captureFrame);
  };

  const captureFrame = useCallback(() => {
    if (!isScanningRef.current) return;

    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (video && video.readyState === 4 && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const imageData = ctx.getImageData(
        0,
        0,
        video.videoWidth,
        video.videoHeight
      );
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        setScanResult(qrCode.data);
        isScanningRef.current = false; // Stop scanning
        navigate("/qr-details", { state: { scannedData: qrCode.data } });
      } else {
        requestAnimationFrame(captureFrame); // Continue scanning
      }
    } else {
      requestAnimationFrame(captureFrame);
    }
  }, [navigate]);

  useEffect(() => {
    if (isScanningRef.current) {
      requestAnimationFrame(captureFrame);
    }
  }, [captureFrame]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          setScanResult(qrCode.data);
          navigate("/qr-details", { state: { scannedData: qrCode.data } });
        } else {
          alert("No QR code detected in the uploaded image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="qr-scanner-container">
      <h1>Scan QR Code</h1>

      <div className="scanner-box">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: "environment" }}
          onUserMedia={handleVideoLoaded}
        />
        <canvas ref={canvasRef} className="hidden-canvas"></canvas>
      </div>
      <h5> the file choose option is for testing purpose only</h5>
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {scanResult && <p className="scan-result">Scanned Data: {scanResult}</p>}
    </div>
  );
};

export default QRScanner;
