"use client";

import { Navbar } from "@/components/ui/Navbar";
import { GameStoreSection } from "@/components/store/GameStoreSection";
import { Footer } from "@/components/sections/Footer";

export default function GamesPage() {
  return (
    <>
      <Navbar />
      <main>
        <GameStoreSection />
      </main>
      <Footer />
    </>
  );
}
