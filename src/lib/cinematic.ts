// Actual frame numbers that exist in frames2 directory
const FRAMES2_FRAMES = [
  3, 5, 6, 8, 10, 13, 15, 16, 20, 22, 23, 24, 25, 27, 28, 29, 30, 34, 36, 37,
  42, 43, 46, 47, 50, 51, 52, 53, 54, 56, 58, 59, 60, 61, 62, 63, 65, 67, 68,
  71, 72, 73, 74, 77, 78, 80, 82, 83, 84, 86, 88, 92, 94, 96, 99, 101, 104,
  107, 110, 114, 116, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 129,
  131, 132, 133, 135, 137, 139, 140, 141, 143, 145, 146, 147, 148, 149, 150,
  151, 152, 153, 154, 155, 156, 157, 158, 159
];

const FRAMES_COUNT = 169;

export const getCineFrameCount = (folder: string): number => {
  if (folder === "frames") return FRAMES_COUNT;
  if (folder === "frames2") return FRAMES2_FRAMES.length;
  // For custom folders, assume sequential frames starting from 1
  // This can be enhanced later to read frame count from a config file
  return 90; // Default fallback
};

export const getCineFramePath = (n: number, folder: string): string => {
  if (folder === "frames") {
    return `/frames/frame_${String(n + 1).padStart(4, "0")}.jpg`;
  } else if (folder === "frames2") {
    const actualFrameNumber = FRAMES2_FRAMES[n];
    return `/frames2/frame_${String(actualFrameNumber).padStart(3, "0")}.png`;
  } else {
    // For custom folders, use sequential naming
    return `/${folder}/frame_${String(n + 1).padStart(4, "0")}.jpg`;
  }
};

// Default exports for backward compatibility
export const CINE_FRAME_COUNT = FRAMES2_FRAMES.length;

export const cineFramePath = (n: number) => {
  const actualFrameNumber = FRAMES2_FRAMES[n];
  return `/frames2/frame_${String(actualFrameNumber).padStart(3, "0")}.png`;
};

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — Ignition",
    quote: "Press start and begin your legacy.",
    speaker: "Chillzone",
    film: "GAMING — 2026",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 — Sync",
    quote: "Every player needs the perfect gear.",
    speaker: "Chillzone",
    film: "CHILLZONE — 2026",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 — Aftermath",
    quote: "Victory is earned, not given.",
    speaker: "Chillzone",
    film: "CHILLZONE — 2026",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
