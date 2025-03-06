const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  treeName: { type: String, required: true }, 
  initialImageUrl: { type: String, required: true },
  location: { 
    lat: { type: Number, required: true }, 
    lng: { type: Number, required: true }
  },
  points: { type: Number, default: 0 },
  stage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
 }, { collection: "plantations" });

// Ensure that the correct collection name is used
module.exports = mongoose.model("Tree", TreeSchema);
