"use client";

import React from "react";
import Image from "next/image";
import { X, Volume2, Bell, Clock, Sliders, Image as ImageIcon } from "lucide-react";
import { TimerSettings } from "@/hooks/useTimer";
import { soundManager } from "@/lib/sounds";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onUpdateSettings: (newSettings: TimerSettings) => void;
}

export const ANCIENT_THEMES = [
  { id: "egypt", name: "Ancient Egypt", src: "/backgrounds/egypt.jpg" },
  { id: "greece", name: "Ancient Greece", src: "/backgrounds/greece.jpg" },
  { id: "india", name: "Ancient India", src: "/backgrounds/india.jpg" },
  { id: "medieval", name: "Medieval Realm", src: "/backgrounds/medieval.jpg" },
  { id: "rome", name: "Imperial Rome", src: "/backgrounds/rome.jpg" },
  { id: "mayan", name: "Mayan Mystery", src: "/backgrounds/mayan.jpg" },
];

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleDurationChange = (field: keyof TimerSettings, val: number) => {
    onUpdateSettings({ ...settings, [field]: val });
  };

  const handleToggle = (field: keyof TimerSettings) => {
    onUpdateSettings({ ...settings, [field]: !settings[field] });
  };

  const handleSelectTheme = (themeId: string) => {
    onUpdateSettings({ ...settings, backgroundTheme: themeId });
  };

  const handleTestBell = () => {
    soundManager.playBowlChime(settings.soundVolume / 100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="modal-title">Timer Settings</h3>
              <p className="modal-subtitle">Personalize your intervals and ancient surroundings</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Durations */}
        <div style={{ marginBottom: "20px" }}>
          <div className="settings-section-title">
            <Clock size={14} style={{ color: "var(--gold-primary)" }} />
            <span>Session Intervals (Minutes)</span>
          </div>
          <div className="durations-grid">
            <div className="duration-box">
              <label>Focus</label>
              <input
                type="number"
                min="1"
                max="120"
                value={settings.focusDuration}
                onChange={(e) => handleDurationChange("focusDuration", Number(e.target.value))}
                className="duration-input"
              />
            </div>
            <div className="duration-box">
              <label>Short Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.shortBreakDuration}
                onChange={(e) => handleDurationChange("shortBreakDuration", Number(e.target.value))}
                className="duration-input"
              />
            </div>
            <div className="duration-box">
              <label>Long Break</label>
              <input
                type="number"
                min="1"
                max="90"
                value={settings.longBreakDuration}
                onChange={(e) => handleDurationChange("longBreakDuration", Number(e.target.value))}
                className="duration-input"
              />
            </div>
          </div>
        </div>

        {/* Ancient Civilization Background Selector */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div className="settings-section-title" style={{ marginBottom: 0 }}>
              <ImageIcon size={14} style={{ color: "var(--gold-primary)" }} />
              <span>Ancient Civilizations Atmosphere</span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--gold-primary)", fontWeight: 600 }}>6 Wonders</span>
          </div>
          <div className="bg-grid">
            {ANCIENT_THEMES.map((t) => {
              const isSelected = settings.backgroundTheme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`bg-thumbnail ${isSelected ? "selected" : ""}`}
                >
                  <Image
                    src={t.src}
                    alt={t.name}
                    width={180}
                    height={100}
                    priority={isSelected}
                  />
                  <div className="bg-thumb-label">{t.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sound & Notifications */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              <Bell size={14} style={{ color: "var(--gold-primary)" }} />
              <span>Completion Tibetan Gong Chime</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={handleTestBell}
                style={{ fontSize: "11px", color: "var(--gold-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Test Bell
              </button>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => handleToggle("soundEnabled")}
                style={{ width: "16px", height: "16px", accentColor: "var(--gold-primary)", cursor: "pointer" }}
              />
            </div>
          </div>

          {settings.soundEnabled && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-dim)" }}>
                <Volume2 size={13} />
                <span>Chime Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.soundVolume}
                onChange={(e) => handleDurationChange("soundVolume", Number(e.target.value))}
                style={{ width: "130px", accentColor: "var(--gold-primary)", cursor: "pointer" }}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "12px",
            background: "var(--gold-primary)",
            color: "#000",
            fontWeight: "bold",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px var(--gold-glow)",
            transition: "all 0.2s"
          }}
        >
          Save &amp; Continue
        </button>
      </div>
    </div>
  );
}
