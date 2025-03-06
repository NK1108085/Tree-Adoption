import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/signup", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center">
      <div className="nature-pattern"></div>

      <div className="signup-card col-md-6">
        <h2 className="signup-title text-center">Sign Up</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          {/* New Phone Number Field */}
          <div className="mb-3">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (e.g., +919226038185)"
              value={formData.phoneNumber}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* Tree Image Overlay */}
      <div className="tree-image-overlay"></div>
    </div>
  );
}

export default Signup;