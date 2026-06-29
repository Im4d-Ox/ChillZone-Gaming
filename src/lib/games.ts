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
  features?: string[];
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

const GAMES_STORAGE_KEY = "chillzone_games";

export const defaultGames: Game[] = [];

// Get games from localStorage
export function getGames(): Game[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GAMES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading games from localStorage:", error);
  }
  return [];
}

// Save games to localStorage
export function saveGames(games: Game[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error("Error saving games to localStorage:", error);
  }
}

// Add a new game
export function addGame(game: Omit<Game, "id">): Game {
  const games = getGames();
  const newGame: Game = {
    ...game,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  games.push(newGame);
  saveGames(games);
  return newGame;
}

// Update an existing game
export function updateGame(id: string, updates: Partial<Game>): void {
  const games = getGames();
  const index = games.findIndex(g => g.id === id);
  if (index !== -1) {
    games[index] = { ...games[index], ...updates };
    saveGames(games);
  }
}

// Delete a game
export function deleteGame(id: string): void {
  const games = getGames();
  const filtered = games.filter(g => g.id !== id);
  saveGames(filtered);
}

// Get games by category
export function getGamesByCategory(category: string): Game[] {
  const games = getGames();
  if (category === "All Games") return games;
  return games.filter((game) => game.category === category);
}

// Get game by ID
export function getGameById(id: string): Game | undefined {
  const games = getGames();
  return games.find((game) => game.id === id);
}
