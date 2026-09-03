"use client";

import React from "react";
import { Play, Pause, Square, SkipForward } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="controls-row">
      {/* Stop Button */}
      <button
        type="button"
        className="btn-secondary"
        onClick={onStop}
        title="Reset timer"
        aria-label="Stop and reset timer"
      >
        <Square size={18} />
      </button>

      {/* Main Start / Pause / Resume Button */}
      {!isRunning && !isPaused && (
        <button
          type="button"
          className="btn-start"
          onClick={onStart}
          aria-label="Start session"
        >
          <Play size={20} fill="currentColor" />
          <span>Start</span>
        </button>
      )}

      {isRunning && (
        <button
          type="button"
          className="btn-start"
          onClick={onPause}
          aria-label="Pause session"
        >
          <Pause size={20} fill="currentColor" />
          <span>Pause</span>
        </button>
      )}

      {isPaused && (
        <button
          type="button"
          className="btn-start"
          onClick={onResume}
          aria-label="Resume session"
        >
          <Play size={20} fill="currentColor" />
          <span>Resume</span>
        </button>
      )}

      {/* Skip Button */}
      <button
        type="button"
        className="btn-secondary"
        onClick={onSkip}
        title="Skip to next session"
        aria-label="Skip session"
      >
        <SkipForward size={18} />
      </button>
    </div>
  );
}
