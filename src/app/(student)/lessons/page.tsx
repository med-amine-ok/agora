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
                        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${config.accent} 0%, ${config.accentLight} 100%)`
                        }}
                      >
                        {config.emoji}
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
                              className="w-[188px] shrink-0 scroll-snap-align-start rounded-[16px] bg-white border border-[#0a3d3d]/8 shadow-[0_2px_8px_rgba(10,61,61,0.05)] overflow-hidden cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_8px_24px_rgba(10,61,61,0.12)] hover:border-[#0e7c7b]/25 transition-all duration-250 flex flex-col justify-between"
                            >
                              {/* Illustration Area */}
                              <div 
                                className="h-[112px] w-full relative flex items-center justify-center overflow-hidden shrink-0"
                                style={{ backgroundColor: config.surfaceColor }}
                              >
                                {/* Central emoji */}
                                <span className="text-[52px] select-none z-10">{config.emoji}</span>
                                
                                {/* Radial Glow */}
                                <div 
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    background: `radial-gradient(circle at 50% 60%, ${config.accent}1A 0%, transparent 70%)`
                                  }}
                                />

                                {/* COMPLETED Badge */}
                                {isCompleted && (
                                  <div className="absolute top-[8px] right-[8px] w-6 h-6 rounded-full bg-[#0E7C7B] flex items-center justify-center shadow-xs">
                                    <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                                  </div>
                                )}

                                {/* NOUVEAU Badge */}
                                {isNew && !isLocked && !isCompleted && (
                                  <div className="absolute top-[8px] left-[8px] bg-[#0E7C7B] text-white text-[10px] font-semibold py-0.5 px-2 rounded-full">
                                    NOUVEAU
                                  </div>
                                )}

                                {/* LOCKED Overlay */}
                                {isLocked && (
                                  <div className="absolute inset-0 bg-[#F5FAFA]/70 flex items-center justify-center z-20">
                                    <Lock className="h-[22px] w-[22px] text-[#7A9E9E]" />
                                  </div>
                                )}
                              </div>

                              {/* Card Body */}
                              <div className="p-[14px] flex-1 flex flex-col justify-between">
                                <div>
                                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] block mb-1" style={{ color: config.accent }}>
                                    Niveau {chapter.level}
                                  </span>
                                  <h3 className="font-sans text-[15px] font-semibold text-[#0D2626] leading-[1.3] line-clamp-2 mb-1">
                                    {chapter.title}
                                  </h3>
                                  <p className="text-[12px] text-[#7A9E9E] leading-[1.4] line-clamp-2 mb-[10px]">
                                    {chapter.description}
                                  </p>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-[3px] w-full bg-[#E0F2F2] rounded-full overflow-hidden mt-auto">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#0E7C7B] to-[#5DC8C6] rounded-full transition-all duration-600 ease-out"
                                    style={{ width: `${isLocked ? 0 : completionPercent}%` }}
                                  />
                                </div>
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

        {/* Autres matières Section (Not Started) */}
        {otherSubjects.length > 0 && (
          <div className="mt-12">
            <div className="h-[1px] w-full bg-gradient-to-r from-[#0a3d3d]/12 to-transparent mb-[40px]" />
            
            <h2 className="font-sans text-[22px] font-semibold text-[#0D2626] mb-[20px]">
              Autres matières
            </h2>

            {/* Slider with muted styles */}
            <div className="relative group/otherSection">
              {/* Left arrow */}
              <button
                onClick={() => handleScroll(otherSliderRef.current, "left")}
                className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-white border border-[#0a3d3d]/12 shadow-[0_2px_8px_rgba(10,61,61,0.10)] text-[#3D5C5C] hover:bg-[#E0F2F2] hover:border-[#0E7C7B] hover:text-[#0A3D3D] hover:shadow-[0_4px_12px_rgba(10,61,61,0.15)] transition-all duration-150 z-10 flex items-center justify-center cursor-pointer md:opacity-0 md:group-hover/otherSection:opacity-100 hidden md:flex"
              >
                <ChevronLeft className="h-[18px] w-[18px]" />
              </button>

              <div
                ref={otherSliderRef}
                className="overflow-x-auto overflow-y-visible scrollbar-none scroll-snap-x-mandatory py-1 px-[2px] pb-[12px]"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex gap-[14px] w-max">
                  {otherSubjects.map((subject, index) => {
                    const config = SUBJECT_CONFIG[subject.id] || {
                      emoji: "📚",
                      surfaceColor: "#EEF4FD",
                      accent: "#7A9E9E",
                      accentLight: "#C8E8E8",
                      level: "FONDAMENTAL"
                    };

                    const firstChapter = MOCK_CHAPTERS.find(c => c.moduleId === subject.id);

                    return (
                      <motion.div
                        key={subject.id}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 16 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => {
                          if (firstChapter) {
                            router.push(`/lessons/${subject.id}/${firstChapter.id}`);
                          }
                        }}
                        className="w-[188px] shrink-0 scroll-snap-align-start rounded-[16px] bg-[#F5FAFA] border border-[#0a3d3d]/6 opacity-85 overflow-hidden cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_8px_24px_rgba(10,61,61,0.12)] hover:border-[#0e7c7b]/25 transition-all duration-250 flex flex-col justify-between"
                      >
                        {/* Illustration Area */}
                        <div className="h-[112px] w-full relative flex items-center justify-center overflow-hidden shrink-0 bg-[#E0F2F2]">
                          <span className="text-[52px] select-none grayscale-[30%]">{config.emoji}</span>
                        </div>

                        {/* Card Body */}
                        <div className="p-[14px] flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] block mb-1" style={{ color: config.accent }}>
                              {config.level}
                            </span>
                            <h3 className="font-sans text-[15px] font-semibold text-[#0D2626] leading-[1.3] line-clamp-2 mb-1">
                              {subject.name}
                            </h3>
                            <p className="text-[12px] text-[#7A9E9E] leading-[1.4] line-clamp-2">
                              {subject.focus}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Plus Card at end of slider */}
                  <div
                    onClick={() => setSearchQuery("")}
                    className="w-[188px] h-full min-h-[220px] rounded-[16px] border-2 border-dashed border-[#0a3d3d]/15 bg-transparent flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0E7C7B] hover:bg-[#0e7c7b]/4 group/plus transition-all duration-150"
                  >
                    <Plus className="h-6 w-6 text-[#7A9E9E] group-hover/plus:text-[#0E7C7B] transition-colors" />
                    <span className="font-sans text-[13px] text-[#7A9E9E] group-hover/plus:text-[#0E7C7B] transition-colors">
                      Explorer les matières
                    </span>
                  </div>
                </div>
              </div>

              {/* Right arrow */}
              <button
                onClick={() => handleScroll(otherSliderRef.current, "right")}
                className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-white border border-[#0a3d3d]/12 shadow-[0_2px_8px_rgba(10,61,61,0.10)] text-[#3D5C5C] hover:bg-[#E0F2F2] hover:border-[#0E7C7B] hover:text-[#0A3D3D] hover:shadow-[0_4px_12px_rgba(10,61,61,0.15)] transition-all duration-150 z-10 flex items-center justify-center cursor-pointer md:opacity-0 md:group-hover/otherSection:opacity-100 hidden md:flex"
              >
                <ChevronRight className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
