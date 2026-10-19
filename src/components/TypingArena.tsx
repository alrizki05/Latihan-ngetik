import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FingerId, FingerStat, LevelItem, SessionResult, UserProfile } from '../types/typing';
import { getFingerForKey, getFingerInfo } from '../utils/fingerMapping';
import { HandGuide } from './HandGuide';
import { VirtualKeyboard } from './VirtualKeyboard';
import { soundManager } from '../utils/sound';
import { RotateCcw, Volume2, VolumeX, Eye, EyeOff, Award, Zap, Timer, CheckCircle2 } from 'lucide-react';

interface TypingArenaProps {
  level: LevelItem;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onCompleteSession: (result: SessionResult) => void;
  onExit: () => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  level,
  userProfile,
  onUpdateProfile,
  onCompleteSession,
  onExit: _onExit,
}) => {
  const targetText = level.text;

  // Typing state
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [charStatuses, setCharStatuses] = useState<('correct' | 'incorrect')[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Statistics trackers
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lastPressed, setLastPressed] = useState<{ key: string; isCorrect: boolean } | null>(null);

  // Per-finger and problem key tracking
  const fingerStatsRef = useRef<Record<FingerId, FingerStat>>({
    'left-pinky': { fingerId: 'left-pinky', fingerName: 'Kelingking Kiri', hand: 'left', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'left-ring': { fingerId: 'left-ring', fingerName: 'Jari Manis Kiri', hand: 'left', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'left-middle': { fingerId: 'left-middle', fingerName: 'Jari Tengah Kiri', hand: 'left', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'left-index': { fingerId: 'left-index', fingerName: 'Jari Telunjuk Kiri', hand: 'left', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'left-thumb': { fingerId: 'left-thumb', fingerName: 'Ibu Jari Kiri', hand: 'left', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'right-thumb': { fingerId: 'right-thumb', fingerName: 'Ibu Jari Kanan', hand: 'right', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'right-index': { fingerId: 'right-index', fingerName: 'Jari Telunjuk Kanan', hand: 'right', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'right-middle': { fingerId: 'right-middle', fingerName: 'Jari Tengah Kanan', hand: 'right', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'right-ring': { fingerId: 'right-ring', fingerName: 'Jari Manis Kanan', hand: 'right', totalKeystrokes: 0, errors: 0, accuracy: 100 },
    'right-pinky': { fingerId: 'right-pinky', fingerName: 'Kelingking Kanan', hand: 'right', totalKeystrokes: 0, errors: 0, accuracy: 100 },
  });

  const problemKeysMapRef = useRef<Record<string, number>>({});
  const timelineRef = useRef<Array<{ second: number; wpm: number; acc: number }>>([]);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Current target character & required finger
  const targetChar = currentIndex < targetText.length ? targetText[currentIndex] : '';
  const activeFingerInfo = targetChar ? getFingerForKey(targetChar) : getFingerInfo('right-thumb');

  const startTimeRef = useRef<number | null>(null);

  // Sound configuration sync
  useEffect(() => {
    soundManager.setEnabled(userProfile.soundEnabled);
    soundManager.setVolume(userProfile.volume);
    soundManager.setType(userProfile.soundType);
  }, [userProfile.soundEnabled, userProfile.volume, userProfile.soundType]);

  // Decoupled Timer Interval: runs smoothly every 250ms based strictly on timestamp
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentStart = startTimeRef.current || startTime;
      const seconds = Math.max(1, Math.floor((now - currentStart) / 1000));
      setElapsedSeconds(seconds);

      // Record timeline periodically (at new second boundaries)
      const lastRecorded = timelineRef.current[timelineRef.current.length - 1];
      if (!lastRecorded || lastRecorded.second < seconds) {
        const correctCount = charStatuses.filter((s) => s === 'correct').length;
        const currentWpm = Math.round((correctCount / 5) / (seconds / 60));
        const currentAcc = totalKeystrokes > 0 ? Number((((totalKeystrokes - totalErrors) / totalKeystrokes) * 100).toFixed(1)) : 100;

        timelineRef.current.push({
          second: seconds,
          wpm: currentWpm,
          acc: Math.max(0, currentAcc),
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [startTime, isFinished, charStatuses, totalKeystrokes, totalErrors]);

  // Keep active character scrolled into view
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const el = activeCharRef.current;
      const relativeTop = el.offsetTop - container.offsetTop;
      if (relativeTop > container.clientHeight - 60 || relativeTop < 20) {
        container.scrollTo({ top: relativeTop - 30, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  // Calculate realtime WPM & Accuracy using exact elapsed milliseconds
  const calculateRealtimeWpm = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    const elapsedMs = Math.max(500, Date.now() - startTimeRef.current);
    const correctCount = charStatuses.filter((s) => s === 'correct').length;
    const minutes = elapsedMs / (1000 * 60);
    return Math.round((correctCount / 5) / minutes);
  }, [charStatuses]);

  const calculateRealtimeAccuracy = useCallback((): number => {
    if (totalKeystrokes <= 0) return 100;
    const acc = ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100;
    return Math.max(0, Math.min(100, Number(acc.toFixed(1))));
  }, [totalKeystrokes, totalErrors]);

  // Finish session with exact millisecond duration calculation
  const completeSession = useCallback(() => {
    setIsFinished(true);
    soundManager.playVictory();

    const now = Date.now();
    const effectiveStart = startTimeRef.current || now - 1000;
    const totalDurationMs = Math.max(500, now - effectiveStart);
    const durationSeconds = Math.max(1, Math.round(totalDurationMs / 1000));
    const durationMinutes = totalDurationMs / (1000 * 60);

    const correctCount = charStatuses.filter((s) => s === 'correct').length;
    const finalWpm = Math.max(1, Math.round((correctCount / 5) / durationMinutes));
    const finalAccuracy = calculateRealtimeAccuracy();
    const finalCpm = Math.round((correctCount / (totalDurationMs / 1000)) * 60);

    // Compute star count (1 to 3 stars)
    let stars = 0;
    if (finalAccuracy >= level.minAccuracy) {
      if (finalWpm >= level.targetWpm && finalAccuracy >= 96) {
        stars = 3;
      } else if (finalWpm >= level.targetWpm * 0.8 && finalAccuracy >= 92) {
        stars = 2;
      } else {
        stars = 1;
      }
    }

    // Compute XP
    const xpBase = level.id * 50;
    const xpSpeed = finalWpm * 4;
    const xpBonus = stars * 100;
    const totalXp = Math.round(xpBase + xpSpeed + xpBonus);

    // Finalize finger statistics
    const finalFingerStats = { ...fingerStatsRef.current };
    Object.keys(finalFingerStats).forEach((key) => {
      const f = finalFingerStats[key as FingerId];
      if (f.totalKeystrokes > 0) {
        f.accuracy = Math.max(0, Math.round(((f.totalKeystrokes - f.errors) / f.totalKeystrokes) * 100));
      } else {
        f.accuracy = 100;
      }
    });

    // Sort problem keys
    const problemKeysList = Object.entries(problemKeysMapRef.current)
      .map(([k, errs]) => ({ key: k, errors: errs }))
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 5);

    const result: SessionResult = {
      levelId: level.id,
      levelTitle: level.title,
      durationSeconds,
      wpm: finalWpm,
      rawWpm: Math.round((totalKeystrokes / 5) / durationMinutes),
      cpm: finalCpm,
      accuracy: finalAccuracy,
      totalChars: targetText.length,
      correctChars: correctCount,
      errorChars: totalErrors,
      maxCombo: Math.max(maxCombo, combo),
      fingerStats: finalFingerStats,
      problemKeys: problemKeysList,
      wpmTimeline: timelineRef.current.length > 0 ? timelineRef.current : [{ second: durationSeconds, wpm: finalWpm, acc: finalAccuracy }],
      starsEarned: stars,
      xpEarned: totalXp,
      timestamp: Date.now(),
    };

    onCompleteSession(result);
  }, [
    charStatuses,
    calculateRealtimeAccuracy,
    level,
    totalKeystrokes,
    totalErrors,
    maxCombo,
    combo,
    targetText.length,
    onCompleteSession,
  ]);

  // Handle typing keystrokes
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinished) return;

      // Ignore special modifier keys
      if (
        ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
          e.key
        )
      ) {
        return;
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentIndex > 0) {
          const newIdx = currentIndex - 1;
          setCurrentIndex(newIdx);
          setTypedChars((prev) => prev.slice(0, newIdx));
          setCharStatuses((prev) => prev.slice(0, newIdx));
          setLastPressed({ key: 'Backspace', isCorrect: true });
          soundManager.playKeypress(true);
        }
        return;
      }

      // Disallow non-character strings (e.g. F1-F12)
      if (e.key.length !== 1) return;

      e.preventDefault();

      // Start timer on first keystroke
      if (!startTimeRef.current) {
        const now = Date.now();
        startTimeRef.current = now;
        setStartTime(now);
      }

      const expectedChar = targetText[currentIndex];
      const typedChar = e.key;
      const isCorrect = typedChar === expectedChar;
      const fingerInfo = getFingerForKey(expectedChar);

      // Keystroke statistics
      setTotalKeystrokes((prev) => prev + 1);

      // Record finger keystroke
      const fStat = fingerStatsRef.current[fingerInfo.id];
      if (fStat) {
        fStat.totalKeystrokes++;
        if (!isCorrect) {
          fStat.errors++;
        }
      }

      if (isCorrect) {
        soundManager.playKeypress(true);
        setCombo((prev) => {
          const next = prev + 1;
          if (next > maxCombo) setMaxCombo(next);
          if (next === 10 || next === 25 || next === 50 || next === 100) {
            soundManager.playComboMilestone(next);
          }
          return next;
        });
      } else {
        soundManager.playError();
        setTotalErrors((prev) => prev + 1);
        setCombo(0);
        problemKeysMapRef.current[expectedChar] = (problemKeysMapRef.current[expectedChar] || 0) + 1;
      }

      // Update character states
      const nextIdx = currentIndex + 1;
      setTypedChars((prev) => [...prev, typedChar]);
      setCharStatuses((prev) => [...prev, isCorrect ? 'correct' : 'incorrect']);
      setCurrentIndex(nextIdx);
      setLastPressed({ key: typedChar, isCorrect });

      // Check if finished level
      if (nextIdx >= targetText.length) {
        completeSession();
      }
    },
    [isFinished, currentIndex, targetText, maxCombo, completeSession]
  );

  // Attach global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Restart level
  const handleRestart = () => {
    startTimeRef.current = null;
    setTypedChars([]);
    setCharStatuses([]);
    setCurrentIndex(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setTotalKeystrokes(0);
    setTotalErrors(0);
    setCombo(0);
    setMaxCombo(0);
    setLastPressed(null);
    timelineRef.current = [];
    problemKeysMapRef.current = {};
    Object.keys(fingerStatsRef.current).forEach((k) => {
      fingerStatsRef.current[k as FingerId].totalKeystrokes = 0;
      fingerStatsRef.current[k as FingerId].errors = 0;
      fingerStatsRef.current[k as FingerId].accuracy = 100;
    });
  };

  const realtimeWpm = calculateRealtimeWpm();
  const realtimeAcc = calculateRealtimeAccuracy();
  const progressPercent = Math.round((currentIndex / targetText.length) * 100);

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Top Header & HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
        {/* Level Title & Progress */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              {level.tierTitle}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Target: {level.targetWpm} WPM</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{level.title}</h2>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> WPM
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {realtimeWpm}
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Akurasi
            </span>
            <span
              className={`text-xl sm:text-2xl font-bold tabular-nums ${
                realtimeAcc >= 95 ? 'text-emerald-400' : realtimeAcc >= 85 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {realtimeAcc}%
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Timer className="w-3 h-3 text-sky-400" /> Waktu
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-200 tabular-nums">
              {elapsedSeconds}s
            </span>
          </div>

          <div className="h-7 w-px bg-slate-800 hidden md:block" />

          <div className="hidden md:flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-purple-400" /> Combo
            </span>
            <span className="text-xl sm:text-2xl font-bold text-purple-300 tabular-nums">
              {combo}x
            </span>
          </div>
        </div>

        {/* Quick Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateProfile({ soundEnabled: !userProfile.soundEnabled })}
            title={userProfile.soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {userProfile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Hands Guide Toggle */}
          <button
            onClick={() => onUpdateProfile({ showKeyboardHands: !userProfile.showKeyboardHands })}
            title={userProfile.showKeyboardHands ? 'Sembunyikan Panduan Tangan' : 'Tampilkan Panduan Tangan'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {userProfile.showKeyboardHands ? <Eye className="w-4 h-4 text-sky-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleRestart}
            title="Ulangi Level Ini"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Level Educational Description */}
      <div className="px-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-300 flex items-center justify-between gap-4">
        <p className="leading-relaxed">
          <strong className="text-white">Instruksi: </strong>
          {level.description}
        </p>
        <div className="shrink-0 flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
          <span>Progres:</span>
          <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* Main Typing Display Box */}
      <div
        ref={textContainerRef}
        className="relative min-h-[130px] max-h-[180px] overflow-y-auto p-4 sm:p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner font-mono text-lg sm:text-2xl leading-relaxed tracking-wider select-none focus:outline-none focus:border-sky-500/50"
      >
        <div className="flex flex-wrap items-center">
          {targetText.split('').map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const status = isTyped ? charStatuses[index] : null;

            let charColor = 'text-slate-500';
            if (isTyped) {
              charColor = status === 'correct' ? 'text-emerald-400' : 'text-rose-400 bg-rose-950/60 rounded px-0.5 underline';
            } else if (isCurrent) {
              charColor = 'text-white font-bold bg-sky-500/20 px-1 rounded ring-2 ring-sky-400 animate-pulse';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`transition-colors duration-75 relative inline-block ${charColor}`}
              >
                {char === ' ' ? (
                  <span className={isCurrent ? 'bg-sky-500/30 px-1 rounded border border-sky-400/50 text-slate-300' : ''}>
                    &nbsp;
                  </span>
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>

        {/* Start hint if idle */}
        {!startTime && (
          <div className="absolute right-4 bottom-3 text-xs text-slate-400 animate-bounce bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700">
            Ketik tombol target untuk memulai...
          </div>
        )}
      </div>

      {/* Visual Hand & Finger Guidance Component */}
      {userProfile.showKeyboardHands && (
        <HandGuide
          activeFinger={activeFingerInfo.id}
          targetChar={targetChar}
          compact={false}
        />
      )}

      {/* Virtual Interactive Keyboard */}
      <VirtualKeyboard
        targetChar={targetChar}
        activeFinger={activeFingerInfo.id}
        lastPressedKey={lastPressed}
        showFingerColors={userProfile.showFingerColors}
      />
    </div>
  );
};
