import { FingerId, FingerInfo } from '../types/typing';

export const FINGER_METADATA: Record<FingerId, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    nameId: 'Kelingking Kiri',
    nameEn: 'Left Pinky',
    hand: 'left',
    colorClass: 'text-rose-500',
    hexColor: '#f43f5e',
    bgClass: 'bg-rose-500/15',
    borderClass: 'border-rose-500'
  },
  'left-ring': {
    id: 'left-ring',
    nameId: 'Jari Manis Kiri',
    nameEn: 'Left Ring',
    hand: 'left',
    colorClass: 'text-amber-500',
    hexColor: '#f59e0b',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500'
  },
  'left-middle': {
    id: 'left-middle',
    nameId: 'Jari Tengah Kiri',
    nameEn: 'Left Middle',
    hand: 'left',
    colorClass: 'text-emerald-500',
    hexColor: '#10b981',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500'
  },
  'left-index': {
    id: 'left-index',
    nameId: 'Jari Telunjuk Kiri',
    nameEn: 'Left Index',
    hand: 'left',
    colorClass: 'text-sky-500',
    hexColor: '#0284c7',
    bgClass: 'bg-sky-500/15',
    borderClass: 'border-sky-500'
  },
  'left-thumb': {
    id: 'left-thumb',
    nameId: 'Ibu Jari Kiri',
    nameEn: 'Left Thumb',
    hand: 'left',
    colorClass: 'text-violet-500',
    hexColor: '#8b5cf6',
    bgClass: 'bg-violet-500/15',
    borderClass: 'border-violet-500'
  },
  'right-thumb': {
    id: 'right-thumb',
    nameId: 'Ibu Jari Kanan',
    nameEn: 'Right Thumb',
    hand: 'right',
    colorClass: 'text-violet-500',
    hexColor: '#8b5cf6',
    bgClass: 'bg-violet-500/15',
    borderClass: 'border-violet-500'
  },
  'right-index': {
    id: 'right-index',
    nameId: 'Jari Telunjuk Kanan',
    nameEn: 'Right Index',
    hand: 'right',
    colorClass: 'text-sky-500',
    hexColor: '#0284c7',
    bgClass: 'bg-sky-500/15',
    borderClass: 'border-sky-500'
  },
  'right-middle': {
    id: 'right-middle',
    nameId: 'Jari Tengah Kanan',
    nameEn: 'Right Middle',
    hand: 'right',
    colorClass: 'text-emerald-500',
    hexColor: '#10b981',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500'
  },
  'right-ring': {
    id: 'right-ring',
    nameId: 'Jari Manis Kanan',
    nameEn: 'Right Ring',
    hand: 'right',
    colorClass: 'text-amber-500',
    hexColor: '#f59e0b',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500'
  },
  'right-pinky': {
    id: 'right-pinky',
    nameId: 'Kelingking Kanan',
    nameEn: 'Right Pinky',
    hand: 'right',
    colorClass: 'text-rose-500',
    hexColor: '#f43f5e',
    bgClass: 'bg-rose-500/15',
    borderClass: 'border-rose-500'
  }
};

// Character to finger mapping
const CHAR_TO_FINGER: Record<string, FingerId> = {
  // Left Pinky
  '`': 'left-pinky', '~': 'left-pinky',
  '1': 'left-pinky', '!': 'left-pinky',
  'q': 'left-pinky', 'Q': 'left-pinky',
  'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky',

  // Left Ring
  '2': 'left-ring', '@': 'left-ring',
  'w': 'left-ring', 'W': 'left-ring',
  's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',

  // Left Middle
  '3': 'left-middle', '#': 'left-middle',
  'e': 'left-middle', 'E': 'left-middle',
  'd': 'left-middle', 'D': 'left-middle',
  'c': 'left-middle', 'C': 'left-middle',

  // Left Index
  '4': 'left-index', '$': 'left-index',
  '5': 'left-index', '%': 'left-index',
  'r': 'left-index', 'R': 'left-index',
  't': 'left-index', 'T': 'left-index',
  'f': 'left-index', 'F': 'left-index',
  'g': 'left-index', 'G': 'left-index',
  'v': 'left-index', 'V': 'left-index',
  'b': 'left-index', 'B': 'left-index',

  // Thumbs
  ' ': 'right-thumb',

  // Right Index
  '6': 'right-index', '^': 'right-index',
  '7': 'right-index', '&': 'right-index',
  'y': 'right-index', 'Y': 'right-index',
  'u': 'right-index', 'U': 'right-index',
  'h': 'right-index', 'H': 'right-index',
  'j': 'right-index', 'J': 'right-index',
  'n': 'right-index', 'N': 'right-index',
  'm': 'right-index', 'M': 'right-index',

  // Right Middle
  '8': 'right-middle', '*': 'right-middle',
  'i': 'right-middle', 'I': 'right-middle',
  'k': 'right-middle', 'K': 'right-middle',
  ',': 'right-middle', '<': 'right-middle',

  // Right Ring
  '9': 'right-ring', '(': 'right-ring',
  'o': 'right-ring', 'O': 'right-ring',
  'l': 'right-ring', 'L': 'right-ring',
  '.': 'right-ring', '>': 'right-ring',

  // Right Pinky
  '0': 'right-pinky', ')': 'right-pinky',
  '-': 'right-pinky', '_': 'right-pinky',
  '=': 'right-pinky', '+': 'right-pinky',
  'p': 'right-pinky', 'P': 'right-pinky',
  '[': 'right-pinky', '{': 'right-pinky',
  ']': 'right-pinky', '}': 'right-pinky',
  '\\': 'right-pinky', '|': 'right-pinky',
  ';': 'right-pinky', ':': 'right-pinky',
  '\'': 'right-pinky', '"': 'right-pinky',
  '/': 'right-pinky', '?': 'right-pinky',
  '\n': 'right-pinky'
};

export function getFingerForKey(char: string): FingerInfo {
  const fingerId = CHAR_TO_FINGER[char] || 'right-thumb';
  return FINGER_METADATA[fingerId];
}

export function getFingerInfo(fingerId: FingerId): FingerInfo {
  return FINGER_METADATA[fingerId];
}

// When typing a capital letter or symbol on the left hand, the RIGHT shift is pressed by the right pinky, and vice versa!
export function getRequiredShiftKey(char: string): 'ShiftLeft' | 'ShiftRight' | null {
  const upperCaseRegex = /[A-Z]/;
  const leftShiftSymbols = /[~!@#$%^]/; // numbers and symbols on left/middle
  const rightShiftSymbols = /[&*()_+{}|:"<>?]/; // symbols on right

  if (upperCaseRegex.test(char)) {
    const finger = CHAR_TO_FINGER[char.toLowerCase()];
    if (finger && FINGER_METADATA[finger]?.hand === 'left') {
      return 'ShiftRight'; // Left hand key needs Right Shift
    } else {
      return 'ShiftLeft'; // Right hand key needs Left Shift
    }
  }

  if (leftShiftSymbols.test(char)) {
    return 'ShiftRight';
  }

  if (rightShiftSymbols.test(char)) {
    return 'ShiftLeft';
  }

  return null;
}
