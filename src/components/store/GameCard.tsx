"use client";

import { Game } from "@/lib/games";
import { Star } from "@phosphor-icons/react";
import { HudFrame } from "@/components/ui/HudFrame";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-accent/50 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(212,162,47,0.15)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <HudFrame corner="tl" size={20} />
        </div>
        <div className="absolute top-3 right-3">
          <HudFrame corner="tr" size={20} />
        </div>
        
        {game.discount && (
          <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-[0_0_12px_rgba(212,162,47,0.6)]">
            -{game.discount}%
          </div>
        )}
        
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm border border-white/10">
          <Star size={12} weight="fill" className="text-accent" />
          <span className="font-mono text-[10px] font-semibold text-white">
            {game.rating}
          </span>
        </div>
      </div>

      <div className="p-4 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            {game.category}
          </span>
        </div>
        
        <h3 className="mb-2 font-sans text-base font-semibold leading-tight text-white group-hover:text-accent transition-colors">
          {game.title}
        </h3>
        
        <p className="mb-3 font-sans text-xs text-zinc-400 line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-lg font-bold text-white">
              ${game.price}
            </span>
            {game.originalPrice && (
              <span className="font-mono text-xs text-zinc-500 line-through">
                ${game.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
