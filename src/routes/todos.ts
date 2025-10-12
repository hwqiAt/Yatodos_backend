import { Router } from "express";
import * as ctrl from "../controllers/todosController";
const router = Router();
router.get("/", ctrl.listTodos);
router.get("/:id", ctrl.getTodo);
router.post("/", ctrl.createTodo);
router.put("/:id", ctrl.updateTodo);
router.delete("/:id", ctrl.deleteTodo);
export default router;
