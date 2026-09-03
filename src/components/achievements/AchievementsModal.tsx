"use client";

import React, { useState, useEffect } from "react";
import { X, Trophy, Lock, Star } from "lucide-react";
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  Achievement,
} from "@/lib/achievements";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  focus: "Focus Sessions",
  streak: "Streaks",
  garden: "Grove & Garden",
  tasks: "Tasks",
  explorer: "Explorer",
  legend: "Legendary",
};

const CATEGORY_ORDER = ["focus", "streak", "garden", "tasks", "explorer", "legend"];

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (isOpen) {
      setUnlockedSet(new Set(getUnlockedAchievements()));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAchievements = ACHIEVEMENTS.filter((a) => !a.secret || unlockedSet.has(a.id)).length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).length;

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    if (a.secret && !unlockedSet.has(a.id)) return false;
    if (activeCategory === "all") return true;
    return a.category === activeCategory;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px", width: "100%" }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div
              className="modal-icon-badge"
              style={{ background: "rgba(212,175,55,0.12)", borderColor: "var(--gold-border)", color: "var(--gold-primary)" }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="modal-title">Hall of Achievements</h3>
              <p className="modal-subtitle">
                {unlockedCount} / {totalAchievements} ancient scrolls unlocked
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Overall Progress Bar */}
        <div style={{ marginBottom: "16px" }}>
          <div className="garden-progress-bar-bg" style={{ height: "6px" }}>
            <div
              className="garden-progress-bar-fill"
              style={{ width: `${totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0}%` }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "11px", color: "var(--text-dim)" }}>
            <span>{Math.round((unlockedCount / Math.max(1, totalAchievements)) * 100)}% Complete</span>
            <span style={{ color: "var(--gold-primary)", fontWeight: 600 }}>
              {totalAchievements - unlockedCount} remaining
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            paddingBottom: "10px",
            marginBottom: "14px",
            scrollbarWidth: "none",
          }}
        >
          {["all", ...CATEGORY_ORDER].map((cat) => {
            const label = cat === "all" ? "All" : CATEGORY_LABELS[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "5px 12px",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: isActive ? "var(--gold-primary)" : "rgba(255,255,255,0.1)",
                  background: isActive ? "var(--gold-dim)" : "rgba(255,255,255,0.04)",
                  color: isActive ? "var(--gold-primary)" : "var(--text-dim)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Achievement Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "10px",
            maxHeight: "420px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {filteredAchievements.map((ach: Achievement) => {
            const isUnlocked = unlockedSet.has(ach.id);
            return (
              <div
                key={ach.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: isUnlocked ? "var(--gold-border)" : "rgba(255,255,255,0.07)",
                  background: isUnlocked
                    ? "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)"
                    : "rgba(255,255,255,0.03)",
                  transition: "all 0.2s",
                  opacity: isUnlocked ? 1 : 0.55,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                    background: isUnlocked ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.06)",
                    border: "1px solid",
                    borderColor: isUnlocked ? "var(--gold-border)" : "rgba(255,255,255,0.1)",
                    filter: isUnlocked ? "none" : "grayscale(1)",
                  }}
                >
                  {isUnlocked ? ach.icon : <Lock size={18} style={{ color: "var(--text-dim)" }} />}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: isUnlocked ? "#fff" : "var(--text-dim)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {ach.name}
                    {isUnlocked && (
                      <Star size={10} fill="var(--gold-primary)" style={{ color: "var(--gold-primary)", flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px", lineHeight: 1.4 }}>
                    {ach.description}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      display: "inline-block",
                      padding: "1px 6px",
                      borderRadius: "6px",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-dim)",
                    }}
                  >
                    {CATEGORY_LABELS[ach.category]}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAchievements.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 20px", color: "var(--text-dim)", fontSize: "14px" }}>
              No achievements in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
