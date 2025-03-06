const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  treesPlanted: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  trees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tree" }] // Still referencing Tree model
});

module.exports = mongoose.model("User", UserSchema);
