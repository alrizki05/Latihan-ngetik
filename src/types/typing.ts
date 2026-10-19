export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface FingerInfo {
  id: FingerId;
  nameId: string; // Indonesian name
  nameEn: string;
  hand: 'left' | 'right';
  colorClass: string;
  hexColor: string;
  bgClass: string;
  borderClass: string;
}

export interface KeyInfo {
  code: string;
  display: string;
  shiftDisplay?: string;
  finger: FingerId;
  hand: 'left' | 'right';
  width?: 'w-standard' | 'w-1.5' | 'w-1.75' | 'w-2' | 'w-2.25' | 'w-space';
}

export type LevelTier =
  | 'home-row'
  | 'top-row'
  | 'bottom-row'
  | 'shift-caps'
  | 'numbers-symbols'
  | 'indonesian-words'
  | 'sentences-prose'
  | 'master-speed';

export interface LevelItem {
  id: number;
  tier: LevelTier;
  tierTitle: string;
  title: string;
  description: string;
  focusKeys: string[];
  focusFingers: FingerId[];
  targetWpm: number;
  minAccuracy: number;
  text: string;
  timeLimit?: number; // seconds, if timed challenge
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestWpm: number;
  bestAccuracy: number;
  bestCpm: number;
  attempts: number;
  lastPlayedAt?: number;
}

export interface FingerStat {
  fingerId: FingerId;
  fingerName: string;
  hand: 'left' | 'right';
  totalKeystrokes: number;
  errors: number;
  accuracy: number;
}

export interface SessionResult {
  levelId?: number;
  levelTitle: string;
  durationSeconds: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
  errorChars: number;
  maxCombo: number;
  fingerStats: Record<FingerId, FingerStat>;
  problemKeys: Array<{ key: string; errors: number }>;
  wpmTimeline: Array<{ second: number; wpm: number; acc: number }>;
  starsEarned: number;
  xpEarned: number;
  timestamp: number;
}

export interface LeaderboardItem {
  id: string;
  playerName: string;
  avatar: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  levelId: number;
  levelTitle: string;
  category: 'beginner' | 'intermediate' | 'master' | 'challenge';
  timestamp: number;
  dateStr: string;
  country: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  soundEnabled: boolean;
  soundType: 'mechanical' | 'soft' | 'clicky';
  volume: number;
  showKeyboardHands: boolean;
  showFingerColors: boolean;
  strictBackspace: boolean;
}
