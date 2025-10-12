import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

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
      return res
        .status(400)
        .json({ _t: "Err", message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ _t: "Err", message: "Invalid credentials" });

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
