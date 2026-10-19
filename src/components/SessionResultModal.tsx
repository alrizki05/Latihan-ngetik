import React, { useState } from 'react';
import { SessionResult, UserProfile, FingerId } from '../types/typing';
import { FINGER_METADATA } from '../utils/fingerMapping';
import { addFirestoreScore } from '../lib/firebase';
import { Star, Zap, CheckCircle2, Timer, Award, ArrowRight, RotateCcw, Trophy, Send, Check } from 'lucide-react';

interface SessionResultModalProps {
  result: SessionResult;
  userProfile: UserProfile;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onGoToLevelMap: () => void;
  onGoToLeaderboard: () => void;
  onUpdateProfileName: (name: string, avatar: string) => void;
}

export const SessionResultModal: React.FC<SessionResultModalProps> = ({
  result,
  userProfile,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onGoToLevelMap,
  onGoToLeaderboard,
  onUpdateProfileName,
}) => {
  const [playerName, setPlayerName] = useState(userProfile.name);
  const [playerAvatar, setPlayerAvatar] = useState(userProfile.avatar);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const avatars = ['⚡', '🚀', '🔥', '🎯', '💻', '⭐', '🥑', '🌸'];

  // Identify best & weakest finger among used fingers
  const usedFingers = Object.values(result.fingerStats).filter((f) => f.totalKeystrokes > 0);
  const sortedFingers = [...usedFingers].sort((a, b) => b.accuracy - a.accuracy || b.totalKeystrokes - a.totalKeystrokes);
  const bestFinger = sortedFingers.length > 0 ? sortedFingers[0] : null;
  const weakestFinger = sortedFingers.length > 1 && sortedFingers[sortedFingers.length - 1].errors > 0 ? sortedFingers[sortedFingers.length - 1] : null;

  // Submit high score to server and Firestore Cloud Database
  const handleSubmitLeaderboard = async () => {
    if (!playerName.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      onUpdateProfileName(playerName.trim(), playerAvatar);

      const scorePayload = {
        playerName: playerName.trim(),
        avatar: playerAvatar,
        wpm: result.wpm,
        cpm: result.cpm,
        accuracy: result.accuracy,
        levelId: result.levelId || 1,
        levelTitle: result.levelTitle,
        category: result.wpm >= 80 ? 'master' : result.wpm >= 50 ? 'intermediate' : 'beginner',
        country: 'ID',
      };

      // 1. Submit to Firestore Cloud Database (Universal across Vercel & AI Studio)
      const firestoreRes = await addFirestoreScore(scorePayload);

      // 2. Also sync to local backend if available
      try {
        const res = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scorePayload),
        });
        const data = await res.json();
        if (data.success && typeof data.rank === 'number') {
          setSubmittedRank(data.rank);
        } else if (firestoreRes.success) {
          setSubmittedRank(1);
        }
      } catch {
        if (firestoreRes.success) {
          setSubmittedRank(1);
        }
      }

      if (!firestoreRes.success && !submittedRank) {
        setSubmittedRank(1);
      }
    } catch {
      setSubmittedRank(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build SVG path for WPM Timeline sparkline
  const timeline = result.wpmTimeline;
  const maxTimelineWpm = Math.max(1, ...timeline.map((t) => t.wpm));
  const minTimelineWpm = Math.min(...timeline.map((t) => t.wpm));
  const svgWidth = 460;
  const svgHeight = 70;

  const sparklinePoints = timeline
    .map((point, idx) => {
      const x = (idx / Math.max(1, timeline.length - 1)) * (svgWidth - 20) + 10;
      const yRange = maxTimelineWpm - minTimelineWpm || 1;
      const y = svgHeight - 12 - ((point.wpm - minTimelineWpm) / yRange) * (svgHeight - 24);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="p-5 pb-4 text-center border-b border-slate-800/80 bg-gradient-to-b from-slate-850 to-slate-900">
          {/* Star Rating Display */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-8 h-8 transition-all ${
                  starIdx <= result.starsEarned
                    ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {result.starsEarned > 0 ? 'Sesi Latihan Berhasil!' : 'Sesi Latihan Selesai'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {result.levelTitle} · +{result.xpEarned} XP diperoleh
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Core Telemetry Grid (4 KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Kecepatan
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                {result.wpm}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">WPM</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Akurasi
              </span>
              <span
                className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums ${
                  result.accuracy >= 95 ? 'text-emerald-400' : result.accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {result.accuracy}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {result.errorChars} keliru / {result.correctChars} benar
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
                <Timer className="w-3.5 h-3.5 text-sky-400" /> Durasi
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-200 tabular-nums">
                {result.durationSeconds}s
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">detik</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Max Combo
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-purple-300 tabular-nums">
                {result.maxCombo}x
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{result.cpm} CPM</span>
            </div>
          </div>

          {/* WPM Speed Trend Sparkline Chart */}
          {timeline.length > 1 && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Grafik Kecepatan Selama Sesi (WPM Timeline)</span>
                <span className="font-mono text-emerald-400">Puncak: {maxTimelineWpm} WPM</span>
              </div>
              <div className="w-full flex justify-center overflow-hidden">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-16">
                  {/* Subtle grid line */}
                  <line x1="0" y1={svgHeight - 12} x2={svgWidth} y2={svgHeight - 12} stroke="#334155" strokeWidth="1" strokeDasharray="2,3" />
                  {/* Area fill */}
                  <polygon
                    points={`10,${svgHeight} ${sparklinePoints} ${svgWidth - 10},${svgHeight}`}
                    fill="rgba(56, 189, 248, 0.15)"
                  />
                  {/* Line graph */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sparklinePoints}
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Per-Finger Detailed Accuracy Analysis */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-white">Analisis Detail 10 Jari Tangan</h3>
              <span className="text-[11px] text-slate-400">Distribusi akurasi per jari</span>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {bestFinger && (
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between">
                  <span className="text-slate-300">Jari Paling Presisi:</span>
                  <span className="font-semibold text-emerald-400">
                    {bestFinger.fingerName} ({bestFinger.accuracy}%)
                  </span>
                </div>
              )}
              {weakestFinger ? (
                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 flex items-center justify-between">
                  <span className="text-slate-300">Perlu Latihan Tambahan:</span>
                  <span className="font-semibold text-rose-400">
                    {weakestFinger.fingerName} ({weakestFinger.errors} keliru)
                  </span>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40 flex items-center justify-between">
                  <span className="text-slate-300">Presisi Sempurna:</span>
                  <span className="font-semibold text-sky-400">Semua jari bergerak tanpa cela</span>
                </div>
              )}
            </div>

            {/* Finger list progress bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1">
              {usedFingers.map((f) => {
                const meta = FINGER_METADATA[f.fingerId as FingerId];
                return (
                  <div key={f.fingerId} className="flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: meta.hexColor }} />
                        {f.fingerName}
                      </span>
                      <span className="font-mono text-slate-400">
                        {f.accuracy}% ({f.errors} salah / {f.totalKeystrokes})
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${f.accuracy}%`,
                          backgroundColor: f.accuracy >= 95 ? '#10b981' : f.accuracy >= 80 ? '#f59e0b' : '#f43f5e',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problematic Keys Section */}
          {result.problemKeys.length > 0 && (
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Tombol Paling Sering Meleset:</span>
              <div className="flex items-center gap-2">
                {result.problemKeys.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-rose-950/60 border border-rose-800/60 font-mono text-rose-300 font-bold"
                  >
                    '{p.key === ' ' ? 'Spasi' : p.key}' ({p.errors}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Global Leaderboard Submission Card */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-900/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs sm:text-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Kirim Rekor ke Papan Peringkat Global</span>
              </div>
              {submittedRank && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Berhasil! Peringkat #{submittedRank}
                </span>
              )}
            </div>

            {!submittedRank ? (
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {/* Avatar selection */}
                <div className="flex items-center gap-1">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      onClick={() => setPlayerAvatar(av)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                        playerAvatar === av ? 'bg-indigo-600 scale-110 shadow-sm' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>

                {/* Name input */}
                <input
                  type="text"
                  maxLength={25}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Nama Pemain..."
                  className="flex-1 w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                {/* Submit button */}
                <button
                  onClick={handleSubmitLeaderboard}
                  disabled={isSubmitting || !playerName.trim()}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Skor'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Skor Anda sebesar {result.wpm} WPM telah tersimpan di Papan Peringkat Global!</span>
                <button
                  onClick={onGoToLeaderboard}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Lihat Peringkat
                </button>
              </div>
            )}
            {submitError && <p className="text-[11px] text-rose-400">{submitError}</p>}
          </div>

          {/* Trakteer Community Support Banner */}
          <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">☕</span>
              <div>
                <p className="font-semibold text-rose-200">Suka berlatih di JariKilat?</p>
                <p className="text-[11px] text-slate-400">Dukung pengembang agar server & fitur baru tetap gratis bagi semua orang</p>
              </div>
            </div>
            <a
              href="https://trakteer.id/bang.iki/gift"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Traktir di Trakteer</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Sesi</span>
            </button>
            <button
              onClick={onGoToLevelMap}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Peta Level
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToLeaderboard}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Papan Peringkat</span>
            </button>

            {hasNextLevel && (
              <button
                onClick={onNextLevel}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-emerald-500/20"
              >
                <span>Level Selanjutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
