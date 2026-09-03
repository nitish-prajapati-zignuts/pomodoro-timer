"use client";

import React from "react";
import { TimerMode } from "@/hooks/useTimer";

interface ModeSelectorProps {
  currentMode: TimerMode;
  onSelectMode: (mode: TimerMode) => void;
  focusCount: number;
  shortBreakCount: number;
  longBreakCount: number;
}

export function ModeSelector({
  currentMode,
  onSelectMode,
  focusCount,
  shortBreakCount,
  longBreakCount,
}: ModeSelectorProps) {
  return (
    <div className="segmented" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === "focus"}
        className={`seg-btn ${currentMode === "focus" ? "active" : ""}`}
        onClick={() => onSelectMode("focus")}
      >
        <span>Focus</span>
        <span className="seg-count">{focusCount}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentMode === "shortBreak"}
        className={`seg-btn ${currentMode === "shortBreak" ? "active" : ""}`}
        onClick={() => onSelectMode("shortBreak")}
      >
        <span>Short Break</span>
        <span className="seg-count">{shortBreakCount}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentMode === "longBreak"}
        className={`seg-btn ${currentMode === "longBreak" ? "active" : ""}`}
        onClick={() => onSelectMode("longBreak")}
      >
        <span>Long Break</span>
        <span className="seg-count">{longBreakCount}</span>
      </button>
    </div>
  );
}
