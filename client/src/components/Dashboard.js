// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./Dashboard.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Dashboard() {
  const [plantations, setPlantations] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Navigation function

  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/plantations", {
          headers: { "x-auth-token": token },
        });
        setPlantations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlantations();
  }, [token]);

  // Sum all points
  const totalPoints = plantations.reduce((acc, p) => acc + (p.points || 0), 0);

  return (
    <div className="dashboard-container container my-5">
      {/* Heading + total points row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title text-success">Your Plantations</h2>
        <h4 className="text-secondary m-0">
          Total Points: <span className="fw-bold">{totalPoints}</span>
        </h4>
        {/* Redeem Points Button */}
        <button className="btn btn-primary" onClick={() => navigate("/redeem")}>
          Redeem Points
        </button>
      </div>

      {plantations.length === 0 ? (
        <p className="no-plantations-text text-center">
          You haven’t added any plantations yet.
        </p>
      ) : (
        <div className="row">
          {plantations.map((p) => (
            <div key={p._id} className="col-md-4 mb-4">
              <div className="card plantation-card h-100 shadow-sm">
                <img
                  src={p.initialImageUrl}
                  className="card-img-top show-img"
                  alt={p.treeName}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.treeName}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {p.location.lat},{" "}
                    {p.location.lng}
                  </p>
                  <p className="card-text">
                    <strong>Points:</strong> <b>{p.points}</b>
                  </p>
                  <p className="card-text">
                    <strong>Date:</strong>{" "}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Stage:</strong>{" "}
                    {p.stage === 0 ? "Initial Stage" : `Stage ${p.stage}`}
                    {p.completed ? " ✅ Completed" : ""}
                  </p>
                </div>
                <div className="card-map">
                  <MapContainer
                    center={[p.location.lat, p.location.lng]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker position={[p.location.lat, p.location.lng]}>
                      <Popup>{p.treeName}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;