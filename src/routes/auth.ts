// src/routes/auth.ts
import { Router } from "express";
import * as ctrl from "../controllers/authController";
const router = Router();
console.log("Auth routes loaded");

// Route cũ của bạn
router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

// --- 3 ROUTE RESET MẬT KHẨU ---
router.post("/forgot-password", ctrl.forgotPassword); // Gửi mã 6 số
router.post("/verify-code", ctrl.verifyCode); // Kiểm tra mã 6 số
router.post("/reset-password", ctrl.resetPassword); // Gửi token reset + pass mới

export default router;
