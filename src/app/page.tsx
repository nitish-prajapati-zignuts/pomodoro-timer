"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Music, ListTodo, Settings, Sparkles, Trophy } from "lucide-react";
import { useTimer, TimerMode, DEFAULT_SETTINGS, TimerSettings } from "@/hooks/useTimer";
import { TimerDial } from "@/components/timer/TimerDial";
import { ModeSelector } from "@/components/timer/ModeSelector";
import { TimerControls } from "@/components/timer/TimerControls";
import { TaskPanel } from "@/components/tasks/TaskPanel";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { SettingsModal, ANCIENT_THEMES } from "@/components/settings/SettingsModal";
import { StreakBadge } from "@/components/streaks/StreakBadge";
import { DailyChallengeModal } from "@/components/challenges/DailyChallengeModal";
import { LoginButton } from "@/components/auth/LoginButton";
import { QuoteDisplay } from "@/components/quote/QuoteDisplay";
import { SessionGarden } from "@/components/garden/SessionGarden";
import { AncientParticles3D } from "@/components/canvas/AncientParticles3D";
import { AchievementsModal } from "@/components/achievements/AchievementsModal";
import { SessionNotePrompt } from "@/components/journal/SessionNotePrompt";
import { PomodoroCoach } from "@/components/coach/PomodoroCoach";
import { DevelopmentBanner } from "@/components/banner/DevelopmentBanner";
import { ThreeDTreeCanvasHandle } from "@/components/garden/ThreeDTreeCanvas";
import { LandingSections } from "@/components/landing/LandingSections";
import { awardXP, XP_REWARDS, getRankForXP, getStoredXP } from "@/lib/xp";
import {
  checkNewAchievements,
  getAchievementStats,
  updateSessionsMeta,
} from "@/lib/achievements";

