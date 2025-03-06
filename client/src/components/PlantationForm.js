import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArcGISMap from "./ArcGISMap"; // ArcGIS map component

function PlantationForm({ setPlantations = () => {} }) {
  const [formData, setFormData] = useState({
    treeName: "",
    image: null,
    lat: "",
    lng: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Authentication failed. Please log in again.");
    navigate("/login");
    return null;
  }

  const onChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        setAccuracy(accuracy);
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error retrieving location:", error);
        alert("Unable to retrieve location. Please check your permissions.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const handleMapClick = (latitude, longitude) => {
    setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));
    setAccuracy(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("treeName", formData.treeName);
      data.append("lat", formData.lat);
      data.append("lng", formData.lng);
      data.append("image", formData.image);

      const res = await axios.post(
        "http://localhost:5000/api/plantations",
        data,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPlantations((prev) => [...prev, res.data]);
      setFormData({ treeName: "", image: null, lat: "", lng: "" });
      setAccuracy(null);

      alert("Plantation added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Error adding plantation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="plantation-form-wrapper">
      <form onSubmit={onSubmit} className="plantation-form">
        <div className="form-group mb-3">
          <input
            type="text"
            name="treeName"
            placeholder="Tree Name"
            value={formData.treeName}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="file"
            name="image"
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group mb-3 d-flex">
          <input
            type="text"
            name="lat"
            placeholder="Latitude"
            value={formData.lat}
            onChange={onChange}
            required
            className="form-control me-2"
          />
          <input
            type="text"
            name="lng"
            placeholder="Longitude"
            value={formData.lng}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        {accuracy && (
          <p style={{ fontStyle: "italic" }}>
            <br />
            Accuracy: ±{Math.round(accuracy * 0.1)} meters
          </p>
        )}

        <div className="form-group mb-3">
          <button
            type="button"
            onClick={useMyLocation}
            className="btn btn-outline-secondary w-100"
          >
            {loadingLocation
              ? "Getting Location..."
              : "Use My Current Location"}
          </button>
        </div>

        <div className="form-group mb-3">
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting...
              </>
            ) : (
              "Add Plantation"
            )}
          </button>
        </div>
      </form>

      <div className="map-preview mt-4">
        <ArcGISMap
          lat={formData.lat}
          lng={formData.lng}
          onCoordinatesChange={handleMapClick}
        />
      </div>
    </div>
  );
}

export default PlantationForm;