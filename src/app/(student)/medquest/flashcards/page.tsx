"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, MoreVertical, Flame, Calendar, BookOpen, User, CheckCircle, ArrowRight, Grid, LayoutList, ChevronLeft } from "lucide-react";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import AIGenerationModal from "@/components/flashcards/AIGenerationModal";
import CreateCardModal from "@/components/flashcards/CreateCardModal";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 15;

export default function FlashcardHub() {
  const router = useRouter();
  const { decks, flashcards, deleteDeck } = useFlashcardStore();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "due" | "mastered" | "my">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Animated card preview flip loop
  const [previewFlipped, setPreviewFlipped] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewFlipped(prev => !prev);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory]);

  const totalMastered = decks.reduce((acc, curr) => acc + curr.masteredCount, 0);
  const totalDue = decks.reduce((acc, curr) => acc + curr.dueCount, 0);

  // Filter personal decks
  const filteredDecks = decks.filter(deck => {
    // Category filter
    if (selectedCategory !== "all" && deck.moduleName.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Tab filter
    if (activeTab === "due" && deck.dueCount === 0) return false;
    if (activeTab === "mastered" && deck.masteredCount < deck.cardCount) return false;
    if (activeTab === "my" && deck.userSubmittedCount === 0) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredDecks.length / ITEMS_PER_PAGE);

  const paginatedDecks = filteredDecks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Extract unique modules/categories for side filtering
  const categories = ["all", "cardiologie", "neurologie", "anatomie"];

  const handleStudy = (deckId: string) => {
    router.push(`/medquest/flashcards/${deckId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5FAFA] flex flex-col font-sans">
      
      {/* MINIMALIST HERO / PREVIEW SECTION */}
      <section className="border-b border-[#0A3D3D]/10 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Info & Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E0F2F2] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0E7C7B]">
                <Sparkles className="h-3.5 w-3.5" /> Répétition Espacée Intelligente
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#0D2626] leading-none">
                Agora <span className="text-[#0E7C7B]">Flashcards</span>
              </h1>
              
              <p className="text-sm sm:text-base text-[#6E8E8E] max-w-xl leading-relaxed">
                Apprenez et retenez vos cours de médecine deux fois plus vite grâce à notre moteur de répétition espacée (algorithme SM-2). Générez des jeux de cartes instantanés grâce à l'IA ou créez-les manuellement.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-5 py-3 text-xs font-bold text-white hover:bg-[#0A3D3D] transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Générer avec l'IA
                </button>
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0A3D3D]/12 bg-white px-5 py-3 text-xs font-bold text-[#214646] hover:bg-[#F5FAFA] transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Créer une carte
                </button>
              </div>
            </div>

            {/* Right Column: Sleek Centered Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E8E8E]">Aperçu Interactif</span>
              </div>
              
              <div 
                className="relative w-72 h-44 select-none cursor-pointer"
                style={{ perspective: 1200 }}
                onClick={() => setPreviewFlipped(!previewFlipped)}
              >
                <motion.div
                  animate={{ rotateY: previewFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-full h-full relative"
                >
                  {/* Front Side */}
                  <div 
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-[#0A3D3D]/12 p-6 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#0E7C7B]">Question</span>
                      <span className="text-[9px] font-mono text-[#6E8E8E]">Cardiologie</span>
                    </div>
                    <div className="my-auto text-center font-display text-base font-bold text-[#0D2626]">
                      Valve mitrale — rôle ?
                    </div>
                    <span className="text-[9px] text-[#6E8E8E]/80 text-center font-medium">Cliquez pour retourner la carte</span>
                  </div>

                  {/* Back Side */}
                  <div 
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                    className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-[#0A3D3D]/12 p-6 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#FF6B35]">Réponse</span>
                      <span className="text-[9px] font-mono text-[#6E8E8E]">Cardiologie</span>
                    </div>
                    <div className="my-auto text-center font-sans text-xs text-[#214646] leading-relaxed font-semibold">
                      Sépare l'oreillette gauche et le ventricule gauche. Composée de 2 feuillets, s'ouvre en diastole pour le remplissage.
                    </div>
                    <span className="text-[9px] text-[#0E7C7B] text-center font-semibold">Agora Flashcards</span>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK STATUS STRIP */}
      <section className="bg-white border-b border-[#0A3D3D]/8 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4 text-xs font-bold text-[#214646]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0E7C7B]" />
              <span>{totalMastered} Maîtrisées</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
              <span>{totalDue} À réviser aujourd'hui</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[#F5FAFA] px-3.5 py-1.5 rounded-xl border border-[#0A3D3D]/8">
            <Flame className="h-4 w-4 text-[#FF6B35] fill-[#FF6B35]" />
            <span>Série active : <strong className="text-[#0D2626]">14 jours</strong></span>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER: SIDEBAR + DECKS CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Deck Types Filters */}
            <div className="bg-white rounded-2xl border border-[#0A3D3D]/10 p-5 space-y-4">
              <h3 className="text-[11px] font-bold text-[#6E8E8E] uppercase tracking-wider">Type d'apprentissage</h3>
              <div className="space-y-1">
                {([
                  { id: "all", label: "Toutes les cartes", count: decks.length },
                  { id: "due", label: "À réviser", count: totalDue },
                  { id: "mastered", label: "Cartes maîtrisées", count: totalMastered },
                  { id: "my", label: "Mes créations", count: decks.filter(d => d.userSubmittedCount > 0).length }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      activeTab === tab.id 
                        ? "bg-[#E0F2F2] text-[#0A3D3D]" 
                        : "text-[#214646] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        activeTab === tab.id ? "bg-[#0E7C7B] text-white" : "bg-[#F5FAFA] text-[#6E8E8E] border border-[#0A3D3D]/8"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules / Categories Filter */}
            <div className="bg-white rounded-2xl border border-[#0A3D3D]/10 p-5 space-y-4">
              <h3 className="text-[11px] font-bold text-[#6E8E8E] uppercase tracking-wider">Modules</h3>
              <div className="space-y-1">
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                        isSelected 
                          ? "bg-[#E0F2F2] text-[#0A3D3D]" 
                          : "text-[#214646] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
                      }`}
                    >
                      <span className="capitalize">{cat === "all" ? "Tous les modules" : cat}</span>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#0E7C7B]" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* RIGHT VIEWPORT: MY DECKS & COMMUNITY DECKS */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* Personal Decks Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#0A3D3D]/10 pb-4">
                <h2 className="font-display text-2xl font-black text-[#0D2626] tracking-tight">
                  Mes Cartes <span className="text-xs text-[#6E8E8E] font-sans font-bold ml-2">({filteredDecks.length} restants)</span>
                </h2>
              </div>

              {paginatedDecks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#0A3D3D]/8 p-12 text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-[#6E8E8E]/40 mx-auto" />
                  <h3 className="font-bold text-[#0D2626] text-sm">Aucun deck ne correspond</h3>
                  <p className="text-xs text-[#6E8E8E] max-w-xs mx-auto leading-relaxed">
                    Essayez de modifier vos filtres ou générez des flashcards à partir d'une leçon médicale.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {paginatedDecks.map(deck => {
                      const progressPercent = Math.round((deck.masteredCount / deck.cardCount) * 100) || 0;
                      const hasDue = deck.dueCount > 0;

                      return (
                        <div 
                          key={deck.id}
                          className="group bg-white rounded-2xl border border-[#0A3D3D]/10 p-5 flex flex-col justify-between hover:border-[#0E7C7B] hover:shadow-sm transition-all duration-200"
                        >
                          <div className="space-y-3">
                            {/* Top metadata tags */}
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#0E7C7B]">
                                {deck.moduleName}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {deck.aiGeneratedCount > 0 && (
                                  <span className="rounded-full bg-[#E0F2F2] px-2 py-0.5 text-[8px] font-bold text-[#0E7C7B] border border-[#0E7C7B]/10">
                                    ✨ IA
                                  </span>
                                )}
                                {hasDue && (
                                  <span className="rounded-full bg-[#FF6B35] px-2 py-0.5 text-[8px] font-bold text-white">
                                    {deck.dueCount} Dues
                                  </span>
                                )}
                              </div>
                            </div>

                            <h3 className="text-sm font-bold text-[#0D2626] line-clamp-1">
                              {deck.lessonTitle}
                            </h3>

                            <div className="flex items-center justify-between text-[11px] text-[#6E8E8E]">
                              <span>{deck.cardCount} cartes</span>
                              <span>{progressPercent}% Maîtrisé</span>
                            </div>

                            {/* Minimalist Progress Indicator */}
                            <div className="h-1 w-full bg-[#F5FAFA] rounded-full overflow-hidden border border-[#0A3D3D]/5">
                              <div className="h-full bg-[#0E7C7B]" style={{ width: `${progressPercent}%` }} />
                            </div>
                          </div>

                          {/* Bottom action row */}
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0A3D3D]/8">
                            <button
                              onClick={() => handleStudy(deck.id)}
                              className="flex-1 py-2 rounded-xl bg-[#E0F2F2] text-[#0A3D3D] text-xs font-bold hover:bg-[#0E7C7B] hover:text-white transition-all duration-200 flex items-center justify-center gap-1"
                            >
                              Réviser <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="relative">
                              <button 
                                onClick={() => setActiveDropdown(activeDropdown === deck.id ? null : deck.id)}
                                className="p-2 rounded-xl border border-[#0A3D3D]/12 hover:bg-[#F5FAFA] text-[#6E8E8E] transition-all"
                              >
                                <MoreVertical className="h-4.5 w-4.5" />
                              </button>
                              
                              {activeDropdown === deck.id && (
                                <div className="absolute right-0 top-10 z-20 w-32 rounded-xl bg-white border border-[#0A3D3D]/12 shadow-lg p-1.5 space-y-0.5 text-xs text-[#214646]">
                                  <button 
                                    onClick={() => { deleteDeck(deck.id); setActiveDropdown(null); }}
                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-[#D72638] transition-all font-semibold"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-6 border-t border-[#0A3D3D]/5">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl border border-[#0A3D3D]/10 bg-white hover:bg-[#F5FAFA] disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4 text-[#214646]" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#0E7C7B] border-[#0E7C7B] text-white"
                              : "border-[#0A3D3D]/10 bg-white text-[#214646] hover:bg-[#F5FAFA]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl border border-[#0A3D3D]/10 bg-white hover:bg-[#F5FAFA] disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <ArrowRight className="h-4 w-4 text-[#214646]" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Community Decks Section */}
            <div className="space-y-6 pt-6 border-t border-[#0A3D3D]/10">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black text-[#0D2626] tracking-tight">
                  Bibliothèque Commune
                </h2>
                <p className="text-xs text-[#6E8E8E]">
                  Explorez et importez des flashcards construites par d'autres étudiants de médecine.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {decks.slice(0, 3).map(deck => (
                  <div 
                    key={`comm-${deck.id}`}
                    className="bg-white rounded-2xl border border-[#0A3D3D]/10 p-5 flex flex-col justify-between hover:border-[#0E7C7B] hover:shadow-sm transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Author Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#E0F2F2] text-[#0A3D3D] flex items-center justify-center font-bold text-[10px]">
                            {deck.lessonTitle.charAt(0)}
                          </div>
                          <div className="text-[10px] text-[#6E8E8E]">
                            <p className="font-bold text-[#0D2626]">Anis K.</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" /> Validé
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0E7C7B]">
                          {deck.moduleName}
                        </span>
                        <h4 className="text-sm font-bold text-[#0D2626] line-clamp-1">
                          {deck.lessonTitle}
                        </h4>
                        <p className="text-[10px] text-[#6E8E8E]">
                          {deck.cardCount} cartes actives
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStudy(deck.id)}
                      className="w-full mt-4 py-2.5 rounded-xl border border-[#0A3D3D]/12 hover:bg-[#E0F2F2] hover:text-[#0A3D3D] text-xs font-bold text-[#214646] transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      Importer & Réviser
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Call to Action banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0E7C7B] to-[#0A3D3D] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10">
                <h3 className="font-display text-xl font-bold">
                  Générez vos flashcards en 10 secondes
                </h3>
                <p className="text-xs text-white/80 max-w-md leading-relaxed">
                  Choisissez une leçon de votre choix. Notre IA extrait les notions essentielles pour concevoir des questions adaptées.
                </p>
              </div>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="shrink-0 bg-white hover:bg-[#F5FAFA] text-[#0A3D3D] font-bold text-xs py-3 px-5 rounded-xl shadow-sm transition-all active:scale-95 z-10"
              >
                Essayer maintenant →
              </button>
              
              <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            </div>

          </div>

        </div>
      </main>

      {/* MODALS */}
      <AIGenerationModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <CreateCardModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} />

    </div>
  );
}

