import { Router } from "express";
import * as ctrl from "../controllers/todosController";

// 1. IMPORT MIDDLEWARE XÁC THỰC CỦA BẠN
// (Tên file và tên hàm có thể khác, ví dụ: '../middleware/authMiddleware' hay '../utils/auth')
import { authMiddleware } from "../middleware/auth";

const router = Router();

// 2. SỬ DỤNG MIDDLEWARE
// Bất kỳ request nào đến /api/todos (GET, POST, PUT, DELETE)
// sẽ phải đi qua 'authMiddleware' NÀY TRƯỚC TIÊN.
// Nếu token hợp lệ, nó sẽ tạo ra 'req.user'.
router.use(authMiddleware);

// 3. CÁC ROUTE CỦA BẠN GIỮ NGUYÊN
// Các hàm controller này bây giờ sẽ luôn có 'req.user'
router.get("/", ctrl.listTodos);
router.get("/:id", ctrl.getTodo);
router.post("/", ctrl.createTodo);
router.put("/:id", ctrl.updateTodo);
router.delete("/:id", ctrl.deleteTodo);
router.delete("/clear/completed", ctrl.deleteCompletedTodos);
export default router;
