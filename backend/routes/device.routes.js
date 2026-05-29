const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');
const auth = require('../middleware/auth.middleware');

<<<<<<< HEAD
router.get('/device-status', deviceController.getChirpStackStatus);
router.post('/', deviceController.createDevice);
=======
// GET: lấy danh sách trạm
router.get('/', auth, deviceController.getDevices);

// POST: tạo trạm
router.post('/', auth, deviceController.createDevice);
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46

module.exports = router;

