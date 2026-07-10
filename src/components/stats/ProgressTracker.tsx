"use client";

import React from "react";
import { BookOpen, GraduationCap, HelpCircle, Inbox } from "lucide-react";

interface ProgressTrackerProps {
  lessonsRead?: number;
  totalLessons?: number;
  modulesRead?: number;
  totalModules?: number;
  qcmsAnswered?: number;
  qcmPrecision?: number;
  flashcardsMastered?: number;
  totalFlashcards?: number;
  flashcardsDueToday?: number;
}

export default function ProgressTracker({
  lessonsRead = 6,
  totalLessons = 18,
  modulesRead = 24,
  totalModules = 67,
  qcmsAnswered = 1247,
  qcmPrecision = 78,
  flashcardsMastered = 89,
  totalFlashcards = 240,
  flashcardsDueToday = 12,
}: ProgressTrackerProps) {
  const lessonPercent = Math.round((lessonsRead / totalLessons) * 100) || 0;
  const modulePercent = Math.round((modulesRead / totalModules) * 100) || 0;
  const flashcardPercent = Math.round((flashcardsMastered / totalFlashcards) * 100) || 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Lessons Progress */}
      <div className="rounded-2xl border border-teal/10 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-dark">📚 Leçons</span>
          <BookOpen className="h-5 w-5 text-teal/60" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-text-dark font-display">
            {lessonsRead} / {totalLessons} leçons
          </p>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-teal" style={{ width: `${lessonPercent}%` }} />
          </div>
          <p className="text-[10px] text-text-light font-semibold">
            {lessonPercent}% du programme complété
          </p>
        </div>
      </div>

      {/* Modules Progress */}
      <div className="rounded-2xl border border-teal/10 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-dark">📖 Modules</span>
          <GraduationCap className="h-5 w-5 text-teal/60" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-text-dark font-display">
            {modulesRead} / {totalModules} lus
          </p>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-teal" style={{ width: `${modulePercent}%` }} />
          </div>
          <p className="text-[10px] text-text-light font-semibold">
            +3 ce mois
          </p>
        </div>
      </div>

      {/* QCM Progress */}
      <div className="rounded-2xl border border-teal/10 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-dark">❓ Questions QCM</span>
          <HelpCircle className="h-5 w-5 text-teal/60" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-text-dark font-display">
            {qcmsAnswered.toLocaleString()} répondues
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="h-1.5 flex-1 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-teal" style={{ width: `${qcmPrecision}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-teal shrink-0">
              {qcmPrecision}%
            </span>
          </div>
          <p className="text-[10px] text-text-light font-semibold">
            Précision globale cumulée
          </p>
        </div>
      </div>

      {/* Flashcards Progress */}
      <div className="rounded-2xl border border-teal/10 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-dark">🃏 Flashcards</span>
          <Inbox className="h-5 w-5 text-teal/60" />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold text-text-dark font-display">
            {flashcardsMastered} / {totalFlashcards} maîtrisées
          </p>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-teal" style={{ width: `${flashcardPercent}%` }} />
          </div>
          <p className="text-[10px] text-text-light font-semibold flex items-center justify-between">
            <span>{flashcardPercent}% du deck total</span>
            {flashcardsDueToday > 0 && (
              <span className="text-orange-500 font-bold font-mono">
                🔄 {flashcardsDueToday} dues aujourd'hui
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
