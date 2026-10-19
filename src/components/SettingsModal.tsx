import React, { useState } from 'react';
import { UserProfile } from '../types/typing';
import { X, Volume2, Hand, Palette, Check } from 'lucide-react';

interface SettingsModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [soundEnabled, setSoundEnabled] = useState(userProfile.soundEnabled);
  const [soundType, setSoundType] = useState(userProfile.soundType);
  const [volume, setVolume] = useState(userProfile.volume);
  const [showKeyboardHands, setShowKeyboardHands] = useState(userProfile.showKeyboardHands);
  const [showFingerColors, setShowFingerColors] = useState(userProfile.showFingerColors);

  const avatars = ['⚡', '🚀', '🔥', '🎯', '💻', '⭐', '🥑', '🌸'];

  if (!isOpen) return null;

  const handleApply = () => {
    onSave({
      name: name.trim() || 'Pengetik Kilat',
      avatar,
      soundEnabled,
      soundType,
      volume,
      showKeyboardHands,
      showFingerColors,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Pengaturan JariKilat
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs">
          {/* Profile Name & Avatar */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-300 block">Profil Pengetik</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                maxLength={25}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Avatar chips */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">Avatar:</span>
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    avatar === av ? 'bg-emerald-600 scale-110 shadow-sm' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Audio Feedback */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Volume2 className="w-4 h-4 text-sky-400" />
                <span>Efek Suara Ketukan Keyboard</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {soundEnabled && (
              <div className="space-y-2.5 pl-6">
                <div>
                  <span className="text-slate-400 block mb-1">Tipe Saklar (Switch):</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSoundType('mechanical')}
                      className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-colors ${
                        soundType === 'mechanical'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Mekanikal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoundType('clicky')}
                      className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-colors ${
                        soundType === 'clicky'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Clicky (Blue)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoundType('soft')}
                      className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-colors ${
                        soundType === 'soft'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Soft Thock
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Volume:</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-800" />

          {/* Visual Guides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Hand className="w-4 h-4 text-amber-400" />
                <span>Gambar Tangan & Jari di Layar</span>
              </div>
              <input
                type="checkbox"
                checked={showKeyboardHands}
                onChange={(e) => setShowKeyboardHands(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Indikator Warna Jari pada Tombol</span>
              </div>
              <input
                type="checkbox"
                checked={showFingerColors}
                onChange={(e) => setShowFingerColors(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
