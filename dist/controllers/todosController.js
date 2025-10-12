import Todo from "../models/Todo.js";
export async function listTodos(req, res) {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.json({ _t: "Ok", data: todos });
}
export async function getTodo(req, res) {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo)
        return res.status(404).json({ _t: "Err", code: "NotFound" });
    return res.json({ _t: "Ok", data: todo });
}
export async function createTodo(req, res) {
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ _t: "Err", code: "MissingTitle" });
    const todo = await Todo.create({ title });
    return res.status(201).json({ _t: "Ok", data: todo });
}
export async function updateTodo(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { title, completed }, { new: true });
    if (!todo)
        return res.status(404).json({ _t: "Err", code: "NotFound" });
    return res.json({ _t: "Ok", data: todo });
}
export async function deleteTodo(req, res) {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo)
        return res.status(404).json({ _t: "Err", code: "NotFound" });
    return res.json({ _t: "Ok", data: { id } });
}
//# sourceMappingURL=todosController.js.map