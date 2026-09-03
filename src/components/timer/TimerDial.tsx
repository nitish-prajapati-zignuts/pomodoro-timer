"use client";

import React from "react";
import { TimerMode } from "@/hooks/useTimer";

interface TimerDialProps {
  timeLeft: number;
  totalDuration: number;
  progress: number;
  mode: TimerMode;
  isRunning: boolean;
}

export function TimerDial({
  timeLeft,
  progress,
  mode,
  isRunning,
}: TimerDialProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // SVG circle calculations
  const radius = 132;
  const circumference = 2 * Math.PI * radius;
  // Stroke dashoffset: 0 when full (0 progress), circumference when empty (1 progress)
  const strokeDashoffset = circumference * (1 - progress);

  const getModeLabel = () => {
    switch (mode) {
      case "focus":
        return "Focus session";
      case "shortBreak":
        return "Short break";
      case "longBreak":
        return "Long break";
    }
  };

  return (
    <div className="dial-container">
      <svg className="dial-svg" viewBox="0 0 300 300" aria-hidden="true">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#e6b85c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4a853" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle className="dial-track" cx="150" cy="150" r={radius} />
        {/* Animated fill */}
        <circle
          className="dial-fill"
          cx="150"
          cy="150"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="dial-inner">
        <div className="time-display">
          <span>{formattedMinutes}</span>
          <span className={`time-sep ${!isRunning ? "opacity-75" : ""}`}>:</span>
          <span>{formattedSeconds}</span>
        </div>

        <div className="focusing-badge">
          <span className="focus-dot" />
          <span>{getModeLabel()}</span>
        </div>
      </div>
    </div>
  );
}
