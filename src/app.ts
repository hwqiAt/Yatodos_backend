import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todos";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "https://yatodos-web-git-main-hwqiats-projects.vercel.app",
};
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

export default app;
