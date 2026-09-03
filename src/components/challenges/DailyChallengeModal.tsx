"use client";

import React, { useState } from "react";
import { X, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/sounds";

interface DailyChallengeModalProps {
  completedSessions: number;
}

export function DailyChallengeModal({ completedSessions }: DailyChallengeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const targetSessions = 4;
  const progressPercent = Math.min(100, Math.round((completedSessions / targetSessions) * 100));
  const isCompleted = completedSessions >= targetSessions;

  const triggerClaimReward = () => {
    soundManager.playVictory(0.8);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#e6b85c", "#ff7733", "#ffffff", "#8c6a2d"],
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="challenge-pill"
      >
        <span className="chal-progress-dot" />
        <span>Today&apos;s challenge</span>
        <span style={{ fontSize: "12px", color: "var(--gold-primary)", fontWeight: 600 }}>
          {completedSessions}/{targetSessions}
        </span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 className="modal-title">Today&apos;s Ancient Trial</h3>
                  <p className="modal-subtitle">Daily milestone challenge &amp; laurel reward</p>
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

            {/* Challenge Card */}
            <div style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid var(--gold-border)",
              borderRadius: "18px",
              padding: "24px",
              textAlign: "center",
              marginBottom: "20px"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏛️</div>
              <h4 style={{ fontSize: "17px", fontWeight: "bold", color: "#fff", fontFamily: "var(--font-ancient)", marginBottom: "6px" }}>
                The Four Pillars of Deep Work
              </h4>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "360px", margin: "0 auto 20px", lineHeight: "1.5" }}>
                Complete four 25-minute focus intervals without distractions to conquer today&apos;s milestone.
              </p>

              {/* Progress bar */}
              <div style={{
                width: "100%",
                background: "rgba(0,0,0,0.5)",
                height: "12px",
                borderRadius: "9999px",
                padding: "2px",
                border: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "8px"
              }}>
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ff7733, var(--gold-primary), #fff)",
                    borderRadius: "9999px",
                    width: `${progressPercent}%`,
                    transition: "width 0.4s ease-out",
                    boxShadow: "0 0 12px var(--gold-glow)"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-dim)" }}>
                <span>{completedSessions} completed</span>
                <span>{targetSessions} target</span>
              </div>
            </div>

            {/* Action */}
            {isCompleted ? (
              <button
                type="button"
                onClick={triggerClaimReward}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #f3ca6c, var(--gold-primary))",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 6px 20px var(--gold-glow)"
                }}
              >
                <Sparkles size={18} />
                <span>Claim Ancient Laurels</span>
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "12px", color: "var(--text-dim)", padding: "8px 0" }}>
                <CheckCircle2 size={15} style={{ color: "var(--gold-primary)" }} />
                <span>Keep the timer going to unlock victory</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
