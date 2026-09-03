"use client";

import React, { useState } from "react";
import { X, Play, Square, Volume2, Sparkles, Music } from "lucide-react";
import { soundManager } from "@/lib/sounds";

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

type AmbientType = "binaural" | "zen" | "rain" | "space";

const TRACKS: { id: AmbientType; name: string; desc: string; icon: string }[] = [
  {
    id: "binaural",
    name: "Binaural Alpha Waves (432Hz)",
    desc: "Harmonized alpha frequencies for deep cognitive focus",
    icon: "🧠",
  },
  {
    id: "zen",
    name: "Ancient Temple Resonance",
    desc: "Tibetan and Egyptian harmonic bronze drone",
    icon: "🔔",
  },
  {
    id: "rain",
    name: "Mystic Temple Rainstorm",
    desc: "Gentle acoustic rainfall on marble courtyards",
    icon: "🌧️",
  },
  {
    id: "space",
    name: "Cosmic Celestial Void",
    desc: "Deep 108Hz resonance for boundless concentration",
    icon: "🌌",
  },
];

export function MusicPlayer({ isOpen, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AmbientType>("binaural");
  const [volume, setVolume] = useState(50);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (isPlaying) {
      soundManager.stopAmbient();
      setIsPlaying(false);
    } else {
      soundManager.startAmbient(selectedTrack, volume / 100);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: AmbientType) => {
    setSelectedTrack(trackId);
    if (isPlaying) {
      soundManager.startAmbient(trackId, volume / 100);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.setAmbientVolume(newVol / 100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge">
              <Music size={18} />
            </div>
            <div>
              <h3 className="modal-title">Focus Soundscapes</h3>
              <p className="modal-subtitle">Synthesized ambient audio for uninterrupted flow</p>
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

        {/* Tracks List */}
        <div className="music-tracks-list">
          {TRACKS.map((track) => {
            const isSelected = selectedTrack === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelectTrack(track.id)}
                className={`music-track-item ${isSelected ? "selected" : ""}`}
              >
                <div className="music-track-left">
                  <span className="music-track-icon">{track.icon}</span>
                  <div>
                    <p className="music-track-title">{track.name}</p>
                    <p className="music-track-desc">{track.desc}</p>
                  </div>
                </div>

                {isSelected && isPlaying && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "16px" }}>
                    <span style={{ width: "3px", height: "10px", backgroundColor: "var(--gold-primary)", borderRadius: "3px" }} />
                    <span style={{ width: "3px", height: "16px", backgroundColor: "var(--gold-primary)", borderRadius: "3px" }} />
                    <span style={{ width: "3px", height: "8px", backgroundColor: "var(--gold-primary)", borderRadius: "3px" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Master Audio Controls */}
        <div className="music-controls-box">
          <div className="music-volume-row">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Volume2 size={16} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                Volume: {volume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              style={{ width: "130px", accentColor: "var(--gold-primary)", cursor: "pointer" }}
            />
          </div>

          <button
            type="button"
            onClick={togglePlay}
            className={`music-play-btn ${isPlaying ? "stop" : "start"}`}
          >
            {isPlaying ? (
              <>
                <Square size={16} />
                <span>Pause Soundscape</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Play Soundscape</span>
              </>
            )}
          </button>
        </div>

        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "var(--text-dim)" }}>
          <Sparkles size={13} style={{ color: "var(--gold-primary)" }} />
          <span>Crafted with Web Audio harmonic oscillators</span>
        </div>
      </div>
    </div>
  );
}
