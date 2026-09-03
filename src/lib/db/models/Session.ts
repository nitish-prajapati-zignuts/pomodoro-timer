import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  userId: string;
  type: "focus" | "shortBreak" | "longBreak";
  durationSeconds: number;
  completedAt: Date;
  taskId?: string | null;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["focus", "shortBreak", "longBreak"], required: true },
    durationSeconds: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    taskId: { type: String, default: null },
  },
  { timestamps: true }
);

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
