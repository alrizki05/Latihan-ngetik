import { LevelProgress, UserProfile, SessionResult } from '../types/typing';
import { LEVELS } from '../data/levels';

const STORAGE_KEYS = {
  USER_PROFILE: 'jarikilat_user_profile',
  LEVEL_PROGRESS: 'jarikilat_level_progress',
  SESSION_HISTORY: 'jarikilat_session_history',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Pengetik Kilat',
  avatar: '⚡',
  xp: 0,
  level: 1,
  streakDays: 1,
  soundEnabled: true,
  soundType: 'mechanical',
  volume: 0.45,
  showKeyboardHands: true,
  showFingerColors: true,
  strictBackspace: true,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function loadLevelProgress(): Record<number, LevelProgress> {
  const result: Record<number, LevelProgress> = {};

  // Initialize all levels from data
  LEVELS.forEach((lvl, idx) => {
    result[lvl.id] = {
      levelId: lvl.id,
      unlocked: idx === 0, // Level 1 is unlocked initially
      completed: false,
      stars: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      bestCpm: 0,
      attempts: 0,
    };
  });

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
    if (raw) {
      const saved: Record<number, LevelProgress> = JSON.parse(raw);
      Object.keys(saved).forEach((k) => {
        const id = Number(k);
        if (result[id]) {
          result[id] = { ...result[id], ...saved[id] };
        }
      });
    }
  } catch {
    // ignore
  }

  // Ensure Level 1 is always unlocked
  if (result[1]) {
    result[1].unlocked = true;
  }

  return result;
}

export function saveLevelProgress(progress: Record<number, LevelProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export function calculateStars(
  wpm: number,
  accuracy: number,
  targetWpm: number,
  minAccuracy: number
): number {
  if (accuracy < minAccuracy) return 0;
  if (wpm >= targetWpm && accuracy >= 96) return 3;
  if (wpm >= targetWpm * 0.8 && accuracy >= 92) return 2;
  if (wpm >= targetWpm * 0.6 && accuracy >= minAccuracy) return 1;
  return 0;
}

export function getRankTitle(level: number): { title: string; color: string } {
  if (level >= 30) return { title: 'Dewa Keyboard Agung', color: 'text-amber-400' };
  if (level >= 25) return { title: 'Grandmaster 10 Jari', color: 'text-rose-400' };
  if (level >= 20) return { title: 'Master Pengetik Cepat', color: 'text-purple-400' };
  if (level >= 15) return { title: 'Pengetik Mahir', color: 'text-sky-400' };
  if (level >= 10) return { title: 'Pengetik Terampil', color: 'text-emerald-400' };
  if (level >= 5) return { title: 'Pengetik Menengah', color: 'text-teal-400' };
  return { title: 'Pemula 10 Jari', color: 'text-slate-400' };
}

export function saveSessionResult(session: SessionResult): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    const list: SessionResult[] = raw ? JSON.parse(raw) : [];
    list.unshift(session);
    // keep last 50 sessions
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function loadSessionHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
