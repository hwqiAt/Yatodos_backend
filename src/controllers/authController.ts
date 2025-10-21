import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/generateCode";
import config from "../config";

const JWT_SECRET = config.jwtSecret;

export async function signup(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ _t: "Err", message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ _t: "Err", message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ _t: "Ok", data: { id: user._id, email, username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ _t: "Err", message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ _t: "Err", message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ _t: "Err", message: "Password incorrect" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      _t: "Ok",
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ _t: "Err", message: "Server error" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ _t: "Ok", msg: "email is sent successfully" });
    }

    const otp = generateOTP();

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // set expiration time (5 minutes)
    user.passwordResetExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const message = `Your password reset OTP is: ${otp}. This OTP is valid for 5 minutes.`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ _t: "Ok", msg: "Email has been sent" });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ _t: "Err", message: "Error sending email", error: err.message });
  }
}
export async function verifyCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.findOne({
      email: email,
      passwordResetToken: hashedCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ _t: "Err", msg: "Invalid or expired code" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.json({ _t: "Ok", resetToken: resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ _t: "Err", message: "Server error" });
  }
}
export async function resetPassword(req: Request, res: Response) {
  try {
    const { resetToken, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ _t: "Err", msg: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      _t: "Ok",
      msg: "Password has been updated successfully",
      token: jwtToken,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ _t: "Err", message: "Server error" });
  }
}
