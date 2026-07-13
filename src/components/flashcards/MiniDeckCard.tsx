"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface MiniDeckCardProps {
  deck: {
    id: string;
    subjectName: string;
    subjectIcon: string;
    lessonTitle: string;
    cardCount: number;
    masteredCount: number;
    dueCount: number;
    status: string; // 'due' | 'review' | 'mastered'
  };
}

export default function MiniDeckCard({ deck }: MiniDeckCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/medquest/flashcards/${deck.id}`);
  };

  const renderBadge = () => {
    switch (deck.status) {
      case "due":
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100"
          >
            ● {deck.dueCount} dues
          </span>
        );
      case "review":
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100"
          >
            ↻ À revoir
          </span>
        );
      case "mastered":
      default:
        return (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100"
          >
            ✓ Maîtrisé
          </span>
        );
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(10,61,61,0.08)" }}
      className="w-[168px] flex-shrink-0 bg-white border border-teal/10 rounded-2xl p-4 cursor-pointer flex flex-col justify-between hover:border-teal/30 transition-all duration-300 relative overflow-hidden"
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal/30 to-teal" />

      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-start">
          <span className="text-2xl">{deck.subjectIcon}</span>
          {renderBadge()}
        </div>
        
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-teal/60 block">
            {deck.subjectName}
          </span>
          <h4 className="text-xs font-bold text-text-dark line-clamp-2 leading-snug h-8" title={deck.lessonTitle}>
            {deck.lessonTitle}
          </h4>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-teal/5 flex items-center justify-between">
        <span className="text-[10px] text-text-light font-medium">
          {deck.cardCount} cartes
        </span>
        <span className="text-[10px] font-black text-teal hover:underline uppercase tracking-wider">
          Réviser &rarr;
        </span>
      </div>
    </motion.div>
  );
}
