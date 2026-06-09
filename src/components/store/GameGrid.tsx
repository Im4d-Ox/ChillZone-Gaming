"use client";

import { Game } from "@/lib/games";
import { GameCard } from "./GameCard";

interface GameGridProps {
  games: Game[];
  onAddToCart?: (game: Game) => void;
}

export function GameGrid({ games, onAddToCart }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
