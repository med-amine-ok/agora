"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  GraduationCap, 
  Award, 
  Clock, 
  Lock, 
  Check, 
  Play, 
  HelpCircle, 
  Trophy, 
  Sparkles,
  BookOpen,
  ChevronRight,
  Flame,
  Calendar,
  Layers
} from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../mockLessonsData";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = (params?.moduleId as string) || "cardiologie";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);

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

  // Scroll animations for connection line
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled past the top of the container
      const totalHeight = rect.height - windowHeight;
      const scrolled = -rect.top;
      
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5FAFA] pt-24 pb-20 font-sans">
      {/* Subtle glowing mesh backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.06),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(244,143,0,0.04),_transparent_40%)]" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <button
          onClick={() => router.push("/lessons")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark transition-colors font-mono cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> TOUS LES MODULES
        </button>

        {/* Subject Hero Section */}
        <section className="bg-white border border-teal/10 rounded-3xl p-8 md:p-10 shadow-xs flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-teal/10 text-teal px-2.5 py-0.5 rounded-full">
                Spécialité
              </span>
              <span className="text-text-light text-xs font-mono">• {totalLessonsCount} Leçons</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-teal-dark">
              {subject.name}
            </h1>
            <p className="text-sm md:text-base text-text-light leading-relaxed">
              {subject.focus}. Progressez étape par étape à travers le programme officiel du résidanat.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-text-mid font-medium">
                <Clock className="h-4 w-4 text-teal" /> {remainingLessonsCount * 12} min restantes
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-mid font-medium">
                <HelpCircle className="h-4 w-4 text-purple-500" /> {totalLessonsCount} Quizz
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-mid font-medium">
                <span>🃏</span> {totalLessonsCount * 4} Flashcards
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-3 bg-teal/5 border border-teal/10 p-6 rounded-2xl shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-teal-dark">
              <span>Votre Progression</span>
              <span>{subject.progress}%</span>
            </div>
            <div className="h-2 w-full bg-teal/10 rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${subject.progress}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-text-light font-mono">
              <span>{completedLessonsCount} Validées</span>
              <span>{remainingLessonsCount} Restantes</span>
            </div>
            {activeLesson && (
              <button 
                onClick={() => router.push(`/lessons/${moduleId}/${activeLesson.chapterId}/${activeLesson.id}`)}
                className="w-full mt-3 py-2.5 bg-accent hover:bg-accent-light text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Continuer <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Learning Journey Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          
          {/* Timeline of Lessons */}
          <div ref={containerRef} className="relative space-y-12 pl-8 md:pl-12">
            
            {/* SVG Connection Line */}
            <div className="absolute left-[15px] md:left-[23px] top-4 bottom-4 w-1 bg-teal/10 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-teal rounded-full origin-top"
                style={{ height: `${scrollProgress * 100}%` }}
              />
            </div>

            {/* Render chapters & their lessons */}
            {moduleChapters.map((chapter) => {
              const chapterLessons = allLessons.filter(l => l.chapterId === chapter.id);
              
              return (
                <div key={chapter.id} className="space-y-8">
                  {/* Chapter Section Title Node */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[37px] md:-left-[45px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal border-4 border-[#F5FAFA] z-10" />
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal">
                        Niveau {chapter.level} • {chapter.title}
                      </span>
                      <h2 className="font-display text-lg font-bold text-teal-dark">
                        {chapter.description}
                      </h2>
                    </div>
                  </div>

                  {/* Lessons in Chapter */}
                  <div className="space-y-6">
                    {chapterLessons.map((lesson, idx) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isCompleted = lesson.isCompleted;
                      const isLocked = lesson.isLocked && !isActive;
                      
                      // Node style based on format/type
                      let nodeType = "normal";
                      if (idx === chapterLessons.length - 1 && chapter.level === moduleChapters.length) {
                        nodeType = "final";
                      } else if (lesson.title.toLowerCase().includes("quizz") || lesson.title.toLowerCase().includes("qcm")) {
                        nodeType = "quiz";
                      } else if (lesson.title.toLowerCase().includes("flashcards") || lesson.title.toLowerCase().includes("cartes")) {
                        nodeType = "flashcard";
                      }

                      return (
                        <div key={lesson.id} className="relative pl-6">
                          
                          {/* Jalon (Node) Marker */}
                          <div className="absolute -left-[45px] md:-left-[53px] top-2 z-20">
                            {isCompleted ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white border-4 border-[#F5FAFA] shadow-xs">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            ) : isActive ? (
                              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-4 border-accent shadow-md">
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="absolute inset-0 rounded-full border-2 border-accent/40"
                                />
                                <Play className="h-3 w-3 fill-accent text-accent ml-0.5" />
                              </div>
                            ) : isLocked ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-400 border-4 border-[#F5FAFA]">
                                <Lock className="h-3 w-3" />
                              </div>
                            ) : nodeType === "quiz" ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white border-4 border-[#F5FAFA] shadow-xs">
                                <HelpCircle className="h-3.5 w-3.5" />
                              </div>
                            ) : nodeType === "flashcard" ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white border-4 border-[#F5FAFA] shadow-xs">
                                <span className="text-xs">🃏</span>
                              </div>
                            ) : nodeType === "final" ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white border-4 border-[#F5FAFA] shadow-xs">
                                <Trophy className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-teal/30 text-teal border-4 border-[#F5FAFA]">
                                <div className="h-2 w-2 rounded-full bg-teal" />
                              </div>
                            )}
                          </div>

                          {/* Lesson Card Node */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredLessonId(lesson.id)}
                            onMouseLeave={() => setHoveredLessonId(null)}
                          >
                            <Link 
                              href={isLocked ? "#" : `/lessons/${moduleId}/${chapter.id}/${lesson.id}`}
                              className={`block rounded-2xl border bg-white p-5 text-left transition-all ${
                                isLocked 
                                  ? "border-teal/5 opacity-70 cursor-not-allowed" 
                                  : isActive
                                    ? "border-accent shadow-sm hover:scale-[1.01]"
                                    : "border-teal/10 hover:border-teal/20 hover:shadow-xs"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className={`font-display text-base font-bold ${isLocked ? "text-text-light" : "text-teal-dark"}`}>
                                      {lesson.title}
                                    </h3>
                                    {lesson.hasAnatomy && (
                                      <span className="text-xs" title="Modèle 3D d'anatomie inclus">🫀</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] text-text-light font-mono">
                                    <span>{lesson.estimatedMinutes} min</span>
                                    <span>•</span>
                                    <span className="text-teal capitalize">{lesson.tags[0] || "Général"}</span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-3">
                                  {isLocked ? (
                                    <span className="text-[10px] font-bold text-text-light font-mono uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                                      Verrouillé
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="text-[10px] font-bold text-teal font-mono uppercase bg-teal/5 px-2.5 py-0.5 rounded-full">
                                      Validé
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-accent font-mono uppercase bg-accent/5 px-2.5 py-0.5 rounded-full">
                                      Étudier
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
                                  className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-72 bg-white border border-teal/15 rounded-2xl p-5 shadow-lg z-50 text-left space-y-3"
                                >
                                  <h4 className="font-display text-sm font-bold text-teal-dark">
                                    {lesson.title}
                                  </h4>
                                  <div className="h-px bg-teal/10" />
                                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-text-mid">
                                    <div>⏱ Durée : <span className="font-bold">{lesson.estimatedMinutes} min</span></div>
                                    <div>🃏 Cartes : <span className="font-bold">{lesson.flashcardCount}</span></div>
                                    <div>❓ Quizz : <span className="font-bold">{lesson.questionCount}</span></div>
                                    <div>📑 Sections : <span className="font-bold">{lesson.sectionCount}</span></div>
                                  </div>
                                  {!isLocked && (
                                    <button 
                                      onClick={() => router.push(`/lessons/${moduleId}/${chapter.id}/${lesson.id}`)}
                                      className="w-full mt-2 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

          {/* Sticky Sidebar */}
          <aside className="sticky top-24 hidden lg:block space-y-6">
            <div className="bg-white border border-teal/10 rounded-3xl p-6 shadow-xs space-y-6 text-left">
              <h3 className="font-display text-base font-bold text-teal-dark">
                Objectifs & Statistiques
              </h3>
              
              <div className="space-y-4">
                {/* Today's Goal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-text-dark">
                    <span>Objectif du Jour</span>
                    <span className="text-teal font-mono">1 / 2 leçons</span>
                  </div>
                  <div className="h-2 w-full bg-teal/5 rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-2xl border border-accent/10">
                  <Flame className="h-6 w-6 text-accent fill-accent animate-bounce" />
                  <div>
                    <h4 className="text-xs font-bold text-teal-dark">14 jours de streak</h4>
                    <p className="text-[10px] text-text-light">Continuez sur votre lancée !</p>
                  </div>
                </div>

                {/* Weekly Time */}
                <div className="flex items-center gap-3 p-3 bg-teal/5 rounded-2xl border border-teal/10">
                  <Calendar className="h-5 w-5 text-teal" />
                  <div>
                    <h4 className="text-xs font-bold text-teal-dark">4h 25m d'étude</h4>
                    <p className="text-[10px] text-text-light">Cette semaine</p>
                  </div>
                </div>
              </div>

              {activeLesson && (
                <button
                  onClick={() => router.push(`/lessons/${moduleId}/${activeLesson.chapterId}/${activeLesson.id}`)}
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Reprendre la leçon <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </aside>

        </div>

      </main>
    </div>
  );
}
