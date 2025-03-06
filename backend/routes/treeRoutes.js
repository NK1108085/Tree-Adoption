const express = require("express");
const multer = require("multer");
const path = require("path");
const TreeAdoption = require("../models/TreeAdoptionSchema");
const auth = require("../middleware/authMiddleware");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "plantations",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage: storage });

// POST: Adopt a tree
router.post("/adopt", auth, upload.single("image"), async (req, res) => {
  try {
    const { treeName, description, category, contact, location } = req.body;
    if (!treeName || !description || !category || !contact || !location) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const tree = new TreeAdoption({
      treeName,
      description,
      category,
      contact,
      location,
      image: imageUrl,
    });

    await tree.save();
    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: Fetch all tree adoptions
router.get("/", async (req, res) => {
  try {
    const trees = await TreeAdoption.find();
    res.json(trees);
  } catch (error) {
    res.status(500).json({ error: "Server Error!" });
  }
});

module.exports = router;
