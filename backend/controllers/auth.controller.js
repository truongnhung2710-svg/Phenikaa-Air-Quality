const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
<<<<<<< HEAD
const nodemailer = require('nodemailer'); 

// ==========================================
// 1. HÀM ĐĂNG NHẬP 
// ==========================================
=======

>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }

<<<<<<< HEAD
   
=======
    // 👉 TẠO TOKEN
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,             
      userId: user._id,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
<<<<<<< HEAD

// ==========================================
// 2. HÀM KHÔI PHỤC MẬT KHẨU 
// ==========================================
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Kiểm tra xem email có tồn tại trong hệ thống không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
    }

    // 2. Tạo mật khẩu mới ngẫu nhiên (8 ký tự)
    const newPassword = Math.random().toString(36).slice(-8);

    // 3. Mã hóa và lưu mật khẩu mới đè vào Database
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 4. Cấu hình tài khoản gửi mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'truongnhung2710@gmail.com', // Email hệ thống của bạn
        pass: 'ztfcyhlgmaqxrays'           // App Password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 5. Giao diện Email gửi đi
    const mailOptions = {
      from: '"Phenikaa CO System" <truongnhung2710@gmail.com>',
      to: email,
      subject: '🔑 Khôi phục mật khẩu Phenikaa CO System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #3b82f6; border-radius: 8px;">
          <h2 style="color: #3b82f6;">KHÔI PHỤC MẬT KHẨU</h2>
          <p>Xin chào,</p>
          <p>Hệ thống đã nhận được yêu cầu cấp lại mật khẩu cho tài khoản của bạn.</p>
          <p>Mật khẩu mới của bạn là: <strong style="color: #ef4444; font-size: 18px; padding: 4px 8px; background: #fee2e2; border-radius: 4px;">${newPassword}</strong></p>
          <p style="margin-top: 20px;">Vui lòng đăng nhập lại bằng mật khẩu này nhé!</p>
        </div>
      `
    };

    // 6. Thực thi gửi mail
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Đã reset và gửi mật khẩu mới tới ${email}`);

    res.status(200).json({ message: 'Gửi email thành công!' });

  } catch (err) {
    console.error('❌ Lỗi gửi mail reset password:', err);
    res.status(500).json({ message: 'Lỗi server khi gửi email', error: err.message });
  }
};
=======
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
