"use client";

import React, { useMemo, useState, RefObject } from "react";
import { Sprout, Box, Image as ImageIcon } from "lucide-react";
import { TimerMode } from "@/hooks/useTimer";
import { ThreeDTreeCanvas, ThreeDTreeCanvasHandle } from "./ThreeDTreeCanvas";

interface SessionGardenProps {
  focusCount: number;
  isRunning: boolean;
  mode: TimerMode;
  backgroundTheme?: string;
  treeRef?: RefObject<ThreeDTreeCanvasHandle | null>;
}

const MILESTONES = [
  { level: 0, name: "Dormant Soil", desc: "Start focusing to plant your seed" },
  { level: 1, name: "Sprouting Seedling", desc: "First signs of life taking root" },
  { level: 2, name: "Young Sapling", desc: "Leaves reaching toward the sun" },
  { level: 3, name: "Branching Tree", desc: "Sturdy trunk and spreading boughs" },
  { level: 4, name: "Majestic Oak", desc: "Rich canopy providing deep shade" },
  { level: 5, name: "Companion Grove", desc: "A sister tree joins the sanctuary" },
  { level: 6, name: "Blooming Flora", desc: "Wild lavender & golden blossoms" },
  { level: 7, name: "Sanctuary of Birds", desc: "Songbirds resting upon ancient branches" },
  { level: 8, name: "Enchanted Forest", desc: "A flourishing eternal grove of focus" },
];

