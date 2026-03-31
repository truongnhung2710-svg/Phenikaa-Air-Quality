const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// --- UPDATE PERSONAL INFO ---
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// --- CHANGE PASSWORD ---
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Provide old and new password' });

    const user = await User.findById(req.user.userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// --- RESET PASSWORD ---
const nodemailer = require("nodemailer");

// ... (Các hàm getProfile, updateProfile, changePassword giữ nguyên ở trên) ...

// --- HÀM KHÔI PHỤC MẬT KHẨU (Tự động sinh pass & Gửi mail) ---
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Vui lòng cung cấp email!" });
  }

  try {
    // 1. Kiểm tra xem email có trong DB không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // 2. Tự động sinh ra 1 mật khẩu ngẫu nhiên (8 ký tự)
    const newRandomPassword = Math.random().toString(36).slice(-8);

    // 3. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newRandomPassword, salt);

    // 4. Lưu pass mới vào Database
    user.password = hashedPassword;
    await user.save();

    // 5. Cấu hình gửi mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'truongnhung2710@gmail.com', // Email hệ thống của bạn
        pass: 'ztfcyhlgmaqxrays'           // App Password của bạn
      }
    });

    // 6. Nội dung email
    const mailOptions = {
      from: '"Hệ Thống Phenikaa" <truongnhung2710@gmail.com>',
      to: email,
      subject: '🔑 Yêu cầu khôi phục mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #f59e0b;">KHÔI PHỤC MẬT KHẨU</h2>
          <p>Chào bạn,</p>
          <p>Hệ thống đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong>.</p>
          <p>Mật khẩu mới của bạn là: <strong style="font-size: 20px; color: #ef4444; background: #fee2e2; padding: 5px 10px; border-radius: 4px; letter-spacing: 2px;">${newRandomPassword}</strong></p>
          <p>Vui lòng sử dụng mật khẩu này để đăng nhập, sau đó vào mục <strong>Hồ sơ cá nhân</strong> để đổi lại mật khẩu của riêng bạn nhằm đảm bảo an toàn.</p>
          <p>Trân trọng,</p>
        </div>
      `
    };

    // 7. Gửi mail đi
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Đã gửi mật khẩu mới ngẫu nhiên cho email: ${email}`);

    res.status(200).json({ message: "Mật khẩu mới đã được gửi vào email của bạn!" });

  } catch (error) {
    console.error("❌ Lỗi reset password:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xử lý yêu cầu." });
  }
};
