"use client";

import { useState } from "react";
import { Game } from "@/lib/games";
import { GameCard } from "./GameCard";
import { GameDetailsModal } from "./GameDetailsModal";

interface GameGridProps {
  games: Game[];
}

export function GameGrid({ games }: GameGridProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      <GameDetailsModal
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
