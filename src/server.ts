import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import config from "./config";
dotenv.config();

// Connect to MongoDB and start the server
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(`🌍 Server running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
