"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/lib/sounds";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  backgroundTheme: string;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  soundEnabled: true,
  soundVolume: 70,
  backgroundTheme: "egypt",
};

export function useTimer(
  initialSettings: TimerSettings = DEFAULT_SETTINGS,
  onSessionComplete?: (type: TimerMode, durationSeconds: number) => void
) {
  const [settings, setSettings] = useState<TimerSettings>(initialSettings);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Counts
  const [focusCount, setFocusCount] = useState(0);
  const [shortBreakCount, setShortBreakCount] = useState(0);
  const [longBreakCount, setLongBreakCount] = useState(0);

  // Remaining seconds
  const getDurationForMode = useCallback(
    (m: TimerMode, s: TimerSettings) => {
      switch (m) {
        case "focus":
          return s.focusDuration * 60;
        case "shortBreak":
          return s.shortBreakDuration * 60;
        case "longBreak":
          return s.longBreakDuration * 60;
      }
    },
    []
  );

  const [timeLeft, setTimeLeft] = useState(() =>
    getDurationForMode("focus", initialSettings)
  );

  // Precise timing ref
  const deadlineRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update timeLeft when durations change and timer is not running
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setTimeLeft(getDurationForMode(mode, settings));
    }
  }, [settings, mode, isRunning, isPaused, getDurationForMode]);

  // Handle completion
  const handleComplete = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
    deadlineRef.current = null;
    setIsRunning(false);
    setIsPaused(false);

    if (settings.soundEnabled) {
      soundManager.playBowlChime(settings.soundVolume / 100);
    }

    const currentDuration = getDurationForMode(mode, settings);
    if (onSessionComplete) {
      onSessionComplete(mode, currentDuration);
    }

    if (mode === "focus") {
      const nextCount = focusCount + 1;
      setFocusCount(nextCount);

      if (nextCount % settings.longBreakInterval === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else if (mode === "shortBreak") {
      setShortBreakCount((prev) => prev + 1);
      setMode("focus");
      setTimeLeft(settings.focusDuration * 60);
    } else {
      setLongBreakCount((prev) => prev + 1);
      setMode("focus");
      setTimeLeft(settings.focusDuration * 60);
    }

    // Optional notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Complete!", {
        body: mode === "focus" ? "Great job! Time for a well-deserved break." : "Break is over! Time to focus.",
        icon: "/favicon.ico",
      });
    }
  }, [focusCount, mode, onSessionComplete, settings, getDurationForMode]);

  // Tick step
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        if (!deadlineRef.current) return;
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.ceil((deadlineRef.current - now) / 1000));
        setTimeLeft(diffSeconds);

        if (diffSeconds <= 0) {
          handleComplete();
        }
      }, 250); // fast resolution interval
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, isPaused, handleComplete]);

  // Request browser notifications once on interaction
  const requestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const start = () => {
    requestNotification();
    soundManager.playClick(0.4);
    const deadline = Date.now() + timeLeft * 1000;
    deadlineRef.current = deadline;
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    soundManager.playClick(0.3);
    setIsPaused(true);
    setIsRunning(false);
    deadlineRef.current = null;
  };

  const resume = () => {
    soundManager.playClick(0.3);
    const deadline = Date.now() + timeLeft * 1000;
    deadlineRef.current = deadline;
    setIsRunning(true);
    setIsPaused(false);
  };

  const stop = () => {
    soundManager.playClick(0.3);
    setIsRunning(false);
    setIsPaused(false);
    deadlineRef.current = null;
    setTimeLeft(getDurationForMode(mode, settings));
  };

  const skip = () => {
    soundManager.playClick(0.3);
    stop();
    if (mode === "focus") {
      setMode("shortBreak");
      setTimeLeft(settings.shortBreakDuration * 60);
    } else {
      setMode("focus");
      setTimeLeft(settings.focusDuration * 60);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    soundManager.playClick(0.3);
    stop();
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode, settings));
  };

  const totalDuration = getDurationForMode(mode, settings);
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  return {
    mode,
    timeLeft,
    totalDuration,
    progress,
    isRunning,
    isPaused,
    focusCount,
    shortBreakCount,
    longBreakCount,
    settings,
    setSettings,
    start,
    pause,
    resume,
    stop,
    skip,
    switchMode,
  };
}
