import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Task } from "@/lib/db/models/Task";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const rawUserId = session?.user ? (session.user as { id?: string }).id || session.user.email : null;

    if (!rawUserId) {
      return NextResponse.json({ tasks: [] });
    }
    const userId = String(rawUserId);

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ tasks: [] });
    }

    const tasks = await Task.find({ userId }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const rawUserId = session?.user ? (session.user as { id?: string }).id || session.user.email : "guest";
    const userId = String(rawUserId);

    const body = await req.json();
    const { title, estimatedPomodoros = 1, parentId = null } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({
        task: {
          _id: "local_" + Date.now(),
          userId,
          title,
          completed: false,
          estimatedPomodoros,
          completedPomodoros: 0,
          trackedSeconds: 0,
          parentId: parentId ? String(parentId) : undefined,
          order: 0,
          createdAt: new Date().toISOString(),
        },
      });
    }

    const task = await Task.create({
      userId,
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      trackedSeconds: 0,
      parentId: parentId ? String(parentId) : undefined,
      order: 0,
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, completed, title, trackedSeconds, completedPomodoros } = body;

    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ success: true, updated: body });
    }

    const updateFields: Record<string, unknown> = {};
    if (completed !== undefined) updateFields.completed = completed;
    if (title !== undefined) updateFields.title = title;
    if (trackedSeconds !== undefined) updateFields.trackedSeconds = trackedSeconds;
    if (completedPomodoros !== undefined) updateFields.completedPomodoros = completedPomodoros;

    const task = await Task.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    const db = await connectDB();
    if (db) {
      await Task.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
