"use client";

import { Game } from "@/lib/games";
import { X, ShoppingCart } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Game[];
  onRemoveFromCart: (gameId: string) => void;
  onClearCart: () => void;
}

export function Cart({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
}: CartProps) {
  const total = cartItems.reduce((sum, game) => sum + game.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-end">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 h-full w-full max-w-md bg-background border-l border-white/10 shadow-2xl sm:h-[calc(100vh-2rem)] sm:m-4 sm:rounded-2xl overflow-hidden flex flex-col">
        <div className="relative border-b border-white/10 p-6">
          <div className="absolute top-4 left-4">
            <HudFrame corner="tl" size={20} />
          </div>
          <div className="absolute top-4 right-4">
            <HudFrame corner="tr" size={20} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-accent" />
              <h2 className="font-sans text-xl font-semibold text-white">
                Shopping Cart
              </h2>
              {cartItems.length > 0 && (
                <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-black shadow-[0_0_12px_rgba(212,162,47,0.6)]">
                  {cartItems.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-zinc-600 mb-4" />
              <p className="font-sans text-zinc-400">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((game) => (
                <div
                  key={game.id}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-accent/30 transition-colors"
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-white">
                        {game.title}
                      </h3>
                      <p className="font-mono text-xs text-zinc-400">
                        {game.developer}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-base font-bold text-accent">
                        ${game.price}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(game.id)}
                        className="rounded-full p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4 relative">
            <div className="absolute bottom-4 left-4">
              <HudFrame corner="bl" size={20} />
            </div>
            <div className="absolute bottom-4 right-4">
              <HudFrame corner="br" size={20} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-zinc-400">Subtotal</span>
              <span className="font-sans text-lg font-bold text-white">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-zinc-400">Tax (10%)</span>
              <span className="font-sans text-lg font-bold text-white">
                ${(total * 0.1).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-mono text-sm font-semibold text-white">
                Total
              </span>
              <span className="font-sans text-2xl font-bold text-accent">
                ${(total * 1.1).toFixed(2)}
              </span>
            </div>
            <button className="w-full rounded-full bg-accent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-accent/90 shadow-[0_0_20px_rgba(212,162,47,0.4)] active:scale-95">
              Checkout
            </button>
            <button
              onClick={onClearCart}
              className="w-full rounded-full border border-white/10 px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
