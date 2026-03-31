// routes/uplink.routes.js
const express = require('express');
const router = express.Router();

// POST /api/lorawan/uplink
router.post('/uplink', async (req, res) => {
  console.log("📡 Uplink received:");
  console.log(JSON.stringify(req.body, null, 2));

  // Lấy MongoDB từ mongoose
  const Reading = require('../models/Reading'); // nếu bạn có model Reading
  try {
    const payload = req.body;

    // Lưu Reading vào MongoDB
    const reading = new Reading({
      devEui: payload.deviceInfo?.devEui,
      deviceName: payload.deviceInfo?.deviceName,
      co: payload.data?.co_ppm,
      unit: payload.data?.unit,
      status: payload.data?.status,
      time: new Date()
    });

    await reading.save();
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
