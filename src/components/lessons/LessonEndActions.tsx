"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { MOCK_DECKS } from "@/lib/mock/flashcardsData";

interface LessonEndActionsProps {
  moduleId: string;
  chapterId: string;
  lessonId?: string;
  nextLessonId?: string;
  nextLessonTitle?: string;
  flashcardCount?: number;
}

export default function LessonEndActions({
  moduleId,
  chapterId,
  lessonId,
  nextLessonId,
  nextLessonTitle = "Chapitre suivant",
  flashcardCount = 12,
}: LessonEndActionsProps) {
  const decks = useFlashcardStore((state) => state.decks);
  const matchedDeck = lessonId 
    ? (decks.find((d) => d.lessonId === lessonId) || MOCK_DECKS.find((d) => d.lessonId === lessonId))
    : undefined;
  const targetHref = matchedDeck ? `/medquest/flashcards/${matchedDeck.id}` : "/medquest/flashcards";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-12 pb-6">
      
      {/* Card 1: Flashcards */}
      <div className="rounded-2xl bg-surface/50 border border-teal/5 p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="space-y-2">
          <div className="text-2xl">🃏</div>
          <h4 className="font-display text-base font-bold text-text-dark">
            Réviser avec les flashcards
          </h4>
          <p className="text-xs text-text-light">
            Ancrez vos connaissances en mémoire grâce au système de répétition espacée.
          </p>
        </div>
        <Link
          href={targetHref}
          className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline"
        >
          Commencer la révision <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Card 2: QCMs */}
      <div className="rounded-2xl bg-[#FF6B35]/5 border border-[#FF6B35]/15 p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="space-y-2">
          <div className="text-2xl text-[#FF6B35]">❓</div>
          <h4 className="font-display text-base font-bold text-text-dark">
            Tester vos connaissances
          </h4>
          <p className="text-xs text-text-light">
            Validez vos acquis à travers un entraînement ciblé sous forme de QCMs rapides.
          </p>
        </div>
        <Link
          href={`/medquest/free?chapter=${chapterId}`}
          className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#FF6B35] hover:underline"
        >
          Lancer les QCMs <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Card 3: Next Lesson */}
      <div className="rounded-2xl bg-teal text-white p-5 flex flex-col justify-between hover:bg-teal-dark transition-all duration-300 shadow-sm">
        <div className="space-y-2">
          <div className="text-xl">➔</div>
          <h4 className="font-display text-base font-bold">
            Leçon suivante
          </h4>
          <p className="text-xs text-white/80 line-clamp-2">
            {nextLessonTitle}
          </p>
        </div>
        {nextLessonId ? (
          <Link
            href={`/lessons/${moduleId}/${chapterId}/${nextLessonId}`}
            className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-teal-light hover:underline"
          >
            Continuer <ArrowRight className="h-3 w-3 text-teal-light" />
          </Link>
        ) : (
          <Link
            href={`/lessons/${moduleId}/${chapterId}`}
            className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-teal-light hover:underline"
          >
            Voir les leçons <ArrowRight className="h-3 w-3 text-teal-light" />
          </Link>
        )}
      </div>

    </div>
  );
}
