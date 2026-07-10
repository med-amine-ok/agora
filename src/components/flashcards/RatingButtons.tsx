"use client";

import React from "react";
import { FlashcardRating } from "@/types/flashcard";

interface RatingButtonsProps {
  onRate: (rating: FlashcardRating) => void;
}

export default function RatingButtons({ onRate }: RatingButtonsProps) {
  const options = [
    { rating: "again" as const, emoji: "🔴", label: "Encore", time: "< 1 min", hoverClass: "hover:bg-red-50 hover:border-red-300" },
    { rating: "hard" as const, emoji: "🟠", label: "Difficile", time: "< 10 min", hoverClass: "hover:bg-orange-50 hover:border-orange-300" },
    { rating: "ok" as const, emoji: "🟢", label: "OK", time: "1 jour", hoverClass: "hover:bg-emerald-50 hover:border-emerald-300" },
    { rating: "easy" as const, emoji: "⭐", label: "Facile", time: "4 jours", hoverClass: "hover:bg-teal-50 hover:border-teal-300" },
  ];

  return (
    <div className="w-full space-y-4 text-center mt-6">
      <p className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-text-light">
        À quelle fréquence souhaitez-vous revoir cette carte ?
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt) => (
          <button
            key={opt.rating}
            onClick={() => onRate(opt.rating)}
            className={`flex flex-col items-center justify-center rounded-xl border border-teal/10 bg-white py-3 px-4 w-28 text-center shadow-sm transition-all active:scale-[0.97] active:duration-75 ${opt.hoverClass}`}
          >
            <span className="text-xl mb-1">{opt.emoji}</span>
            <span className="text-xs font-bold text-text-dark">{opt.label}</span>
            <span className="text-[10px] font-mono text-text-light mt-0.5">{opt.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
