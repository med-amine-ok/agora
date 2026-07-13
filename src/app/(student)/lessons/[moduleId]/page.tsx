"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  Lock, 
  Check, 
  Play, 
  HelpCircle, 
  Trophy,
  ChevronRight,
  Flame,
  Calendar,
  Layers,
  BookOpen
} from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../mockLessonsData";
import { SUBJECT_CONFIG } from "@/lib/config/subjects";
import QuickQCMChip from "@/components/lessons/QuickQCMChip";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.moduleId as string) || "cardiologie";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);
  const config = useMemo(() => SUBJECT_CONFIG[moduleId] || SUBJECT_CONFIG.cardiologie, [moduleId]);

  // Filter chapters belonging to this module
  const moduleChapters = useMemo(() => {
    return MOCK_CHAPTERS.filter((c) => c.moduleId === moduleId);
  }, [moduleId]);

  // Get all lessons belonging to this module in order
  const allLessons = useMemo(() => {
    const chapterIds = moduleChapters.map(c => c.id);
    return MOCK_LESSON_LIST.filter(l => chapterIds.includes(l.chapterId));
  }, [moduleChapters]);

  const completedLessonsCount = allLessons.filter(l => l.isCompleted).length;
  const totalLessonsCount = allLessons.length;
  const remainingLessonsCount = totalLessonsCount - completedLessonsCount;

  // Find the current active lesson (first uncompleted and not locked, or first lesson if none)
  const activeLesson = useMemo(() => {
    return allLessons.find(l => !l.isCompleted && !l.isLocked) || allLessons[0];
  }, [allLessons]);

  // State for hover previews
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-[#F5FAFA] pt-[56px] pb-24 font-sans text-[#0D2626]">
      {/* Decorative background gradient reflecting subject's theme */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.06] z-0" 
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${config.accent}, transparent 45%), radial-gradient(circle at bottom right, #5DC8C6, transparent 45%)`
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1100px] px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="pt-6">
          <button
            onClick={() => router.push("/lessons")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7C7B] hover:text-[#0A3D3D] transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> TOUS LES MODULES
          </button>
        </div>

        {/* Grid Layout (Page 2 spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-[40px] pt-8 items-start">
          
          {/* LEFT COLUMN: Sticky Subject Info Card */}
          <aside className="lg:sticky lg:top-[80px] space-y-6">
            <div className="bg-white border border-[#0a3d3d]/8 rounded-[24px] p-6 shadow-[0_2px_12px_rgba(10,61,61,0.04)] text-left flex flex-col justify-between">
              <div>
                {/* stylized header */}
                <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: config.accent }}>
                  {config.level}
                </span>
                
                <h1 className="font-display text-[30px] font-semibold text-[#0D2626] leading-tight mt-1 mb-2">
                  {subject.name}
                </h1>
                
                <p className="text-[13px] text-[#7A9E9E] leading-[1.5] mb-6">
                  {subject.focus}
                </p>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-[#0a3d3d]/6 py-4 mb-6">
                  <div className="text-center">
                    <span className="block text-[15px] font-bold text-[#0D2626] font-mono">{totalLessonsCount}</span>
                    <span className="text-[10px] text-[#7A9E9E] font-medium uppercase tracking-[0.02em]">Leçons</span>
                  </div>
                  <div className="text-center border-l border-r border-[#0a3d3d]/6">
                    <span className="block text-[15px] font-bold text-[#0D2626] font-mono">{totalLessonsCount * 3}</span>
                    <span className="text-[10px] text-[#7A9E9E] font-medium uppercase tracking-[0.02em]">Exer.</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[15px] font-bold text-[#0D2626] font-mono">{totalLessonsCount * 4}</span>
                    <span className="text-[10px] text-[#7A9E9E] font-medium uppercase tracking-[0.02em]">Cards</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[12px] font-bold text-[#0D2626]">
                    <span>Progression</span>
                    <span className="font-mono">{subject.progress}%</span>
                  </div>
                  <div className="h-[6px] w-full bg-[#E0F2F2] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r rounded-full transition-all duration-600" 
                      style={{ 
                        width: `${subject.progress}%`,
                        backgroundImage: `linear-gradient(to right, ${config.accent}, ${config.accentLight})`
                      }} 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#7A9E9E] font-mono">
                    <span>{completedLessonsCount} Validées</span>
                    <span>{remainingLessonsCount} Restantes</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {activeLesson && (
                <button
                  onClick={() => router.push(`/lessons/${moduleId}/${activeLesson.chapterId}/${activeLesson.id}`)}
                  className="w-full py-[12px] text-white text-xs font-bold rounded-[14px] transition-all shadow-[0_4px_12px_rgba(14,124,123,0.15)] flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105 active:scale-[0.98]"
                  style={{ backgroundColor: config.accent }}
                >
                  Reprendre <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Streak & Time summary cards */}
            <div className="bg-white border border-[#0a3d3d]/8 rounded-[24px] p-5 shadow-[0_2px_12px_rgba(10,61,61,0.04)] space-y-4 text-left">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-[#E8593C] fill-[#E8593C] animate-bounce" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#0D2626]">14 jours de streak</h4>
                  <p className="text-[11px] text-[#7A9E9E]">Continuez sur votre lancée !</p>
                </div>
              </div>
              <div className="h-[1px] bg-[#0a3d3d]/6" />
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#0E7C7B]" />
                <div>
                  <h4 className="text-[13px] font-bold text-[#0D2626]">4h 25m d'étude</h4>
                  <p className="text-[11px] text-[#7A9E9E]">Cette semaine</p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Vertical Lesson Node Path */}
          <div className="relative pl-[36px] md:pl-[48px] space-y-12">
            
            {/* Central Vertical Connecting Line */}
            <div className="absolute left-[15px] md:left-[21px] top-4 bottom-4 w-[3px] bg-[#C8E8E8] rounded-full" />

            {moduleChapters.map((chapter) => {
              const chapterLessons = allLessons.filter(l => l.chapterId === chapter.id);
              
              return (
                <div key={chapter.id} className="space-y-6">
                  
                  {/* Chapter Section title node */}
                  <div className="relative pl-4 text-left">
                    <div className="absolute -left-[30px] md:-left-[36px] top-1.5 flex h-[13px] w-[13px] items-center justify-center rounded-full bg-white border-2 border-[#0E7C7B] z-10" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ color: config.accent }}>
                      Niveau {chapter.level} • {chapter.title}
                    </span>
                    <h2 className="font-display text-[18px] font-bold text-[#0D2626] mt-[2px]">
                      {chapter.description}
                    </h2>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-4">
                    {chapterLessons.map((lesson, index) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isCompleted = lesson.isCompleted;
                      const isLocked = lesson.isLocked && !isActive;

                      return (
                        <div key={lesson.id} className="relative pl-4">
                          
                          {/* Circular Node */}
                          <div className="absolute -left-[38px] md:-left-[44px] top-1/2 -translate-y-1/2 z-20">
                            {isCompleted ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0E7C7B] text-white border-4 border-[#F5FAFA] shadow-xs">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            ) : isActive ? (
                              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 shadow-sm" style={{ borderColor: config.accent }}>
                                <Play className="h-2.5 w-2.5 ml-0.5" style={{ fill: config.accent, color: config.accent }} />
                              </div>
                            ) : isLocked ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E0F2F2] text-[#7A9E9E] border-4 border-[#F5FAFA]">
                                <Lock className="h-2.5 w-2.5" />
                              </div>
                            ) : (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-[#C8E8E8] border-4 border-[#F5FAFA]">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#7A9E9E]" />
                              </div>
                            )}
                          </div>

                          {/* Lesson Card */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredLessonId(lesson.id)}
                            onMouseLeave={() => setHoveredLessonId(null)}
                          >
                            <Link
                              href={isLocked ? "#" : `/lessons/${moduleId}/${chapter.id}/${lesson.id}`}
                              className={`block rounded-[16px] border bg-white p-4 text-left transition-all duration-200 ${
                                isLocked 
                                  ? "border-[#0a3d3d]/5 opacity-65 cursor-not-allowed" 
                                  : isActive
                                    ? "shadow-sm hover:scale-[1.01]"
                                    : "border-[#0a3d3d]/8 hover:border-[#0e7c7b]/20 hover:shadow-xs"
                              }`}
                              style={{
                                borderColor: isActive ? config.accent : undefined
                              }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className={`font-sans text-[15px] font-semibold ${isLocked ? "text-[#7A9E9E]" : "text-[#0D2626]"}`}>
                                      {lesson.title}
                                    </h3>
                                    {lesson.hasAnatomy && (
                                      <span className="text-xs" title="Modèle 3D d'anatomie inclus">🫀</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] text-[#7A9E9E] font-mono">
                                    <span>{lesson.estimatedMinutes} min</span>
                                    <span>•</span>
                                    <span style={{ color: config.accent }}>{lesson.tags[1] || "Général"}</span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                  {/* QCM / Cards quick chips */}
                                  {lesson.questionCount > 0 && !isLocked && (
                                    <QuickQCMChip
                                      chapterId={chapter.id}
                                      lessonId={lesson.id}
                                      questionCount={lesson.questionCount}
                                    />
                                  )}
                                  {lesson.flashcardCount > 0 && !isLocked && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E0F2F2] border border-[#0a3d3d]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0E7C7B]">
                                      <span>🃏</span> {lesson.flashcardCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>

                            {/* Floating Preview Card on Hover */}
                            <AnimatePresence>
                              {hoveredLessonId === lesson.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                  className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-72 bg-white border border-[#0a3d3d]/12 rounded-[20px] p-5 shadow-[0_12px_32px_rgba(10,61,61,0.15)] z-50 text-left space-y-3"
                                >
                                  <h4 className="font-display text-sm font-bold text-[#0D2626]">
                                    {lesson.title}
                                  </h4>
                                  <div className="h-[1px] bg-[#0a3d3d]/8" />
                                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#7A9E9E]">
                                    <div>⏱ Durée : <span className="font-bold text-[#0D2626]">{lesson.estimatedMinutes} min</span></div>
                                    <div>🃏 Cards : <span className="font-bold text-[#0D2626]">{lesson.flashcardCount}</span></div>
                                    <div>❓ Quizz : <span className="font-bold text-[#0D2626]">{lesson.questionCount}</span></div>
                                    <div>📑 Sections : <span className="font-bold text-[#0D2626]">{lesson.sectionCount}</span></div>
                                  </div>
                                  {!isLocked && (
                                    <button 
                                      onClick={() => router.push(`/lessons/${moduleId}/${chapter.id}/${lesson.id}`)}
                                      className="w-full mt-2 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-105"
                                      style={{ backgroundColor: config.accent }}
                                    >
                                      Commencer <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </main>

      {/* Sticky Bottom Resume Bar */}
      {activeLesson && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#0a3d3d]/10 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(10,61,61,0.08)] py-4">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full text-white animate-pulse"
                style={{ backgroundColor: config.accent }}
              >
                <Play className="h-4 w-4 fill-white text-white ml-0.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0D2626]">
                  Reprendre : {activeLesson.title}
                </p>
                <p className="text-[10px] text-[#7A9E9E] font-mono">
                  Module : {subject.name} • {activeLesson.estimatedMinutes} min restantes
                </p>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/lessons/${moduleId}/${activeLesson.chapterId}/${activeLesson.id}`)}
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
