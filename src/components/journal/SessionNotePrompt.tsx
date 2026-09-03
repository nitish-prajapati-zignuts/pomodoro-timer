"use client";

import React, { useState, useEffect } from "react";
import { PenLine, Check, X } from "lucide-react";

interface SessionNotePromptProps {
  isVisible: boolean;
  sessionType: "focus" | "shortBreak" | "longBreak";
  onSubmit: (note: string) => void;
  onDismiss: () => void;
}

const SESSION_PROMPTS = {
  focus: [
    "What did you accomplish in this session?",
    "What breakthrough did you have just now?",
    "Capture your key insight from this session...",
    "What will you build on in the next session?",
  ],
  shortBreak: "A short break well taken. How do you feel?",
  longBreak: "Long break complete. What recharges you most?",
};

export function SessionNotePrompt({ isVisible, sessionType, onSubmit, onDismiss }: SessionNotePromptProps) {
  const [note, setNote] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (sessionType === "focus") {
      const prompts = SESSION_PROMPTS.focus;
      setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    } else {
      setPrompt(SESSION_PROMPTS[sessionType]);
    }
    setNote("");
  }, [isVisible, sessionType]);

  if (!isVisible) return null;

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(420px, 90vw)",
        background: "rgba(15, 12, 24, 0.95)",
        border: "1px solid var(--gold-border)",
        borderRadius: "18px",
        padding: "18px 20px",
        zIndex: 300,
        boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 30px var(--gold-dim)",
        backdropFilter: "blur(20px)",
        animation: "slideUpNote 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes slideUpNote {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PenLine size={14} style={{ color: "var(--gold-primary)" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Focus Journal
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "4px", borderRadius: "6px", display: "flex" }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Prompt */}
      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
        {prompt}
      </p>

      {/* Input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a quick thought... (optional)"
        rows={2}
        maxLength={280}
        autoFocus
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px",
          padding: "10px 12px",
          color: "#fff",
          fontSize: "13px",
          fontFamily: "inherit",
          resize: "none",
          outline: "none",
          marginBottom: "12px",
          lineHeight: 1.5,
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.target.style.borderColor = "var(--gold-primary)"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
        onKeyDown={(e) => { if (e.key === "Escape") onDismiss(); if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
      />

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", color: "var(--text-dim)" }}>⌘↵ to save · Esc to dismiss</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              padding: "7px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-dim)", fontSize: "12px", fontWeight: 600, cursor: "pointer",
            }}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "7px 14px", borderRadius: "10px",
              background: "var(--gold-primary)", border: "none",
              color: "#000", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "5px",
              boxShadow: "0 4px 12px var(--gold-glow)",
            }}
          >
            <Check size={12} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