export default function PomodoroPage() {
  // Settings & Theme
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // XP State
  const [currentXP, setCurrentXP] = useState(0);

  // Journal note state
  const [showNotePrompt, setShowNotePrompt] = useState(false);
  const [lastCompletedMode, setLastCompletedMode] = useState<TimerMode>("focus");

  // XP Level-up toast
  const [levelUpToast, setLevelUpToast] = useState<{ icon: string; name: string } | null>(null);

  // Achievement unlock toast queue
  const [achievementToast, setAchievementToast] = useState<{ icon: string; name: string } | null>(null);

  // 3D Tree canvas ref for burst trigger
  const treeCanvasRef = useRef<ThreeDTreeCanvasHandle>(null);

  // Load saved settings from local storage
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch { /* ignore */ }
    }
    setCurrentXP(getStoredXP());
  }, []);

  const handleUpdateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    timer.setSettings(newSettings);
    localStorage.setItem("pomodoro_settings", JSON.stringify(newSettings));

    // Track backgrounds used for achievements
    const stats = getAchievementStats();
    const used = new Set(stats.backgroundsUsed || []);
    used.add(newSettings.backgroundTheme);
    updateSessionsMeta({ backgroundsUsed: [...used] });
  };

  // Timer Session completion callback
  const handleSessionComplete = useCallback(async (mode: TimerMode, durationSeconds: number) => {
    // 1. Trigger 3D burst animation on focus session completion
    if (mode === "focus") {
      treeCanvasRef.current?.triggerBurst();
    }

    // 2. Award XP
    const xpAmount = mode === "focus"
      ? XP_REWARDS.focusSession
      : mode === "shortBreak"
      ? XP_REWARDS.shortBreak
      : XP_REWARDS.longBreak;

    const result = awardXP(xpAmount);
    setCurrentXP(result.newXP);

    if (result.leveledUp) {
      setLevelUpToast({ icon: result.newRank.icon, name: result.newRank.name });
      setTimeout(() => setLevelUpToast(null), 4000);
    }

    // 3. Update session metadata for achievements
    const now = new Date();
    const hour = now.getHours();
    const existingStats = getAchievementStats();

    updateSessionsMeta({
      totalFocusSessions: (existingStats.totalFocusSessions || 0) + (mode === "focus" ? 1 : 0),
      totalFocusMinutes: (existingStats.totalFocusMinutes || 0) + Math.floor(durationSeconds / 60),
      lateNightSessions: (existingStats.lateNightSessions || 0) + (hour >= 23 ? 1 : 0),
      earlyMorningSessions: (existingStats.earlyMorningSessions || 0) + (hour < 7 ? 1 : 0),
    });

    // 4. Check achievements
    const newStats = getAchievementStats();
    const newAchievements = checkNewAchievements(newStats);
    if (newAchievements.length > 0) {
      // Show first unlocked achievement toast
      setAchievementToast({ icon: newAchievements[0].icon, name: newAchievements[0].name });
      setTimeout(() => setAchievementToast(null), 5000);
    }

    // 5. Show journal note prompt only after focus sessions
    if (mode === "focus") {
      setLastCompletedMode(mode);
      setShowNotePrompt(true);
      // Auto-dismiss after 10 seconds if user ignores it
      setTimeout(() => setShowNotePrompt(false), 10000);
    }

    // 6. Persist session to API
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: mode, durationSeconds, taskId: activeTaskId }),
      });
    } catch { /* Offline fallback */ }

    // 7. Accumulate tracked time on the active task
    if (mode === "focus" && activeTaskId) {
      const savedTasks = localStorage.getItem("pomodoro_local_tasks");
      if (savedTasks) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsed = JSON.parse(savedTasks).map((t: any) => {
            if (t._id === activeTaskId) {
              return {
                ...t,
                trackedSeconds: (t.trackedSeconds || 0) + durationSeconds,
                completedPomodoros: (t.completedPomodoros || 0) + 1,
              };
            }
            return t;
          });
          localStorage.setItem("pomodoro_local_tasks", JSON.stringify(parsed));
        } catch { /* ignore */ }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTaskId]);

  const timer = useTimer(settings, handleSessionComplete);

  // Sync title with remaining time
  const prevTimeRef = useRef(timer.timeLeft);
  useEffect(() => {
    if (prevTimeRef.current !== timer.timeLeft) {
      prevTimeRef.current = timer.timeLeft;
      const mins = Math.floor(timer.timeLeft / 60);
      const secs = String(timer.timeLeft % 60).padStart(2, "0");
      const modeLabel = timer.mode === "focus" ? "Focus" : timer.mode === "shortBreak" ? "Break" : "Long Break";
      document.title = `${mins}:${secs} - ${modeLabel} | Ancient Pomodoro`;
    }
  }, [timer.timeLeft, timer.mode]);

  // Derive current rank
  const currentRank = getRankForXP(currentXP);

  // Find background path
  const currentThemeObj = ANCIENT_THEMES.find((t) => t.id === settings.backgroundTheme) || ANCIENT_THEMES[0];
  const bgImageSrc = currentThemeObj.src;

  return (
    <main className="relative min-h-screen">
      {/* Development Banner */}
      <DevelopmentBanner />

      {/* 1. Stage (Fullscreen App) */}
      <div className="stage">
        {/* Background Layers */}
        <div className="bg-photo" style={{ backgroundImage: `url('${bgImageSrc}')` }} />
        <div className="bg-scrim" />
        <div className="grain" />
        <AncientParticles3D isRunning={timer.isRunning} />

        {/* Content View */}
        <div className="content">
          {/* Top Bar */}
          <header className="topbar">
            <div className="topleft">
              <button
                type="button"
                className="brand-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Sparkles size={20} className="brand-icon" />
                <span>Pomodoro Timer</span>
              </button>

              {/* Scholar Rank Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: currentRank.color,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                title={`Scholar Rank: ${currentRank.name} — ${currentXP} XP`}
                onClick={() => setIsAchievementsOpen(true)}
              >
                <span>{currentRank.icon}</span>
                <span>{currentRank.name}</span>
                <span style={{ color: "var(--gold-primary)", opacity: 0.7 }}>{currentXP} XP</span>
              </div>

              <StreakBadge />
            </div>

            <div className="topactions">
              {/* Achievements */}
              <button
                type="button"
                className={`iconbtn ${isAchievementsOpen ? "active" : ""}`}
                onClick={() => setIsAchievementsOpen(true)}
                title="Hall of Achievements"
                aria-label="Achievements"
              >
                <Trophy size={18} />
              </button>

              {/* Music Player toggle */}
              <button
                type="button"
                className={`iconbtn ${isMusicOpen ? "active" : ""}`}
                onClick={() => setIsMusicOpen(true)}
                title="Ambient Soundscapes"
                aria-label="Ambient soundscapes"
              >
                <Music size={19} />
              </button>

              {/* Tasks Drawer toggle */}
              <button
                type="button"
                className={`iconbtn ${isTasksOpen ? "active" : ""}`}
                onClick={() => setIsTasksOpen(true)}
                title="Tasks"
                aria-label="Show tasks"
              >
                <ListTodo size={20} />
              </button>

              {/* Settings toggle */}
              <button
                type="button"
                className={`iconbtn ${isSettingsOpen ? "active" : ""}`}
                onClick={() => setIsSettingsOpen(true)}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={19} />
              </button>

              {/* Login / Profile */}
              <LoginButton />
            </div>
          </header>

          {/* Center Timer Zone */}
          <div className="zone-main">
            <p className="hero-tagline">
              Stay focused and do more in less time — with ancient soundscapes, a built-in
              task list, custom intervals and daily streaks.
            </p>

            {/* Segmented Mode Selector */}
            <ModeSelector
              currentMode={timer.mode}
              onSelectMode={timer.switchMode}
              focusCount={timer.focusCount}
              shortBreakCount={timer.shortBreakCount}
              longBreakCount={timer.longBreakCount}
            />

            {/* Dial with progress ring */}
            <TimerDial
              timeLeft={timer.timeLeft}
              totalDuration={timer.totalDuration}
              progress={timer.progress}
              mode={timer.mode}
              isRunning={timer.isRunning}
            />

            {/* Timer Controls */}
            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              onStart={timer.start}
              onPause={timer.pause}
              onResume={timer.resume}
              onStop={timer.stop}
              onSkip={timer.skip}
            />

            {/* Living Session Garden (Forest-App Style) with 3D burst ref */}
            <SessionGarden
              focusCount={timer.focusCount}
              isRunning={timer.isRunning}
              mode={timer.mode}
              backgroundTheme={settings.backgroundTheme}
              treeRef={treeCanvasRef}
            />

            {/* Ancient Wisdom Quote */}
            <QuoteDisplay />
          </div>

          {/* Footer Bar */}
          <footer className="stage-footer">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
                {currentRank.icon} {currentRank.name} · {currentXP} XP
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
                Atmosphere: {currentThemeObj.name}
              </span>
              <DailyChallengeModal completedSessions={timer.focusCount} />
            </div>
          </footer>
        </div>
      </div>

      {/* Overlays & Modals */}
      {/* 2. Slide-out Task Panel */}
      <TaskPanel
        isOpen={isTasksOpen}
        onClose={() => setIsTasksOpen(false)}
        activeTaskId={activeTaskId}
        onSelectActiveTask={(id) => setActiveTaskId(id)}
      />

      {/* 3. Ambient Music Player Popover */}
      <MusicPlayer isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)} />

      {/* 4. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* 5. Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* 6. Focus Journal Note Prompt */}
      <SessionNotePrompt
        isVisible={showNotePrompt}
        sessionType={lastCompletedMode}
        onSubmit={(note) => {
          setShowNotePrompt(false);
          if (note) {
            // Award bonus XP for journaling
            const r = awardXP(XP_REWARDS.sessionNote);
            setCurrentXP(r.newXP);
            // Store note
            const notes = JSON.parse(localStorage.getItem("pomodoro_notes") || "[]");
            notes.unshift({ note, ts: Date.now(), mode: lastCompletedMode });
            localStorage.setItem("pomodoro_notes", JSON.stringify(notes.slice(0, 100)));
          }
        }}
        onDismiss={() => setShowNotePrompt(false)}
      />

      {/* 7. Pomodoro Coach Tips */}
      <PomodoroCoach sessionCount={timer.focusCount} />

      {/* 8. Level-Up Toast */}
      {levelUpToast && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            right: "24px",
            zIndex: 500,
            background: "rgba(15, 12, 24, 0.95)",
            border: "1px solid var(--gold-primary)",
            borderRadius: "16px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 30px var(--gold-glow)",
            animation: "scaleUp 0.3s ease",
            backdropFilter: "blur(16px)",
          }}
        >
          <span style={{ fontSize: "24px" }}>{levelUpToast.icon}</span>
          <div>
            <div style={{ fontSize: "11px", color: "var(--gold-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Scholar Level Up!
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{levelUpToast.name}</div>
          </div>
        </div>
      )}

      {/* 9. Achievement Unlock Toast */}
      {achievementToast && (
        <div
          style={{
            position: "fixed",
            top: levelUpToast ? "140px" : "72px",
            right: "24px",
            zIndex: 500,
            background: "rgba(15, 12, 24, 0.95)",
            border: "1px solid rgba(82,183,136,0.5)",
            borderRadius: "16px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 30px rgba(82,183,136,0.2)",
            animation: "scaleUp 0.3s ease",
            backdropFilter: "blur(16px)",
          }}
        >
          <span style={{ fontSize: "24px" }}>{achievementToast.icon}</span>
          <div>
            <div style={{ fontSize: "11px", color: "#74c69d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Achievement Unlocked
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{achievementToast.name}</div>
          </div>
        </div>
      )}

      {/* 10. SSR Landing Sections */}
      <LandingSections />
    </main>
  );
}
