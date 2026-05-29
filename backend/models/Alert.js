const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  coValue: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'WARNING' // WARNING | DANGER
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
