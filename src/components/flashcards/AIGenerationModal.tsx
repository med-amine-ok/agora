"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, BookOpen, Settings2, ShieldCheck } from "lucide-react";
import { getSubjectById, LESSONS_DATA, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "@/app/(student)/lessons/mockLessonsData";
import { useFlashcardStore } from "@/lib/store/flashcardStore";

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
  
  const [step, setStep] = useState<"options" | "loading" | "result">("options");
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

    if (step === "loading") {
      setProgress(0);
      setStatusIndex(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep("result");
            return 100;
          }
          return prev + 5;
        });
      }, 350);

      statusInterval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % ROTATING_STATUSES.length);
      }, 1500);
    }

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [step]);

  const handleGenerate = () => {
    setStep("loading");
  };

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
    setStep("options");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-teal/10 shadow-xl overflow-hidden p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal" />
            <h3 className="font-display text-xl font-bold text-text-dark">
              Générer des flashcards avec l'IA
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-surface text-text-light hover:text-text-dark">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Configuration Options */}
        {step === "options" && (
          <div className="space-y-5 text-xs text-text-dark">
            
            {/* Matière Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-text-light">Matière</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-teal/15 bg-white p-3 text-xs focus:border-teal focus:outline-none"
              >
                {LESSONS_DATA.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Chapitre Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-text-light">Chapitre</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full rounded-xl border border-teal/15 bg-white p-3 text-xs focus:border-teal focus:outline-none"
              >
                {filteredChapters.map(chap => (
                  <option key={chap.id} value={chap.id}>{chap.title}</option>
                ))}
              </select>
            </div>

            {/* Leçon Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-text-light">Leçon</label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full rounded-xl border border-teal/15 bg-white p-3 text-xs focus:border-teal focus:outline-none"
              >
                {filteredLessons.map(les => (
                  <option key={les.id} value={les.id}>{les.title}</option>
                ))}
              </select>
            </div>

            {/* Count Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-text-light">Nombre de cartes</label>
              <div className="flex gap-2">
                {[10, 20, 30].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setCardCount(count)}
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-center transition-all ${
                      cardCount === count 
                        ? "bg-teal border-teal text-white shadow-sm" 
                        : "border-teal/15 bg-white text-text-mid hover:border-teal/30"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-text-light">Difficulté</label>
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
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-center transition-all ${
                      difficulty === diff.id 
                        ? "bg-teal border-teal text-white shadow-sm" 
                        : "border-teal/15 bg-white text-text-mid hover:border-teal/30"
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-teal/15 text-xs font-semibold text-text-mid hover:bg-surface transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="flex-1 py-3 rounded-full bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="h-4 w-4" /> Générer maintenant →
              </button>
            </div>

          </div>
        )}

        {/* Step 2: Loading State */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="relative flex items-center justify-center h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-teal/10 border-t-teal animate-spin" />
              <Sparkles className="h-8 w-8 text-teal animate-pulse" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="font-display text-lg font-bold text-text-dark">
                L'IA génère vos flashcards...
              </h4>
              <p className="text-xs text-teal font-medium h-4 transition-all duration-300">
                {ROTATING_STATUSES[statusIndex]}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-right text-[10px] font-mono text-text-light">{progress}%</p>
            </div>
          </div>
        )}

        {/* Step 3: Result Preview */}
        {step === "result" && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-display text-lg font-bold text-text-dark">
                {cardCount} flashcards générées !
              </h4>
              <p className="text-xs text-text-light">
                Le deck est prêt à être sauvegardé dans votre espace.
              </p>
            </div>

            {/* Mini Scroll Preview */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div 
                  key={idx}
                  className="shrink-0 w-44 rounded-xl border border-teal/10 bg-surface/30 p-3 space-y-2 text-[10px] text-text-mid"
                >
                  <span className="inline-block rounded-full bg-teal/5 text-teal px-2 py-0.5 font-bold uppercase scale-90 origin-left">
                    Concept #{idx + 1}
                  </span>
                  <p className="font-bold text-text-dark line-clamp-2">
                    Cardiologie Clinique - Notion clé {idx + 1}
                  </p>
                  <p className="line-clamp-3 leading-relaxed">
                    Définition ou question d'anatomie ciblée générée automatiquement.
                  </p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("options")}
                className="flex-1 py-3 rounded-full border border-teal/15 text-xs font-semibold text-text-mid hover:bg-surface transition-all"
              >
                Reconfigurer
              </button>
              <button
                type="button"
                onClick={handleSaveDeck}
                className="flex-1 py-3 rounded-full bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-all shadow-sm"
              >
                Sauvegarder le deck →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
