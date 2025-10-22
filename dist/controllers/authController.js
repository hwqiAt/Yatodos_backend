"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.verifyCode = verifyCode;
exports.resetPassword = resetPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
const generateCode_1 = require("../utils/generateCode");
const config_1 = __importDefault(require("../config"));
const JWT_SECRET = config_1.default.jwtSecret;
async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ _t: "Err", message: "Missing fields" });
        const existing = await User_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ _t: "Err", message: "Email already used" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({ username, email, password: hashed });
        res.status(201).json({ _t: "Ok", data: { id: user._id, email, username } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ _t: "Err", message: "Server error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ _t: "Err", message: "User not found" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ _t: "Err", message: "Password incorrect" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({
            _t: "Ok",
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ _t: "Err", message: "Server error" });
    }
}
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res
                .status(200)
                .json({ _t: "Ok", msg: "email is sent successfully" });
        }
        const otp = (0, generateCode_1.generateOTP)();
        user.passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(otp)
            .digest("hex");
        // set expiration time (5 minutes)
        user.passwordResetExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        const message = `Your password reset OTP is: ${otp}. This OTP is valid for 5 minutes.`;
        await (0, sendEmail_1.sendEmail)({
            to: user.email,
            subject: "Password Reset OTP",
            text: message,
            html: `<p>${message}</p>`,
        });
        res.status(200).json({ _t: "Ok", msg: "Email has been sent" });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ _t: "Err", message: "Error sending email", error: err.message });
    }
}
async function verifyCode(req, res) {
    try {
        const { email, code } = req.body;
        const hashedCode = crypto_1.default.createHash("sha256").update(code).digest("hex");
        const user = await User_1.default.findOne({
            email: email,
            passwordResetToken: hashedCode,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ _t: "Err", msg: "Invalid or expired code" });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        res.json({ _t: "Ok", resetToken: resetToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ _t: "Err", message: "Server error" });
    }
}
async function resetPassword(req, res) {
    try {
        const { resetToken, password } = req.body;
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const user = await User_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(400)
                .json({ _t: "Err", msg: "Invalid or expired token" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        user.password = hashed;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        const jwtToken = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.jwtSecret, {
            expiresIn: "7d",
        });
        res.json({
            _t: "Ok",
            msg: "Password has been updated successfully",
            token: jwtToken,
            user: { id: user._id, email: user.email, username: user.username },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ _t: "Err", message: "Server error" });
    }
}
//# sourceMappingURL=authController.js.map