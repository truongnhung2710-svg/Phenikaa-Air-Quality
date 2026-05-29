// routes/uplink.routes.js
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const nodemailer = require('nodemailer');
const Alert = require('../models/Alert'); 

// Cấu hình Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'truongnhung2710@gmail.com',
    pass: 'ztfcyhlgmaqxrays' 
  },
  tls: { rejectUnauthorized: false }
});

router.post('/uplink', async (req, res) => {
  try {
    const payload = req.body;
    const now = new Date();

    // 1. BÓC TÁCH DỮ LIỆU
    const devEui = payload.deviceInfo?.devEui || "Unknown";
    const deviceName = payload.deviceInfo?.deviceName || "Trạm Mặc Định";
    
    let coValue = 0;

    if (payload.object) {
      coValue = payload.object.co_ppm || payload.object.co || payload.object.value || 0;
    } else if (payload.objectJSON) {
      try {
        const decoded = typeof payload.objectJSON === 'string' ? JSON.parse(payload.objectJSON) : payload.objectJSON;
        coValue = decoded.co_ppm || decoded.co || decoded.value || 0;
      } catch (e) {
        console.error("Lỗi parse objectJSON:", e);
      }
    }

    coValue = Number(coValue);
    console.log(`[DEBUG] Trạm ${deviceName} đo được CO: ${coValue} ppm`);


    // 2. GỬI DỮ LIỆU REALTIME QUA SOCKET.IO
    const io = req.app.get("io");
if (io) {
  const newData = { /* ... */ };
  console.log("🚀 Đang gửi dữ liệu Realtime qua Socket:", newData); // THÊM DÒNG NÀY
  io.emit("co_realtime_data", newData);
} else {
  console.log("❌ LỖI: Không tìm thấy biến IO, Socket bị xịt!"); // THÊM DÒNG NÀY
}

    // ==========================================
    // 3. LOGIC LƯU CẢNH BÁO & GỬI MAIL (TEST NGƯỠNG 2PPM)
    // ==========================================
    const THRESHOLD = 2; 

    if (coValue > THRESHOLD) {
      const alertType = 'WARNING_INSTANT';
      console.log(`⚠️ Kích hoạt cảnh báo ${alertType} cho trạm ${deviceName}`);

      try {
        const newAlert = new Alert({
          deviceId: deviceName, 
          coValue: coValue,
          threshold: THRESHOLD,
          status: alertType,
          time: now
        });
        await newAlert.save();
        console.log("✅ ĐÃ LƯU THÀNH CÔNG CẢNH BÁO VÀO MONGODB!");
        console.log("📍 --- THÔNG TIN NƠI LƯU THỰC TẾ ---");
        console.log("📍 Tên Cluster/Host:", newAlert.db.host);
        console.log("📍 Tên Database:", newAlert.db.name);
        console.log("📍 Tên Bảng (Collection):", newAlert.collection.name);
        console.log("📍 ---------------------------------");
      } catch (alertErr) {
        console.log("❌ LỖI LƯU CẢNH BÁO MONGODB:", alertErr.message);
      }

      const emailSubject = `[CẢNH BÁO] Khí CO tại ${deviceName} bắt đầu vượt ngưỡng 2ppm`;
      const emailHtml = `<h2>⚠️ Cảnh báo nồng độ CO tăng cao</h2>
           <p>Hệ thống ghi nhận nồng độ CO tại <strong>${deviceName}</strong> vừa chạm ngưỡng cảnh báo.</p>
           <p><strong>Nồng độ hiện tại:</strong> <span style="color:orange">${coValue} ppm</span></p>`;

      // Bắt lỗi gửi mail
      try {
        await transporter.sendMail({
          from: '"Hệ thống giám sát CO" <truongnhung2710@gmail.com>',
          to: 'truongnhung2710@gmail.com', 
          subject: emailSubject,
          html: emailHtml
        });
        console.log("✉️ Đã gửi Email cảnh báo thành công!");
      } catch (mailErr) {
        console.log("❌ LỖI GỬI EMAIL:", mailErr.message);
      }
    }

    res.json({ status: "ok" });

  } catch (err) {
    console.error("❌ Lỗi tổng xử lý Uplink:", err);
=======

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
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
    res.status(500).json({ status: "error", message: err.message });
  }
});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
