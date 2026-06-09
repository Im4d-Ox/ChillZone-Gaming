"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { GameStoreSection } from "@/components/store/GameStoreSection";
import { Cart } from "@/components/store/Cart";
import { Footer } from "@/components/sections/Footer";
import { Game } from "@/lib/games";

export default function GamesPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Game[]>([]);

  const handleAddToCart = (game: Game) => {
    setCartItems((prev) => [...prev, game]);
  };

  const handleRemoveFromCart = (gameId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== gameId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
      />
      <main>
        <GameStoreSection onAddToCart={handleAddToCart} />
      </main>
      <Footer />
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </>
  );
}
