// client/src/components/StageDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { loadModules } from "esri-loader";
import "./StageDashboard.css";

// Mapping for stage labels
const stageLabels = {
  0: "Initial Stage",
  1: "Stage 1",
  2: "Stage 2",
  3: "Final Stage",
};

function StageDashboard() {
  const [plantations, setPlantations] = useState([]);
  const token = localStorage.getItem("token");
  const { stage } = useParams();
  const stageNum = parseInt(stage, 10);

  // Fetch plantations by stage
  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/plantations/stage/${stageNum}`,
          { headers: { "x-auth-token": token } }
        );
        setPlantations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlantations();
  }, [token, stageNum]);

  // Helper to choose the correct image based on plantation stage
  const getDisplayImage = (p) => {
    switch (p.stage) {
      case 0:
        return p.initialImageUrl;
      case 1:
        return p.stage1ImageUrl || p.initialImageUrl;
      case 2:
        return p.stage2ImageUrl || p.initialImageUrl;
      case 3:
        return p.stage3ImageUrl || p.initialImageUrl;
      default:
        return p.initialImageUrl;
    }
  };

  return (
    <div className="stage-dashboard container my-5">
      <h2 className="text-success mb-4 text-center">
        Plantations - {stageLabels[stageNum] || `Stage ${stageNum}`}
      </h2>

      {plantations.length === 0 ? (
        <p className="no-plantations-text text-center">
          No plantations at this stage.
        </p>
      ) : (
        <div className="row">
          {plantations.map((p) => (
            <div key={p._id} className="col-md-6 mb-4">
              <div className="card plantation-card h-100 shadow-sm">
                {/* Plant image */}
                <img
                  src={getDisplayImage(p)}
                  className="card-img-top show-img"
                  alt={p.treeName}
                />

                {/* Card body: text info */}
                <div className="card-body">
                  <h5 className="card-title">{p.treeName}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {p.location.lat}, {p.location.lng}
                  </p>
                  <p className="card-text">
                    <strong>Points:</strong> {p.points}
                  </p>
                  <p className="card-text">
                    <strong>Date:</strong>{" "}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Stage:</strong>{" "}
                    {stageLabels[p.stage] || `Stage ${p.stage}`}
                  </p>
                </div>

                {/* ArcGIS map goes here, same spot as Leaflet map used to be */}
                <div className="card-map" style={{ height: "200px", width: "100%" }}>
                  <ArcGISMap
                    lat={p.location.lat}
                    lng={p.location.lng}
                    treeName={p.treeName}
                  />
                </div>

                {/* Card footer with Update button */}
                <div className="card-footer text-center p-3">
                  {p.stage < 3 ? (
                    <Link
                      to={`/verifyLocation/${p._id}`}
                      className="btn btn-primary"
                    >
                      Update
                    </Link>
                  ) : p.completed ? (
                    <span className="text-success fw-bold">✔ Completed</span>
                  ) : (
                    <Link
                      to={`/verifyLocation/${p._id}`}
                      className="btn btn-primary"
                    >
                      Update
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ArcGISMap Component
 * Renders a single ArcGIS map with one marker at [lng, lat].
 */
function ArcGISMap({ lat, lng, treeName }) {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;
    let graphicsLayer;

    // Load ArcGIS modules
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer"],
      { css: true }
    )
      .then(([ArcGISMap, MapView, Graphic, GraphicsLayer]) => {
        // Create the map
        const map = new ArcGISMap({
          basemap: "streets-navigation-vector",
        });

        // Create a layer for the marker
        graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Create the map view
        view = new MapView({
          container: mapRef.current,
          map: map,
          center: [parseFloat(lng) || 0, parseFloat(lat) || 0], // ArcGIS wants [longitude, latitude]
          zoom: 13,
        });

        // Create a marker graphic
        const pointGraphic = new Graphic({
          geometry: {
            type: "point",
            longitude: parseFloat(lng) || 0,
            latitude: parseFloat(lat) || 0,
          },
          symbol: {
            type: "simple-marker",
            style: "circle",
            color: [226, 119, 40],
            size: "12px",
            outline: {
              color: [255, 255, 255],
              width: 1,
            },
          },
          popupTemplate: {
            title: treeName || "Plantation",
            content: `
              <p><strong>Latitude:</strong> ${lat}</p>
              <p><strong>Longitude:</strong> ${lng}</p>
            `,
          },
        });

        graphicsLayer.add(pointGraphic);
      })
      .catch((err) => {
        console.error("ArcGIS load error: ", err);
      });

    // Cleanup on unmount
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [lat, lng, treeName]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default StageDashboard;