"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { FlashcardDeck } from "@/types/flashcard";
import { Sparkles, CheckCircle, ArrowRight, Clock } from "lucide-react";
import AIGenerationModal from "@/components/flashcards/AIGenerationModal";
import CreateCardModal from "@/components/flashcards/CreateCardModal";
import FlashcardBrowserModal from "@/components/flashcards/FlashcardBrowserModal";
import FlashcardPageHeader from "@/components/flashcards/FlashcardPageHeader";
import FlashcardFilterBar, { FilterType, SortType } from "@/components/flashcards/FlashcardFilterBar";
import FlashcardTree from "@/components/flashcards/FlashcardTree";

export default function FlashcardHub() {
  const router = useRouter();
  const { decks } = useFlashcardStore();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isBrowserModalOpen, setIsBrowserModalOpen] = useState(false);
  const [selectedDeckForBrowser, setSelectedDeckForBrowser] = useState<FlashcardDeck | null>(null);
  const [selectedDeckIdForManual, setSelectedDeckIdForManual] = useState<string | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("title");

  // Read filter query param in client side safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get("filter") as FilterType;
      if (filterParam && ["all", "due", "learning", "mastered", "ai", "my"].includes(filterParam)) {
        setActiveFilter(filterParam);
      }
    }
  }, []);

  const totalMastered = decks.reduce((acc, curr) => acc + curr.masteredCount, 0);
  const totalDue = decks.reduce((acc, curr) => acc + curr.dueCount, 0);

  const firstDueDeck = decks.find((d) => d.dueCount > 0);

  const handleStudy = (deckId: string) => {
    router.push(`/medquest/flashcards/${deckId}`);
  };

  const handleOpenBrowser = (deck: FlashcardDeck) => {
    setSelectedDeckForBrowser(deck);
    setIsBrowserModalOpen(true);
  };

  const handleOpenCreateCard = (deckId?: string) => {
    setSelectedDeckIdForManual(deckId);
    setIsManualModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5FAFA] flex flex-col">
      {/* 1. Page Header */}
      <FlashcardPageHeader
        totalMastered={totalMastered}
        totalDue={totalDue}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenManualModal={() => handleOpenCreateCard()}
      />

      {/* Due Today Banner overlapping the hero bottom */}
      {totalDue > 0 && (
        <div className="relative z-20 -mt-8 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white border border-[#FF6B35]/20 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-xs font-black text-text-dark uppercase tracking-wider">Révisions Quotidiennes En Attente</h4>
                <p className="text-[10px] text-text-light">Vous avez {totalDue} cartes qui attendent d'être révisées aujourd'hui.</p>
              </div>
            </div>
            {firstDueDeck && (
              <button
                onClick={() => handleStudy(firstDueDeck.id)}
                className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#E55A27] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Commencer maintenant <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* 2. Sticky Filters */}
        <div>
          <FlashcardFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* 3. Classification Tree */}
          <FlashcardTree
            decks={decks}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            sortBy={sortBy}
            onStudy={handleStudy}
            onBrowse={handleOpenBrowser}
          />
        </div>

        {/* 4. Community Library Decks */}
        <section className="space-y-6 pt-8 border-t border-[#0A3D3D]/10">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-black text-text-dark tracking-tight">
              Bibliothèque Commune
            </h2>
            <p className="text-xs text-text-light">
              Explorez et importez des flashcards construites par d'autres étudiants de médecine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {decks.slice(0, 3).map((deck) => (
              <div
                key={`comm-${deck.id}`}
                className="bg-white rounded-2xl border border-[#0A3D3D]/10 p-5 flex flex-col justify-between hover:border-teal/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#E0F2F2] text-[#0A3D3D] flex items-center justify-center font-bold text-[10px]">
                        {deck.lessonTitle.charAt(0)}
                      </div>
                      <div className="text-[10px] text-text-light">
                        <p className="font-bold text-text-dark">Anis K.</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle className="h-3 w-3" /> Validé
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-teal">
                      {deck.moduleName}
                    </span>
                    <h4 className="text-sm font-bold text-text-dark line-clamp-1">
                      {deck.lessonTitle}
                    </h4>
                    <p className="text-[10px] text-text-light">
                      {deck.cardCount} cartes actives
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStudy(deck.id)}
                  className="w-full mt-4 py-2.5 rounded-xl border border-[#0A3D3D]/12 hover:bg-[#E0F2F2] hover:text-[#0A3D3D] text-xs font-bold text-[#214646] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Importer &amp; Réviser
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. AI Call to Action banner */}
        <div className="rounded-3xl bg-gradient-to-r from-teal to-[#0A3D3D] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
          <div className="space-y-2 z-10">
            <h3 className="font-display text-xl font-bold">
              Générez vos flashcards en 10 secondes
            </h3>
            <p className="text-xs text-white/80 max-w-md leading-relaxed font-sans">
              Choisissez une leçon de votre choix. Notre IA extrait les notions essentielles pour concevoir des questions adaptées.
            </p>
          </div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="shrink-0 bg-white hover:bg-[#F5FAFA] text-[#0A3D3D] font-bold text-xs py-3 px-5 rounded-xl shadow-sm transition-all active:scale-95 z-10 cursor-pointer"
          >
            Essayer maintenant &rarr;
          </button>
          
          <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        </div>

      </main>

      {/* Modals */}
      <AIGenerationModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      
      <CreateCardModal
        isOpen={isManualModalOpen}
        onClose={() => {
          setIsManualModalOpen(false);
          setSelectedDeckIdForManual(undefined);
        }}
        defaultDeckId={selectedDeckIdForManual}
      />

      <FlashcardBrowserModal
        isOpen={isBrowserModalOpen}
        onClose={() => {
          setIsBrowserModalOpen(false);
          setSelectedDeckForBrowser(null);
        }}
        deck={selectedDeckForBrowser}
        onOpenCreateCard={handleOpenCreateCard}
      />
    </div>
  );
}
