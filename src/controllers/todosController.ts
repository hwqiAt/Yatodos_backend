import { Request, Response } from "express";
import Todo from "../models/Todo";
export async function listTodos(req: Request, res: Response) {
  const userId = req.user!.id;
  const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
  return res.json({ _t: "Ok", data: todos });
}
export async function getTodo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const todo = await Todo.findOne({ _id: id, user: userId });
    if (!todo) return res.status(404).json({ _t: "Err", code: "NotFound" });

    return res.json({ _t: "Ok", data: todo });
  } catch (error) {
    return res.status(500).json({ _t: "Err", code: "ServerError" });
  }
}
export async function createTodo(req: Request, res: Response) {
  try {
    const { title } = req.body;
    const userId = req.user!.id;

    if (!title) {
      return res.status(400).json({ _t: "Err", code: "MissingTitle" });
    }

    if (!userId) {
      return res.status(401).json({ _t: "Err", code: "Unauthorized" });
    }

    const todo = await Todo.create({
      title: title,
      user: userId,
    });

    return res.status(201).json({ _t: "Ok", data: todo });
  } catch (error) {
    let errorMessage = "Một lỗi không xác định đã xảy ra";

    if (error instanceof Error) {
      // Bây giờ TypeScript biết 'error' là một đối tượng Error
      errorMessage = error.message;
    }

    console.error(errorMessage);
  }
}
export async function updateTodo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    const updateFields: { title?: string; completed?: boolean } = {};
    if (title !== undefined) updateFields.title = title;
    if (completed !== undefined) updateFields.completed = completed;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true }
    );

    if (!todo) return res.status(404).json({ _t: "Err", code: "NotFound" });
    return res.json({ _t: "Ok", data: todo });
  } catch (error) {
    return res.status(500).json({ _t: "Err", code: "ServerError" });
  }
}
export async function deleteTodo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const todo = await Todo.findOneAndDelete({ _id: id, user: userId }); // Chỉ xoá todo NÀY và thuộc về user NÀY

    if (!todo) return res.status(404).json({ _t: "Err", code: "NotFound" });
    return res.json({ _t: "Ok", data: { id } });
  } catch (error) {
    return res.status(500).json({ _t: "Err", code: "ServerError" });
  }
}
export async function deleteCompletedTodos(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    await Todo.deleteMany({ user: userId, completed: true });

    return res
      .status(200)
      .json({ _t: "Ok", msg: "Đã xóa các todo hoàn thành" });
  } catch (error) {
    return res.status(500).json({ _t: "Err", code: "ServerError" });
  }
}
