"use client";

import React, { useState, useEffect } from "react";
import { FlashcardDeck } from "@/types/flashcard";
import { FilterType, SortType } from "./FlashcardFilterBar";
import ModuleTreeRow from "./ModuleTreeRow";
import ChapterTreeRow from "./ChapterTreeRow";
import LessonDeckCard from "./LessonDeckCard";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface FlashcardTreeProps {
  decks: FlashcardDeck[];
  searchQuery: string;
  activeFilter: FilterType;
  sortBy: SortType;
  onStudy: (deckId: string) => void;
  onBrowse: (deck: FlashcardDeck) => void;
}

// Helper mappings for chapters and module icons
const CHAPTER_NAMES: Record<string, string> = {
  c1: "Le Cœur",
  c2: "La Circulation",
  c3: "Valvulopathies",
  c4: "Cardiopathies ischémiques",
  c5: "Le Cerveau",
  c6: "Système nerveux périphérique",
  c7: "Pathologies vasculaires cérébrales",
  c8: "Neuropathies",
};

const MODULE_ICONS: Record<string, string> = {
  s1: "🫀",
  cardiologie: "🫀",
  s2: "🧠",
  neurologie: "🧠",
  s3: "🫁",
  pneumologie: "🫁",
  s4: "🦠",
  infectiologie: "🦠",
  s5: "🩺",
  general: "🩺",
};

