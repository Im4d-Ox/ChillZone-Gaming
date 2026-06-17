export interface Game {
  id: string;
  title: string;
  developer: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  releaseDate: string;
  tags: string[];
  description: string;
  status: "live" | "hidden";
}

export const categories = [
  "All Games",
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Sports",
  "Racing",
  "Puzzle",
  "Sci-Fi",
];

export const defaultGames: Game[] = [];

export const games: Game[] = [];

export function getGamesByCategory(category: string): Game[] {
  if (category === "All Games") return games;
  return games.filter((game) => game.category === category);
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
