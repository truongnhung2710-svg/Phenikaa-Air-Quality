const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  devEui: String,
  deviceName: String,
  co_ppm: Number,   // đổi từ coValue sang co_ppm
  unit: String,
  status: String,
  time: { type: Date, default: Date.now }
  // bỏ coValue và deviceId required
});

module.exports = mongoose.model('Reading', ReadingSchema);

