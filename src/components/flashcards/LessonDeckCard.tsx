"use client";

import React from "react";
import { ArrowRight, BookOpen, Sparkles, User, AlertCircle } from "lucide-react";
import { FlashcardDeck } from "@/types/flashcard";

interface LessonDeckCardProps {
  deck: FlashcardDeck;
  onStudy: (deckId: string) => void;
  onBrowse: (deck: FlashcardDeck) => void;
}

export default function LessonDeckCard({ deck, onStudy, onBrowse }: LessonDeckCardProps) {
  const progressPercent = Math.round((deck.masteredCount / deck.cardCount) * 100) || 0;
  const hasDue = deck.dueCount > 0;

  const getAccentColor = (moduleName?: string) => {
    const name = (moduleName || "").toLowerCase();
    if (name.includes("cardio")) return "bg-rose-500";
    if (name.includes("neuro")) return "bg-purple-500";
    if (name.includes("pneumo")) return "bg-sky-500";
    return "bg-teal";
  };

  return (
    <div className="relative overflow-hidden bg-white border border-[#0A3D3D]/10 rounded-2xl pt-7 p-5 flex flex-col justify-between hover:border-teal/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      {/* Top accent bar matching medical subject */}
      <div className={`absolute top-0 inset-x-0 h-1.5 ${getAccentColor(deck.moduleName)}`} />

      <div className="space-y-3.5">
        {/* Badges & Info */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5">
            {deck.aiGeneratedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E0F2F2] px-2 py-0.5 text-[8px] font-bold text-[#0E7C7B] border border-[#0E7C7B]/10 uppercase tracking-wider">
                <Sparkles className="h-2.5 w-2.5 text-teal" /> IA
              </span>
            )}
            {deck.userSubmittedCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[8px] font-bold text-orange-600 border border-orange-100 uppercase tracking-wider">
                <User className="h-2.5 w-2.5" /> Manuel
              </span>
            )}
          </div>

          <div>
            {hasDue ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-bold text-[#D72638] border border-red-100 uppercase tracking-wider animate-pulse">
                <AlertCircle className="h-2.5 w-2.5" /> {deck.dueCount} à réviser
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                ✓ Prêt
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-light/75 block">
            {deck.moduleName}
          </span>
          <h5 className="text-xs sm:text-sm font-black text-text-dark line-clamp-2 min-h-[36px] leading-snug group-hover:text-teal transition-colors">
            {deck.lessonTitle}
          </h5>
        </div>

        {/* Stats & Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-[#6E8E8E] font-bold uppercase tracking-wider">
            <span>{deck.cardCount} cartes</span>
            <span>{progressPercent}% maîtrisé</span>
          </div>
          <div className="h-1.5 w-full bg-[#F5FAFA] rounded-full overflow-hidden border border-[#0A3D3D]/5 p-[0.5px]">
            <div className="h-full bg-teal rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0A3D3D]/8">
        <button
          onClick={() => onStudy(deck.id)}
          className="flex-grow inline-flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#E0F2F2] hover:bg-[#0E7C7B] text-[#0A3D3D] hover:text-white text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          Réviser <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onBrowse(deck)}
          className="px-3 py-2.5 rounded-xl border border-[#0A3D3D]/10 hover:bg-slate-50 text-[#6E8E8E] hover:text-[#0D2626] text-xs font-bold transition-all duration-200 cursor-pointer"
          title="Voir toutes les cartes"
        >
          <BookOpen className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
