"use client";

import React, { useRef } from "react";
import { Check, Lock, Heart, ArrowRight } from "lucide-react";
import { LessonListItem } from "@/types/lesson";
import QuickQCMChip from "./QuickQCMChip";
import { useRouter } from "next/navigation";

interface LessonListRowProps {
  lesson: LessonListItem;
  index: number;
  moduleId: string;
  isActive: boolean;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  rowRef: (el: HTMLDivElement | null) => void;
}

export default function LessonListRow({
  lesson,
  index,
  moduleId,
  isActive,
  onKeyDown,
  rowRef,
}: LessonListRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    if (lesson.isLocked) return;
    router.push(`/lessons/${moduleId}/${lesson.chapterId}/${lesson.id}`);
  };

  const formattedNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={rowRef}
      tabIndex={lesson.isLocked ? -1 : 0}
      onKeyDown={(e) => onKeyDown(e, index)}
      onClick={handleRowClick}
      className={`group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-teal/10 transition-all duration-200 outline-none focus:bg-surface/50 hover:bg-surface/30 cursor-pointer ${
        isActive ? "border-l-[3px] border-l-teal-light bg-surface/20" : ""
      } ${lesson.isLocked ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Left: Number circle & Info */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Number Circle */}
        <div className="shrink-0 mt-0.5">
          {lesson.isCompleted ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-white">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
          ) : lesson.isLocked ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text-light border border-teal/5">
              <Lock className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal text-teal font-mono text-sm font-bold bg-white">
              {formattedNumber}
            </div>
          )}
        </div>

        {/* Text details */}
        <div className="space-y-1.5 min-w-0">
          <h3 className={`font-display text-lg font-bold text-text-dark group-hover:text-teal transition-colors ${
            lesson.isCompleted ? "text-text-mid line-through decoration-text-light/30" : ""
          }`}>
            {lesson.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-light">
            <span className="font-sans font-medium">~{lesson.estimatedMinutes} min</span>
            <span>•</span>
            <span>{lesson.sectionCount} sections</span>
            
            {lesson.tags.map((tag) => (
              <span key={tag} className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold text-text-mid">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Badges & Action */}
      <div className="flex items-center justify-end gap-3 flex-wrap md:flex-nowrap shrink-0">
        {/* Anatomy Icon */}
        {lesson.hasAnatomy && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal/5 text-teal border border-teal/10" title="Contient un modèle anatomique">
            <Heart className="h-4 w-4 fill-teal/10" />
          </span>
        )}

        {/* Flashcards badge */}
        {lesson.flashcardCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal/5 px-2.5 py-1 text-xs font-semibold text-teal border border-teal/10">
            <span>🃏</span>
            <span>{lesson.flashcardCount} flashcards</span>
          </span>
        )}

        {/* QCM Shortcut */}
        {lesson.questionCount > 0 && (
          <QuickQCMChip
            chapterId={lesson.chapterId}
            lessonId={lesson.id}
            questionCount={lesson.questionCount}
          />
        )}

        {/* Hover Commencer Action */}
        {!lesson.isLocked && (
          <button
            type="button"
            className="md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 inline-flex items-center justify-center gap-1.5 rounded-full bg-teal px-4 py-2 text-xs font-semibold text-white hover:bg-teal-dark transition-all duration-200"
          >
            <span>{lesson.isCompleted ? "Revoir" : "Commencer"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