export default function FlashcardTree({
  decks,
  searchQuery,
  activeFilter,
  sortBy,
  onStudy,
  onBrowse,
}: FlashcardTreeProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  // Hydrate open/collapse states from localStorage
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem("agora-flashcard-tree-modules");
      const savedChapters = localStorage.getItem("agora-flashcard-tree-chapters");
      
      // Default s1 open
      const defaultModules = { s1: true };

      if (savedModules) setOpenModules(JSON.parse(savedModules));
      else setOpenModules(defaultModules);

      if (savedChapters) setOpenChapters(JSON.parse(savedChapters));
    } catch (e) {
      console.error("Failed to read localStorage tree states", e);
    }
  }, []);

  const toggleModule = (moduleId: string) => {
    const updated = { ...openModules, [moduleId]: !openModules[moduleId] };
    setOpenModules(updated);
    localStorage.setItem("agora-flashcard-tree-modules", JSON.stringify(updated));
  };

  const toggleChapter = (chapterId: string) => {
    const updated = { ...openChapters, [chapterId]: !openChapters[chapterId] };
    setOpenChapters(updated);
    localStorage.setItem("agora-flashcard-tree-chapters", JSON.stringify(updated));
  };

  // 1. Filter Decks
  const filteredDecks = decks.filter((deck) => {
    // Search filter
    const matchesSearch = deck.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deck.moduleName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Pill filter
    let matchesPill = true;
    if (activeFilter === "due") {
      matchesPill = deck.dueCount > 0;
    } else if (activeFilter === "learning") {
      matchesPill = deck.masteredCount > 0 && deck.masteredCount < deck.cardCount;
    } else if (activeFilter === "mastered") {
      matchesPill = deck.masteredCount === deck.cardCount && deck.cardCount > 0;
    } else if (activeFilter === "ai") {
      matchesPill = deck.aiGeneratedCount > 0;
    } else if (activeFilter === "my") {
      matchesPill = deck.userSubmittedCount > 0;
    }

    return matchesSearch && matchesPill;
  });

  // 2. Sort Decks
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortBy === "title") {
      return a.lessonTitle.localeCompare(b.lessonTitle);
    } else if (sortBy === "progress") {
      const progressA = a.masteredCount / a.cardCount || 0;
      const progressB = b.masteredCount / b.cardCount || 0;
      return progressB - progressA; // highest progress first
    } else if (sortBy === "cards") {
      return b.cardCount - a.cardCount; // largest card count first
    }
    return 0;
  });

  // 3. Build Dynamic Tree Structure
  const modulesMap: Record<string, {
    moduleId: string;
    moduleName: string;
    moduleIcon: string;
    totalCards: number;
    masteredCards: number;
    dueToday: number;
    chapters: Record<string, {
      chapterId: string;
      chapterTitle: string;
      totalCards: number;
      masteredCards: number;
      dueToday: number;
      decks: FlashcardDeck[];
    }>;
  }> = {};

  sortedDecks.forEach((deck) => {
    const modId = deck.moduleId || "general";
    const modName = deck.moduleName || "Général";
    const modIcon = MODULE_ICONS[modId] || MODULE_ICONS[modName.toLowerCase()] || "🩺";
    
    const chapId = deck.chapterId || "c_other";
    const chapTitle = CHAPTER_NAMES[chapId] || `Chapitre ${chapId.replace("c", "")}`;

    if (!modulesMap[modId]) {
      modulesMap[modId] = {
        moduleId: modId,
        moduleName: modName,
        moduleIcon: modIcon,
        totalCards: 0,
        masteredCards: 0,
        dueToday: 0,
        chapters: {},
      };
    }

    const mod = modulesMap[modId];
    mod.totalCards += deck.cardCount;
    mod.masteredCards += deck.masteredCount;
    mod.dueToday += deck.dueCount;

    if (!mod.chapters[chapId]) {
      mod.chapters[chapId] = {
        chapterId: chapId,
        chapterTitle: chapTitle,
        totalCards: 0,
        masteredCards: 0,
        dueToday: 0,
        decks: [],
      };
    }

    const chap = mod.chapters[chapId];
    chap.totalCards += deck.cardCount;
    chap.masteredCards += deck.masteredCount;
    chap.dueToday += deck.dueCount;
    chap.decks.push(deck);
  });

  const modulesList = Object.values(modulesMap);

  if (modulesList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#0A3D3D]/8 p-12 text-center space-y-4 max-w-lg mx-auto mt-8">
        <BookOpen className="h-12 w-12 text-[#6E8E8E]/40 mx-auto" />
        <h3 className="font-bold text-[#0D2626] text-sm">Aucun jeu ne correspond</h3>
        <p className="text-xs text-[#6E8E8E] leading-relaxed">
          Essayez de modifier vos critères de recherche ou de changer les filtres actifs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modulesList.map((mod) => {
        const isModOpen = !!openModules[mod.moduleId];
        const chaptersList = Object.values(mod.chapters);

        return (
          <div key={mod.moduleId} className="space-y-3">
            {/* Level 1: Module row */}
            <ModuleTreeRow
              moduleId={mod.moduleId}
              moduleName={mod.moduleName}
              moduleIcon={mod.moduleIcon}
              totalCards={mod.totalCards}
              masteredCards={mod.masteredCards}
              dueToday={mod.dueToday}
              isOpen={isModOpen}
              onToggle={() => toggleModule(mod.moduleId)}
            />

            {/* Level 2: Chapters Collapsible */}
            <AnimatePresence initial={false}>
              {isModOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden pl-4 sm:pl-6 space-y-4 border-l border-[#0A3D3D]/10 ml-5"
                >
                  {chaptersList.map((chap) => {
                    const isChapOpen = !!openChapters[chap.chapterId];

                    return (
                      <div key={chap.chapterId} className="space-y-3">
                        {/* Level 2: Chapter row */}
                        <ChapterTreeRow
                          chapterTitle={chap.chapterTitle}
                          totalCards={chap.totalCards}
                          masteredCards={chap.masteredCards}
                          dueToday={chap.dueToday}
                          isOpen={isChapOpen}
                          onToggle={() => toggleChapter(chap.chapterId)}
                        />

                        {/* Level 3: Lesson Decks Grid Collapsible */}
                        <AnimatePresence initial={false}>
                          {isChapOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4 pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                            >
                              {chap.decks.map((deck) => (
                                <LessonDeckCard
                                  key={deck.id}
                                  deck={deck}
                                  onStudy={onStudy}
                                  onBrowse={onBrowse}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
