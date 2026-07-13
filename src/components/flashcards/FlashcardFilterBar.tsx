"use client";

import React from "react";
import { Search } from "lucide-react";

export type FilterType = "all" | "due" | "learning" | "mastered" | "ai" | "my";
export type SortType = "title" | "progress" | "cards";

interface FlashcardFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (val: FilterType) => void;
  sortBy: SortType;
  setSortBy: (val: SortType) => void;
}

export default function FlashcardFilterBar({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
}: FlashcardFilterBarProps) {
  const filterOptions: { id: FilterType; label: string }[] = [
    { id: "all", label: "Toutes" },
    { id: "due", label: "À faire" },
    { id: "learning", label: "En cours" },
    { id: "mastered", label: "Maîtrisées" },
    { id: "ai", label: "IA" },
    { id: "my", label: "Mes cartes" },
  ];

  return (
    <div className="sticky top-16 z-30 bg-[#F5FAFA]/80 backdrop-blur-md border-b border-[#0A3D3D]/5 py-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-[360px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E8E8E]" />
          <input
            type="text"
            placeholder="Rechercher une leçon ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0A3D3D]/10 bg-white text-xs font-semibold text-text-dark placeholder-[#6E8E8E]/65 outline-none focus:border-teal/30 transition-all"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-white border border-[#0A3D3D]/8 p-1 rounded-xl">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === opt.id
                    ? "bg-[#E0F2F2] text-[#0A3D3D]"
                    : "text-[#6E8E8E] hover:text-[#0D2626] hover:bg-[#F5FAFA]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="px-3 py-2 rounded-xl border border-[#0A3D3D]/10 bg-white text-xs font-bold text-[#214646] outline-none focus:border-teal/30 cursor-pointer"
          >
            <option value="title">Trier par titre</option>
            <option value="progress">Trier par progression</option>
            <option value="cards">Trier par nombre de cartes</option>
          </select>

        </div>
      </div>
    </div>
  );
}
