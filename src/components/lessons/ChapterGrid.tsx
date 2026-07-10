"use client";

import React from "react";
import { CheckCircle2, Lock, BookOpen, HelpCircle } from "lucide-react";
import { Chapter } from "@/types/lesson";
import { useRouter } from "next/navigation";

interface ChapterGridProps {
  chapters: Chapter[];
}

export default function ChapterGrid({ chapters }: ChapterGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {chapters.map((chapter) => {
        const progressPercent = Math.round(
          (chapter.completedLessons / chapter.lessonCount) * 100
        );

        // Determine if fully completed
        const isCompleted = chapter.completedLessons === chapter.lessonCount && chapter.lessonCount > 0;

        // Custom action handlers
        const handleQcmClick = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/medquest/free?chapter=${chapter.id}`);
        };

        const handleCardClick = () => {
          if (!chapter.isLocked) {
            router.push(`/lessons/${chapter.moduleId}/${chapter.id}`);
          }
        };

        return (
          <div
            key={chapter.id}
            onClick={handleCardClick}
            className={`group relative flex flex-col h-full rounded-2xl bg-white border border-teal/10 shadow-sm transition-all duration-300 ${
              chapter.isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:border-teal/20 cursor-pointer"
            }`}
          >
            {/* Top Illustration/Image (160px height, object-cover) */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-surface/50 border-b border-teal/5 flex items-center justify-center">
              {/* Custom SVG fallbacks to make it look premium */}
              <div className="text-teal/40 group-hover:scale-105 transition-transform duration-500">
                <BookOpen className="h-16 w-16" />
              </div>

              {/* Badges on Image */}
              {isCompleted && (
                <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-teal text-white shadow-sm">
                  <CheckCircle2 className="h-4.5 w-4.5 fill-white text-teal" />
                </div>
              )}

              {chapter.isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 p-6 space-y-3">
              <span className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-light">
                Niveau {chapter.level}
              </span>
              
              <h3 className="font-display text-xl font-bold text-text-dark group-hover:text-teal transition-colors">
                {chapter.title}
              </h3>
              
              <p className="font-sans text-sm text-text-mid line-clamp-3 leading-relaxed">
                {chapter.description}
              </p>
              
              <p className="font-sans text-xs font-medium text-text-light">
                {chapter.lessonCount} leçons · {chapter.estimatedMinutes} min
              </p>
            </div>

            {/* Footer / Progress */}
            <div className="px-6 pb-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
                <div 
                  className="h-full bg-teal transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-text-light">
                <span>{chapter.completedLessons}/{chapter.lessonCount} leçons</span>
                <span className="font-bold">{progressPercent}%</span>
              </div>
            </div>

            {/* Actions Row */}
            <div className="p-6 pt-4 border-t border-teal/5 flex items-center gap-3 mt-auto">
              {!chapter.isLocked ? (
                <>
                  <button
                    onClick={handleCardClick}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white px-4 py-2.5 text-xs font-semibold text-teal hover:bg-surface/50 transition-colors"
                  >
                    📖 Voir les leçons
                  </button>
                  <button
                    onClick={handleQcmClick}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-teal px-4 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    {chapter.questionCount} QCMs
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-xs font-semibold text-text-light py-2">
                  🔒 Terminez les niveaux précédents pour débloquer
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
