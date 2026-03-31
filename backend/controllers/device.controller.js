const Device = require('../models/Device');

// POST: tạo trạm (mock)
exports.createDevice = async (req, res) => {
  try {
    const { deviceId, location } = req.body;

    const device = new Device({ deviceId, location });
    await device.save();

    res.json({
      message: 'Device created',
      device
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET: lấy danh sách trạm
exports.getDevices = async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
};
