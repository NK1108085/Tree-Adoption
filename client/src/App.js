// client/src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddPlantation from "./components/AddPlantation";
import AdminDashBoard from "./components/AdminDashBoard";
import StageDashboard from "./components/StageDashboard";
import UpdatePlantation from "./components/UpdatePlantation";
import VerifyLocation from "./components/VerifyLocation";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import RedeemPage from "./components/RedeemPage";
import Chatbot from "./components/Chatbot";
import AdoptTree from "./components/AdoptTree";

function App() {
  const [stage, setStage] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        const response = await axios.get("/api/plantations/stage");
        setStage(response.data.stage);
      } catch (error) {
        console.error("Failed to fetch stage:", error);
      }
    };
    fetchStage();
  }, []);

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  return (
    <Router>
      <Layout>
        <div className="App">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/adopt-tree"
              element={
                <PrivateRoute>
                  <AdoptTree />
                </PrivateRoute>
              }
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-plantation"
              element={
                <PrivateRoute>
                  <AddPlantation />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashBoard />
                </PrivateRoute>
              }
            />
            <Route
              path="/stage/:stage"
              element={
                <PrivateRoute>
                  <StageDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/update/:id"
              element={
                <PrivateRoute>
                  <UpdatePlantation stage={stage} />
                </PrivateRoute>
              }
            />
            <Route
              path="/verifyLocation/:id"
              element={
                <PrivateRoute>
                  <VerifyLocation />
                </PrivateRoute>
              }
            />
            <Route
              path="/redeem"
              element={
                <PrivateRoute>
                  <RedeemPage />
                </PrivateRoute>
              }
            />
          </Routes>

          <button
            onClick={toggleChatbot}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "10px 20px",
              zIndex: 1100,
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showChatbot ? "Close Chatbot" : "Open Chatbot"}
          </button>

          {showChatbot && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1000,
                backgroundColor: "white",
                overflow: "auto",
              }}
            >
              <Chatbot />
            </div>
          )}
        </div>
      </Layout>
    </Router>
  );
}

export default App;
