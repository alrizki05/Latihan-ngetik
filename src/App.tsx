import { useState, useEffect } from 'react';
import { LevelItem, LevelProgress, SessionResult, UserProfile } from './types/typing';
import { LEVELS } from './data/levels';
import {
  loadUserProfile,
  saveUserProfile,
  loadLevelProgress,
  saveLevelProgress,
  loadSessionHistory,
  saveSessionResult,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { TypingArena } from './components/TypingArena';
import { LevelSelect } from './components/LevelSelect';
import { LeaderboardView } from './components/LeaderboardView';
import { CustomPractice } from './components/CustomPractice';
import { StatsHistoryView } from './components/StatsHistoryView';
import { SessionResultModal } from './components/SessionResultModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'practice' | 'levels' | 'custom' | 'leaderboard' | 'stats'>('practice');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgress>>(loadLevelProgress());
  const [sessionHistory, setSessionHistory] = useState<SessionResult[]>(loadSessionHistory());
  const [activeLevel, setActiveLevel] = useState<LevelItem>(LEVELS[0]);
  const [activeResult, setActiveResult] = useState<SessionResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync profile to storage
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      saveUserProfile(next);
      return next;
    });
  };

  // Select a level and enter practice mode
  const handleSelectLevel = (level: LevelItem) => {
    setActiveLevel(level);
    setActiveResult(null);
    setCurrentTab('practice');
  };

  // Find next unlocked level
  const handleStartLatestPractice = () => {
    const nextLvl =
      LEVELS.find((l) => {
        const p = levelProgress[l.id];
        return p?.unlocked && (!p.completed || p.stars < 3);
      }) || LEVELS[0];

    handleSelectLevel(nextLvl);
  };

  // When a level practice session ends
  const handleCompleteSession = (result: SessionResult) => {
    // 1. Update session history
    saveSessionResult(result);
    setSessionHistory((prev) => [result, ...prev]);

    // 2. If it's a standard campaign level, update level progress
    if (result.levelId && result.levelId <= LEVELS.length) {
      const lvlId = result.levelId;
      setLevelProgress((prev) => {
        const current = prev[lvlId] || {
          levelId: lvlId,
          unlocked: true,
          completed: false,
          stars: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          bestCpm: 0,
          attempts: 0,
        };

        const updatedStars = Math.max(current.stars, result.starsEarned);
        const updatedBestWpm = Math.max(current.bestWpm, result.wpm);
        const updatedBestAcc = Math.max(current.bestAccuracy, result.accuracy);
        const updatedBestCpm = Math.max(current.bestCpm, result.cpm);

        const updatedProgress = {
          ...prev,
          [lvlId]: {
            ...current,
            completed: current.completed || result.starsEarned > 0,
            stars: updatedStars,
            bestWpm: updatedBestWpm,
            bestAccuracy: updatedBestAcc,
            bestCpm: updatedBestCpm,
            attempts: current.attempts + 1,
            lastPlayedAt: Date.now(),
          },
        };

        // Unlock next level if this level got at least 1 star!
        if (result.starsEarned > 0 && lvlId < LEVELS.length) {
          const nextId = lvlId + 1;
          if (updatedProgress[nextId]) {
            updatedProgress[nextId].unlocked = true;
          }
        }

        saveLevelProgress(updatedProgress);
        return updatedProgress;
      });
    }

    // 3. Award XP & Level Up Player
    setUserProfile((prev) => {
      const newXp = prev.xp + result.xpEarned;
      // 1 level every 350 XP
      const newLevel = Math.max(1, Math.floor(newXp / 350) + 1);
      const nextProfile = {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
      saveUserProfile(nextProfile);
      return nextProfile;
    });

    // 4. Show Result Modal
    setActiveResult(result);
  };

  // Next level action from result modal
  const handleNextLevel = () => {
    setActiveResult(null);
    if (!activeLevel) return;
    const nextIdx = LEVELS.findIndex((l) => l.id === activeLevel.id) + 1;
    if (nextIdx < LEVELS.length) {
      setActiveLevel(LEVELS[nextIdx]);
      setCurrentTab('practice');
    }
  };

  // Retry level
  const handleRetry = () => {
    setActiveResult(null);
    setCurrentTab('practice');
  };

  // Clear history
  const handleClearHistory = () => {
    localStorage.removeItem('jarikilat_session_history');
    setSessionHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setActiveResult(null);
          setCurrentTab(tab);
        }}
        userProfile={userProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartLatestPractice={handleStartLatestPractice}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col py-4">
        {currentTab === 'practice' && (
          <TypingArena
            key={activeLevel.id}
            level={activeLevel}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onCompleteSession={handleCompleteSession}
            onExit={() => setCurrentTab('levels')}
          />
        )}

        {currentTab === 'levels' && (
          <LevelSelect
            levelProgress={levelProgress}
            userProfile={userProfile}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {currentTab === 'custom' && (
          <CustomPractice
            onStartCustomLevel={(customLevel) => {
              setActiveLevel(customLevel);
              setActiveResult(null);
              setCurrentTab('practice');
            }}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            userProfile={userProfile}
            onStartPractice={handleStartLatestPractice}
          />
        )}

        {currentTab === 'stats' && (
          <StatsHistoryView
            userProfile={userProfile}
            history={sessionHistory}
            onClearHistory={handleClearHistory}
            onStartPractice={handleStartLatestPractice}
          />
        )}
      </main>

      {/* Post-Session Detailed Diagnostics Modal */}
      {activeResult && (
        <SessionResultModal
          result={activeResult}
          userProfile={userProfile}
          hasNextLevel={Boolean(activeLevel && activeLevel.id < LEVELS.length)}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onGoToLevelMap={() => {
            setActiveResult(null);
            setCurrentTab('levels');
          }}
          onGoToLeaderboard={() => {
            setActiveResult(null);
            setCurrentTab('leaderboard');
          }}
          onUpdateProfileName={(name, avatar) => {
            handleUpdateProfile({ name, avatar });
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        userProfile={userProfile}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleUpdateProfile}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-400">
        <p>JariKilat 10 · Game Edukasi Mengetik Sepuluh Jari Cepat & Presisi</p>
      </footer>
    </div>
  );
}
