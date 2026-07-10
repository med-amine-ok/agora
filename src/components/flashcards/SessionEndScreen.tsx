"use client";

import React from "react";
import { CheckCircle2, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";

interface SessionEndScreenProps {
  stats: {
    again: number;
    hard: number;
    ok: number;
    easy: number;
  };
  totalReviewed: number;
  masteredCount: number;
  onRestartDifficult: () => void;
  onBackToDecks: () => void;
  nextLessonUrl?: string;
  onGoToNextLesson?: () => void;
}

export default function SessionEndScreen({
  stats,
  totalReviewed,
  masteredCount,
  onRestartDifficult,
  onBackToDecks,
  nextLessonUrl,
  onGoToNextLesson,
}: SessionEndScreenProps) {
  const totalCards = stats.again + stats.hard + stats.ok + stats.easy;
  const progressPercent = Math.round((masteredCount / totalReviewed) * 100) || 0;

  return (
    <div className="w-full max-w-[560px] mx-auto bg-white p-8 md:p-12 rounded-3xl border border-teal/10 shadow-[0_8px_30px_rgb(31,132,118,0.06)] text-center space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-bold text-text-dark">
          ✦ Révision terminée !
        </h2>
        <p className="text-sm text-text-light">
          Félicitations pour avoir finalisé vos révisions SM-2 d'aujourd'hui.
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-lg">🔴</span>
          <span className="text-xl font-bold text-red-700 font-mono mt-1">{stats.again}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 mt-0.5">Encore</span>
        </div>
        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-lg">🟠</span>
          <span className="text-xl font-bold text-orange-700 font-mono mt-1">{stats.hard}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-orange-500 mt-0.5">Difficile</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-lg">🟢</span>
          <span className="text-xl font-bold text-emerald-700 font-mono mt-1">{stats.ok}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500 mt-0.5">OK</span>
        </div>
        <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-lg">⭐</span>
          <span className="text-xl font-bold text-teal-700 font-mono mt-1">{stats.easy}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-teal-500 mt-0.5">Facile</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-sm mx-auto space-y-2">
        <div className="flex items-center justify-between text-xs text-text-mid font-semibold">
          <span>Cartes maîtrisées</span>
          <span className="font-mono text-teal font-bold">{masteredCount} / {totalReviewed}</span>
        </div>
        <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 text-xs leading-relaxed max-w-sm mx-auto">
        <p className="text-text-mid">
          Les cartes <strong className="text-red-500">Encore</strong> et <strong className="text-orange-500">Difficile</strong> seront prioritaires dans vos prochaines sessions d'étude.
        </p>
        <p className="text-teal font-bold flex items-center justify-center gap-1.5 mt-2">
          <span>🔄 Prochaine révision recommandée : demain à 9h00</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
        {(stats.again > 0 || stats.hard > 0) && (
          <button
            onClick={onRestartDifficult}
            className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="h-4 w-4" /> Recommencer les difficiles
          </button>
        )}
        
        {nextLessonUrl && onGoToNextLesson && (
          <button
            onClick={onGoToNextLesson}
            className="w-full py-3 rounded-full bg-teal hover:bg-teal-dark text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span>Leçon suivante</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={onBackToDecks}
          className="w-full py-3 rounded-full border border-teal/15 text-text-mid hover:bg-surface text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux decks
        </button>
      </div>

    </div>
  );
}
