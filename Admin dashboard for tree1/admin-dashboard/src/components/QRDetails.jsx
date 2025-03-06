import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./qrdetail.css";

const QRDetails = () => {
  const location = useLocation();
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if (location.state?.scannedData) {
      try {
        const data =
          typeof location.state.scannedData === "string"
            ? JSON.parse(location.state.scannedData)
            : location.state.scannedData;

        setScannedData(data);
      } catch (error) {
        console.error("Error parsing scanned data:", error);
        setScannedData(null);
      }
    }
  }, [location.state]);
  // Deduct 50 points from the scanned user

  // Redeem user points (resets to 0)
  const redeemPoints = async () => {
    if (!scannedData || !scannedData.email) {
      alert("No valid user found.");
      return;
    }

    if (scannedData.points === 0) {
      alert("User already has 0 points.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/redeem", {
        email: scannedData.email,
      });

      if (response.data.success) {
        alert(response.data.message);
        setScannedData((prev) => ({
          ...prev,
          points: 0,
        }));
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Failed to redeem points. Please try again.");
    }
  };

  // Deduct 50 points from all users
  const deductPointsFromAllUsers = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/admin/deductPointsAll"
      );

      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deducting points from all users:", error);
      alert("Failed to deduct points. Please try again.");
    }
  };

  return (
    <div className="qr-details-container">
      <h1>Tree Adopter Details</h1>
      {scannedData ? (
        <>
          <p>
            <strong>Name:</strong> {scannedData.name}
          </p>
          <p>
            <strong>Email:</strong> {scannedData.email}
          </p>
          <p>
            <strong>Points:</strong> {scannedData.points}
          </p>
          <p>
            <strong>Redeemed For:</strong> {scannedData.redeemedFor}
          </p>
        </>
      ) : (
        <p>No data available.</p>
      )}
      <button onClick={deductPointsFromAllUsers}>Deduct 50 Coins</button>
    </div>
  );
};

export default QRDetails;
