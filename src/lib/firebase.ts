import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { LeaderboardItem } from '../types/typing';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use the designated Firestore Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const COLLECTION_NAME = 'leaderboard';

// In-Memory & Session Cache to minimize Firestore reads (Quota Saver)
interface CacheEntry {
  data: LeaderboardItem[];
  timestamp: number;
}
let memoryCache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 180000; // 3 minutes cache lifetime

// Default initial high scores for the leaderboard
const INITIAL_SEEDS: Omit<LeaderboardItem, 'id'>[] = [
  {
    playerName: 'Reza Keyboardist',
    avatar: '⚡',
    wpm: 118,
    cpm: 590,
    accuracy: 99.4,
    levelId: 24,
    levelTitle: 'Tantangan Master Kecepatan',
    category: 'master',
    timestamp: Date.now() - 3600000 * 2,
    dateStr: 'Hari ini',
    country: 'ID',
  },
  {
    playerName: 'Nadia SpeedTypist',
    avatar: '🚀',
    wpm: 104,
    cpm: 520,
    accuracy: 98.8,
    levelId: 20,
    levelTitle: 'Paragraf Esai Inspiratif',
    category: 'master',
    timestamp: Date.now() - 3600000 * 5,
    dateStr: 'Hari ini',
    country: 'ID',
  },
  {
    playerName: 'Budi JariKilat',
    avatar: '🔥',
    wpm: 92,
    cpm: 460,
    accuracy: 97.9,
    levelId: 18,
    levelTitle: 'Kata Populer Bahasa Indonesia',
    category: 'intermediate',
    timestamp: Date.now() - 3600000 * 12,
    dateStr: 'Hari ini',
    country: 'ID',
  },
  {
    playerName: 'Dewi Mahir',
    avatar: '✨',
    wpm: 86,
    cpm: 430,
    accuracy: 99.1,
    levelId: 15,
    levelTitle: 'Simbol & Tanda Baca Lengkap',
    category: 'intermediate',
    timestamp: Date.now() - 3600000 * 24,
    dateStr: 'Kemarin',
    country: 'ID',
  },
  {
    playerName: 'Dimas TouchTyping',
    avatar: '🎯',
    wpm: 79,
    cpm: 395,
    accuracy: 96.5,
    levelId: 12,
    levelTitle: 'Kombinasi 3 Baris Huruf',
    category: 'intermediate',
    timestamp: Date.now() - 3600000 * 30,
    dateStr: 'Kemarin',
    country: 'ID',
  },
  {
    playerName: 'Siti TenFingers',
    avatar: '🌸',
    wpm: 72,
    cpm: 360,
    accuracy: 98.2,
    levelId: 10,
    levelTitle: 'Huruf Kapital & Tombol Shift',
    category: 'intermediate',
    timestamp: Date.now() - 3600000 * 48,
    dateStr: '2 hari lalu',
    country: 'ID',
  },
];

// Fetch global leaderboard scores from Firestore with smart caching
export async function getFirestoreLeaderboard(
  category: 'all' | 'today' | 'master' | 'intermediate' = 'all',
  limitCount: number = 30,
  forceRefresh: boolean = false
): Promise<LeaderboardItem[]> {
  const cacheKey = `leaderboard_${category}_${limitCount}`;
  const now = Date.now();

  // 1. Check in-memory cache first (Saves 100% of Firestore read operations)
  if (!forceRefresh && memoryCache[cacheKey] && now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return memoryCache[cacheKey].data;
  }

  // 2. Check browser sessionStorage as secondary cache
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(cacheKey);
      if (stored) {
        const parsed: CacheEntry = JSON.parse(stored);
        if (now - parsed.timestamp < CACHE_TTL_MS) {
          memoryCache[cacheKey] = parsed;
          return parsed.data;
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Query Firestore only if cache expired or force refreshed
  try {
    const colRef = collection(db, COLLECTION_NAME);
    // Optimized limit to conserve document reads
    const q = query(colRef, orderBy('wpm', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_SEEDS.map((s, idx) => ({ ...s, id: `seed-${idx}` }));
    }

    const items: LeaderboardItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        playerName: data.playerName || 'Anonim',
        avatar: data.avatar || '⚡',
        wpm: Number(data.wpm) || 0,
        cpm: Number(data.cpm) || Number(data.wpm) * 5,
        accuracy: Number(data.accuracy) || 0,
        levelId: Number(data.levelId) || 1,
        levelTitle: data.levelTitle || 'Latihan',
        category: data.category || (data.wpm >= 80 ? 'master' : 'intermediate'),
        timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
        dateStr: data.dateStr || 'Baru saja',
        country: data.country || 'ID',
      });
    });

    // Client-side category filtering
    let filtered = items;
    if (category === 'today') {
      const oneDayAgo = Date.now() - 24 * 3600000;
      filtered = items.filter((i) => i.timestamp >= oneDayAgo);
    } else if (category === 'master') {
      filtered = items.filter((i) => i.wpm >= 80);
    } else if (category === 'intermediate') {
      filtered = items.filter((i) => i.wpm >= 50 && i.wpm < 80);
    }

    // Save to cache
    const cacheEntry: CacheEntry = { data: filtered, timestamp: now };
    memoryCache[cacheKey] = cacheEntry;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      } catch {
        // ignore
      }
    }

    return filtered;
  } catch (err) {
    console.warn('Firestore fetch error, falling back to local seeds:', err);
    return INITIAL_SEEDS.map((s, idx) => ({ ...s, id: `seed-${idx}` }));
  }
}

let lastWriteTimestamp = 0;

// Submit a new high score to Firestore with anti-spam rate limiting
export async function addFirestoreScore(score: {
  playerName: string;
  avatar: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  levelId: number;
  levelTitle: string;
  category?: string;
  country?: string;
}): Promise<{ success: boolean; id?: string }> {
  const now = Date.now();
  // Anti-spam write protection (prevents repeated clicks from consuming write quota)
  if (now - lastWriteTimestamp < 3000) {
    return { success: true };
  }

  try {
    lastWriteTimestamp = now;
    const colRef = collection(db, COLLECTION_NAME);
    const payload = {
      playerName: score.playerName.trim().slice(0, 50),
      avatar: score.avatar || '⚡',
      wpm: Math.round(score.wpm),
      cpm: Math.round(score.cpm),
      accuracy: Number(score.accuracy.toFixed(1)),
      levelId: score.levelId,
      levelTitle: score.levelTitle.slice(0, 100),
      category: score.category || (score.wpm >= 80 ? 'master' : score.wpm >= 50 ? 'intermediate' : 'beginner'),
      timestamp: now,
      createdAt: serverTimestamp(),
      dateStr: 'Hari ini',
      country: score.country || 'ID',
    };

    const docRef = await addDoc(colRef, payload);

    // Invalidate local cache so next leaderboard view fetches updated score
    memoryCache = {};
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch {
        // ignore
      }
    }

    return { success: true, id: docRef.id };
  } catch (err) {
    console.error('Failed to submit score to Firestore:', err);
    return { success: false };
  }
}
