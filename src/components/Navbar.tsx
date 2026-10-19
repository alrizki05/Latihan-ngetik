import React from 'react';
import { UserProfile } from '../types/typing';
import { Keyboard, Settings, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  currentTab: 'practice' | 'levels' | 'custom' | 'leaderboard' | 'stats';
  onSelectTab: (tab: 'practice' | 'levels' | 'custom' | 'leaderboard' | 'stats') => void;
  userProfile: UserProfile;
  onOpenSettings: () => void;
  onStartLatestPractice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userProfile,
  onOpenSettings,
  onStartLatestPractice,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('levels')}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            JariKilat <span className="text-emerald-400 font-mono text-sm">10</span>
          </span>
        </button>

        {/* Zone 2: 4–5 Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('practice')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentTab === 'practice' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Latihan
          </button>
          <button
            onClick={() => onSelectTab('levels')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentTab === 'levels' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Level (30)
          </button>
          <button
            onClick={() => onSelectTab('custom')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentTab === 'custom' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Kustom
          </button>
          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentTab === 'leaderboard' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Papan Peringkat
          </button>
          <button
            onClick={() => onSelectTab('stats')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentTab === 'stats' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Riwayat
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSettings}
            title="Pengaturan Keyboard & Suara"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onStartLatestPractice}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Mulai Ketik</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 bg-slate-950 text-[11px] font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('practice')}
          className={`px-2 py-1 rounded ${currentTab === 'practice' ? 'text-emerald-400 font-bold' : ''}`}
        >
          Latihan
        </button>
        <button
          onClick={() => onSelectTab('levels')}
          className={`px-2 py-1 rounded ${currentTab === 'levels' ? 'text-emerald-400 font-bold' : ''}`}
        >
          Level
        </button>
        <button
          onClick={() => onSelectTab('custom')}
          className={`px-2 py-1 rounded ${currentTab === 'custom' ? 'text-emerald-400 font-bold' : ''}`}
        >
          Kustom
        </button>
        <button
          onClick={() => onSelectTab('leaderboard')}
          className={`px-2 py-1 rounded ${currentTab === 'leaderboard' ? 'text-emerald-400 font-bold' : ''}`}
        >
          Peringkat
        </button>
        <button
          onClick={() => onSelectTab('stats')}
          className={`px-2 py-1 rounded ${currentTab === 'stats' ? 'text-emerald-400 font-bold' : ''}`}
        >
          Riwayat
        </button>
      </div>
    </header>
  );
};
