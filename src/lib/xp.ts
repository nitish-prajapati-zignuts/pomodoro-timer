// XP and Scholar Rank system for Ancient Pomodoro Timer

export const SCHOLAR_RANKS = [
  { level: 1,  name: "Scholar",        xpRequired: 0,    icon: "📜", color: "#a0a0a0" },
  { level: 2,  name: "Scribe",         xpRequired: 100,  icon: "✍️",  color: "#8bc4a8" },
  { level: 3,  name: "Philosopher",    xpRequired: 250,  icon: "🏛️", color: "#74c69d" },
  { level: 4,  name: "Sage",           xpRequired: 500,  icon: "🌿", color: "#52b788" },
  { level: 5,  name: "Oracle",         xpRequired: 900,  icon: "🔮", color: "#9d4edd" },
  { level: 6,  name: "Alchemist",      xpRequired: 1500, icon: "⚗️", color: "#e08c3a" },
  { level: 7,  name: "Archon",         xpRequired: 2500, icon: "⚔️",  color: "#d4af37" },
  { level: 8,  name: "Archimedes",     xpRequired: 4000, icon: "⚙️",  color: "#f0c040" },
  { level: 9,  name: "Seneca",         xpRequired: 6000, icon: "🦅", color: "#ff8c42" },
  { level: 10, name: "Eternal Sage",   xpRequired: 10000, icon: "✨", color: "#ffd700" },
];

export type ScholarRank = { level: number; name: string; xpRequired: number; icon: string; color: string };


export const XP_REWARDS = {
  focusSession: 10,
  shortBreak: 2,
  longBreak: 5,
  dailyChallenge: 25,
  streak7: 50,
  streak14: 100,
  streak30: 200,
  firstSession: 20,   // bonus on first session
  sessionNote: 5,     // bonus for adding a note
} as const;

export function getRankForXP(xp: number): ScholarRank {
  let rank = SCHOLAR_RANKS[0];
  for (const r of SCHOLAR_RANKS) {
    if (xp >= r.xpRequired) rank = r;
  }
  return rank;
}

export function getNextRank(xp: number): ScholarRank | null {
  for (const r of SCHOLAR_RANKS) {
    if (xp < r.xpRequired) return r;
  }
  return null; // Max rank reached
}

export function getProgressToNextRank(xp: number): number {
  const current = getRankForXP(xp);
  const next = getNextRank(xp);
  if (!next) return 100;
  const range = next.xpRequired - current.xpRequired;
  const earned = xp - current.xpRequired;
  return Math.min(100, Math.round((earned / range) * 100));
}

// Persist XP to localStorage
const XP_KEY = "pomodoro_scholar_xp";

export function getStoredXP(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(XP_KEY) || "0", 10);
}

export function awardXP(amount: number): { newXP: number; newRank: ScholarRank; leveledUp: boolean } {
  const prevXP = getStoredXP();
  const prevRank = getRankForXP(prevXP);
  const newXP = prevXP + amount;
  const newRank = getRankForXP(newXP);
  localStorage.setItem(XP_KEY, String(newXP));
  return { newXP, newRank, leveledUp: newRank.level > prevRank.level };
}
