const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true }, // New field for the phone number
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin','commercial'], default: 'user' } 
});

module.exports = mongoose.model('User', UserSchema);