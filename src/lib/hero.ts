export const FRAME_COUNT = 165;

export const framePath = (n: number) => {
  // Handle inconsistent file naming (some 3-digit, some 4-digit)
  if (n <= 8) {
    return `/frames/frame_${String(n).padStart(3, "0")}.png`;
  }
  return `/frames/frame_${String(n).padStart(4, "0")}.png`;
};

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "Where legends are born, one game at a time.",
    speaker: "Chillzone",
    film: "GAMING — 2026",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Your next adventure starts here.",
    speaker: "Chillzone",
    film: "CHILLZONE — 2026",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Level up your gaming experience today.",
    speaker: "Chillzone",
    film: "CHILLZONE — 2026",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
