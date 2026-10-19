import React from 'react';
import { FingerId, KeyInfo } from '../types/typing';
import { FINGER_METADATA, getRequiredShiftKey } from '../utils/fingerMapping';

interface VirtualKeyboardProps {
  targetChar: string;
  activeFinger: FingerId;
  lastPressedKey?: { key: string; isCorrect: boolean } | null;
  showFingerColors?: boolean;
  className?: string;
}

// Complete keyboard layout definition
const KEYBOARD_ROWS: KeyInfo[][] = [
  // Row 0: Numbers & Tilde
  [
    { code: 'Backquote', display: '`', shiftDisplay: '~', finger: 'left-pinky', hand: 'left', width: 'w-standard' },
    { code: 'Digit1', display: '1', shiftDisplay: '!', finger: 'left-pinky', hand: 'left', width: 'w-standard' },
    { code: 'Digit2', display: '2', shiftDisplay: '@', finger: 'left-ring', hand: 'left', width: 'w-standard' },
    { code: 'Digit3', display: '3', shiftDisplay: '#', finger: 'left-middle', hand: 'left', width: 'w-standard' },
    { code: 'Digit4', display: '4', shiftDisplay: '$', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'Digit5', display: '5', shiftDisplay: '%', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'Digit6', display: '6', shiftDisplay: '^', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'Digit7', display: '7', shiftDisplay: '&', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'Digit8', display: '8', shiftDisplay: '*', finger: 'right-middle', hand: 'right', width: 'w-standard' },
    { code: 'Digit9', display: '9', shiftDisplay: '(', finger: 'right-ring', hand: 'right', width: 'w-standard' },
    { code: 'Digit0', display: '0', shiftDisplay: ')', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Minus', display: '-', shiftDisplay: '_', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Equal', display: '=', shiftDisplay: '+', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Backspace', display: 'Backspace', finger: 'right-pinky', hand: 'right', width: 'w-2' },
  ],
  // Row 1: Top Row QWERTY
  [
    { code: 'Tab', display: 'Tab', finger: 'left-pinky', hand: 'left', width: 'w-1.5' },
    { code: 'KeyQ', display: 'q', shiftDisplay: 'Q', finger: 'left-pinky', hand: 'left', width: 'w-standard' },
    { code: 'KeyW', display: 'w', shiftDisplay: 'W', finger: 'left-ring', hand: 'left', width: 'w-standard' },
    { code: 'KeyE', display: 'e', shiftDisplay: 'E', finger: 'left-middle', hand: 'left', width: 'w-standard' },
    { code: 'KeyR', display: 'r', shiftDisplay: 'R', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyT', display: 't', shiftDisplay: 'T', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyY', display: 'y', shiftDisplay: 'Y', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'KeyU', display: 'u', shiftDisplay: 'U', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'KeyI', display: 'i', shiftDisplay: 'I', finger: 'right-middle', hand: 'right', width: 'w-standard' },
    { code: 'KeyO', display: 'o', shiftDisplay: 'O', finger: 'right-ring', hand: 'right', width: 'w-standard' },
    { code: 'KeyP', display: 'p', shiftDisplay: 'P', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'BracketLeft', display: '[', shiftDisplay: '{', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'BracketRight', display: ']', shiftDisplay: '}', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Backslash', display: '\\', shiftDisplay: '|', finger: 'right-pinky', hand: 'right', width: 'w-1.5' },
  ],
  // Row 2: Home Row ASDF
  [
    { code: 'CapsLock', display: 'Caps Lock', finger: 'left-pinky', hand: 'left', width: 'w-1.75' },
    { code: 'KeyA', display: 'a', shiftDisplay: 'A', finger: 'left-pinky', hand: 'left', width: 'w-standard' },
    { code: 'KeyS', display: 's', shiftDisplay: 'S', finger: 'left-ring', hand: 'left', width: 'w-standard' },
    { code: 'KeyD', display: 'd', shiftDisplay: 'D', finger: 'left-middle', hand: 'left', width: 'w-standard' },
    { code: 'KeyF', display: 'f', shiftDisplay: 'F', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyG', display: 'g', shiftDisplay: 'G', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyH', display: 'h', shiftDisplay: 'H', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'KeyJ', display: 'j', shiftDisplay: 'J', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'KeyK', display: 'k', shiftDisplay: 'K', finger: 'right-middle', hand: 'right', width: 'w-standard' },
    { code: 'KeyL', display: 'l', shiftDisplay: 'L', finger: 'right-ring', hand: 'right', width: 'w-standard' },
    { code: 'Semicolon', display: ';', shiftDisplay: ':', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Quote', display: "'", shiftDisplay: '"', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'Enter', display: 'Enter', finger: 'right-pinky', hand: 'right', width: 'w-2.25' },
  ],
  // Row 3: Bottom Row ZXCV
  [
    { code: 'ShiftLeft', display: 'Shift', finger: 'left-pinky', hand: 'left', width: 'w-2.25' },
    { code: 'KeyZ', display: 'z', shiftDisplay: 'Z', finger: 'left-pinky', hand: 'left', width: 'w-standard' },
    { code: 'KeyX', display: 'x', shiftDisplay: 'X', finger: 'left-ring', hand: 'left', width: 'w-standard' },
    { code: 'KeyC', display: 'c', shiftDisplay: 'C', finger: 'left-middle', hand: 'left', width: 'w-standard' },
    { code: 'KeyV', display: 'v', shiftDisplay: 'V', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyB', display: 'b', shiftDisplay: 'B', finger: 'left-index', hand: 'left', width: 'w-standard' },
    { code: 'KeyN', display: 'n', shiftDisplay: 'N', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'KeyM', display: 'm', shiftDisplay: 'M', finger: 'right-index', hand: 'right', width: 'w-standard' },
    { code: 'Comma', display: ',', shiftDisplay: '<', finger: 'right-middle', hand: 'right', width: 'w-standard' },
    { code: 'Period', display: '.', shiftDisplay: '>', finger: 'right-ring', hand: 'right', width: 'w-standard' },
    { code: 'Slash', display: '/', shiftDisplay: '?', finger: 'right-pinky', hand: 'right', width: 'w-standard' },
    { code: 'ShiftRight', display: 'Shift', finger: 'right-pinky', hand: 'right', width: 'w-2.25' },
  ],
  // Row 4: Space Bar & Modifiers
  [
    { code: 'ControlLeft', display: 'Ctrl', finger: 'left-pinky', hand: 'left', width: 'w-1.5' },
    { code: 'AltLeft', display: 'Alt', finger: 'left-thumb', hand: 'left', width: 'w-1.5' },
    { code: 'Space', display: 'Spacebar', finger: 'right-thumb', hand: 'right', width: 'w-space' },
    { code: 'AltRight', display: 'Alt', finger: 'right-thumb', hand: 'right', width: 'w-1.5' },
    { code: 'ControlRight', display: 'Ctrl', finger: 'right-pinky', hand: 'right', width: 'w-1.5' },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetChar,
  activeFinger: _activeFinger,
  lastPressedKey,
  showFingerColors = true,
  className = '',
}) => {
  const requiredShift = getRequiredShiftKey(targetChar);

  // Check if a given key is the active target key
  const isKeyActive = (key: KeyInfo): boolean => {
    if (targetChar === ' ' && key.code === 'Space') return true;
    if (targetChar === '\n' && key.code === 'Enter') return true;

    if (key.display === targetChar || key.shiftDisplay === targetChar) {
      return true;
    }

    if (key.display.toLowerCase() === targetChar.toLowerCase() && key.display.length === 1) {
      return true;
    }

    return false;
  };

  // Check if this key is the assisting shift key
  const isShiftActive = (key: KeyInfo): boolean => {
    if (requiredShift === 'ShiftLeft' && key.code === 'ShiftLeft') return true;
    if (requiredShift === 'ShiftRight' && key.code === 'ShiftRight') return true;
    return false;
  };

  // Check if this key matches the last pressed key
  const isKeyRecentlyPressed = (key: KeyInfo): boolean => {
    if (!lastPressedKey) return false;
    const pressed = lastPressedKey.key;
    if (pressed === ' ' && key.code === 'Space') return true;
    if (pressed === 'Enter' && key.code === 'Enter') return true;
    if (pressed === 'Backspace' && key.code === 'Backspace') return true;
    return (
      key.display.toLowerCase() === pressed.toLowerCase() ||
      key.shiftDisplay === pressed
    );
  };

  // Key width helper class
  const getWidthClass = (width?: string): string => {
    switch (width) {
      case 'w-1.5':
        return 'flex-[1.5] min-w-[38px]';
      case 'w-1.75':
        return 'flex-[1.75] min-w-[44px]';
      case 'w-2':
        return 'flex-[2] min-w-[50px]';
      case 'w-2.25':
        return 'flex-[2.25] min-w-[56px]';
      case 'w-space':
        return 'flex-[6.5] min-w-[160px]';
      case 'w-standard':
      default:
        return 'flex-1 min-w-[32px]';
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl select-none ${className}`}
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((key) => {
              const active = isKeyActive(key);
              const shiftActive = isShiftActive(key);
              const recentlyPressed = isKeyRecentlyPressed(key);
              const meta = FINGER_METADATA[key.finger];
              const isHomeBump = key.code === 'KeyF' || key.code === 'KeyJ';

              // Dynamic styling calculation
              let keyBg = 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700/80';
              let glowStyle: React.CSSProperties = {};

              if (active) {
                keyBg = 'bg-slate-800 text-white border-2 scale-[1.02] -translate-y-0.5 z-10';
                glowStyle = {
                  borderColor: meta.hexColor,
                  boxShadow: `0 0 16px ${meta.hexColor}60, inset 0 0 10px ${meta.hexColor}25`,
                };
              } else if (shiftActive) {
                keyBg = 'bg-rose-950/60 text-rose-300 border-2 border-rose-500 scale-[1.02] -translate-y-0.5 z-10';
                glowStyle = {
                  boxShadow: '0 0 14px rgba(244, 63, 94, 0.45)',
                };
              } else if (recentlyPressed) {
                if (lastPressedKey?.isCorrect) {
                  keyBg = 'bg-emerald-600/30 text-emerald-300 border-emerald-500 translate-y-0.5';
                } else {
                  keyBg = 'bg-rose-600/30 text-rose-300 border-rose-500 translate-y-0.5';
                }
              }

              return (
                <div
                  key={key.code}
                  style={glowStyle}
                  className={`
                    relative h-9 sm:h-12 rounded-lg flex flex-col items-center justify-center font-mono
                    border shadow-sm transition-all duration-100 ${getWidthClass(key.width)} ${keyBg}
                  `}
                >
                  {/* Top shift character if exists */}
                  {key.shiftDisplay && (
                    <span className="text-[9px] sm:text-[11px] text-slate-400 leading-none">
                      {key.shiftDisplay}
                    </span>
                  )}

                  {/* Main key character */}
                  <span
                    className={`font-semibold leading-tight ${
                      key.width === 'w-space'
                        ? 'text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest'
                        : key.display.length > 1
                        ? 'text-[10px] sm:text-xs text-slate-300'
                        : 'text-xs sm:text-base'
                    }`}
                  >
                    {key.width === 'w-space' ? 'Spasi' : key.display.toUpperCase()}
                  </span>

                  {/* Tactile locator notch bumps on F and J keys */}
                  {isHomeBump && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-slate-400/80 rounded-full" />
                  )}

                  {/* Finger color dot indicator at bottom */}
                  {showFingerColors && key.width !== 'w-space' && !active && (
                    <span
                      className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full opacity-60"
                      style={{ backgroundColor: meta.hexColor }}
                    />
                  )}

                  {/* Active key pulsing marker */}
                  {active && (
                    <span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                      style={{ backgroundColor: meta.hexColor }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger color guide bar below keyboard */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Panduan Warna Jari:</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Kelingking</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span>Manis</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Tengah</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
              <span>Telunjuk</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
              <span>Ibu Jari</span>
            </span>
          </div>
        </div>

        <div className="text-slate-500 hidden sm:block">
          Tekan tombol di keyboard fisik Anda untuk mengetik
        </div>
      </div>
    </div>
  );
};
