"use client";

import React, { useState } from "react";
import { X, Search, Plus, Sparkles, User, HelpCircle } from "lucide-react";
import { Flashcard, FlashcardDeck } from "@/types/flashcard";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import FlashcardBrowserRow from "./FlashcardBrowserRow";

interface FlashcardBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FlashcardDeck | null;
  onOpenCreateCard: (deckId: string) => void;
}

export default function FlashcardBrowserModal({
  isOpen,
  onClose,
  deck,
  onOpenCreateCard,
}: FlashcardBrowserModalProps) {
  const { flashcards } = useFlashcardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "definition" | "true_false" | "fill_blank">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "ai_generated" | "user_submitted" | "admin">("all");

  if (!isOpen || !deck) return null;

  // Filter flashcards belonging to this deck
  const deckCards = flashcards.filter((card) => card.deckId === deck.id);

  // Apply search query and filters
  const filteredCards = deckCards.filter((card) => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || card.type === typeFilter;
    
    let matchesSource = true;
    if (sourceFilter !== "all") {
      if (sourceFilter === "ai_generated") {
        matchesSource = card.source === "ai_generated";
      } else {
        // user_submitted or admin are manual
        matchesSource = card.source === "user_submitted" || card.source === "admin";
      }
    }

    return matchesSearch && matchesType && matchesSource;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-custom/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-teal/10 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0A3D3D]/10 pb-4">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-teal">
              {deck.moduleName} &rsaquo; {deck.lessonTitle}
            </span>
            <h2 className="font-display text-xl font-extrabold text-text-dark">
              Parcourir les cartes ({deckCards.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface/50 text-text-light hover:text-text-dark transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-2">
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6E8E8E]" />
            <input
              type="text"
              placeholder="Rechercher dans ce jeu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#0A3D3D]/10 rounded-xl text-xs font-semibold text-text-dark placeholder-[#6E8E8E]/65 outline-none focus:border-teal/30 bg-[#F5FAFA]/50"
            />
          </div>

          {/* Type filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#0A3D3D]/10 rounded-xl text-xs font-semibold text-text-dark bg-white outline-none focus:border-teal/30 cursor-pointer"
            >
              <option value="all">Tous les types</option>
              <option value="definition">Définition</option>
              <option value="true_false">Vrai/Faux</option>
              <option value="fill_blank">Texte à trou</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="sm:col-span-3">
            <select
              value={sourceFilter}
              onChange={(e: any) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#0A3D3D]/10 rounded-xl text-xs font-semibold text-text-dark bg-white outline-none focus:border-teal/30 cursor-pointer"
            >
              <option value="all">Toutes les sources</option>
              <option value="ai_generated">Générées par l'IA</option>
              <option value="manual">Créées manuellement</option>
            </select>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto pr-1 border border-[#0A3D3D]/5 rounded-2xl bg-white max-h-[50vh] min-h-[200px] scrollbar-thin">
          {filteredCards.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <HelpCircle className="h-10 w-10 text-[#6E8E8E]/30 mx-auto" />
              <p className="text-xs font-bold text-text-mid">Aucune carte trouvée</p>
              <p className="text-[11px] text-[#6E8E8E] max-w-xs mx-auto">
                Modifiez vos filtres ou ajoutez une nouvelle carte manuelle pour commencer.
              </p>
            </div>
          ) : (
            filteredCards.map((card) => (
              <FlashcardBrowserRow key={card.id} card={card} />
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-[#0A3D3D]/10 pt-4 mt-2">
          <button
            onClick={() => {
              onClose();
              onOpenCreateCard(deck.id);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E0F2F2] text-teal-dark hover:bg-[#0E7C7B] hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Ajouter une carte
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#0A3D3D]/12 bg-white text-xs font-bold text-[#214646] hover:bg-[#F5FAFA] transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
