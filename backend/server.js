// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const plantationRoutes = require("./routes/plantations");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/userRoutes");
const cloudinary = require("cloudinary").v2; // ✅ Import user routes

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

app.use("/api/auth", authRoutes);
app.use("/api/plantations", plantationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
const treeRoutes = require("./routes/treeRoutes");
app.use("/api/trees", treeRoutes); // ✅ Add user routes

mongoose
  .connect("mongodb://127.0.0.1:27017/plantApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected!");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(` Server running on port ${port}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
