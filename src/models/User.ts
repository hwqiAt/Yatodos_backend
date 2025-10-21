import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

export type UserDoc = mongoose.Document & {
  email: string;
  password: string;
  username: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default mongoose.model<UserDoc>("User", userSchema);
