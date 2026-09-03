import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Streak } from "@/lib/db/models/Streak";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as { id?: string }).id || session.user.email : null;

    if (!userId) {
      return NextResponse.json({
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: "",
          history: [],
          freezesRemaining: 1,
        },
      });
    }

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: "",
          history: [],
          freezesRemaining: 1,
        },
      });
    }

    let streak = await Streak.findOne({ userId });
    if (!streak) {
      streak = await Streak.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: "",
        history: [],
        freezesRemaining: 1,
      });
    }

    return NextResponse.json({ streak });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
