import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
});
export default mongoose.model("Todo", todoSchema);
//# sourceMappingURL=Todo.js.map