import React from 'react';
import { FingerId } from '../types/typing';
import { FINGER_METADATA, getFingerInfo, getRequiredShiftKey } from '../utils/fingerMapping';

interface HandGuideProps {
  activeFinger: FingerId;
  targetChar: string;
  className?: string;
  compact?: boolean;
}

export const HandGuide: React.FC<HandGuideProps> = ({
  activeFinger,
  targetChar,
  className = '',
  compact = false
}) => {
  const currentFingerInfo = getFingerInfo(activeFinger);
  const requiredShift = getRequiredShiftKey(targetChar);
  
  // If Shift is required, which pinky is pressed?
  const shiftFinger: FingerId | null = requiredShift === 'ShiftLeft' ? 'left-pinky' : requiredShift === 'ShiftRight' ? 'right-pinky' : null;

  // Render individual finger SVG component
  const renderFinger = (
    id: FingerId,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    angle: number,
    tipY: number,
    labelShort: string
  ) => {
    const isTarget = activeFinger === id;
    const isShiftHelper = shiftFinger === id;
    const meta = FINGER_METADATA[id];

    return (
      <g
        key={id}
        transform={`rotate(${angle} ${cx} ${cy})`}
        className="transition-all duration-200"
      >
        {/* Shadow / Base */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx + 1}
          ry={ry + 2}
          fill="rgba(0,0,0,0.25)"
        />

        {/* Finger body */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={isTarget ? '#1e293b' : '#334155'}
          stroke={isTarget ? meta.hexColor : isShiftHelper ? '#f43f5e' : '#475569'}
          strokeWidth={isTarget ? 2.5 : isShiftHelper ? 2 : 1}
        />

        {/* Knuckle crease accent */}
        <path
          d={`M ${cx - rx * 0.6} ${cy} Q ${cx} ${cy - 2} ${cx + rx * 0.6} ${cy}`}
          stroke="#64748b"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />

        {/* Fingertip circle */}
        <circle
          cx={cx}
          cy={tipY}
          r={rx * 0.75}
          fill={isTarget ? meta.hexColor : isShiftHelper ? '#f43f5e' : 'rgba(100, 116, 139, 0.4)'}
          className={isTarget ? 'transition-all duration-150 animate-pulse' : 'transition-colors'}
        />

        {/* Active glowing ring if this finger needs to press the key */}
        {isTarget && (
          <circle
            cx={cx}
            cy={tipY}
            r={rx * 1.3}
            fill="none"
            stroke={meta.hexColor}
            strokeWidth="2"
            opacity="0.8"
            className="animate-ping"
            style={{ transformOrigin: `${cx}px ${tipY}px` }}
          />
        )}

        {/* Shift indicator if assisting shift */}
        {isShiftHelper && !isTarget && (
          <text
            x={cx}
            y={tipY + 3}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            ⇧
          </text>
        )}

        {/* Short finger label */}
        <text
          x={cx}
          y={cy + ry * 0.7}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="7"
          fontFamily="sans-serif"
        >
          {labelShort}
        </text>
      </g>
    );
  };

  return (
    <div className={`flex flex-col items-center bg-slate-900/80 border border-slate-800 rounded-xl p-3 ${className}`}>
      {/* Dynamic guidance banner */}
      <div className="w-full flex items-center justify-between px-2 mb-2 pb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Jari Aktif:</span>
          <span
            className="font-semibold px-2 py-0.5 rounded text-xs"
            style={{
              backgroundColor: `${currentFingerInfo.hexColor}20`,
              color: currentFingerInfo.hexColor,
              border: `1px solid ${currentFingerInfo.hexColor}40`
            }}
          >
            {currentFingerInfo.nameId}
          </span>
          {requiredShift && (
            <span className="text-slate-400 text-xs">
              + Tekan <strong className="text-rose-400">{requiredShift === 'ShiftLeft' ? 'Shift Kiri' : 'Shift Kanan'}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Tombol Target:</span>
          <span className="px-2 py-0.5 font-mono text-sm font-bold bg-slate-800 text-white rounded border border-slate-700 min-w-[24px] text-center shadow-inner">
            {targetChar === ' ' ? 'Spasi' : targetChar}
          </span>
        </div>
      </div>

      {/* SVG Hands Visualization */}
      <div className="relative w-full flex justify-center items-center py-1 overflow-hidden">
        <svg
          viewBox="0 0 540 180"
          className={compact ? 'w-full max-w-[420px] h-[130px]' : 'w-full max-w-[520px] h-[160px]'}
        >
          <defs>
            {/* Ambient gradients */}
            <radialGradient id="palmGlowLeft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="palmGlowRight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* ================= LEFT HAND ================= */}
          <g id="left-hand" transform="translate(10, 5)">
            {/* Palm */}
            <path
              d="M 60 120 C 50 160, 110 170, 160 165 C 190 160, 200 130, 185 105 C 170 85, 140 85, 90 90 Z"
              fill="url(#palmGlowLeft)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Wrist */}
            <path
              d="M 90 165 C 110 178, 140 178, 160 165"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,3"
            />
            {/* Hand Label */}
            <text x="125" y="145" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
              TANGAN KIRI
            </text>

            {/* Resting Bump Indicator for F */}
            <circle cx="172" cy="40" r="3" fill="#38bdf8" opacity="0.9" />
            <text x="172" y="32" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">F</text>

            {/* Pinky (Kelingking Kiri) */}
            {renderFinger('left-pinky', 55, 65, 8, 30, -18, 40, 'Kel.')}

            {/* Ring (Jari Manis Kiri) */}
            {renderFinger('left-ring', 90, 50, 9, 36, -8, 20, 'Manis')}

            {/* Middle (Jari Tengah Kiri) */}
            {renderFinger('left-middle', 130, 42, 9.5, 40, 2, 10, 'Tengah')}

            {/* Index (Jari Telunjuk Kiri) */}
            {renderFinger('left-index', 170, 50, 9.5, 36, 12, 20, 'Telunjuk')}

            {/* Thumb (Ibu Jari Kiri) */}
            {renderFinger('left-thumb', 205, 95, 10, 26, 42, 74, 'Jempol')}
          </g>

          {/* Center Dividing Guideline */}
          <line
            x1="270"
            y1="25"
            x2="270"
            y2="165"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <text x="270" y="172" textAnchor="middle" fill="#475569" fontSize="8">
            Pusat Keyboard
          </text>

          {/* ================= RIGHT HAND ================= */}
          <g id="right-hand" transform="translate(280, 5)">
            {/* Palm */}
            <path
              d="M 80 105 C 65 130, 75 160, 105 165 C 155 170, 215 160, 205 120 C 175 85, 125 85, 80 105 Z"
              fill="url(#palmGlowRight)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Wrist */}
            <path
              d="M 105 165 C 125 178, 155 178, 175 165"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2,3"
            />
            {/* Hand Label */}
            <text x="140" y="145" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
              TANGAN KANAN
            </text>

            {/* Resting Bump Indicator for J */}
            <circle cx="92" cy="40" r="3" fill="#38bdf8" opacity="0.9" />
            <text x="92" y="32" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">J</text>

            {/* Thumb (Ibu Jari Kanan) */}
            {renderFinger('right-thumb', 60, 95, 10, 26, -42, 74, 'Jempol')}

            {/* Index (Jari Telunjuk Kanan) */}
            {renderFinger('right-index', 95, 50, 9.5, 36, -12, 20, 'Telunjuk')}

            {/* Middle (Jari Tengah Kanan) */}
            {renderFinger('right-middle', 135, 42, 9.5, 40, -2, 10, 'Tengah')}

            {/* Ring (Jari Manis Kanan) */}
            {renderFinger('right-ring', 175, 50, 9, 36, 8, 20, 'Manis')}

            {/* Pinky (Kelingking Kanan) */}
            {renderFinger('right-pinky', 210, 65, 8, 30, 18, 40, 'Kel.')}
          </g>
        </svg>
      </div>

      {/* Posture and finger placement tip */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block"></span>
          <span>Titik Tonjolan Rumah: <strong>F</strong> (Telunjuk Kiri) & <strong>J</strong> (Telunjuk Kanan)</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-500">
          <span>Gunakan ibu jari untuk menekan tombol spasi</span>
        </div>
      </div>
    </div>
  );
};
