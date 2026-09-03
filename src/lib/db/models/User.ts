import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  preferences: {
    focusDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    soundEnabled: boolean;
    soundVolume: number;
    backgroundTheme: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    preferences: {
      focusDuration: { type: Number, default: 25 },
      shortBreakDuration: { type: Number, default: 5 },
      longBreakDuration: { type: Number, default: 15 },
      longBreakInterval: { type: Number, default: 4 },
      autoStartBreaks: { type: Boolean, default: false },
      soundEnabled: { type: Boolean, default: true },
      soundVolume: { type: Number, default: 70 },
      backgroundTheme: { type: String, default: "egypt" },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
