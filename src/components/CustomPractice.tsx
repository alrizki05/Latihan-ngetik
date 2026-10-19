import React, { useState } from 'react';
import { LevelItem } from '../types/typing';
import { AdBanner } from './AdBanner';
import { Play, Sparkles, Code2, BookOpen, Clock, FileText } from 'lucide-react';

interface CustomPracticeProps {
  onStartCustomLevel: (customLevel: LevelItem) => void;
}

const PRESET_TEXTS = [
  {
    id: 'berita',
    title: 'Wawasan Teknologi Nusantara',
    category: 'Berita & Teknologi',
    icon: Sparkles,
    targetWpm: 45,
    minAccuracy: 95,
    text: 'Transformasi kecerdasan buatan di Indonesia membuka era efisiensi baru bagi generasi muda. Kemahiran mengetik sepuluh jari adalah fondasi utama kecepatan berkarya dalam lingkungan komputasi modern.',
  },
  {
    id: 'sastra',
    title: 'Kutipan Sastra & Perenungan',
    category: 'Sastra',
    icon: BookOpen,
    targetWpm: 40,
    minAccuracy: 96,
    text: 'Buku adalah jendela dunia, dan pikiran manusia adalah sayap yang menerbangkannya melintasi samudra pengetahuan tanpa batas. Ketelitian dalam setiap aksara melahirkan keindahan bahasa.',
  },
  {
    id: 'koding',
    title: 'Koding JavaScript & TypeScript',
    category: 'Pemrograman',
    icon: Code2,
    targetWpm: 38,
    minAccuracy: 94,
    text: 'const filterNumbers = (list) => { return list.filter((n) => n > 10).map((n) => n * 2); }; console.log("Hasil:", filterNumbers([5, 12, 18, 25]));',
  },
  {
    id: 'sprint60',
    title: 'Sprint Uji Kecepatan 60 Kata',
    category: 'Speed Test',
    icon: Clock,
    targetWpm: 55,
    minAccuracy: 95,
    text: 'waktu bergerak cepat jangan ragu melangkah maju fokus pada tujuan raih impian dengan disiplin konsisten berlatih setiap hari adalah kunci rahasia para juara sejati di pentas dunia',
  },
];

export const CustomPractice: React.FC<CustomPracticeProps> = ({ onStartCustomLevel }) => {
  const [customInputText, setCustomInputText] = useState<string>('');
  const [targetSpeed, setTargetSpeed] = useState<number>(45);

  const handleLaunchPreset = (preset: typeof PRESET_TEXTS[0]) => {
    const level: LevelItem = {
      id: 999,
      tier: 'master-speed',
      tierTitle: 'Latihan Bebas',
      title: preset.title,
      description: `Latihan khusus kategori ${preset.category}. Fokus pada kenyamanan jari dan ritme konsisten.`,
      focusKeys: ['all'],
      focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
      targetWpm: preset.targetWpm,
      minAccuracy: preset.minAccuracy,
      text: preset.text,
    };
    onStartCustomLevel(level);
  };

  const handleLaunchCustom = () => {
    const clean = customInputText.trim();
    if (!clean) return;

    const level: LevelItem = {
      id: 9999,
      tier: 'master-speed',
      tierTitle: 'Teks Kustom Sendiri',
      title: 'Latihan Teks Kustom Anda',
      description: 'Latihan menggunakan teks yang Anda masukkan sendiri. Jari-jemari memandu ketukan secara real-time.',
      focusKeys: ['custom'],
      focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
      targetWpm: targetSpeed,
      minAccuracy: 92,
      text: clean,
    };
    onStartCustomLevel(level);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Latihan Bebas & Teks Kustom
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pilih tema latihan siap pakai atau tempelkan teks materi Anda sendiri untuk melatih 10 jari
        </p>
      </div>

      {/* Preset Cards Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Tema & Modul Pilihan</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PRESET_TEXTS.map((preset) => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-emerald-400 font-semibold">{preset.category}</span>
                    <span className="text-slate-500 font-mono">Target: {preset.targetWpm} WPM</span>
                  </div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span>{preset.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-2 line-clamp-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    "{preset.text}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={() => handleLaunchPreset(preset)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Mulai Latihan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Text Input Box */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Gunakan Teks Anda Sendiri</span>
        </div>
        <p className="text-xs text-slate-400">
          Tempelkan artikel, paragraf tugas sekolah/kampus, atau potongan kode yang ingin Anda latih.
        </p>

        <textarea
          rows={4}
          value={customInputText}
          onChange={(e) => setCustomInputText(e.target.value)}
          placeholder="Ketik atau tempelkan teks Anda di sini (minimal 10 karakter)..."
          className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Target Kecepatan:</span>
            <input
              type="number"
              min={15}
              max={150}
              value={targetSpeed}
              onChange={(e) => setTargetSpeed(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-center text-white"
            />
            <span>WPM</span>
          </div>

          <button
            onClick={handleLaunchCustom}
            disabled={customInputText.trim().length < 10}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-indigo-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Ketik Teks Kustom</span>
          </button>
        </div>
      </div>

      {/* Google AdSense Display Banner */}
      <AdBanner />
    </div>
  );
};
