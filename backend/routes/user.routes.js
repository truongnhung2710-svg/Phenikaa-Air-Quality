const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// GET profile (me)
router.get("/me", authMiddleware, userController.getProfile);

// UPDATE personal info
router.put("/update", authMiddleware, userController.updateProfile);

// CHANGE password
router.put(
  "/change-password",
  authMiddleware,
  userController.changePassword
);

// RESET password (forgot password)
router.post("/reset-password", userController.resetPassword);



module.exports = router;
