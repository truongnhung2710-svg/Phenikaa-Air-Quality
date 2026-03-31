const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/* =====================
   REGISTER
===================== */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Thiếu email hoặc mật khẩu'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email đã tồn tại'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: 'Đăng ký thành công',
      userId: newUser._id
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({
      message: 'Lỗi server khi đăng ký'
    });
  }
});

/* =====================
   LOGIN
===================== */
router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          message: info?.message || 'Đăng nhập thất bại'
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
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
    }
  )(req, res, next);
});

module.exports = router;
