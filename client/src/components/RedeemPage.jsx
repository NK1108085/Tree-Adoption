// client/src/components/RedeemPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import
import "./RedeemPage.css";
import { useNavigate } from "react-router-dom";

function RedeemPage() {
  const [user, setUser] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Stores selected redeem option
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { "x-auth-token": token },
        });

        setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleRedeem = (option) => {
    setSelectedOption(option); // Set selected redeem option
    setShowQRCode(true);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "redeem_qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="redeem-container">
      <h2 className="redeem-title">Redeem Your Points</h2>

      <div className="redeem-options">
        {/* Tax Discount Card */}
        <div className="redeem-card">
          <img src="watertax.jpg" alt="Tax Discount" />
          <button onClick={() => handleRedeem("Tax Discount")}>
            Redeem Tax Discount
          </button>
        </div>

        {/* Government Park Discount Card */}
        <div className="redeem-card">
          <img src="images.jpeg" alt="Government Park Discount" />
          <button onClick={() => handleRedeem("Park Discount")}>
            Redeem Park Discount
          </button>
        </div>
      </div>

      {/* Show QR Code when Redeem is clicked */}
      {showQRCode && user && (
        <div className="qr-container">
          <h3>Your QR Code for {selectedOption}</h3>
          <QRCodeCanvas
            value={JSON.stringify({
              name: user.name,
              email: user.email,
              points: user.points,
              location: user.location,
              redeemedFor: selectedOption,
            })}
            size={200}
          />
          <button className="download-btn" onClick={downloadQRCode}>
            Download QR Code
          </button>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default RedeemPage;