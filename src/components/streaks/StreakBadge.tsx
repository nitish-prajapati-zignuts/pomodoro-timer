"use client";

import React, { useState, useEffect } from "react";
import { Flame, X, Shield, Calendar, Award } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  history: string[];
  freezesRemaining: number;
}

export function StreakBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 1,
    longestStreak: 5,
    lastActiveDate: new Date().toISOString().split("T")[0],
    history: [new Date().toISOString().split("T")[0]],
    freezesRemaining: 1,
  });

  useEffect(() => {
    fetch("/api/streaks")
      .then((res) => res.json())
      .then((data) => {
        if (data.streak) {
          setStreak(data.streak);
        }
      })
      .catch(() => {
        const local = localStorage.getItem("pomodoro_streak_data");
        if (local) setStreak(JSON.parse(local));
      });
  }, []);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const isToday = i === 0;
      const isActive = streak.history?.includes(dateStr) || (isToday && streak.currentStreak > 0);
      days.push({ dateStr, dayName, isToday, isActive });
    }
    return days;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="streak-btn"
        aria-label={`${streak.currentStreak}-day focus streak`}
      >
        <span className="fire-emoji">🔥</span>
        <span>{streak.currentStreak}</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge" style={{ background: "rgba(255, 119, 51, 0.15)", borderColor: "rgba(255, 119, 51, 0.4)", color: "#ff7733" }}>
                  🔥
                </div>
                <div>
                  <h3 className="modal-title">Focus Streak</h3>
                  <p className="modal-subtitle">Consistency is the hallmark of great scholars</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Streak metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", color: "#ff7733", marginBottom: "4px" }}>
                  <Flame size={14} />
                  <span>Current Streak</span>
                </div>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#fff", fontFamily: "var(--font-timer)" }}>
                  {streak.currentStreak} <span style={{ fontSize: "13px", fontWeight: "normal", color: "var(--text-dim)" }}>days</span>
                </p>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "12px", color: "var(--gold-primary)", marginBottom: "4px" }}>
                  <Award size={14} />
                  <span>Best Record</span>
                </div>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#fff", fontFamily: "var(--font-timer)" }}>
                  {streak.longestStreak || streak.currentStreak}{" "}
                  <span style={{ fontSize: "13px", fontWeight: "normal", color: "var(--text-dim)" }}>days</span>
                </p>
              </div>
            </div>

            {/* 7-Day Consistency Week Calendar */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "12px" }}>
                <Calendar size={14} style={{ color: "var(--gold-primary)" }} />
                <span>Last 7 Days</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center" }}>
                {getLast7Days().map((day) => (
                  <div key={day.dateStr} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase" }}>{day.dayName}</span>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        background: day.isActive
                          ? "linear-gradient(135deg, #ff7733, #e6b85c)"
                          : "rgba(255,255,255,0.05)",
                        border: day.isActive ? "none" : "1px solid rgba(255,255,255,0.1)",
                        color: day.isActive ? "#000" : "var(--text-dim)",
                        fontWeight: day.isActive ? "bold" : "normal",
                        boxShadow: day.isActive ? "0 0 12px rgba(255,119,51,0.4)" : "none"
                      }}
                    >
                      {day.isActive ? "🔥" : "·"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Freeze Banner */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px",
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
              borderRadius: "14px",
              fontSize: "12px",
              color: "var(--text-muted)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Shield size={18} style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, color: "#fff" }}>Weekly Streak Shield</p>
                  <p style={{ color: "var(--text-dim)", fontSize: "11px" }}>Protects your streak if you miss a day</p>
                </div>
              </div>
              <span style={{
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "var(--gold-primary)",
                color: "#000",
                fontWeight: 700,
                fontSize: "11px"
              }}>
                {streak.freezesRemaining} Left
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
