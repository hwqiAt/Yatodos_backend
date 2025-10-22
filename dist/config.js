"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}
if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in .env file.");
    process.exit(1);
}
exports.default = {
    jwtSecret: JWT_SECRET,
    mongoUri: MONGO_URI,
    port: PORT,
};
//# sourceMappingURL=config.js.map