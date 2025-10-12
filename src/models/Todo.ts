import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});
export type TodoDoc = mongoose.Document & {
  title: string;
  completed: boolean;
  createdAt: Date;
};
export default mongoose.model<TodoDoc>("Todo", todoSchema);
