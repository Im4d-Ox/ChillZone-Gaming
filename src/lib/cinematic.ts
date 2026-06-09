export const CINE_FRAME_COUNT = 169;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.jpg`;

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
