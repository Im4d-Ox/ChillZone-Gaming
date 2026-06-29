"use client";

import { Game } from "@/lib/games";
import { useCurrency } from "@/contexts/CurrencyContext";

interface GameDetailsModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameDetailsModal({ game, isOpen, onClose }: GameDetailsModalProps) {
  const { formatPrice } = useCurrency();

  if (!isOpen || !game) return null;

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      {/* Backdrop with transition */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content with slide-up transition */}
      <div 
        className="relative w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-secondary/10" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 text-white/70 hover:text-white transition-colors text-4xl bg-black/30 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-accent/30"
        >
          ×
        </button>

        {/* Scrollable Content */}
        <div className="relative z-10 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 md:py-16 min-h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Image Preview */}
              <div className="hidden lg:block sticky top-8">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-auto max-h-[70vh] object-cover rounded-2xl shadow-2xl border border-accent/30"
                />
              </div>

              {/* Right Side - Details */}
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-secondary">
                    {game.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
                    {game.title}
                  </h1>
                  <p className="text-zinc-400 mt-1 text-base">{game.developer}</p>
                </div>

                {/* Rating & Release */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-accent text-xl">★</span>
                    <span className="text-white font-semibold">{game.rating}</span>
                  </div>
                  <div className="text-zinc-400">
                    Released: {game.releaseDate}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white">{formatPrice(game.price)}</span>
                  {game.originalPrice && (
                    <span className="text-xl text-zinc-500 line-through">{formatPrice(game.originalPrice)}</span>
                  )}
                  {game.discount && (
                    <span className="bg-gradient-to-r from-accent to-accent-secondary text-black px-2 py-0.5 rounded text-xs font-semibold">
                      -{game.discount}%
                    </span>
                  )}
                </div>

                {/* Tags */}
                {game.tags && game.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {game.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gradient-to-r from-accent/20 to-accent-secondary/20 border border-accent/30 rounded-full text-xs text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description - Full */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">About</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{game.description}</p>
                </div>

                {/* Features - Full */}
                {game.features && game.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Features</h3>
                    <ul className="space-y-1">
                      {game.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-zinc-400 text-sm">
                          <span className="text-accent text-xs">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-accent to-accent-secondary hover:from-accent/90 hover:to-accent-secondary/90 text-black font-semibold rounded-lg transition-all shadow-[0_0_30px_rgba(255,107,157,0.3)] hover:shadow-[0_0_40px_rgba(255,107,157,0.4)]"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
