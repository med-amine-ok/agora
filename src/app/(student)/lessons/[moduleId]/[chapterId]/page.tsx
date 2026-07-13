"use client";

import React, { useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, Award, Play, ChevronRight, Check, Lock } from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../../mockLessonsData";
import { SUBJECT_CONFIG } from "@/lib/config/subjects";
import LessonListRow from "@/components/lessons/LessonListRow";

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.moduleId as string) || "cardiologie";
  const chapterId = (params?.chapterId as string) || "c1";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);
  const config = useMemo(() => SUBJECT_CONFIG[moduleId] || SUBJECT_CONFIG.cardiologie, [moduleId]);

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
    return chapterLessons.find((l) => !l.isCompleted && !l.isLocked) || chapterLessons[0];
  }, [chapterLessons]);

  const completedLessons = useMemo(() => {
    return chapterLessons.filter(l => l.isCompleted).length;
  }, [chapterLessons]);

  const progressPercent = useMemo(() => {
    if (chapterLessons.length === 0) return 0;
    return Math.round((completedLessons / chapterLessons.length) * 100);
  }, [chapterLessons, completedLessons]);

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
    <div className="relative min-h-screen bg-[#F5FAFA] pt-[56px] pb-24 font-sans text-[#0D2626]">
      {/* Decorative background gradient reflecting subject's theme */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.06] z-0" 
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${config.accent}, transparent 45%), radial-gradient(circle at bottom right, #5DC8C6, transparent 45%)`
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[800px] px-4 md:px-6">
        
        {/* Back Link & Header */}
        <section className="space-y-4 pt-6">
          <Link 
            href={`/lessons/${moduleId}`} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7C7B] hover:text-[#0A3D3D] transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> RETOUR AU MODULE
          </Link>

          <div className="flex flex-col gap-4 border-b border-[#0a3d3d]/10 pb-6">
            <div className="space-y-3 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] block" style={{ color: config.accent }}>
                Niveau {chapter.level} • Chapitre
              </span>
              <h1 className="font-display text-[38px] font-semibold text-[#0D2626] leading-tight">
                {chapter.title}
              </h1>
              <p className="text-base text-[#7A9E9E] mt-1.5 leading-relaxed">
                {chapter.description}
              </p>
            </div>

            {/* Chapter Stats and Progress Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-[#0a3d3d]/8 rounded-[20px] p-5 shadow-[0_2px_8px_rgba(10,61,61,0.03)] mt-2">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#0D2626]">
                  <span>Progression du chapitre</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#E0F2F2] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundImage: `linear-gradient(to right, ${config.accent}, ${config.accentLight})`
                    }} 
                  />
                </div>
              </div>

              <div className="flex gap-2 shrink-0 sm:ml-6 items-center">
                <div className="flex items-center gap-1.5 rounded-full bg-[#E0F2F2] px-3.5 py-1.5 text-xs font-semibold text-[#0E7C7B] border border-[#0a3d3d]/6">
                  <GraduationCap className="h-4 w-4" /> {chapterLessons.length} cours
                </div>
                {chapter.flashcardCount && chapter.flashcardCount > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#7A9E9E] border border-[#0a3d3d]/8">
                    <span>🃏</span> {chapter.flashcardCount} cards
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Centered Lesson List */}
        <section className="bg-white rounded-[24px] border border-[#0a3d3d]/8 shadow-[0_2px_12px_rgba(10,61,61,0.04)] overflow-hidden mt-8">
          <div className="p-5 border-b border-[#0a3d3d]/8 bg-[#F5FAFA] flex items-center justify-between">
            <h2 className="font-sans text-[16px] font-bold text-[#0D2626]">
              Liste des cours
            </h2>
            <span className="text-[11px] text-[#7A9E9E] font-medium font-mono uppercase">
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
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#0a3d3d]/10 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(10,61,61,0.08)] py-4">
          <div className="mx-auto flex max-w-[800px] items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full text-white animate-pulse"
                style={{ backgroundColor: config.accent }}
              >
                <Play className="h-4 w-4 fill-white text-white ml-0.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0D2626]">
                  Reprendre : {resumeLesson.title}
                </p>
                <p className="text-[10px] text-[#7A9E9E] font-mono">
                  {resumeLesson.completionPercent > 0 
                    ? `${resumeLesson.completionPercent}% complété` 
                    : `${resumeLesson.estimatedMinutes} min de lecture restante`}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/lessons/${moduleId}/${chapterId}/${resumeLesson.id}`)}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white hover:brightness-105 transition-all shadow-sm cursor-pointer"
              style={{ backgroundColor: config.accent }}
            >
              <span>Reprendre</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
