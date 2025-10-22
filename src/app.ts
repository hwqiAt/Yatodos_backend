import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://yatodos-web-git-main-hwqiats-projects.vercel.app",
  "http://localhost:3000",
];
type CorsCallback = (err: Error | null, allow?: boolean) => void;

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined, // Thêm kiểu cho origin
    callback: CorsCallback // Sử dụng kiểu đã định nghĩa
  ) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;
