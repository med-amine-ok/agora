"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Lock, 
  Plus,
  ArrowLeft
} from "lucide-react";
import { LESSONS_DATA, MOCK_CHAPTERS } from "./mockLessonsData";
import { SUBJECT_CONFIG } from "@/lib/config/subjects";
import CourseIllustration from "@/components/illustrations/CourseIllustrations";

export default function LessonsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["cardiologie"]);

  // Refs for horizontal scroll containers
  const startedRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const otherSliderRef = useRef<HTMLDivElement | null>(null);

  const toggleFavorite = (subjectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId) 
        : [...prev, subjectId]
    );
  };

  const filteredSubjects = useMemo(() => {
    return LESSONS_DATA.filter((subject) => {
      const config = SUBJECT_CONFIG[subject.id];
      const nameMatch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
      const focusMatch = subject.focus.toLowerCase().includes(searchQuery.toLowerCase());
      const levelMatch = config?.level.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return nameMatch || focusMatch || levelMatch;
    });
  }, [searchQuery]);

  const startedSubjects = useMemo(() => {
    return filteredSubjects.filter(s => s.progress > 0);
  }, [filteredSubjects]);

  const otherSubjects = useMemo(() => {
    return filteredSubjects.filter(s => s.progress === 0);
  }, [filteredSubjects]);

  const handleScroll = (element: HTMLDivElement | null, direction: "left" | "right") => {
    if (element) {
      const cardWidth = 188;
      const gap = 14;
      const scrollAmount = (cardWidth + gap) * 2;
      element.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5FAFA] pt-[56px] pb-24 font-sans text-[#0D2626]">
      {/* Centered wrapper matching layout guidelines */}
      <main className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
        
        {/* Navigation back button */}
        <div className="pt-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7C7B] hover:text-[#0A3D3D] transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
          </button>
        </div>

        {/* Page Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pt-[48px] pb-[16px]">
          <div>
            <h1 className="font-display text-[38px] font-semibold text-[#0D2626] leading-tight">
              Parcours d'apprentissage
            </h1>
            <p className="text-base text-[#7A9E9E] mt-1.5">
              Progressez étape par étape vers la maîtrise.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A9E9E]" />
            <input
              type="text"
              placeholder="Que souhaitez-vous apprendre ?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#0a3d3d]/12 rounded-full py-[10px] pl-[40px] pr-[18px] text-[14px] text-[#0D2626] placeholder-[#7A9E9E] transition-all focus:border-[#0E7C7B] focus:ring-[3px] focus:ring-[#0E7C7B]/10 focus:outline-none"
            />
          </div>
        </header>

        {/* Vos matières (Started Subjects) */}
        {startedSubjects.length > 0 && (
          <div className="mt-8">
            {startedSubjects.map((subject) => {
              const config = SUBJECT_CONFIG[subject.id] || {
                emoji: "📚",
                surfaceColor: "#EEF4FD",
                accent: "#0E7C7B",
                accentLight: "#5DC8C6",
                level: "FONDAMENTAL"
              };

              const subjectChapters = MOCK_CHAPTERS.filter(c => c.moduleId === subject.id);
              const progressRingCircumference = 2 * Math.PI * 10; // r=10 => ~62.83

              return (
                <section key={subject.id} className="mb-[56px] relative group/section">
                  
                  {/* Section Header */}
                  <div className="flex items-center justify-between pb-[16px] mb-[20px] border-b border-[#0a3d3d]/8">
                    <div 
                      onClick={() => router.push(`/lessons/${subject.id}`)}
                      className="flex items-center gap-[16px] cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {/* Icon Box */}
                      <div 
                        className={`w-[62px] h-[62px]  flex items-center justify-center shrink-0 overflow-hidden ${subject.imageUrl ? "p-2" : "p-2.5"}`}
                       
                      >
                        {subject.imageUrl ? (
                          <img 
                            src={subject.imageUrl} 
                            alt={subject.name} 
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div style={{ display: subject.imageUrl ? 'none' : 'block' }} className="w-full h-full">
                          <CourseIllustration subjectId={subject.id} color="#FFFFFF" accent={config.accentLight} className="w-full h-full text-white" />
                        </div>
                      </div>

                      {/* Text Group */}
                      <div className="ml-1">
                        <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: config.accent }}>
                          {config.level}
                        </span>
                        <h2 className="font-display text-[22px] font-semibold text-[#0D2626] mt-[2px]">
                          {subject.name}
                        </h2>
                        <p className="text-[13px] text-[#7A9E9E] mt-[2px]">
                          {subject.focus}
                        </p>
                      </div>
                    </div>

                    {/* Right side stats/actions */}
                    <div className="flex items-center gap-[12px]">
                      {/* Progress Chip */}
                      <div className="flex items-center gap-[8px] py-[6px] px-[14px] bg-[#E0F2F2] border border-[#0a3d3d]/8 rounded-full">
                        <svg className="w-6 h-6 -rotate-90">
                          <circle cx="12" cy="12" r="10" stroke="rgba(14,124,123,0.15)" strokeWidth="2.5" fill="transparent" />
                          <motion.circle 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="#0E7C7B" 
                            strokeWidth="2.5" 
                            fill="transparent" 
                            strokeDasharray={progressRingCircumference}
                            initial={{ strokeDashoffset: progressRingCircumference }}
                            animate={{ strokeDashoffset: progressRingCircumference * (1 - subject.progress / 100) }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </svg>
                        <span className="font-mono text-[13px] font-medium text-[#0D2626]">
                          {subject.progress}% complété
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(subject.id, e)}
                        className="text-[#C8E8E8] hover:scale-[1.15] transition-all duration-200 cursor-pointer"
                      >
                        <Star 
                          className="h-[20px] w-[20px] transition-colors" 
                          fill={favorites.includes(subject.id) ? "#E8A838" : "none"}
                          stroke={favorites.includes(subject.id) ? "#E8A838" : "currentColor"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Module Slider Wrapper */}
                  <div className="relative">
                    {/* Left arrow */}
                    <button
                      onClick={() => handleScroll(startedRefs.current[subject.id], "left")}
                      className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-white border border-[#0a3d3d]/12 shadow-[0_2px_8px_rgba(10,61,61,0.10)] text-[#3D5C5C] hover:bg-[#E0F2F2] hover:border-[#0E7C7B] hover:text-[#0A3D3D] hover:shadow-[0_4px_12px_rgba(10,61,61,0.15)] transition-all duration-150 z-10 flex items-center justify-center cursor-pointer md:opacity-0 md:group-hover/section:opacity-100 hidden md:flex"
                    >
                      <ChevronLeft className="h-[18px] w-[18px]" />
                    </button>

                    {/* Scroll Container */}
                    <div
                      ref={(el) => { startedRefs.current[subject.id] = el; }}
                      className="overflow-x-auto overflow-y-visible scrollbar-none scroll-snap-x-mandatory py-1 px-[2px] pb-[12px]"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      <div className="flex gap-[14px] w-max">
                        {subjectChapters.map((chapter, index) => {
                          const isNew = chapter.isNew;
                          const isLocked = chapter.isLocked;
                          const isCompleted = chapter.completedLessons === chapter.lessonCount;
                          const completionPercent = Math.min(100, Math.round((chapter.completedLessons / chapter.lessonCount) * 100));

                          return (
                            <motion.div
                              key={chapter.id}
                              whileInView={{ opacity: 1, y: 0 }}
                              initial={{ opacity: 0, y: 16 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              onClick={() => {
                                if (!isLocked) {
                                  router.push(`/lessons/${subject.id}/${chapter.id}`);
                                }
                              }}
                              className="w-[188px] shrink-0 scroll-snap-align-start flex flex-col items-center gap-3 cursor-pointer group"
                            >
                              {/* The Card Box (Illustration only) */}
                              <div className="w-[188px] h-[188px] rounded-[32px] bg-[#F5FAFA] border border-[#0a3d3d]/8 shadow-[0_4px_20px_rgba(10,61,61,0.05)] relative flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_30px_rgba(10,61,61,0.12)] group-hover:border-[#0E7C7B]/30">
                                
                                {/* Radial Glow */}
                                <div 
                                  className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[#0E7C7B]/5 via-transparent to-[#E0F2F2]/10"
                                />

                                {/* Illustration */}
                                {chapter.imageUrl ? (
                                  <img 
                                    src={chapter.imageUrl} 
                                    alt={chapter.title} 
                                    className="w-[110px] h-[110px] object-contain z-10 transition-transform duration-300 group-hover:scale-105" 
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (nextSibling) {
                                        nextSibling.style.display = 'block';
                                      }
                                    }}
                                  />
                                ) : null}
                                <div style={{ display: chapter.imageUrl ? 'none' : 'block' }} className="z-10 transition-transform duration-300 group-hover:scale-105">
                                  <CourseIllustration subjectId={subject.id} color={config.accent} accent={config.accentLight} className="w-[84px] h-[84px]" />
                                </div>

                                {/* COMPLETED Badge */}
                                {isCompleted && (
                                  <div className="absolute top-[12px] right-[12px] w-7 h-7 rounded-full bg-[#0E7C7B] flex items-center justify-center shadow-md border border-white/10 z-20">
                                    <Check className="h-4 w-4 text-white stroke-[3]" />
                                  </div>
                                )}

                                {/* NOUVEAU Badge */}
                                {isNew && !isLocked && !isCompleted && (
                                  <div className="absolute top-[12px] left-[12px] bg-[#0E7C7B] text-white text-[9px] font-bold py-0.5 px-2.5 rounded-full tracking-wide shadow-sm z-20">
                                    NOUVEAU
                                  </div>
                                )}

                                {/* LOCKED Overlay */}
                                {isLocked && (
                                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20">
                                    <Lock className="h-7 w-7 text-[#7A9E9E]" />
                                  </div>
                                )}

                                {/* Progress Bar at the bottom of the card */}
                                {!isLocked && (
                                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/5 overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-[#0E7C7B] to-[#5DC8C6] transition-all duration-600 ease-out"
                                      style={{ width: `${completionPercent}%` }}
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Card Text below */}
                              <div className="text-center px-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.1em] block mb-0.5" style={{ color: config.accent }}>
                                  Niveau {chapter.level}
                                </span>
                                <h3 className="font-sans text-[14px] font-semibold text-[#0D2626] leading-snug line-clamp-1 group-hover:text-[#0E7C7B] transition-colors">
                                  {chapter.title}
                                </h3>
                                <p className="text-[11px] text-[#7A9E9E] line-clamp-1 mt-0.5 max-w-[170px] mx-auto">
                                  {chapter.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right arrow */}
                    <button
                      onClick={() => handleScroll(startedRefs.current[subject.id], "right")}
                      className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-white border border-[#0a3d3d]/12 shadow-[0_2px_8px_rgba(10,61,61,0.10)] text-[#3D5C5C] hover:bg-[#E0F2F2] hover:border-[#0E7C7B] hover:text-[#0A3D3D] hover:shadow-[0_4px_12px_rgba(10,61,61,0.15)] transition-all duration-150 z-10 flex items-center justify-center cursor-pointer md:opacity-0 md:group-hover/section:opacity-100 hidden md:flex"
                    >
                      <ChevronRight className="h-[18px] w-[18px]" />
                    </button>
                  </div>

                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
