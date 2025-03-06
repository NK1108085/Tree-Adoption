// backend/models/Plantation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  treeName: { type: String, required: true },
  initialImageUrl: { type: String, required: true },
  stage1ImageUrl: { type: String },
  stage2ImageUrl: { type: String },
  stage3ImageUrl: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  points: { type: Number, default: 0 },
  stage: { type: Number, default: 0 }, // 0 for initial stage, then 1,2,3
  completed: { type: Boolean, default: false }, // true if stage 3 validated
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Plantation', PlantationSchema);