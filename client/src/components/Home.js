import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [trees, setTrees] = useState([]);
  const [treeAddresses, setTreeAddresses] = useState({});
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  // Fetch tree adoption data from your API
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await axios.get("/api/trees");
        setTrees(response.data);
      } catch (error) {
        console.error("Error fetching adopt tree data:", error);
      }
    };
    fetchTrees();
  }, []);

  // For each tree, fetch the street address via Nominatim reverse geocoding
  useEffect(() => {
    if (trees.length > 0) {
      trees.forEach((tree) => {
        if (!treeAddresses[tree._id] && tree.location) {
          // Assume tree.location is "lat, lng"
          const coords = tree.location.split(",").map((s) => s.trim());
          if (coords.length === 2) {
            const [lat, lng] = coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
            fetch(url, { headers: { "User-Agent": "TreeAdoptionApp/1.0" } })
              .then((response) => response.json())
              .then((data) => {
                if (data && data.display_name) {
                  setTreeAddresses((prev) => ({
                    ...prev,
                    [tree._id]: data.display_name,
                  }));
                }
              })
              .catch((error) =>
                console.error("Error reverse geocoding tree location:", error)
              );
          }
        }
      });
    }
  }, [trees, treeAddresses]);

  // Get user's geolocation and reverse geocode for user's own address
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
          fetch(url, { headers: { "User-Agent": "TreeAdoptionApp/1.0" } })
            .then((response) => response.json())
            .then((data) => {
              if (data.display_name) {
                setAddress(data.display_name);
              } else {
                console.error("No address found in reverse geocoding response.");
              }
            })
            .catch((error) =>
              console.error("Error with reverse geocoding:", error)
            );
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      <div className="background-container">
        <div className="overlay">
          <h1 className="background-heading">Welcome to Tree Adoption</h1>
          <p className="background-subtext">
            Join us in making the planet greener by adopting and nurturing trees.
          </p>
          {address && (
            <p className="location-text">
              Your Location: <strong>{address}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="process-container">
        <h1 className="process-title">Tree Adoption Process Flow</h1>
        <p className="process-intro">
          Our platform encourages individuals to plant and nurture trees. Here’s how the process works:
        </p>
        <div className="process-diagram">
          <div className="process-step">
            <div className="circle">1</div>
            <h3>Adopt a Tree</h3>
            <p>
              Adopt a tree from the Municipal Corporation or plant one yourself.
              Trees provided by the Municipal Corporation are already six months old.
            </p>
          </div>
          <div className="arrow">→</div>
          <div className="process-step">
            <div className="circle">2</div>
            <h3>Register the Tree</h3>
            <p>
              Plant a tree, upload an image, and grant location access to register it.
              The tree must be at least six months old.
            </p>
          </div>
          <div className="arrow">→</div>
          <div className="process-step">
            <div className="circle">3</div>
            <h3>Upload Progress</h3>
            <p>
              Upload images of the tree at intervals of 4 to 6 months. Growth verification is done using a machine learning model.
            </p>
          </div>
          <div className="arrow">→</div>
          <div className="process-step">
            <div className="circle">4</div>
            <h3>Earn Discounts</h3>
            <p>
              Upon successful verification, earn points that can be redeemed for municipal bill discounts.
              The discount amount depends on your city's policies.
            </p>
          </div>
        </div>
        <p className="process-conclusion">
          Start your journey towards a greener future today!
        </p>
      </div>

      {/* Adopt a Tree Carousel Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Adopt a Tree</h2>
        {trees.length > 0 ? (
          <div id="adoptTreeCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {trees.map((tree, index) => (
                <div key={tree._id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <div
                    className="card h-100 shadow-lg border-0 rounded mx-auto"
                    style={{ overflow: "hidden", maxWidth: "400px" }}
                  >
                    <img
                      src={tree.image}
                      className="card-img-top"
                      alt={tree.treeName}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div className="card-body p-3">
                      <h5 className="card-title">{tree.treeName}</h5>
                      <p className="card-text">{tree.description}</p>
                      <ul className="list-unstyled">
                        <li>
                          <strong>Category: </strong>
                          <span className="text-muted">{tree.category}</span>
                        </li>
                        <li>
                          <strong>Contact: </strong>
                          <span className="text-muted">{tree.contact}</span>
                        </li>
                        <li>
                          <strong>Location: </strong>
                          <span className="text-muted">
                            {treeAddresses[tree._id] || tree.location}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#adoptTreeCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#adoptTreeCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <p className="text-center">No adopted trees to display yet.</p>
        )}
      </div>
    </>
  );
};

export default Home;