import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

// Lấy secret key từ biến môi trường
// (Phải giống hệt key bạn dùng trong authController)
const JWT_SECRET = config.jwtSecret;

// Định nghĩa kiểu cho payload đã giải mã (để khớp với file index.d.ts)
interface UserPayload {
  id: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ _t: "Err", code: "Unauthorized", msg: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      _t: "Err",
      code: "Unauthorized",
      msg: "Token format invalid, must be Bearer",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      _t: "Err",
      code: "Unauthorized",
      msg: "Invalid or expired token",
    });
  }
}
