import React, { useState, useEffect, useCallback } from 'react';
import { LeaderboardItem, UserProfile } from '../types/typing';
import { Trophy, Medal, Search, RefreshCw, Zap, CheckCircle2, Globe, Users, Flame } from 'lucide-react';

interface LeaderboardViewProps {
  userProfile: UserProfile;
  onStartPractice: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  userProfile: _userProfile,
  onStartPractice,
}) => {
  const [entries, setEntries] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'today' | 'master' | 'intermediate'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalStats, setGlobalStats] = useState({
    totalPractices: 1530,
    topSpeed: 118,
    averageAccuracy: '98.2',
    averageWpm: 74,
  });

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?category=${filterCategory}&limit=50`);
      const data = await res.json();
      if (data.success && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setGlobalStats({
          totalPractices: data.totalPractices,
          topSpeed: data.topSpeed,
          averageAccuracy: data.averageAccuracy,
          averageWpm: data.averageWpm,
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Filter by search query
  const filteredEntries = entries.filter((item) =>
    item.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.levelTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const remainingEntries = filteredEntries.slice(3);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Peringkat Dunia 10 Jari</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Papan Peringkat Global
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kompetisi kecepatan dan akurasi pengetik 10 jari dari seluruh Indonesia & dunia
          </p>
        </div>

        <button
          onClick={onStartPractice}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>Tantang Rekor Sekarang</span>
        </button>
      </div>

      {/* Global Community Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Total Latihan Selesai</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
            {globalStats.totalPractices.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Rekor Kecepatan Puncak</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {globalStats.topSpeed} <span className="text-xs text-slate-400 font-normal">WPM</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rata-rata Akurasi</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {globalStats.averageAccuracy}%
          </div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rata-rata Komunitas</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-300 tabular-nums">
            {globalStats.averageWpm} <span className="text-xs text-slate-400 font-normal">WPM</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {!loading && topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* 2nd Place (Perak) */}
          <div className="order-2 md:order-1 p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-slate-400 font-bold font-mono text-xs">#2</div>
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-2xl shadow-md mb-2">
              {topThree[1].avatar}
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-[180px]">{topThree[1].playerName}</h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">{topThree[1].levelTitle}</p>
            <div className="mt-3 flex items-center gap-3 font-mono">
              <div>
                <span className="text-lg font-bold text-slate-200">{topThree[1].wpm}</span>
                <span className="text-[10px] text-slate-500 block">WPM</span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div>
                <span className="text-lg font-bold text-emerald-400">{topThree[1].accuracy}%</span>
                <span className="text-[10px] text-slate-500 block">AKURASI</span>
              </div>
            </div>
            <span className="mt-2 text-[10px] text-slate-500 font-medium">Medali Perak</span>
          </div>

          {/* 1st Place (Emas - Crowned & Highlighted) */}
          <div className="order-1 md:order-2 p-5 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-2xl flex flex-col items-center text-center relative shadow-xl shadow-amber-500/10 -translate-y-1">
            <div className="absolute top-2 right-2 flex items-center gap-1 text-amber-400 font-bold text-xs">
              <Trophy className="w-3.5 h-3.5" /> #1 JUARA
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-2">
              {topThree[0].avatar}
            </div>
            <h3 className="text-base font-extrabold text-white truncate max-w-[200px]">{topThree[0].playerName}</h3>
            <p className="text-xs text-amber-300/80 truncate max-w-[220px] mt-0.5">{topThree[0].levelTitle}</p>
            <div className="mt-3 flex items-center gap-4 font-mono">
              <div>
                <span className="text-2xl font-bold text-amber-400">{topThree[0].wpm}</span>
                <span className="text-[10px] text-slate-400 block">WPM</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div>
                <span className="text-2xl font-bold text-emerald-400">{topThree[0].accuracy}%</span>
                <span className="text-[10px] text-slate-400 block">AKURASI</span>
              </div>
            </div>
            <span className="mt-2 text-xs text-amber-400 font-bold">Medali Emas Global</span>
          </div>

          {/* 3rd Place (Perunggu) */}
          <div className="order-3 md:order-3 p-4 bg-slate-900/90 border border-amber-900/50 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 text-amber-600 font-bold font-mono text-xs">#3</div>
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-2xl shadow-md mb-2">
              {topThree[2].avatar}
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-[180px]">{topThree[2].playerName}</h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">{topThree[2].levelTitle}</p>
            <div className="mt-3 flex items-center gap-3 font-mono">
              <div>
                <span className="text-lg font-bold text-slate-200">{topThree[2].wpm}</span>
                <span className="text-[10px] text-slate-500 block">WPM</span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div>
                <span className="text-lg font-bold text-emerald-400">{topThree[2].accuracy}%</span>
                <span className="text-[10px] text-slate-500 block">AKURASI</span>
              </div>
            </div>
            <span className="mt-2 text-[10px] text-amber-600 font-medium">Medali Perunggu</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-slate-900 border border-slate-800 rounded-xl">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Waktu
          </button>
          <button
            onClick={() => setFilterCategory('today')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterCategory === 'today'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterCategory('master')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterCategory === 'master'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Master (80+ WPM)
          </button>
          <button
            onClick={() => setFilterCategory('intermediate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              filterCategory === 'intermediate'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Menengah (50-79 WPM)
          </button>
        </div>

        {/* Search input and reload button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pemain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>

          <button
            onClick={fetchLeaderboard}
            title="Segarkan Papan Peringkat"
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-14 font-semibold text-center">#</th>
                <th className="py-3 px-4 font-semibold">Pemain</th>
                <th className="py-3 px-4 font-semibold text-center">Kecepatan</th>
                <th className="py-3 px-4 font-semibold text-center">Akurasi</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">Level Teruji</th>
                <th className="py-3 px-4 font-semibold text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Memuat data papan peringkat...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Belum ada data skor yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item, index) => {
                  const rank = index + 1;
                  const isTopRank = rank <= 3;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-850/60 transition-colors ${
                        rank === 1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank Number */}
                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {rank === 1 ? (
                          <span className="text-amber-400">1</span>
                        ) : rank === 2 ? (
                          <span className="text-slate-300">2</span>
                        ) : rank === 3 ? (
                          <span className="text-amber-600">3</span>
                        ) : (
                          <span className="text-slate-500">{rank}</span>
                        )}
                      </td>

                      {/* Player Profile */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{item.avatar}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white tracking-tight">
                              {item.playerName}
                            </span>
                            <span className="text-[10px] text-slate-500 sm:hidden">
                              {item.levelTitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* WPM */}
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="text-sm font-bold text-white tabular-nums">{item.wpm}</span>
                        <span className="text-[10px] text-slate-500 ml-1">WPM</span>
                      </td>

                      {/* Accuracy */}
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={`font-semibold tabular-nums ${
                            item.accuracy >= 98
                              ? 'text-emerald-400'
                              : item.accuracy >= 92
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.accuracy}%
                        </span>
                      </td>

                      {/* Level Title */}
                      <td className="py-3 px-4 text-slate-300 hidden sm:table-cell truncate max-w-[220px]">
                        {item.levelTitle}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-right text-slate-500 text-[11px] whitespace-nowrap">
                        {item.dateStr || 'Baru saja'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
