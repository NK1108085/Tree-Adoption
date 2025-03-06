import React from 'react';
import { Link } from 'react-router-dom';
import { BsTree, BsEnvelope, BsTelephone, BsGeoAlt } from 'react-icons/bs';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <BsTree className="logo-icon" />
              <span className="logo-text">TreeAdopt</span>
            </Link>
            <p className="footer-description">
              Join us in making the world greener, one tree at a time.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/trees" className="footer-link">Our Trees</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-info">
              <p><BsEnvelope /> support@treeadopt.com</p>
              <p><BsTelephone /> (+91) 555-123-4567</p>
              <p><BsGeoAlt /> Maharashtra ,India</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TreeAdopt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;