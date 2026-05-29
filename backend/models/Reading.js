const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  devEui: String,
  deviceName: String,
<<<<<<< HEAD
  co_ppm: Number,   
  unit: String,
  status: String,
  time: { type: Date, default: Date.now }
  
=======
  co_ppm: Number,   // đổi từ coValue sang co_ppm
  unit: String,
  status: String,
  time: { type: Date, default: Date.now }
  // bỏ coValue và deviceId required
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
});

module.exports = mongoose.model('Reading', ReadingSchema);

