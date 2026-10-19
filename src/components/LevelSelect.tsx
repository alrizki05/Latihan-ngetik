import React, { useState } from 'react';
import { LevelItem, LevelProgress, LevelTier, UserProfile } from '../types/typing';
import { LEVELS } from '../data/levels';
import { getRankTitle } from '../utils/storage';
import { Star, Lock, Play, ChevronRight, Zap, Target } from 'lucide-react';

interface LevelSelectProps {
  levelProgress: Record<number, LevelProgress>;
  userProfile: UserProfile;
  onSelectLevel: (level: LevelItem) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  levelProgress,
  userProfile,
  onSelectLevel,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Compute overall stats
  const totalStars = Object.values(levelProgress).reduce((acc, cur) => acc + (cur.stars || 0), 0);
  const maxStars = LEVELS.length * 3;
  const completedLevels = Object.values(levelProgress).filter((l) => l.completed).length;

  // Find next unlocked level that isn't 3-starred yet or latest unlocked
  const nextRecommendedLevel =
    LEVELS.find((lvl) => {
      const p = levelProgress[lvl.id];
      return p?.unlocked && (!p.completed || p.stars < 3);
    }) || LEVELS[0];

  const rankInfo = getRankTitle(userProfile.level);

  // Group levels by tier
  const tiers: { id: LevelTier; label: string; range: string }[] = [
    { id: 'home-row', label: 'Tahap 1: Baris Rumah', range: 'Level 1 - 6' },
    { id: 'top-row', label: 'Tahap 2: Baris Atas', range: 'Level 7 - 11' },
    { id: 'bottom-row', label: 'Tahap 3: Baris Bawah', range: 'Level 12 - 16' },
    { id: 'shift-caps', label: 'Tahap 4: Huruf Kapital & Shift', range: 'Level 17 - 18' },
    { id: 'numbers-symbols', label: 'Tahap 5: Angka & Simbol', range: 'Level 19 - 20' },
    { id: 'indonesian-words', label: 'Tahap 6: Kelancaran Bahasa', range: 'Level 21 - 22' },
    { id: 'sentences-prose', label: 'Tahap 7: Kalimat & Prosa', range: 'Level 23 - 25' },
    { id: 'master-speed', label: 'Tahap 8: Master & Kecepatan', range: 'Level 26 - 30' },
  ];

  const filteredLevels =
    selectedTier === 'all' ? LEVELS : LEVELS.filter((l) => l.tier === selectedTier);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Player Level & Progression Hero Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-inner">
            {userProfile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {userProfile.name}
              </h2>
              <span className={`text-xs font-semibold ${rankInfo.color}`}>
                {rankInfo.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Level Akun {userProfile.level}</span>
              <span>·</span>
              <span className="font-mono">{userProfile.xp} XP</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {totalStars}/{maxStars}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Continue Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col text-right hidden lg:block">
            <span className="text-[11px] text-slate-400">Rekomendasi Latihan:</span>
            <span className="text-xs font-semibold text-emerald-400 truncate max-w-[200px]">
              {nextRecommendedLevel.title}
            </span>
          </div>
          <button
            onClick={() => onSelectLevel(nextRecommendedLevel)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lanjutkan Level Terbuka</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block mb-0.5">Level Terbuka</span>
          <span className="text-lg font-mono font-bold text-white">
            {Object.values(levelProgress).filter((l) => l.unlocked).length} / {LEVELS.length}
          </span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block mb-0.5">Level Selesai</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {completedLevels} / {LEVELS.length}
          </span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block mb-0.5">Bintang Sempurna (⭐⭐⭐)</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {Object.values(levelProgress).filter((l) => l.stars === 3).length}
          </span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block mb-0.5">Rata-rata WPM Pribadi</span>
          <span className="text-lg font-mono font-bold text-sky-400">
            {completedLevels > 0
              ? Math.round(
                  Object.values(levelProgress).reduce((a, c) => a + (c.bestWpm || 0), 0) /
                    completedLevels
                )
              : 0}{' '}
            WPM
          </span>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedTier === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Semua Tahap (30 Level)
        </button>
        {tiers.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTier(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTier === t.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredLevels.map((lvl) => {
          const prog = levelProgress[lvl.id] || {
            levelId: lvl.id,
            unlocked: lvl.id === 1,
            completed: false,
            stars: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            bestCpm: 0,
            attempts: 0,
          };

          const isUnlocked = prog.unlocked;

          return (
            <div
              key={lvl.id}
              onClick={() => isUnlocked && onSelectLevel(lvl)}
              className={`
                relative p-4 rounded-xl border transition-all text-left flex flex-col justify-between
                ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer shadow-md'
                    : 'bg-slate-950/60 border-slate-850 opacity-60 cursor-not-allowed'
                }
              `}
            >
              <div>
                {/* Header: Level Number & Star Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider">
                    LEVEL {lvl.id}
                  </span>

                  <div className="flex items-center gap-1">
                    {isUnlocked ? (
                      [1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= (prog.stars || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Title */}
                <h3 className="text-sm font-bold text-white line-clamp-1">{lvl.title}</h3>

                {/* Level Description */}
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lvl.description}
                </p>
              </div>

              {/* Bottom Info: Focus Keys & Best Score */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {isUnlocked ? (
                  prog.completed ? (
                    <div className="flex items-center gap-3 text-slate-300 font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Zap className="w-3 h-3" /> {prog.bestWpm} WPM
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-sky-400">
                        <Target className="w-3 h-3" /> {prog.bestAccuracy}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Target: {lvl.targetWpm} WPM ({lvl.minAccuracy}% akurasi)
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-slate-600">
                    Selesaikan Level {lvl.id - 1} untuk membuka
                  </span>
                )}

                {isUnlocked && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
