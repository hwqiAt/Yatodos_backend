"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTodos = listTodos;
exports.getTodo = getTodo;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
exports.deleteCompletedTodos = deleteCompletedTodos;
const Todo_1 = __importDefault(require("../models/Todo"));
async function listTodos(req, res) {
    const userId = req.user.id;
    const todos = await Todo_1.default.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ _t: "Ok", data: todos });
}
async function getTodo(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const todo = await Todo_1.default.findOne({ _id: id, user: userId });
        if (!todo)
            return res.status(404).json({ _t: "Err", code: "NotFound" });
        return res.json({ _t: "Ok", data: todo });
    }
    catch (error) {
        return res.status(500).json({ _t: "Err", code: "ServerError" });
    }
}
async function createTodo(req, res) {
    try {
        const { title } = req.body;
        const userId = req.user.id;
        if (!title) {
            return res.status(400).json({ _t: "Err", code: "MissingTitle" });
        }
        if (!userId) {
            return res.status(401).json({ _t: "Err", code: "Unauthorized" });
        }
        const todo = await Todo_1.default.create({
            title: title,
            user: userId,
        });
        return res.status(201).json({ _t: "Ok", data: todo });
    }
    catch (error) {
        let errorMessage = "Một lỗi không xác định đã xảy ra";
        if (error instanceof Error) {
            // Bây giờ TypeScript biết 'error' là một đối tượng Error
            errorMessage = error.message;
        }
        console.error(errorMessage);
    }
}
async function updateTodo(req, res) {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        // @ts-ignore
        const userId = req.user.id;
        const updateFields = {};
        if (title !== undefined)
            updateFields.title = title;
        if (completed !== undefined)
            updateFields.completed = completed;
        const todo = await Todo_1.default.findOneAndUpdate({ _id: id, user: userId }, updateFields, { new: true });
        if (!todo)
            return res.status(404).json({ _t: "Err", code: "NotFound" });
        return res.json({ _t: "Ok", data: todo });
    }
    catch (error) {
        return res.status(500).json({ _t: "Err", code: "ServerError" });
    }
}
async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;
        const todo = await Todo_1.default.findOneAndDelete({ _id: id, user: userId }); // Chỉ xoá todo NÀY và thuộc về user NÀY
        if (!todo)
            return res.status(404).json({ _t: "Err", code: "NotFound" });
        return res.json({ _t: "Ok", data: { id } });
    }
    catch (error) {
        return res.status(500).json({ _t: "Err", code: "ServerError" });
    }
}
async function deleteCompletedTodos(req, res) {
    try {
        const userId = req.user.id;
        await Todo_1.default.deleteMany({ user: userId, completed: true });
        return res
            .status(200)
            .json({ _t: "Ok", msg: "Đã xóa các todo hoàn thành" });
    }
    catch (error) {
        return res.status(500).json({ _t: "Err", code: "ServerError" });
    }
}
//# sourceMappingURL=todosController.js.map