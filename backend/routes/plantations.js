// backend/routes/plantations.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Plantation = require("../models/Plantation");
const User = require("../models/User");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
// Use dynamic import for node-fetch (v3 is ESM-only)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "plantations",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage: storage });

// Helper function to get coordinates from an address
async function getCoordinates(queryAddress) {
  try {
    const query = encodeURIComponent(queryAddress);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();
    if (data && data.length) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      return { lat: null, lon: null };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return { lat: null, lon: null };
  }
}

// GET: Fetch plantations for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const plantations = await Plantation.find({ user: req.user });
    res.json(plantations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET: Fetch plantations for logged-in user filtered by stage
router.get("/stage/:stage", auth, async (req, res) => {
  try {
    const stage = parseInt(req.params.stage, 10);
    const plantations = await Plantation.find({ user: req.user, stage });
    res.json(plantations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST: Create a new plantation (initial stage)
// Expects form-data with: treeName, (address & country OR lat & lng), and file "image"
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { treeName, address, country, lat, lng } = req.body;
    const imageUrl = req.file ? req.file.path : "";

    let coordinates = { lat: null, lon: null };

    // Use provided coordinates if available, else try to geocode the address
    if (lat && lng) {
      coordinates.lat = parseFloat(lat);
      coordinates.lon = parseFloat(lng);
    } else if (address && country) {
      const fullAddress = `${address}, ${country}`;
      coordinates = await getCoordinates(fullAddress);
    } else {
      return res
        .status(400)
        .json({ msg: "Please provide either lat/lng or address and country." });
    }

    if (coordinates.lat === null || coordinates.lon === null) {
      return res.status(400).json({ msg: "Unable to geocode address" });
    }

    const newPlantation = new Plantation({
      user: req.user,
      treeName,
      initialImageUrl: imageUrl,
      location: {
        lat: coordinates.lat,
        lng: coordinates.lon,
      },
      points: 0,
      stage: 0,
    });
    await newPlantation.save();
    res.json(newPlantation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUT: Update plantation stage (for stage transitions)
// Expects form-data with: stage (one of "stage1", "stage2", "stage3") and file "image"
router.put("/update/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const plantation = await Plantation.findById(req.params.id);
    if (!plantation)
      return res.status(404).json({ msg: "Plantation not found" });
    if (plantation.user.toString() !== req.user)
      return res.status(401).json({ msg: "Not authorized" });

    const { stage } = req.body; // Expected: "stage1", "stage2", "stage3"
    const imageUrl = req.file ? req.file.path : "";

    if (!imageUrl || !stage) {
      return res
        .status(400)
        .json({ msg: "Missing image or stage information" });
    }

    // Dummy ML validation: For testing, always pass.
    let pointsToAdd = 0;
    if (stage === "stage1" && plantation.stage === 0) {
      plantation.stage1ImageUrl = imageUrl;
      pointsToAdd = 50;
    } else if (stage === "stage2" && plantation.stage === 1) {
      plantation.stage2ImageUrl = imageUrl;
      pointsToAdd = 200;
    } else if (stage === "stage3" && plantation.stage === 2) {
      plantation.stage3ImageUrl = imageUrl;
      pointsToAdd = 350;
      plantation.completed = true; // Mark as complete
    } else {
      return res.status(400).json({ msg: "Invalid stage transition" });
    }
    plantation.points += pointsToAdd;
    plantation.stage = plantation.stage + 1;
    plantation.updatedAt = Date.now();

    await plantation.save();
    res.json(plantation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// backend/routes/plantations.js (verifyLocation route)
router.get("/verifyLocation/:id", auth, async (req, res) => {
  try {
    const plantation = await Plantation.findById(req.params.id);
    if (!plantation) {
      return res.status(404).json({ msg: "Plantation not found" });
    }

    // Get user's coordinates from query parameters
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);
    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ msg: "Invalid coordinates provided" });
    }

    // Retrieve plantation's stored location
    const { lat: plantationLat, lng: plantationLng } = plantation.location;

    // Define a tolerance (in degrees) for matching. Now accepts ±0.20 degrees.
    const tolerance = 0.75;
    const latDiff = Math.abs(plantationLat - userLat);
    const lngDiff = Math.abs(plantationLng - userLng);

    if (latDiff <= tolerance && lngDiff <= tolerance) {
      console.log("Match");
      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ msg: "Location does not match plantation location" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// Route to add 200 points to all plantations
router.post("/redeem", async (req, res) => {
  try {
    const result = await Plantation.updateMany(
      {}, // Empty filter means update all documents
      {
        $inc: { points: 200, stage: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    res.status(200).json({
      message: "200 points added and stage increased for all plantations.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Failed to update plantations:", error);
    res
      .status(500)
      .json({ error: "Failed to redeem points and update stage." });
  }
});

// 🌱 Update stage by 1 and add 200 points for the given plantation ID
router.post("/redeem/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find plantation by ID
    const plantation = await Plantation.findById(id);
    if (!plantation) {
      return res.status(404).json({ message: "Plantation not found" });
    }

    // If already completed (stage 3), no further updates
    if (plantation.stage >= 3) {
      return res.status(400).json({ message: "Already at final stage!" });
    }

    // Update stage and points
    plantation.stage += 1;
    plantation.points += 200;

    // Mark as completed if stage 3 reached
    if (plantation.stage === 3) {
      plantation.completed = true;
    }

    plantation.updatedAt = Date.now();
    await plantation.save();

    // Update user points
    const user = await User.findById(plantation.user);
    if (user) {
      user.points += 200;
      await user.save();
    }

    res.json({
      message: `Stage updated to ${plantation.stage} Successfully with 200 points`,
      newStage: plantation.stage,
      plantationPoints: plantation.points,
      userPoints: user ? user.points : "User not found",
    });
  } catch (error) {
    console.error("Error updating plantation and user points:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});
/**
 * Fetch and return the stage of a plantation by ID.
 */
router.get("/stagedefine/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find plantation by ID
    const plantation = await Plantation.findById(id);
    if (!plantation) {
      return res.status(404).json({ message: "Plantation not found" });
    }

    res.json({
      message: `Current stage: ${plantation.stage}`,
      stage: plantation.stage,
    });
  } catch (error) {
    console.error("Error fetching plantation stage:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
