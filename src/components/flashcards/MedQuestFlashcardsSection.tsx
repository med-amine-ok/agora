"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { MOCK_RECENT_DECKS } from "@/lib/mock/flashcardsData";
import MiniDeckCard from "./MiniDeckCard";
import { BookOpen, Sparkles } from "lucide-react";

export default function MedQuestFlashcardsSection() {
  const router = useRouter();
  const { decks } = useFlashcardStore();

  // Compute live stats from the store
  const dueCount = decks.reduce((acc, d) => acc + d.dueCount, 0);
  const masteredCount = decks.reduce((acc, d) => acc + d.masteredCount, 0);

  return (
    <div className="bg-gradient-to-tr from-white to-[#F9FCFC] border border-teal/10 rounded-3xl p-6 shadow-[0_4px_24px_rgba(14,124,123,0.04)] space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg font-black text-text-dark tracking-tight">
              Flashcards Récurrentes
            </h2>
          </div>
          <p className="text-xs text-text-light font-medium">
            Révisez activement les notions clés pour ancrer vos connaissances.
          </p>
        </div>
        <button
          onClick={() => router.push("/medquest/flashcards")}
          className="bg-white hover:bg-teal/5 border border-teal/10 font-bold text-[11px] uppercase tracking-wider text-teal py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Voir tout
        </button>
      </div>

      {/* Horizontal scroll list */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-teal/10 scrollbar-track-transparent">
        {MOCK_RECENT_DECKS.map((deck) => (
          <MiniDeckCard key={deck.id} deck={deck} />
        ))}
      </div>

      {/* Bottom strip */}
      <div className="pt-4 border-t border-teal/5 flex flex-wrap justify-between items-center gap-4">
        <div className="text-xs text-text-mid font-medium flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{dueCount} {dueCount > 1 ? "cartes dues" : "carte due"} aujourd'hui</span>
          <span className="text-text-light/55 font-bold">&middot;</span>
          <span className="text-text-light">{masteredCount} {masteredCount > 1 ? "maîtrisées" : "maîtrisée"}</span>
        </div>
        <button
          onClick={() => router.push("/medquest/flashcards?filter=due")}
          className="bg-[#FF6B35] hover:bg-[#E55A27] text-white font-bold text-[11px] uppercase tracking-wider py-2 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="h-3 w-3" /> Réviser les cartes dues &rarr;
        </button>
      </div>
    </div>
  );
}
