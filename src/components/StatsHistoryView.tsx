import React from 'react';
import { SessionResult, UserProfile, FingerId } from '../types/typing';
import { FINGER_METADATA } from '../utils/fingerMapping';
import { getRankTitle } from '../utils/storage';
import { Zap, CheckCircle2, History, Award, Trash2 } from 'lucide-react';

interface StatsHistoryViewProps {
  userProfile: UserProfile;
  history: SessionResult[];
  onClearHistory: () => void;
  onStartPractice: () => void;
}

export const StatsHistoryView: React.FC<StatsHistoryViewProps> = ({
  userProfile,
  history,
  onClearHistory,
  onStartPractice,
}) => {
  const rankInfo = getRankTitle(userProfile.level);

  // Compute lifetime metrics
  const totalSessions = history.length;
  const bestWpm = totalSessions > 0 ? Math.max(...history.map((s) => s.wpm)) : 0;
  const avgWpm =
    totalSessions > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.wpm, 0) / totalSessions)
      : 0;
  const avgAccuracy =
    totalSessions > 0
      ? (history.reduce((acc, cur) => acc + cur.accuracy, 0) / totalSessions).toFixed(1)
      : '0';
  const totalCharsTyped = history.reduce((acc, cur) => acc + cur.totalChars, 0);

  // Aggregated finger performance across sessions
  const aggregatedFingers: Record<FingerId, { total: number; errors: number }> = {
    'left-pinky': { total: 0, errors: 0 },
    'left-ring': { total: 0, errors: 0 },
    'left-middle': { total: 0, errors: 0 },
    'left-index': { total: 0, errors: 0 },
    'left-thumb': { total: 0, errors: 0 },
    'right-thumb': { total: 0, errors: 0 },
    'right-index': { total: 0, errors: 0 },
    'right-middle': { total: 0, errors: 0 },
    'right-ring': { total: 0, errors: 0 },
    'right-pinky': { total: 0, errors: 0 },
  };

  history.forEach((s) => {
    if (s.fingerStats) {
      Object.entries(s.fingerStats).forEach(([id, stat]) => {
        const fingerId = id as FingerId;
        if (aggregatedFingers[fingerId]) {
          aggregatedFingers[fingerId].total += stat.totalKeystrokes || 0;
          aggregatedFingers[fingerId].errors += stat.errors || 0;
        }
      });
    }
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Profile & Lifetime Header */}
      <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-3xl">
            {userProfile.avatar}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {userProfile.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className={`font-semibold ${rankInfo.color}`}>{rankInfo.title}</span> · Level {userProfile.level} · {userProfile.xp} Total XP
            </p>
          </div>
        </div>

        <button
          onClick={onStartPractice}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>Mulai Latihan Baru</span>
        </button>
      </div>

      {/* Lifetime KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-sans block mb-1">Rekor WPM Puncak</span>
          <span className="text-2xl font-bold text-amber-400 tabular-nums">{bestWpm}</span>
          <span className="text-[10px] text-slate-500 font-sans block">Kata / Menit</span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-sans block mb-1">Rata-rata Kecepatan</span>
          <span className="text-2xl font-bold text-white tabular-nums">{avgWpm}</span>
          <span className="text-[10px] text-slate-500 font-sans block">WPM</span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-sans block mb-1">Rata-rata Akurasi</span>
          <span className="text-2xl font-bold text-emerald-400 tabular-nums">{avgAccuracy}%</span>
          <span className="text-[10px] text-slate-500 font-sans block">Presisi Ketukan</span>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-sans block mb-1">Total Karakter Diketik</span>
          <span className="text-2xl font-bold text-sky-400 tabular-nums">
            {totalCharsTyped.toLocaleString('id-ID')}
          </span>
          <span className="text-[10px] text-slate-500 font-sans block">Karakter</span>
        </div>
      </div>

      {/* Lifetime 10-Finger Heatmap */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white">
            Evaluasi Akurasi 10 Jari Kumulatif
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis data ketukan dan tingkat kesalahan pada setiap jari sepanjang riwayat latihan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {(Object.keys(aggregatedFingers) as FingerId[]).map((fId) => {
            const data = aggregatedFingers[fId];
            const meta = FINGER_METADATA[fId];
            const acc =
              data.total > 0
                ? Math.round(((data.total - data.errors) / data.total) * 100)
                : 100;

            return (
              <div key={fId} className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: meta.hexColor }}
                    />
                    {meta.nameId}
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {data.total > 0 ? `${acc}% (${data.errors} salah / ${data.total})` : 'Belum teruji'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${acc}%`,
                      backgroundColor:
                        acc >= 95 ? '#10b981' : acc >= 85 ? '#f59e0b' : '#f43f5e',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Riwayat Sesi Terakhir</h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Belum ada riwayat sesi. Selesaikan level pertama Anda untuk melihat statistik mendalam!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Level / Materi</th>
                  <th className="py-2.5 px-3 text-center">Kecepatan</th>
                  <th className="py-2.5 px-3 text-center">Akurasi</th>
                  <th className="py-2.5 px-3 text-center">Bintang</th>
                  <th className="py-2.5 px-3 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {history.slice(0, 15).map((session, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-200 font-medium">
                      {session.levelTitle}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white tabular-nums">
                      {session.wpm} WPM
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span
                        className={
                          session.accuracy >= 95
                            ? 'text-emerald-400'
                            : session.accuracy >= 90
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-amber-400 font-mono">
                        {'★'.repeat(session.starsEarned)}
                        {'☆'.repeat(3 - session.starsEarned)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(session.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
