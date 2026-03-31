const express = require('express');
const router = express.Router();

// 1. Import Controller
const readingController = require('../controllers/reading.controller');

// 2. Route nhận dữ liệu (Đã đổi 'controller' thành 'readingController')
router.post('/', readingController.createReading); 

// 3. Route lấy lịch sử dữ liệu từ InfluxDB
router.get('/history', readingController.getHistory);

module.exports = router;
