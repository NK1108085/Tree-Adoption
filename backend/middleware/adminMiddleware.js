// backend/middleware/adminMiddleware.js
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user);
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
