"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, BookOpen, Settings2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { LESSONS_DATA, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "@/app/(student)/lessons/mockLessonsData";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { motion, AnimatePresence } from "framer-motion";

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROTATING_STATUSES = [
  "Analyse du contenu de la leçon...",
  "Identification des concepts clés...",
  "Création des définitions...",
  "Ajout des questions Vrai/Faux...",
  "Génération des exercices images...",
  "Finalisation du deck..."
];

export default function AIGenerationModal({ isOpen, onClose }: AIGenerationModalProps) {
  const { generateAiDeck } = useFlashcardStore();
  
  // Wizard steps: 1 (Subject), 2 (Chapter & Lesson), 3 (Count & Diff), 4 (Loading), 5 (Result)
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState(LESSONS_DATA[0].id);
  const [selectedChapter, setSelectedChapter] = useState(MOCK_CHAPTERS[0].id);
  const [selectedLesson, setSelectedLesson] = useState(MOCK_LESSON_LIST[0].id);

  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  // Filter lists based on selections
  const filteredChapters = MOCK_CHAPTERS.filter(c => c.moduleId === selectedSubject);
  const filteredLessons = MOCK_LESSON_LIST.filter(l => l.chapterId === selectedChapter);

  // Sync child dropdown values
  useEffect(() => {
    if (filteredChapters.length > 0) {
      setSelectedChapter(filteredChapters[0].id);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (filteredLessons.length > 0) {
      setSelectedLesson(filteredLessons[0].id);
    }
  }, [selectedChapter]);

  // Loading animation simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let statusInterval: NodeJS.Timeout;

    if (wizardStep === 4) {
      setProgress(0);
      setStatusIndex(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setWizardStep(5);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      statusInterval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % ROTATING_STATUSES.length);
      }, 1200);
    }

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [wizardStep]);

  const handleSaveDeck = () => {
    const lesson = MOCK_LESSON_LIST.find(l => l.id === selectedLesson) || MOCK_LESSON_LIST[0];
    const subject = LESSONS_DATA.find(s => s.id === selectedSubject) || LESSONS_DATA[0];

    generateAiDeck(
      selectedSubject,
      selectedChapter,
      selectedLesson,
      lesson.title,
      subject.name,
      cardCount
    );

    // Reset and close
    setWizardStep(1);
    onClose();
  };

  if (!isOpen) return null;

  const getSubjectEmoji = (id: string) => {
    switch (id) {
      case "cardiologie": return "❤️";
      case "neurologie": return "🧠";
      case "biochimie": return "🧪";
      case "anatomie": return "💀";
      case "physiologie": return "⚡";
      case "hematologie": return "🩸";
      case "nephrologie": return "💧";
      case "pharmacologie": return "💊";
      default: return "📚";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-[#0D2E2E] border border-teal/20 shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 max-h-[95vh] overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-light animate-pulse" />
            <h3 className="font-display text-lg font-black tracking-tight text-white">
              Générateur de Flashcards IA
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-xl p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progression Dots */}
        {wizardStep <= 3 && (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  wizardStep === s ? "w-8 bg-teal-light" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Select Subject */}
          {wizardStep === 1 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-teal-light/70">Matière</h4>
                <p className="text-xs text-teal-light/50">Sélectionnez la matière pour laquelle générer des flashcards.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LESSONS_DATA.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      selectedSubject === sub.id
                        ? "bg-teal/20 border-teal-light text-white shadow-lg"
                        : "bg-white/5 border-white/5 text-teal-light/80 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{getSubjectEmoji(sub.id)}</span>
                    <span className="text-xs font-black block">{sub.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setWizardStep(2)}
                  className="bg-teal text-white hover:bg-teal-dark font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Chapter & Lesson */}
          {wizardStep === 2 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-teal-light/70">Chapitre & Leçon</h4>
                <p className="text-xs text-teal-light/50">Déterminez l'unité spécifique de révision.</p>
              </div>

              {/* Chapitre Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Chapitre</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white focus:border-teal-light focus:outline-none cursor-pointer"
                >
                  {filteredChapters.map(chap => (
                    <option key={chap.id} value={chap.id} className="bg-[#0D2E2E]">{chap.title}</option>
                  ))}
                </select>
              </div>

              {/* Leçon Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Leçon</label>
                <select
                  value={selectedLesson}
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white focus:border-teal-light focus:outline-none cursor-pointer"
                >
                  {filteredLessons.map(les => (
                    <option key={les.id} value={les.id} className="bg-[#0D2E2E]">{les.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setWizardStep(1)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
                <button
                  onClick={() => setWizardStep(3)}
                  className="bg-teal text-white hover:bg-teal-dark font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  Continuer <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Count & Difficulty */}
          {wizardStep === 3 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-teal-light/70">Configuration</h4>
                <p className="text-xs text-teal-light/50">Personnalisez la taille et la difficulté du deck.</p>
              </div>

              {/* Count Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Nombre de cartes</label>
                <div className="flex gap-2">
                  {[10, 20, 30].map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setCardCount(count)}
                      className={`flex-1 py-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                        cardCount === count 
                          ? "bg-teal border-teal text-white shadow-lg" 
                          : "border-white/10 bg-white/5 text-teal-light hover:border-white/20"
                      }`}
                    >
                      {count} cartes
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-teal-light/50">Difficulté</label>
                <div className="flex gap-2">
                  {([
                    { id: "easy", label: "Facile" },
                    { id: "medium", label: "Mixte" },
                    { id: "hard", label: "Difficile" }
                  ] as const).map(diff => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setDifficulty(diff.id)}
                      className={`flex-1 py-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                        difficulty === diff.id 
                          ? "bg-teal border-teal text-white shadow-lg" 
                          : "border-white/10 bg-white/5 text-teal-light hover:border-white/20"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setWizardStep(2)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
                <button
                  onClick={() => setWizardStep(4)}
                  className="bg-[#FF6B35] hover:bg-[#E55A27] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" /> Générer avec l'IA
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Loading State */}
          {wizardStep === 4 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 space-y-6"
            >
              <div className="relative flex items-center justify-center h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-teal/20 border-t-teal-light animate-spin" />
                <Sparkles className="h-8 w-8 text-teal-light animate-pulse" />
              </div>

              <div className="text-center space-y-2">
                <h4 className="font-display text-lg font-black text-white">
                  Génération en cours...
                </h4>
                <p className="text-xs text-teal-light font-bold h-4 transition-all duration-300">
                  {ROTATING_STATUSES[statusIndex]}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs space-y-1">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-[0.5px]">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-light to-emerald-400 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-right text-[10px] font-mono text-teal-light/50 font-bold">{progress}%</p>
              </div>
            </motion.div>
          )}

          {/* Step 5: Result Preview */}
          {wizardStep === 5 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg font-black text-white">
                  {cardCount} flashcards générées !
                </h4>
                <p className="text-xs text-teal-light/60">
                  Le deck est prêt à être sauvegardé dans votre espace.
                </p>
              </div>

              {/* Mini Scroll Preview */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className="shrink-0 w-44 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-[10px] text-teal-light/80"
                  >
                    <span className="inline-block rounded-full bg-teal/20 text-teal-light px-2 py-0.5 font-black uppercase tracking-wider scale-90 origin-left">
                      Concept #{idx + 1}
                    </span>
                    <p className="font-black text-white line-clamp-2">
                      Cardiologie Clinique - Notion #{idx + 1}
                    </p>
                    <p className="line-clamp-3 leading-relaxed text-teal-light/60">
                      Définition ou question d'anatomie ciblée générée automatiquement par notre IA.
                    </p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 font-bold text-xs text-teal-light hover:bg-white/10 transition-all cursor-pointer text-center"
                >
                  Reconfigurer
                </button>
                <button
                  type="button"
                  onClick={handleSaveDeck}
                  className="flex-1 py-3 rounded-xl bg-teal text-white font-bold text-xs hover:bg-teal-dark transition-all shadow-md cursor-pointer text-center"
                >
                  Sauvegarder le deck →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
