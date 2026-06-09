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

export const defaultGames: Game[] = [
  {
    id: "1",
    title: "Chill Racing Pro",
    developer: "Chillzone Studios",
    price: 59.99,
    originalPrice: 69.99,
    discount: 14,
    image: "https://images.unsplash.com/photo-1511882150382-421056ac8ba7?w=800&h=600&fit=crop",
    category: "Racing",
    rating: 4.8,
    releaseDate: "2026-03-15",
    tags: ["Racing", "Multiplayer", "Simulation"],
    description: "Experience the ultimate racing simulation with realistic physics and stunning graphics.",
  },
  {
    id: "2",
    title: "Chill Quest: Odyssey",
    developer: "Chillzone Studios",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
    category: "Adventure",
    rating: 4.9,
    releaseDate: "2026-01-20",
    tags: ["Adventure", "Open World", "Story"],
    description: "Embark on an epic journey through mystical lands and ancient civilizations.",
  },
  {
    id: "3",
    title: "Chill Strategy Master",
    developer: "Chillzone Studios",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&h=600&fit=crop",
    category: "Strategy",
    rating: 4.5,
    releaseDate: "2026-02-10",
    tags: ["Strategy", "Turn-Based", "Multiplayer"],
    description: "Build your empire and conquer the world in this deep strategy game.",
  },
  {
    id: "4",
    title: "Chill Sports Arena",
    developer: "Chillzone Studios",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-silence?w=800&h=600&fit=crop",
    category: "Sports",
    rating: 4.3,
    releaseDate: "2026-04-01",
    tags: ["Sports", "Multiplayer", "Competition"],
    description: "Compete in various sports with realistic gameplay and online multiplayer.",
  },
  {
    id: "5",
    title: "Chill Puzzle Paradise",
    developer: "Chillzone Studios",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=600&fit=crop",
    category: "Puzzle",
    rating: 4.6,
    releaseDate: "2026-05-15",
    tags: ["Puzzle", "Brain Training", "Casual"],
    description: "Challenge your mind with hundreds of unique puzzles and brain teasers.",
  },
  {
    id: "6",
    title: "Chill Action Heroes",
    developer: "Chillzone Studios",
    price: 54.99,
    originalPrice: 64.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    category: "Action",
    rating: 4.7,
    releaseDate: "2026-06-01",
    tags: ["Action", "Combat", "Adventure"],
    description: "Become the ultimate action hero in this fast-paced combat adventure.",
  },
  {
    id: "7",
    title: "Chill RPG Legends",
    developer: "Chillzone Studios",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop",
    category: "RPG",
    rating: 4.4,
    releaseDate: "2026-03-25",
    tags: ["RPG", "Fantasy", "Story"],
    description: "Create your legend in this immersive role-playing game with deep storytelling.",
  },
  {
    id: "8",
    title: "Chill Space Explorer",
    developer: "Chillzone Studios",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?w=800&h=600&fit=crop",
    category: "Sci-Fi",
    rating: 4.2,
    releaseDate: "2026-02-28",
    tags: ["Sci-Fi", "Space", "Exploration"],
    description: "Explore the vast universe and discover new worlds in this space adventure.",
  },
];

export const games: Game[] = defaultGames;

export function getGamesByCategory(category: string): Game[] {
  if (category === "All Games") return games;
  return games.filter((game) => game.category === category);
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
