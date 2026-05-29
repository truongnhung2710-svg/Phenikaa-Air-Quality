const express = require('express');
const router = express.Router();

// 1. Import Controller
const readingController = require('../controllers/reading.controller');

<<<<<<< HEAD
// 2. Route nhận dữ liệu 
=======
// 2. Route nhận dữ liệu (Đã đổi 'controller' thành 'readingController')
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
router.post('/', readingController.createReading); 

// 3. Route lấy lịch sử dữ liệu từ InfluxDB
router.get('/history', readingController.getHistory);

module.exports = router;
