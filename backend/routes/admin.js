// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const Plantation = require('../models/Plantation');
const User = require('../models/User');

// GET: Admin - Get all plantations from all users, sorted by most recent
router.get('/plantations', auth, admin, async (req, res) => {
  try {
    const plantations = await Plantation.find({}).sort({ createdAt: -1 });
    res.json(plantations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Admin - Get all users (optional)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Admin - Get own admin info (optional)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
