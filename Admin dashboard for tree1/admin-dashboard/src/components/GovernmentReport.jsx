import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "./governmentReport.css";

// Custom tree marker icon
const treeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Replace with a suitable icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const GovernmentReport = () => {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    // Fetch tree plantation data from the backend
    axios.get("http://localhost:5001/api/admin/plantations")
      .then(response => setTrees(response.data))
      .catch(error => console.error("Error fetching plantations:", error));
  }, []);

  return ( 
    <div className="gov">
      <h1>Plantation Locations</h1>
      
      <div className="map">

      {/* Map Display */}
      <MapContainer center={[20, 77]} zoom={5} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render tree plantations on the map */}
        {trees.map(tree => (
          <Marker key={tree._id} position={[tree.location.lat, tree.location.lng]} icon={treeIcon}>
            <Popup>
              <strong>Tree Name:</strong> {tree.treeName} <br />
              <strong>Planted by:</strong> {tree.user?.name || "Unknown"} <br />
              <strong>Points Earned:</strong> {tree.points} <br />
              <strong>Growth Stage:</strong> {tree.stage} <br />
              <strong>Completed:</strong> {tree.completed ? "Yes" : "No"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
        </div>
    </div>
  );
};

export default GovernmentReport;