"use client";

import React from "react";
import { X, SkipForward } from "lucide-react";

interface SessionHeaderProps {
  title: string;
  currentIndex: number;
  totalCards: number;
  onQuit: () => void;
  onSkip: () => void;
  hasRated: boolean;
}

export default function SessionHeader({
  title,
  currentIndex,
  totalCards,
  onQuit,
  onSkip,
  hasRated,
}: SessionHeaderProps) {
  const progressPercent = Math.round((currentIndex / totalCards) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-teal/10 shadow-sm py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Quit Button */}
        <button
          onClick={onQuit}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-white px-4 py-2 text-xs font-semibold text-text-light hover:bg-surface hover:text-teal transition-all"
        >
          <X className="h-4 w-4" /> Quitter
        </button>

        {/* Info & Progress */}
        <div className="flex-1 max-w-md mx-6 text-center space-y-1">
          <p className="text-xs font-bold text-text-dark truncate">
            {title}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-light shrink-0">
              {currentIndex} / {totalCards}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-surface overflow-hidden">
              <div 
                className="h-full bg-teal transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          disabled={hasRated}
          className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-white px-4 py-2 text-xs font-semibold text-text-light hover:bg-surface hover:text-teal transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Passer</span>
          <SkipForward className="h-4 w-4" />
        </button>

      </div>
    </header>
  );
}
