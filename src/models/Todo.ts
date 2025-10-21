import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export type TodoDoc = mongoose.Document & {
  user: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
};

export default mongoose.model<TodoDoc>("Todo", todoSchema);
