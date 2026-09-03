"use client";

import React, { useState } from "react";
import { Hammer, X, Sparkles, ChevronRight } from "lucide-react";

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        style={{
          position: "fixed",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "rgba(20, 15, 30, 0.9)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          borderRadius: "20px",
          padding: "5px 12px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--gold-primary)",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          transition: "all 0.2s",
        }}
        title="Show Development Notice"
      >
        <Hammer size={12} />
        <span>Beta · Under Development</span>
        <ChevronRight size={12} />
      </button>
    );
  }

  return (
    <aside
      aria-label="Development Notice"
      style={{
        width: "100%",
        background: "linear-gradient(90deg, rgba(35, 25, 10, 0.95) 0%, rgba(55, 40, 15, 0.98) 50%, rgba(35, 25, 10, 0.95) 100%)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.35)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.6), inset 0 -1px 0 rgba(212, 175, 55, 0.2)",
        position: "relative",
        zIndex: 999,
        backdropFilter: "blur(12px)",
        padding: "7px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "0 auto",
          fontSize: "12px",
          color: "#f3e8cb",
          fontWeight: 500,
          textAlign: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(212, 175, 55, 0.2)",
            border: "1px solid rgba(212, 175, 55, 0.5)",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--gold-primary)",
          }}
        >
          <Hammer size={11} /> Under Active Development
        </span>

        <span>
          Ancient Wonders, 3D Gardens, and features are currently being forged. Your session progress is saved automatically.
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "11px",
          }}
        >
          <Sparkles size={11} style={{ color: "var(--gold-primary)" }} /> v0.9-beta
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "6px",
            padding: "3px 8px",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          title="Minimize to top badge"
        >
          Minimize
        </button>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
          aria-label="Dismiss banner"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
