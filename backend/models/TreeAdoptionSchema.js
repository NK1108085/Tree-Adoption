const mongoose = require("mongoose");

const TreeAdoptionSchema = new mongoose.Schema({
  treeName: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["individual", "organization"], required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("TreeAdoption", TreeAdoptionSchema);