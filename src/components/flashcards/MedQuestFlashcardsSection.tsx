"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { BookOpen, ArrowRight } from "lucide-react";

export default function MedQuestFlashcardsSection() {
  const router = useRouter();
  const { decks } = useFlashcardStore();

  const dueCount = decks.reduce((acc, d) => acc + d.dueCount, 0);

  return (
    <div 
      onClick={() => router.push("/medquest/flashcards")}
      className="group relative overflow-hidden rounded-3xl border border-teal/10 bg-white p-6 shadow-md hover:shadow-lg hover:border-teal/30 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px]"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-display text-lg font-bold text-text-dark">
              Flashcards
            </h2>
          </div>
          <p className="text-xs text-text-light max-w-sm leading-relaxed">
            Révisez vos fiches médicales par répétition espacée pour consolider vos connaissances.
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-surface text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all duration-300">
          <ArrowRight className="h-4.5 w-4.5" />
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-teal/5 pt-4 mt-4">
        <span className="text-[11px] font-mono font-semibold text-text-light flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${dueCount > 0 ? "bg-rose-500 animate-pulse" : "bg-teal"}`} />
          {dueCount > 0 ? `${dueCount} fiches à réviser aujourd'hui` : "Toutes les fiches sont maîtrisées !"}
        </span>
        <span className="text-xs font-bold text-teal group-hover:translate-x-1 transition-transform duration-300">
          Réviser &rarr;
        </span>
      </div>
    </div>
  );
}
