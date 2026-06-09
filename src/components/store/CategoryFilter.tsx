"use client";

import { categories } from "@/lib/games";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-all duration-200 border ${
            selectedCategory === category
              ? "bg-accent text-black border-accent shadow-[0_0_12px_rgba(212,162,47,0.6)]"
              : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
