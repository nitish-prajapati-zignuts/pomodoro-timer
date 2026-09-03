// Achievements System for Ancient Pomodoro Timer

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "focus" | "streak" | "garden" | "tasks" | "explorer" | "legend";
  condition: (stats: AchievementStats) => boolean;
  secret?: boolean;
}

export interface AchievementStats {
  totalFocusSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  dailyChallengesCompleted: number;
  backgroundsUsed: string[];
  lateNightSessions: number; // sessions after 11 PM
  earlyMorningSessions: number; // sessions before 7 AM
  maxSessionsInOneDay: number;
  gardenMaxStage: number;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── Focus Sessions ────────────────────────────────────────────
  {
    id: "first_seed",
    name: "First Seed",
    description: "Complete your very first focus session",
    icon: "🌱",
    category: "focus",
    condition: (s) => s.totalFocusSessions >= 1,
  },
  {
    id: "ten_sessions",
    name: "Dedicated Student",
    description: "Complete 10 focus sessions",
    icon: "📚",
    category: "focus",
    condition: (s) => s.totalFocusSessions >= 10,
  },
  {
    id: "fifty_sessions",
    name: "Ancient Oak",
    description: "Complete 50 total focus sessions",
    icon: "🌳",
    category: "focus",
    condition: (s) => s.totalFocusSessions >= 50,
  },
  {
    id: "century_sessions",
    name: "Century Scholar",
    description: "Complete 100 total focus sessions",
    icon: "💯",
    category: "focus",
    condition: (s) => s.totalFocusSessions >= 100,
  },
  {
    id: "five_hundred_sessions",
    name: "Eternal Philosopher",
    description: "Complete 500 total focus sessions",
    icon: "🦅",
    category: "legend",
    condition: (s) => s.totalFocusSessions >= 500,
  },
  {
    id: "ten_hours",
    name: "Hour Keeper",
    description: "Accumulate 10 hours of focused work",
    icon: "⏳",
    category: "focus",
    condition: (s) => s.totalFocusMinutes >= 600,
  },
  {
    id: "one_hundred_hours",
    name: "Master of Time",
    description: "Accumulate 100 hours of focused work",
    icon: "🕰️",
    category: "legend",
    condition: (s) => s.totalFocusMinutes >= 6000,
  },

  // ─── Streaks ────────────────────────────────────────────────────
  {
    id: "streak_3",
    name: "Kindled Flame",
    description: "Maintain a 3-day focus streak",
    icon: "🕯️",
    category: "streak",
    condition: (s) => s.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Week of Wisdom",
    description: "Maintain a 7-day focus streak",
    icon: "🔥",
    category: "streak",
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: "streak_14",
    name: "Fortnight Oracle",
    description: "Maintain a 14-day focus streak",
    icon: "🌙",
    category: "streak",
    condition: (s) => s.currentStreak >= 14,
  },
  {
    id: "streak_30",
    name: "Eternal Flame",
    description: "Maintain a 30-day focus streak — a true sage",
    icon: "🏺",
    category: "legend",
    condition: (s) => s.currentStreak >= 30,
  },

  // ─── Garden ─────────────────────────────────────────────────────
  {
    id: "full_forest",
    name: "Enchanted Forest",
    description: "Reach the maximum grove stage in a single day",
    icon: "🌲",
    category: "garden",
    condition: (s) => s.gardenMaxStage >= 8,
  },
  {
    id: "lightning_focus",
    name: "Lightning Focus",
    description: "Complete 4 focus sessions in one day",
    icon: "⚡",
    category: "garden",
    condition: (s) => s.maxSessionsInOneDay >= 4,
  },
  {
    id: "deep_focus_day",
    name: "Deep Work Archon",
    description: "Complete 8 sessions in one day",
    icon: "🏛️",
    category: "legend",
    condition: (s) => s.maxSessionsInOneDay >= 8,
  },

  // ─── Tasks ──────────────────────────────────────────────────────
  {
    id: "first_task",
    name: "Scribe's Apprentice",
    description: "Complete your first task",
    icon: "📝",
    category: "tasks",
    condition: (s) => s.tasksCompleted >= 1,
  },
  {
    id: "ten_tasks",
    name: "Scroll Keeper",
    description: "Complete 10 tasks",
    icon: "📜",
    category: "tasks",
    condition: (s) => s.tasksCompleted >= 10,
  },

  // ─── Explorer ────────────────────────────────────────────────────
  {
    id: "world_traveler",
    name: "World Traveler",
    description: "Use all 6 ancient civilization backgrounds",
    icon: "🗺️",
    category: "explorer",
    condition: (s) => s.backgroundsUsed.length >= 6,
  },
  {
    id: "midnight_scholar",
    name: "Midnight Scholar",
    description: "Complete a focus session after 11 PM",
    icon: "🌙",
    category: "explorer",
    condition: (s) => s.lateNightSessions >= 1,
    secret: true,
  },
  {
    id: "dawn_philosopher",
    name: "Dawn Philosopher",
    description: "Complete a focus session before 7 AM",
    icon: "🌅",
    category: "explorer",
    condition: (s) => s.earlyMorningSessions >= 1,
    secret: true,
  },
  {
    id: "daily_champion",
    name: "Daily Champion",
    description: "Complete 7 daily challenges",
    icon: "🏆",
    category: "legend",
    condition: (s) => s.dailyChallengesCompleted >= 7,
  },
];

const UNLOCKED_KEY = "pomodoro_achievements_unlocked";

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(UNLOCKED_KEY) || "[]");
  } catch { return []; }
}

export function checkNewAchievements(stats: AchievementStats): Achievement[] {
  const unlocked = new Set(getUnlockedAchievements());
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.has(achievement.id) && achievement.condition(stats)) {
      unlocked.add(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify([...unlocked]));
  }

  return newlyUnlocked;
}

export function getAchievementStats(): AchievementStats {
  if (typeof window === "undefined") return {
    totalFocusSessions: 0, totalFocusMinutes: 0,
    currentStreak: 0, longestStreak: 0, tasksCompleted: 0,
    dailyChallengesCompleted: 0, backgroundsUsed: [], lateNightSessions: 0,
    earlyMorningSessions: 0, maxSessionsInOneDay: 0, gardenMaxStage: 0, xp: 0,
  };

  const sessions = JSON.parse(localStorage.getItem("pomodoro_sessions_meta") || "{}");
  const settings = JSON.parse(localStorage.getItem("pomodoro_settings") || "{}");
  const xp = parseInt(localStorage.getItem("pomodoro_scholar_xp") || "0", 10);

  return {
    totalFocusSessions: sessions.totalFocus || 0,
    totalFocusMinutes: sessions.totalMinutes || 0,
    currentStreak: sessions.currentStreak || 0,
    longestStreak: sessions.longestStreak || 0,
    tasksCompleted: sessions.tasksCompleted || 0,
    dailyChallengesCompleted: sessions.dailyChallenges || 0,
    backgroundsUsed: sessions.backgroundsUsed || [settings.backgroundTheme || "egypt"],
    lateNightSessions: sessions.lateNight || 0,
    earlyMorningSessions: sessions.earlyMorning || 0,
    maxSessionsInOneDay: sessions.maxInOneDay || 0,
    gardenMaxStage: sessions.gardenMaxStage || 0,
    xp,
  };
}

export function updateSessionsMeta(update: Partial<AchievementStats & { date: string }>) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem("pomodoro_sessions_meta") || "{}");
    const merged = { ...existing, ...update };
    localStorage.setItem("pomodoro_sessions_meta", JSON.stringify(merged));
  } catch { /* ignore */ }
}
