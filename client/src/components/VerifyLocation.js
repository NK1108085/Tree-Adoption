// client/src/components/VerifyLocation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./VerifyLocation.css";
function VerifyLocation() {
  const { id } = useParams(); // Plantation ID from URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const verify = async (latitude, longitude) => {
      try {
        const res = await axios.get(`/api/plantations/verifyLocation/${id}`, {
          headers: { "x-auth-token": token },
          params: { lat: latitude, lng: longitude },
        });

        if (res.data.success) {
          setVerificationSuccess(true);
          setTimeout(() => {
            navigate(`/update/${id}`);
          }, 5000); // Redirect after 5 seconds
        }
      } catch (err) {
        alert(err.response?.data?.msg || "Location verification failed");
        navigate(-1);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          verify(latitude, longitude);
        },
        (error) => {
          alert(
            "Unable to retrieve location. Please enable location services."
          );
          navigate(-1);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      navigate(-1);
    }
  }, [id, navigate, token]);

  return (
    <div className="verify-container">
      {verificationSuccess ? (
        <>
          <h2 className="success-message">
            ✅ Location Verified Successfully!
          </h2>
          <p className="success-subtext">Redirecting to the update page...</p>
        </>
      ) : (
        <>
          <h2 className="verify-title">Verifying your location...</h2>
          <p className="verify-subtitle">
            Please wait while we check your location.
          </p>
          <div className="loader"></div>
        </>
      )}
        
    </div>
  );
}

export default VerifyLocation;
