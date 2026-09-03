import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStreak extends Document {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: string[]; // List of dates active
  freezesRemaining: number;
}

const StreakSchema = new Schema<IStreak>(
  {
    userId: { type: String, required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
    history: [{ type: String }],
    freezesRemaining: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Streak: Model<IStreak> =
  mongoose.models.Streak || mongoose.model<IStreak>("Streak", StreakSchema);
