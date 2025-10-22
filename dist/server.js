"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
dotenv_1.default.config();
// Connect to MongoDB and start the server
mongoose_1.default
    .connect(config_1.default.mongoUri)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    app_1.default.listen(config_1.default.port, () => {
        console.log(`🌍 Server running on http://localhost:${config_1.default.port}`);
    });
})
    .catch((err) => console.error("❌ MongoDB connection error:", err));
//# sourceMappingURL=server.js.map