"use client";

import React, { useEffect, useState } from "react";
import { X, SkipForward, Flame } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

interface SessionHeaderProps {
  title: string;
  currentIndex: number;
  totalCards: number;
  onQuit: () => void;
  onSkip: () => void;
  hasRated: boolean;
  streak?: number;
}

export default function SessionHeader({
  title,
  currentIndex,
  totalCards,
  onQuit,
  onSkip,
  hasRated,
  streak = 14,
}: SessionHeaderProps) {
  const progressPercent = Math.round((currentIndex / totalCards) * 100);
  const controls = useAnimation();

  useEffect(() => {
    // Bounce animation on card increment
    controls.start({
      scale: [1, 1.25, 1],
      transition: { duration: 0.3 }
    });
  }, [currentIndex, controls]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal/15 py-4 shadow-sm text-text-dark">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Quit Button & Streak */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal/15 bg-teal/5 px-4 py-2 text-xs font-bold text-teal hover:bg-teal/10 transition-all active:scale-95 cursor-pointer"
          >
            <X className="h-4 w-4" /> Quitter
          </button>

          <motion.div 
            animate={controls}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 font-bold text-xs"
          >
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-mono">{streak}</span>
          </motion.div>
        </div>

        {/* Center: Title & Progress Bar */}
        <div className="flex-1 max-w-md mx-6 text-center space-y-2">
          <p className="text-xs font-black tracking-wide uppercase text-teal truncate">
            {title}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-light shrink-0 font-bold">
              {currentIndex} / {totalCards}
            </span>
            <div className="h-2 flex-1 rounded-full bg-teal/10 overflow-hidden p-[0.5px]">
              <div 
                className="h-full bg-gradient-to-r from-teal-light to-teal rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Skip Button */}
        <button
          onClick={onSkip}
          disabled={hasRated}
          className="inline-flex items-center gap-1.5 rounded-xl border border-teal/15 bg-teal/5 px-4 py-2 text-xs font-bold text-teal hover:bg-teal/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Passer</span>
          <SkipForward className="h-4 w-4" />
        </button>

      </div>
    </header>
  );
}
