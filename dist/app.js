"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const todos_1 = __importDefault(require("./routes/todos"));
// dotenv.config();
// const app = express();
// app.use(express.json());
// const allowedOrigins = [
//   "https://yatodos-web.vercel.app/",
//   "http://localhost:3000",
//   "https://yatodo.netlify.app/",
// ];
// type CorsCallback = (err: Error | null, allow?: boolean) => void;
// const corsOptions: CorsOptions = {
//   origin: function (
//     origin: string | undefined, // Thêm kiểu cho origin
//     callback: CorsCallback // Sử dụng kiểu đã định nghĩa
//   ) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// app.use(cors(corsOptions));
// app.use("/api/auth", authRoutes);
// app.use("/api/todos", todoRoutes);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// SỬA Ở ĐÂY: Dùng cors() không có tham số
app.use((0, cors_1.default)());
app.use("/api/auth", auth_1.default);
app.use("/api/todos", todos_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map