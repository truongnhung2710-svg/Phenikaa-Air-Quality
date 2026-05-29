const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Alert = require('../models/Alert');

// Cấu hình transporter gửi mail bằng Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'truongnhung2710@gmail.com', // Email hệ thống
    pass: 'ztfcyhlgmaqxrays'           // App Password
<<<<<<< HEAD
  },
  tls: {
    rejectUnauthorized: false 
  }
});


=======
  }
});

// API nhận cảnh báo: POST /api/alerts/trigger
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
router.post('/trigger', async (req, res) => {
  const { deviceId, coValue, threshold, emailTo } = req.body;

  try {
    // 1. LƯU MONGODB
<<<<<<< HEAD
    const alertStatus = coValue > 35 ? 'DANGER' : 'WARNING'; 
=======
    const alertStatus = coValue > 50 ? 'DANGER' : 'WARNING'; 
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
    
    const newAlert = new Alert({
      deviceId: deviceId,
      coValue: coValue,
      threshold: threshold,
      status: alertStatus
    });
    await newAlert.save();
    console.log(`✅ Đã lưu cảnh báo vào DB: ${deviceId} - ${coValue}ppm`);

    // 2. GỬI EMAIL
    if (emailTo) {
      const mailOptions = {
        from: '"Phenikaa CO Monitor" <truongnhung2710@gmail.com>',
        to: emailTo,
        subject: `[${alertStatus}] Cảnh báo Nồng độ CO vượt mức tại ${deviceId}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
            <h2 style="color: #ef4444;">🚨 CẢNH BÁO NỒNG ĐỘ KHÍ CO CAO!</h2>
            <p>Hệ thống ghi nhận mức CO nguy hiểm tại <strong>${deviceId}</strong>.</p>
            <ul>
              <li><strong>Nồng độ đo được:</strong> <span style="color: red; font-weight: bold;">${coValue} ppm</span></li>
              <li><strong>Ngưỡng an toàn:</strong> &lt; ${threshold} ppm</li>
              <li><strong>Mức độ:</strong> ${alertStatus}</li>
              <li><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</li>
            </ul>
            <p style="margin-top: 20px;">Vui lòng kiểm tra và xử lý ngay lập tức!</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ Đã gửi email cảnh báo tới ${emailTo}`);
    }

    res.status(201).json({ message: 'Đã lưu cảnh báo và gửi email' });

  } catch (error) {
    console.error('❌ Lỗi xử lý cảnh báo:', error);
    res.status(500).json({ message: 'Lỗi server khi xử lý', error: error.message });
  }
});

// API Lấy danh sách (GET /api/alerts)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ time: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy dữ liệu', error: error.message });
  }
});

module.exports = router;
