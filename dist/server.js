import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/todoApp")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
// Routes
app.get("/", (req, res) => {
    res.send("🚀 Server running with TypeScript + Express + MongoDB");
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map