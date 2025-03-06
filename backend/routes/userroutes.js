//userroute in route folder

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Ensure correct middleware
const User = require("../models/User");

const router = express.Router();

// Get the currently logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;