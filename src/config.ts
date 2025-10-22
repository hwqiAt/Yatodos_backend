import dotenv from "dotenv";
dotenv.config();

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

export default {
  jwtSecret: JWT_SECRET,
  mongoUri: MONGO_URI,
  port: PORT,
};
