"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Check, Trash2, Target, CheckCircle2 } from "lucide-react";

export interface TaskItemData {
  _id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  trackedSeconds: number;
}

interface TaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTaskId: string | null;
  onSelectActiveTask: (id: string | null) => void;
}

export function TaskPanel({
  isOpen,
  onClose,
  activeTaskId,
  onSelectActiveTask,
}: TaskPanelProps) {
  const [tasks, setTasks] = useState<TaskItemData[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [estimatedCount, setEstimatedCount] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
      } else {
        const saved = localStorage.getItem("pomodoro_local_tasks");
        if (saved) {
          setTasks(JSON.parse(saved));
        } else {
          const defaults: TaskItemData[] = [
            {
              _id: "demo_1",
              title: "Study ancient philosophy & stoicism",
              completed: false,
              estimatedPomodoros: 2,
              completedPomodoros: 0,
              trackedSeconds: 0,
            },
            {
              _id: "demo_2",
              title: "Complete deep work writing session",
              completed: false,
              estimatedPomodoros: 4,
              completedPomodoros: 1,
              trackedSeconds: 1500,
            },
          ];
          setTasks(defaults);
          localStorage.setItem("pomodoro_local_tasks", JSON.stringify(defaults));
        }
      }
    } catch {
      const saved = localStorage.getItem("pomodoro_local_tasks");
      if (saved) setTasks(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItemData = {
      _id: "task_" + Date.now(),
      title: newTitle.trim(),
      completed: false,
      estimatedPomodoros: estimatedCount,
      completedPomodoros: 0,
      trackedSeconds: 0,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem("pomodoro_local_tasks", JSON.stringify(updated));
    setNewTitle("");
    setEstimatedCount(1);

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          estimatedPomodoros: newTask.estimatedPomodoros,
        }),
      });
    } catch {
      // Offline
    }
  };

  const toggleTask = async (id: string) => {
    const updated = tasks.map((t) => {
      if (t._id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem("pomodoro_local_tasks", JSON.stringify(updated));

    const target = updated.find((t) => t._id === id);
    if (target) {
      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, completed: target.completed }),
        });
      } catch {
        // Offline
      }
    }
  };

  const deleteTask = async (id: string) => {
    if (activeTaskId === id) {
      onSelectActiveTask(null);
    }
    const updated = tasks.filter((t) => t._id !== id);
    setTasks(updated);
    localStorage.setItem("pomodoro_local_tasks", JSON.stringify(updated));

    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    } catch {
      // Offline
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="side-panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label="Tasks panel">
        <div className="panel-header">
          <div className="panel-title">
            <CheckCircle2 size={20} style={{ color: "var(--gold-primary)" }} />
            <span>Tasks &amp; Focus</span>
          </div>
          <button
            type="button"
            className="panel-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="panel-content">
          {/* Add task form */}
          <form onSubmit={handleAddTask} className="task-form-box">
            <div className="task-input-row">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What are you focusing on?"
                className="task-input"
              />
              <button type="submit" className="task-add-btn">
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            <div className="task-est-row">
              <span>Estimated Pomodoros (25m each):</span>
              <div className="task-est-options">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setEstimatedCount(num)}
                    className={`task-est-btn ${estimatedCount === num ? "active" : ""}`}
                  >
                    {num} 🍅
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Task list */}
          <div className="task-list">
            {loading && tasks.length === 0 ? (
              <p style={{ color: "var(--text-dim)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                Loading tasks...
              </p>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>No tasks added yet.</p>
                <p style={{ color: "var(--text-dim)", opacity: 0.6, fontSize: "12px", marginTop: "4px" }}>
                  Add a task to track your focus sessions.
                </p>
              </div>
            ) : (
              tasks.map((task) => {
                const isActive = activeTaskId === task._id;
                return (
                  <div
                    key={task._id}
                    className={`task-item ${task.completed ? "completed" : ""} ${
                      isActive ? "active-focus" : ""
                    }`}
                  >
                    <div className="task-left">
                      <button
                        type="button"
                        onClick={() => toggleTask(task._id)}
                        className={`task-checkbox ${task.completed ? "checked" : ""}`}
                        aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
                      >
                        {task.completed && <Check size={14} strokeWidth={3} />}
                      </button>

                      <div className="task-details">
                        <p className={`task-title-text ${task.completed ? "completed" : ""}`}>
                          {task.title}
                        </p>
                        <div className="task-sub-meta">
                          <span>
                            {task.completedPomodoros}/{task.estimatedPomodoros} 🍅
                          </span>
                          {task.trackedSeconds > 0 && (
                            <span>• {Math.round(task.trackedSeconds / 60)} min spent</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        onClick={() => onSelectActiveTask(isActive ? null : task._id)}
                        title={isActive ? "Remove as active focus" : "Focus on this task"}
                        className={`task-action-btn ${isActive ? "active" : ""}`}
                      >
                        <Target size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task._id)}
                        title="Delete task"
                        className="task-action-btn"
                        style={{ color: "rgba(239, 68, 68, 0.7)" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
