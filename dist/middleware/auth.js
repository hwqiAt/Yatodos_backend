"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
// Lấy secret key từ biến môi trường
// (Phải giống hệt key bạn dùng trong authController)
const JWT_SECRET = config_1.default.jwtSecret;
function authMiddleware(req, res, next) {
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            _t: "Err",
            code: "Unauthorized",
            msg: "Invalid or expired token",
        });
    }
}
//# sourceMappingURL=auth.js.map