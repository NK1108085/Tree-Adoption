import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  // Added phoneNumber field along with email and password
  const [formData, setFormData] = useState({ email: '', password: '', phoneNumber: '' });
  const { email, password, phoneNumber } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('Login form submitted with:', formData); // Debug log
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login response:', res.data); // Debug log
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      
      // Navigate based on user role:
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error during login:', err.response ? err.response.data : err);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-card col-md-6">
        <h2 className="login-title text-center">Welcome Back</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          {/* Added Phone Number Field */}
          <div className="mb-3">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (e.g., +919226038185)"
              value={phoneNumber}
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
              value={password}
              onChange={onChange}
              required
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;