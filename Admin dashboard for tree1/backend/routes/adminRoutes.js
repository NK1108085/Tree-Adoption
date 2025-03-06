const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  getStats,
  getUsers,
  getTrees,
  generateReport,
} = require("../controllers/adminController");

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/plantations", getTrees); // Changed from /trees to /plantations
router.get("/generate-report", generateReport);

// Redeem user points
router.post("/redeem", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user && user.points > 0) {
      user.points = 0; // Reset points after redemption
      await user.save();
      res.json({ success: true, message: "Points redeemed successfully." });
    } else {
      res.json({ success: false, message: "No points to redeem." });
    }
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({ error: "Error redeeming points" });
  }
});

router.post("/deductPointsAll", async (req, res) => {
  try {
    await User.updateMany({}, [
      {
        $set: {
          points: { $max: [{ $subtract: ["$points", 50] }, 0] },
        },
      },
    ]);

    return res.json({
      success: true,
      message: "50 points deducted ",
    });
  } catch (error) {
    console.error("Error deducting points ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Deduct 50 points from a specific user by email
router.post("/deductPoints", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Deduct 50 points but ensure it doesn’t go below 0
    user.points = Math.max(user.points - 50, 0);
    await user.save();

    return res.json({
      success: true,
      message: "50 points deducted successfully.",
      points: user.points,
    });
  } catch (error) {
    console.error("Error deducting points:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
