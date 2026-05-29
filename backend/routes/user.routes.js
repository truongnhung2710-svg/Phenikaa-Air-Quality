const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

<<<<<<< HEAD
// ==========================================
// THÔNG TIN CÁ NHÂN (Yêu cầu đăng nhập)
// ==========================================

// GET /api/users/me - Lấy thông tin profile hiện tại
router.get(
  "/me", 
  authMiddleware, 
  userController.getProfile
);

// PUT /api/users/update - Cập nhật thông tin cá nhân (Tên, SĐT, v.v.)
router.put(
  "/update", 
  authMiddleware, 
  userController.updateProfile
);

// PUT /api/users/change-password - Người dùng tự đổi mật khẩu (khi đã login)
=======
// GET profile (me)
router.get("/me", authMiddleware, userController.getProfile);

// UPDATE personal info
router.put("/update", authMiddleware, userController.updateProfile);

// CHANGE password
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
router.put(
  "/change-password",
  authMiddleware,
  userController.changePassword
);

<<<<<<< HEAD
// ==========================================
// QUÊN MẬT KHẨU (Không yêu cầu đăng nhập)
// ==========================================

// POST /api/users/forgot-password - Gửi yêu cầu quên mật khẩu (Gửi OTP/Link qua email)
//router.post(
  //"/forgot-password",
  //userController.forgotPassword
//);

// POST /api/users/reset-password - Đặt lại mật khẩu mới (Sử dụng Token/OTP)
//router.post(
  //"/reset-password",
  //userController.resetPassword
//);

module.exports = router;
=======
// RESET password (forgot password)
router.post("/reset-password", userController.resetPassword);



module.exports = router;
>>>>>>> b055402f05cde08f7f6a02082b568b75ff45ea46
