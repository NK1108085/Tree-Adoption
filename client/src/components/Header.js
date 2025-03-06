// client/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsTree } from "react-icons/bs";
import "./Layout.css";

const Header = () => {
  const navigate = useNavigate();
  const userRole = (localStorage.getItem("userRole") || "").trim();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content d-flex justify-content-between align-items-center">
          <Link to="/home" className="logo">
            <BsTree className="logo-icon" />
            <span className="logo-text">TreeAdopt</span>
          </Link>
          <nav className="nav-menu">
            {!userRole ? (
              <>
                <Link to="/home" className="nav-link">
                  Home
                </Link>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Get Started
                </Link>
              </>
            ) : userRole === "admin" ? (
              <>
                <Link to="/admin" className="nav-link">
                  Admin Dashboard
                </Link>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>

                <Link to="/adopt-tree" className="nav-link">Adopt a Tree</Link>

                <Link to="/add-plantation" className="nav-link">
                  Add Plantations
                </Link>
                <div className="dropdown d-inline-block">
                  <button
                    className="btn btn-secondary dropdown-toggle nav-button"
                    type="button"
                    id="stageDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Stage
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="stageDropdown">
                    <li>
                      <Link className="dropdown-item" to="/stage/0">
                        Initial Stage
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/stage/1">
                        Stage 1
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/stage/2">
                        Stage 2
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/stage/3">
                        Final Stage
                      </Link>
                    </li>
                  </ul>
                </div>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
