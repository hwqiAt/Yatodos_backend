import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import todosRouter from "./routes/todos.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/todos", todosRouter);
// basic health
app.get("/api/health", (req, res) => res.json({ _t: "Ok", data: { status: "ok" } }));
export default app;
//# sourceMappingURL=app.js.map