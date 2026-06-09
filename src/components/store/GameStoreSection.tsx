"use client";

import { useState, useEffect } from "react";
import { Game, defaultGames, categories } from "@/lib/games";
import { CategoryFilter } from "./CategoryFilter";
import { GameGrid } from "./GameGrid";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { getGamesFromFirestore, initializeDefaultGames } from "@/lib/firestore";

interface GameStoreSectionProps {
  onAddToCart?: (game: Game) => void;
}

export function GameStoreSection({ onAddToCart }: GameStoreSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Games");
  const [games, setGames] = useState<Game[]>(defaultGames);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      await initializeDefaultGames();
      const gamesData = await getGamesFromFirestore();
      setGames(gamesData);
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = selectedCategory === "All Games" 
    ? games 
    : games.filter((game) => game.category === selectedCategory);

  return (
    <section
      id="games"
      className="relative border-t border-white/5 bg-background px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection className="flex flex-col gap-12">
          <AnimatedItem>
            <EyebrowBadge>CHILLZONE // GAME COLLECTION</EyebrowBadge>
          </AnimatedItem>
          
          <AnimatedItem>
            <div className="flex flex-col gap-8">
              <h2 className="max-w-[20ch] font-sans text-4xl font-semibold leading-[0.98] tracking-tighter text-foreground md:text-6xl">
                Premium
                <br />
                <span className="text-accent">Game Collection</span>
              </h2>
              <p className="max-w-[48ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                Explore our curated collection of premium games. From action-packed
                adventures to strategic masterpieces, find your next gaming
                experience at Chillzone.
              </p>
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <div className="mb-8">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </AnimatedItem>

          <AnimatedItem>
            <GameGrid games={filteredGames} onAddToCart={onAddToCart} />
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
