import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  trackedSeconds: number;
  parentId?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    estimatedPomodoros: { type: Number, default: 1 },
    completedPomodoros: { type: Number, default: 0 },
    trackedSeconds: { type: Number, default: 0 },
    parentId: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