export function SessionGarden({ focusCount, isRunning, mode, backgroundTheme = "egypt", treeRef }: SessionGardenProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  const currentStage = useMemo(() => {
    const clamped = Math.min(focusCount, 8);
    return MILESTONES[clamped];
  }, [focusCount]);

  const stageLevel = Math.min(focusCount, 8);

  return (
    <div className="garden-card">
      {/* Garden Header */}
      <div className="garden-header">
        <div className="garden-title-wrap">
          <Sprout size={14} className="garden-icon" />
          <span className="garden-title">Grove of Focus</span>
          <span className="garden-badge">
            {focusCount} {focusCount === 1 ? "Session" : "Sessions"}
          </span>
        </div>

        {/* 3D / 2D Toggle Switch */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            style={{
              background: viewMode === "3d" ? "var(--gold-primary)" : "rgba(255,255,255,0.06)",
              color: viewMode === "3d" ? "#000" : "var(--text-dim)",
              border: "none",
              borderRadius: "6px",
              padding: "3px 7px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s",
            }}
            title="Interactive 3D Three.js Sanctuary"
          >
            <Box size={11} />
            <span>3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            style={{
              background: viewMode === "2d" ? "var(--gold-primary)" : "rgba(255,255,255,0.06)",
              color: viewMode === "2d" ? "#000" : "var(--text-dim)",
              border: "none",
              borderRadius: "6px",
              padding: "3px 7px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s",
            }}
            title="Classic 2D Illustration"
          >
            <ImageIcon size={11} />
            <span>2D</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display */}
      {viewMode === "3d" ? (
        <ThreeDTreeCanvas ref={treeRef} focusCount={focusCount} isRunning={isRunning} mode={mode} backgroundTheme={backgroundTheme} />
      ) : (
        <div className="garden-canvas-wrap">
          <svg
            viewBox="0 0 360 140"
            className={`garden-svg ${isRunning && mode === "focus" ? "is-growing" : ""}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0d1b1e" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#15272a" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1b2e2b" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2d4a3e" />
                <stop offset="100%" stopColor="#182d25" />
              </linearGradient>
              <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3d6352" />
                <stop offset="100%" stopColor="#223d32" />
              </linearGradient>

              <linearGradient id="foliageGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#52b788" />
                <stop offset="50%" stopColor="#2d6a4f" />
                <stop offset="100%" stopColor="#1b4332" />
              </linearGradient>
              <linearGradient id="foliageGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#74c69d" />
                <stop offset="100%" stopColor="#40916c" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <rect x="0" y="0" width="360" height="140" rx="10" fill="url(#skyGrad)" />

            <path
              d="M0,110 Q60,95 130,105 T260,98 T360,108 L360,140 L0,140 Z"
              fill="url(#hillGrad1)"
              opacity="0.6"
            />

            {stageLevel >= 4 && (
              <g className="garden-sun-group" opacity={stageLevel >= 7 ? 0.9 : 0.45}>
                <circle cx="180" cy="36" r="16" fill="#ffd166" opacity="0.3" filter="url(#goldGlow)" />
                <circle cx="180" cy="36" r="9" fill="#ffeaa7" opacity="0.85" />
                <line x1="180" y1="12" x2="180" y2="18" stroke="#ffeaa7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="198" y1="20" x2="194" y2="24" stroke="#ffeaa7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="204" y1="36" x2="198" y2="36" stroke="#ffeaa7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="162" y1="20" x2="166" y2="24" stroke="#ffeaa7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                <line x1="156" y1="36" x2="162" y2="36" stroke="#ffeaa7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </g>
            )}

            {stageLevel >= 6 && (
              <g className="garden-stars-group">
                <circle cx="45" cy="25" r="1.5" fill="#f6d365" className="star-flicker-1" />
                <circle cx="95" cy="35" r="1" fill="#ffffff" className="star-flicker-2" />
                <circle cx="280" cy="22" r="1.5" fill="#f6d365" className="star-flicker-3" />
                <circle cx="320" cy="38" r="1.2" fill="#ffffff" className="star-flicker-1" />
                <circle cx="140" cy="20" r="1" fill="#f6d365" opacity="0.8" />
                <circle cx="230" cy="18" r="1" fill="#ffffff" opacity="0.8" />
              </g>
            )}

            {stageLevel >= 7 && (
              <g className="garden-birds-group">
                <path
                  d="M110,42 Q115,38 120,42 Q125,38 130,42"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="bird-float-1"
                />
                <path
                  d="M245,35 Q249,32 253,35 Q257,32 261,35"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="bird-float-2"
                />
              </g>
            )}

            <path
              d="M0,122 Q90,110 180,116 T360,118 L360,140 L0,140 Z"
              fill="url(#hillGrad2)"
            />

            {stageLevel === 0 && (
              <g className="garden-seed-group">
                <ellipse cx="180" cy="120" rx="3.5" ry="2.5" fill="#d4af37" filter="url(#softGlow)" />
                <circle cx="180" cy="120" r="1" fill="#fff" />
                <path d="M174,122 Q180,118 186,122" stroke="#5c4033" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {stageLevel === 1 && (
              <g className="garden-seedling-group">
                <path d="M180,122 Q181,114 180,108" stroke="#74c69d" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                <path d="M180,112 Q172,110 173,105 Q178,106 180,110" fill="#52b788" />
                <path d="M180,109 Q188,107 187,102 Q182,103 180,107" fill="#74c69d" />
              </g>
            )}

            {stageLevel === 2 && (
              <g className="garden-sapling-group">
                <path d="M180,122 Q179,108 180,95" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M180,108 Q172,102 168,104" stroke="#8b5a2b" strokeWidth="1.8" fill="none" />
                <ellipse cx="166" cy="103" rx="5" ry="3" fill="#52b788" transform="rotate(-20 166 103)" />
                <path d="M180,102 Q188,96 193,98" stroke="#8b5a2b" strokeWidth="1.8" fill="none" />
                <ellipse cx="195" cy="97" rx="5" ry="3" fill="#74c69d" transform="rotate(20 195 97)" />
                <ellipse cx="180" cy="92" rx="7" ry="5" fill="#40916c" />
                <ellipse cx="180" cy="89" rx="5" ry="4" fill="#74c69d" />
              </g>
            )}

            {stageLevel >= 3 && (
              <g className="garden-tree-main">
                <path
                  d="M176,122 L177,90 Q177,80 180,75 Q183,80 183,90 L184,122 Z"
                  fill="#5c3a21"
                />
                <path d="M179,92 Q168,82 160,84" stroke="#5c3a21" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M181,88 Q192,78 200,80" stroke="#5c3a21" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                <circle cx="162" cy="74" r={stageLevel >= 4 ? "18" : "13"} fill="#1b4332" opacity="0.9" />
                <circle cx="198" cy="72" r={stageLevel >= 4 ? "18" : "13"} fill="#1b4332" opacity="0.9" />
                <circle cx="180" cy="58" r={stageLevel >= 4 ? "22" : "16"} fill="#2d6a4f" />

                <circle cx="168" cy="68" r={stageLevel >= 4 ? "16" : "12"} fill="url(#foliageGrad1)" />
                <circle cx="192" cy="66" r={stageLevel >= 4 ? "16" : "12"} fill="url(#foliageGrad1)" />
                <circle cx="180" cy="52" r={stageLevel >= 4 ? "20" : "15"} fill="url(#foliageGrad2)" />

                {stageLevel >= 4 && (
                  <>
                    <circle cx="176" cy="46" r="13" fill="#95d5b2" opacity="0.8" />
                    <circle cx="188" cy="52" r="10" fill="#74c69d" opacity="0.75" />
                  </>
                )}
              </g>
            )}

            {stageLevel >= 5 && (
              <g className="garden-tree-left">
                <path d="M98,120 L99,96 Q100,90 102,86 L104,120 Z" fill="#4a2e1b" />
                <circle cx="92" cy="80" r="12" fill="#1b4332" />
                <circle cx="112" cy="78" r="12" fill="#2d6a4f" />
                <circle cx="102" cy="68" r="15" fill="url(#foliageGrad2)" />
                <circle cx="100" cy="64" r="9" fill="#95d5b2" opacity="0.75" />
              </g>
            )}

            {stageLevel >= 8 && (
              <g className="garden-tree-right">
                <path d="M260,121 L261,98 Q262,92 264,88 L266,121 Z" fill="#4a2e1b" />
                <circle cx="254" cy="82" r="13" fill="#1b4332" />
                <circle cx="274" cy="80" r="13" fill="#2d6a4f" />
                <circle cx="264" cy="70" r="16" fill="url(#foliageGrad1)" />
                <circle cx="262" cy="65" r="10" fill="#95d5b2" opacity="0.8" />
              </g>
            )}

            {stageLevel >= 6 && (
              <g className="garden-flowers-group">
                <circle cx="60" cy="120" r="2.2" fill="#e0aaff" />
                <circle cx="64" cy="118" r="2.2" fill="#c77dff" />
                <circle cx="68" cy="121" r="2.2" fill="#9d4edd" />
                <path d="M64,124 L64,119" stroke="#52b788" strokeWidth="1" />

                <circle cx="145" cy="122" r="2.5" fill="#ffd166" />
                <circle cx="145" cy="122" r="1.2" fill="#fff" />
                <path d="M145,125 L145,122" stroke="#52b788" strokeWidth="1" />

                <circle cx="215" cy="123" r="2.5" fill="#f72585" opacity="0.8" />
                <circle cx="220" cy="121" r="2.2" fill="#ffd166" />

                <circle cx="300" cy="120" r="2.2" fill="#e0aaff" />
                <circle cx="305" cy="118" r="2.5" fill="#ffd166" />
                <path d="M305,124 L305,119" stroke="#52b788" strokeWidth="1" />
              </g>
            )}

            {stageLevel >= 8 && (
              <g className="garden-floating-pollen">
                <circle cx="170" cy="60" r="1.2" fill="#ffeaa7" className="pollen-float-1" />
                <circle cx="190" cy="50" r="1.2" fill="#95d5b2" className="pollen-float-2" />
                <circle cx="105" cy="70" r="1" fill="#ffeaa7" className="pollen-float-1" />
                <circle cx="260" cy="75" r="1" fill="#95d5b2" className="pollen-float-2" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Footer Milestone Progression */}
      <div className="garden-footer">
        <div className="garden-progress-bar-bg">
          <div
            className="garden-progress-bar-fill"
            style={{ width: `${(stageLevel / 8) * 100}%` }}
          />
        </div>
        <div className="garden-caption">
          <span>{currentStage.desc}</span>
          <span className="garden-next-hint">
            {stageLevel < 8 ? `${8 - focusCount} more to Full Forest` : "Max Sanctuary Reached ✨"}
          </span>
        </div>
      </div>
    </div>
  );
}
