"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, GraduationCap, Award, Play } from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../../mockLessonsData";
import LessonListRow from "@/components/lessons/LessonListRow";

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.moduleId as string) || "cardiologie";
  const chapterId = (params?.chapterId as string) || "c1";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);
  const chapter = useMemo(() => {
    return MOCK_CHAPTERS.find((c) => c.id === chapterId) || MOCK_CHAPTERS[0];
  }, [chapterId]);

  // Filter lessons belonging to this chapter
  const chapterLessons = useMemo(() => {
    return MOCK_LESSON_LIST.filter((l) => l.chapterId === chapterId);
  }, [chapterId]);

  // Keyboard navigation refs and active state
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Find the first uncompleted or partially completed lesson to display in the sticky bar
  const resumeLesson = useMemo(() => {
    return chapterLessons.find((l) => !l.isCompleted && !l.isLocked);
  }, [chapterLessons]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.min(index + 1, chapterLessons.length - 1);
      setActiveIndex(nextIdx);
      rowRefs.current[nextIdx]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIdx = Math.max(index - 1, 0);
      setActiveIndex(prevIdx);
      rowRefs.current[prevIdx]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const lesson = chapterLessons[index];
      if (lesson && !lesson.isLocked) {
        router.push(`/lessons/${moduleId}/${chapterId}/${lesson.id}`);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4] pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(214,163,0,0.10),_transparent_24%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        
        {/* Back Link & Header */}
        <section className="space-y-4">
          <Link 
            href={`/lessons/${moduleId}`} 
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-light transition-colors hover:text-teal"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au module
          </Link>

          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-teal">
                Niveau {chapter.level} • Chapitre
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-dark sm:text-5xl">
                {chapter.title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-light">
                {chapter.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <GraduationCap className="h-4 w-4 text-teal" /> {chapterLessons.length} leçons
              </div>
              {chapter.flashcardCount && chapter.flashcardCount > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-accent/15 bg-white px-4 py-2 text-xs font-semibold text-accent shadow-sm">
                  <span>🃏</span> {chapter.flashcardCount} flashcards
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Centered Lesson List */}
        <section className="mx-auto w-full max-w-[800px] bg-white rounded-3xl border border-teal/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-teal/10 bg-surface/10 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-text-dark">
              Liste des cours
            </h2>
            <span className="text-xs text-text-light font-medium">
              Utilisez les flèches ↑ ↓ pour naviguer
            </span>
          </div>

          <div className="flex flex-col">
            {chapterLessons.map((lesson, idx) => (
              <LessonListRow
                key={lesson.id}
                lesson={lesson}
                index={idx}
                moduleId={moduleId}
                isActive={activeIndex === idx}
                onKeyDown={handleKeyDown}
                rowRef={(el) => {
                  rowRefs.current[idx] = el;
                }}
              />
            ))}
          </div>
        </section>

      </main>

      {/* Sticky Bottom Resume Bar */}
      {resumeLesson && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-teal/10 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal animate-pulse">
                <Play className="h-4 w-4 fill-teal" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-text-dark">
                  Reprendre : {resumeLesson.title}
                </p>
                <p className="text-[10px] text-text-light">
                  {resumeLesson.completionPercent > 0 
                    ? `${resumeLesson.completionPercent}% complété` 
                    : `${resumeLesson.estimatedMinutes} min de lecture restante`}
                </p>
              </div>
            </div>
            
            <Link
              href={`/lessons/${moduleId}/${chapterId}/${resumeLesson.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition-colors shadow-sm"
            >
              <span>Reprendre</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
