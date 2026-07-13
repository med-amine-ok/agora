"use client";

import React from "react";
import { ChevronDown, FolderOpen, FolderClosed } from "lucide-react";
import { motion } from "framer-motion";

interface ChapterTreeRowProps {
  chapterTitle: string;
  totalCards: number;
  masteredCards: number;
  dueToday: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChapterTreeRow({
  chapterTitle,
  totalCards,
  masteredCards,
  dueToday,
  isOpen,
  onToggle,
}: ChapterTreeRowProps) {
  const progressPercent = Math.round((masteredCards / totalCards) * 100) || 0;

  return (
    <div
      onClick={onToggle}
      className={`w-full rounded-xl bg-white border border-[#0A3D3D]/10 border-l-[5px] border-l-[#0E7C7B] p-4 flex items-center justify-between cursor-pointer select-none transition-all duration-200 hover:bg-[#F5FAFA] hover:shadow-md shadow-sm`}
    >
      <div className="flex items-center gap-3">
        <div className="text-teal">
          {isOpen ? (
            <FolderOpen className="h-4.5 w-4.5 fill-teal/10" />
          ) : (
            <FolderClosed className="h-4.5 w-4.5 fill-teal/10" />
          )}
        </div>
        <h4 className="font-sans text-xs sm:text-sm font-black text-text-dark leading-tight">
          {chapterTitle}
        </h4>
        {dueToday > 0 && (
          <span className="rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 border border-[#FF6B35]/20 animate-pulse">
            {dueToday} cartes
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Progress */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">
            {masteredCards}/{totalCards} maîtrisées
          </span>
          <div className="h-2 w-16 bg-[#F5FAFA] rounded-full overflow-hidden border border-[#0A3D3D]/10 p-[1px]">
            <div className="h-full bg-teal rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-light h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>
    </div>
  );
}
