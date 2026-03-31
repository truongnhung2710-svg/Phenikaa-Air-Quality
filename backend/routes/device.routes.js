const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');
const auth = require('../middleware/auth.middleware');

// GET: lấy danh sách trạm
router.get('/', auth, deviceController.getDevices);

// POST: tạo trạm
router.post('/', auth, deviceController.createDevice);

module.exports = router;

