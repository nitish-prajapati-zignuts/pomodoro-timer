import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Session } from "@/lib/db/models/Session";
import { Streak } from "@/lib/db/models/Streak";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const rawUserId = session?.user ? (session.user as { id?: string }).id || session.user.email : null;

    if (!rawUserId) {
      return NextResponse.json({ sessions: [], totalFocusMinutes: 0 });
    }
    const userId = String(rawUserId);

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ sessions: [], totalFocusMinutes: 0 });
    }

    const sessions = await Session.find({ userId }).sort({ completedAt: -1 }).limit(50);
    const totalFocusSeconds = sessions
      .filter((s) => s.type === "focus")
      .reduce((acc, curr) => acc + curr.durationSeconds, 0);

    return NextResponse.json({
      sessions,
      totalFocusMinutes: Math.round(totalFocusSeconds / 60),
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUserId = session?.user ? (session.user as { id?: string }).id || session.user.email : "guest";
    const userId = String(rawUserId);

    const body = await req.json();
    const { type, durationSeconds, taskId } = body;

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ success: true, savedLocally: true });
    }

    const newSession = await Session.create({
      userId,
      type,
      durationSeconds,
      taskId: taskId ? String(taskId) : undefined,
      completedAt: new Date(),
    });

    // If it's a focus session, update the streak
    if (type === "focus") {
      const todayStr = new Date().toISOString().split("T")[0];
      let streak = await Streak.findOne({ userId });

      if (!streak) {
        streak = await Streak.create({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: todayStr,
          history: [todayStr],
        });
      } else {
        const lastDate = streak.lastActiveDate;
        if (lastDate !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastDate === yesterdayStr) {
            streak.currentStreak += 1;
          } else {
            streak.currentStreak = 1;
          }

          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }
          streak.lastActiveDate = todayStr;
          if (!streak.history.includes(todayStr)) {
            streak.history.push(todayStr);
          }
          await streak.save();
        }
      }
    }

    return NextResponse.json({ session: newSession });
  } catch (error) {
    console.error("Error logging session:", error);
    return NextResponse.json({ error: "Failed to log session" }, { status: 500 });
  }
}
