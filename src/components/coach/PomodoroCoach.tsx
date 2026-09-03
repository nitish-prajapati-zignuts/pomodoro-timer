"use client";

import React, { useEffect, useState } from "react";

const COACH_TIPS = [
  {
    id: "hydrate",
    text: "Take a moment to drink some water before your next session.",
    trigger: (sessions: number) => sessions > 0 && sessions % 2 === 0,
    icon: "💧",
  },
  {
    id: "stretch",
    text: "Three sessions in a row — stand up and stretch for 60 seconds.",
    trigger: (sessions: number) => sessions === 3 || sessions === 6 || sessions === 9,
    icon: "🧘",
  },
  {
    id: "long_break",
    text: "You've been very consistent. A long break will boost memory consolidation.",
    trigger: (sessions: number) => sessions > 0 && sessions % 4 === 0,
    icon: "🌙",
  },
  {
    id: "keep_going",
    text: "Your grove is growing! Each session is a seed of deep knowledge.",
    trigger: (sessions: number) => sessions === 1,
    icon: "🌱",
  },
  {
    id: "halfway",
    text: "Halfway to your daily goal! Consistency beats intensity.",
    trigger: (sessions: number) => sessions === 2,
    icon: "🏛️",
  },
  {
    id: "full_forest",
    text: "Full Enchanted Forest reached! You've achieved extraordinary focus today.",
    trigger: (sessions: number) => sessions === 8,
    icon: "🌲",
  },
];

interface PomodoroCoachProps {
  sessionCount: number;
}

export function PomodoroCoach({ sessionCount }: PomodoroCoachProps) {
  const [activeTip, setActiveTip] = useState<{ text: string; icon: string } | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (sessionCount === 0) return;

    for (const tip of COACH_TIPS) {
      if (!seenIds.has(tip.id) && tip.trigger(sessionCount)) {
        setActiveTip({ text: tip.text, icon: tip.icon });
        setSeenIds((prev) => new Set([...prev, tip.id]));
        // Auto-dismiss after 7 seconds
        const timer = setTimeout(() => setActiveTip(null), 7000);
        return () => clearTimeout(timer);
      }
    }
  }, [sessionCount, seenIds]);

  if (!activeTip) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "72px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(15, 12, 24, 0.9)",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: "40px",
        padding: "10px 18px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        animation: "slideDownCoach 0.3s ease",
        maxWidth: "min(460px, 90vw)",
      }}
    >
      <style>{`
        @keyframes slideDownCoach {
          from { transform: translateX(-50%) translateY(-10px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>

      <span style={{ fontSize: "20px", flexShrink: 0 }}>{activeTip.icon}</span>
      <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.4 }}>
        {activeTip.text}
      </span>
      <button
        type="button"
        onClick={() => setActiveTip(null)}
        style={{
          background: "none", border: "none", color: "var(--text-dim)",
          cursor: "pointer", fontSize: "16px", padding: "0 4px", flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
