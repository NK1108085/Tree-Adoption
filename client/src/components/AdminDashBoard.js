import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Our custom styles

function AdminDashBoard() {
  const [users, setUsers] = useState([]);
  const [plantations, setPlantations] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch all users (admins & normal users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch all plantations from all users
  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/plantations', {
          headers: { 'x-auth-token': token },
        });
        setPlantations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlantations();
  }, [token]);

  // Separate admin users and normal users
  const adminUsers = users.filter(user => user.role === 'admin');
  const normalUsers = users.filter(user => user.role !== 'admin');

  // Helper function to get plantation stats for a user
  const getUserStats = (userId) => {
    const userPlantations = plantations.filter(p => {
      // p.user may be a string or an object (if populated)
      let uid;
      if (typeof p.user === 'object' && p.user._id) {
        uid = p.user._id;
      } else {
        uid = p.user;
      }
      return uid.toString() === userId.toString();
    });
    const total = userPlantations.length;
    const completed = userPlantations.filter(p => p.completed).length;
    const totalPoints = userPlantations.reduce((sum, p) => sum + (p.points || 0), 0);
    return { total, completed, totalPoints };
  };

  return (
    <div className="admin-dashboard container-fluid">
      <div className="row justify-content-center">
        <div className="col-11 col-xl-10">
          <div className="admin-header d-flex justify-content-between align-items-center my-4">
            <h2 className="admin-title">Admin Dashboard</h2>
          </div>

          <div className="row g-4">
            {/* Admins Column */}
            <div className="col-md-6">
              <div className="section-box">
                <h3 className="section-heading">Admins</h3>
                {adminUsers.length === 0 ? (
                  <p>No admin users found.</p>
                ) : (
                  adminUsers.map(admin => (
                    <div key={admin._id} className="card mb-3 shadow-sm hover-card">
                      <div className="card-body">
                        <h5 className="card-title">
                          <i className="bi bi-shield-lock-fill me-2 text-warning"></i>
                          {admin.name}
                        </h5>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Users Column */}
            <div className="col-md-6">
              <div className="section-box">
                <h3 className="section-heading">Users</h3>
                {normalUsers.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  normalUsers.map(user => {
                    const stats = getUserStats(user._id);
                    return (
                      <div key={user._id} className="card mb-3 shadow-sm hover-card">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-person-fill me-2 text-primary"></i>
                            {user.name}
                          </h5>
                          <p className="card-text">
                            <strong>Total Plantations:</strong> {stats.total} <br />
                            <strong>Completed:</strong> {stats.completed} <br />
                            <strong>Total Points:</strong> {stats.totalPoints}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard;
