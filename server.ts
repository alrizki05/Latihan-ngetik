import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LeaderboardEntry {
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

const DEFAULT_SEEDS: LeaderboardEntry[] = [
  {
    id: 'seed-1',
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
    country: 'ID'
  },
  {
    id: 'seed-2',
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
    country: 'ID'
  },
  {
    id: 'seed-3',
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
    country: 'ID'
  },
  {
    id: 'seed-4',
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
    country: 'ID'
  },
  {
    id: 'seed-5',
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
    country: 'ID'
  },
  {
    id: 'seed-6',
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
    country: 'ID'
  },
  {
    id: 'seed-7',
    playerName: 'Fajar CodeRacer',
    avatar: '💻',
    wpm: 68,
    cpm: 340,
    accuracy: 95.8,
    levelId: 8,
    levelTitle: 'Eksplorasi Baris Bawah ZXCV',
    category: 'beginner',
    timestamp: Date.now() - 3600000 * 52,
    dateStr: '2 hari lalu',
    country: 'ID'
  },
  {
    id: 'seed-8',
    playerName: 'Ayu Pembelajar',
    avatar: '⭐',
    wpm: 55,
    cpm: 275,
    accuracy: 97.4,
    levelId: 5,
    levelTitle: 'Eksplorasi Baris Atas QWERTY',
    category: 'beginner',
    timestamp: Date.now() - 3600000 * 72,
    dateStr: '3 hari lalu',
    country: 'ID'
  },
  {
    id: 'seed-9',
    playerName: 'Rian Santai',
    avatar: '🥑',
    wpm: 46,
    cpm: 230,
    accuracy: 94.2,
    levelId: 3,
    levelTitle: 'Kombinasi Home Row ASDF JKL;',
    category: 'beginner',
    timestamp: Date.now() - 3600000 * 80,
    dateStr: '3 hari lalu',
    country: 'ID'
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const dataDir = path.join(__dirname, 'data');
  const leaderboardFile = path.join(dataDir, 'leaderboard.json');

  let leaderboardData: LeaderboardEntry[] = [];

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(leaderboardFile)) {
      const raw = fs.readFileSync(leaderboardFile, 'utf-8');
      leaderboardData = JSON.parse(raw);
    } else {
      leaderboardData = [...DEFAULT_SEEDS];
      fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboardData, null, 2), 'utf-8');
    }
  } catch {
    leaderboardData = [...DEFAULT_SEEDS];
  }

  function saveLeaderboard() {
    try {
      fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboardData, null, 2), 'utf-8');
    } catch {
      // Ignore write errors in restricted envs
    }
  }

  // GET /api/leaderboard
  app.get('/api/leaderboard', (req, res) => {
    const category = (req.query.category as string) || 'all';
    const limit = Number(req.query.limit) || 50;

    let filtered = [...leaderboardData];

    if (category === 'today') {
      const oneDayAgo = Date.now() - 24 * 3600000;
      filtered = filtered.filter(item => item.timestamp >= oneDayAgo);
    } else if (category === 'master') {
      filtered = filtered.filter(item => item.category === 'master' || item.wpm >= 80);
    } else if (category === 'intermediate') {
      filtered = filtered.filter(item => item.category === 'intermediate' || (item.wpm >= 50 && item.wpm < 80));
    } else if (category === 'beginner') {
      filtered = filtered.filter(item => item.category === 'beginner' || item.wpm < 50);
    }

    // Sort by WPM descending, then accuracy descending
    filtered.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

    res.json({
      success: true,
      totalEntries: leaderboardData.length,
      entries: filtered.slice(0, limit)
    });
  });

  // POST /api/leaderboard
  app.post('/api/leaderboard', (req, res) => {
    try {
      const {
        playerName,
        avatar,
        wpm,
        cpm,
        accuracy,
        levelId,
        levelTitle,
        category,
        country
      } = req.body;

      if (!playerName || typeof wpm !== 'number' || typeof accuracy !== 'number') {
        res.status(400).json({ success: false, error: 'Data skor tidak valid' });
        return;
      }

      const cleanName = String(playerName).trim().slice(0, 30) || 'Pengetik Cepat';
      const cleanWpm = Math.max(0, Math.min(250, Math.round(wpm)));
      const cleanAccuracy = Math.max(0, Math.min(100, Number(accuracy.toFixed(1))));
      const cleanCpm = cpm ? Math.round(cpm) : cleanWpm * 5;

      const newEntry: LeaderboardEntry = {
        id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        playerName: cleanName,
        avatar: avatar || '⚡',
        wpm: cleanWpm,
        cpm: cleanCpm,
        accuracy: cleanAccuracy,
        levelId: Number(levelId) || 1,
        levelTitle: levelTitle || 'Latihan Mengetik',
        category: (category as any) || (cleanWpm >= 80 ? 'master' : cleanWpm >= 50 ? 'intermediate' : 'beginner'),
        timestamp: Date.now(),
        dateStr: 'Baru saja',
        country: country || 'ID'
      };

      leaderboardData.push(newEntry);
      leaderboardData.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

      // Keep top 200
      if (leaderboardData.length > 200) {
        leaderboardData = leaderboardData.slice(0, 200);
      }

      saveLeaderboard();

      // Find user rank
      const userRank = leaderboardData.findIndex(item => item.id === newEntry.id) + 1;

      res.json({
        success: true,
        entry: newEntry,
        rank: userRank,
        totalEntries: leaderboardData.length
      });
    } catch {
      res.status(500).json({ success: false, error: 'Gagal menyimpan skor' });
    }
  });

  // GET /api/stats
  app.get('/api/stats', (_req, res) => {
    const totalEntries = leaderboardData.length;
    const avgWpm = totalEntries > 0 ? Math.round(leaderboardData.reduce((acc, cur) => acc + cur.wpm, 0) / totalEntries) : 0;
    const maxWpm = totalEntries > 0 ? Math.max(...leaderboardData.map(e => e.wpm)) : 0;
    const avgAcc = totalEntries > 0 ? (leaderboardData.reduce((acc, cur) => acc + cur.accuracy, 0) / totalEntries).toFixed(1) : '0';

    res.json({
      success: true,
      totalPractices: totalEntries + 1420, // baseline community counter
      averageWpm: avgWpm,
      topSpeed: maxWpm,
      averageAccuracy: avgAcc
    });
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JariKilat 10-Finger typing server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
