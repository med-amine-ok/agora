"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Info,
  Check,
  X,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../../../mockLessonsData";
import { SUBJECT_CONFIG } from "@/lib/config/subjects";
import LessonEndActions from "@/components/lessons/LessonEndActions";

// Initial default fallback region
const DEFAULT_REGION = { id: "default", name: "Structure", desc: "Cliquez sur une zone pour en savoir plus.", color: "#7A9E9E" };

export default function LessonReaderPage() {
  const params = useParams();
  const router = useRouter();

  const moduleId = (params?.moduleId as string) || "cardiologie";
  const chapterId = (params?.chapterId as string) || "c1";
  const lessonId = (params?.lessonId as string) || "l1";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);
  const config = useMemo(() => SUBJECT_CONFIG[moduleId] || SUBJECT_CONFIG.cardiologie, [moduleId]);

  const chapter = useMemo(() => {
    return MOCK_CHAPTERS.find((c) => c.id === chapterId) || MOCK_CHAPTERS[0];
  }, [chapterId]);

  const chapterLessons = useMemo(() => {
    return MOCK_LESSON_LIST.filter((l) => l.chapterId === chapterId);
  }, [chapterId]);

  const currentLessonIndex = useMemo(() => {
    return chapterLessons.findIndex((l) => l.id === lessonId);
  }, [chapterLessons, lessonId]);

  const lesson = useMemo(() => {
    return chapterLessons[currentLessonIndex] || chapterLessons[0] || MOCK_LESSON_LIST[0];
  }, [chapterLessons, currentLessonIndex]);

  const sections = useMemo(() => {
    return lesson?.sections || [
      { title: "1. Contenu", content: "Contenu de la leçon en cours de préparation..." }
    ];
  }, [lesson]);

  const checkpoints = useMemo(() => {
    return lesson?.checkpoints || [];
  }, [lesson]);

  const regions = useMemo(() => {
    return lesson?.anatomyData?.regions || [];
  }, [lesson]);

  // Section Tracking State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted ?? false);
  const [selectedRegion, setSelectedRegion] = useState<any>(DEFAULT_REGION);

  // Initialize selectedRegion when regions change
  React.useEffect(() => {
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
    } else {
      setSelectedRegion(DEFAULT_REGION);
    }
  }, [regions]);

  // Interactive Checkpoint States
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, number>>({});
  const [checkpointPoints, setCheckpointPoints] = useState<Record<number, { x: number; y: number } | null>>({});
  const [checkpointParticles, setCheckpointParticles] = useState<Record<number, boolean>>({});

  // Find next lesson for CTA
  const nextLesson = useMemo(() => {
    if (currentLessonIndex !== -1 && currentLessonIndex < chapterLessons.length - 1) {
      return chapterLessons[currentLessonIndex + 1];
    }
    return undefined;
  }, [chapterLessons, currentLessonIndex]);

  const handleCheckpointSelect = (sectionIndex: number, optionIndex: number, isCorrect: boolean, e: React.MouseEvent) => {
    if (checkpointAnswers[sectionIndex] !== undefined) return; // Already answered

    setCheckpointAnswers(prev => ({ ...prev, [sectionIndex]: optionIndex }));

    if (isCorrect) {
      // Trigger floating +1 animation
      const rect = e.currentTarget.getBoundingClientRect();
      setCheckpointPoints(prev => ({
        ...prev,
        [sectionIndex]: { x: rect.left + rect.width / 2, y: rect.top }
      }));

      // Trigger particle burst
      setCheckpointParticles(prev => ({ ...prev, [sectionIndex]: true }));

      // Clean animation timers
      setTimeout(() => {
        setCheckpointPoints(prev => ({ ...prev, [sectionIndex]: null }));
      }, 900);

      setTimeout(() => {
        setCheckpointParticles(prev => ({ ...prev, [sectionIndex]: false }));
      }, 600);
    }
  };

  const handleMarkAsCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // Custom heart rendering helper for the AnatomyViewer
  const renderHeartSVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full max-w-[280px] h-auto drop-shadow-md select-none">
        <path d="M100 20 C60 10 20 50 20 100 C20 150 70 190 100 210 C130 190 180 150 180 100 C180 50 140 10 100 20 Z" fill="#FADBD8" className="transition-all duration-300" />
        
        {/* Aorte */}
        <path 
          d="M80 60 C80 30 120 30 120 60 L120 90 L80 90 Z" 
          fill={selectedRegion.id === "aorte" ? config.accent : config.accentLight} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "aorte") || selectedRegion)}
        />
        
        {/* Oreillette Droite */}
        <path 
          d="M40 80 C40 60 70 60 70 80 L70 120 L40 120 Z" 
          fill={selectedRegion.id === "od" ? "#3498DB" : "#85C1E9"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "od") || selectedRegion)}
        />
        
        {/* Ventricule Gauche */}
        <path 
          d="M100 120 L160 120 C160 150 130 180 100 195 Z" 
          fill={selectedRegion.id === "vg" ? config.accent : config.accentLight} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "vg") || selectedRegion)}
        />
        
        {/* Ventricule Droit */}
        <path 
          d="M40 120 L100 120 L100 195 C70 180 40 150 40 120 Z" 
          fill={selectedRegion.id === "vd" ? "#2980B9" : "#5DADE2"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "vd") || selectedRegion)}
        />

        <circle cx="100" cy="50" r="4" fill="white" className="pointer-events-none" />
        <circle cx="55" cy="95" r="4" fill="white" className="pointer-events-none" />
        <circle cx="130" cy="145" r="4" fill="white" className="pointer-events-none" />
        <circle cx="70" cy="145" r="4" fill="white" className="pointer-events-none" />
      </svg>
    );
  };

  const renderBrainSVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full max-w-[280px] h-auto drop-shadow-md select-none">
        {/* Cortex */}
        <path 
          d="M100 30 C50 30 30 70 30 110 C30 140 50 160 80 160 C90 160 100 150 100 140 C100 150 110 160 120 160 C150 160 170 140 170 110 C170 70 150 30 100 30 Z" 
          fill={selectedRegion.id === "cortex" ? "#8E44AD" : "#D7BDE2"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "cortex") || selectedRegion)}
        />
        {/* Cervelet */}
        <path 
          d="M60 160 C40 160 40 190 70 190 C90 190 100 175 100 160 Z" 
          fill={selectedRegion.id === "cervelet" ? "#9B59B6" : "#E8DAEF"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "cervelet") || selectedRegion)}
        />
        {/* Thalamus */}
        <ellipse 
          cx="100" cy="110" rx="25" ry="20"
          fill={selectedRegion.id === "thalamus" ? "#E8DAEF" : "#FDF2E9"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "thalamus") || selectedRegion)}
        />
        {/* Tronc cérébral */}
        <path 
          d="M90 140 L110 140 L115 200 L85 200 Z" 
          fill={selectedRegion.id === "tronc" ? "#D2B4DE" : "#EBDEF0"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "tronc") || selectedRegion)}
        />
      </svg>
    );
  };

  const renderKidneySVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full max-w-[280px] h-auto drop-shadow-md select-none">
        {/* Silhouette Kidney */}
        <path 
          d="M100 20 C150 20 170 60 170 110 C170 160 150 200 100 200 C80 200 85 160 85 110 C85 60 80 20 100 20 Z" 
          fill={selectedRegion.id === "glome" ? "#1ABC9C" : "#A2D9CE"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "glome") || selectedRegion)}
        />
        {/* Tubules/Medulla area */}
        <path 
          d="M100 50 C130 50 140 70 140 110 C140 150 130 170 100 170 C95 170 95 150 95 110 C95 70 95 50 100 50 Z" 
          fill={selectedRegion.id === "tubule" ? "#16A085" : "#76D7C4"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "tubule") || selectedRegion)}
        />
        {/* Calices */}
        <path 
          d="M95 80 L115 90 L115 130 L95 140 Z" 
          fill={selectedRegion.id === "calice" ? "#76D7C4" : "#E8F8F5"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "calice") || selectedRegion)}
        />
        {/* Bassinet */}
        <path 
          d="M85 100 L100 110 L85 130 Z" 
          fill={selectedRegion.id === "bassinet" ? "#A2D9CE" : "#E8F8F5"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "bassinet") || selectedRegion)}
        />
      </svg>
    );
  };

  const renderCellSVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full max-w-[280px] h-auto drop-shadow-md select-none">
        {/* Cell membrane */}
        <circle 
          cx="100" cy="110" r="80" 
          fill={selectedRegion.id === "membrane" ? "#5DADE2" : "#EBF5FB"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-[#2980B9] stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "membrane") || selectedRegion)}
        />
        {/* Cytoplasm */}
        <circle 
          cx="100" cy="110" r="70" 
          fill={selectedRegion.id === "cyto" ? "#AED6F1" : "#F2F8FD"} 
          className="cursor-pointer hover:brightness-105 transition-all"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "cyto") || selectedRegion)}
        />
        {/* Nucleus */}
        <circle 
          cx="100" cy="110" r="30" 
          fill={selectedRegion.id === "noyau" ? "#2980B9" : "#D4E6F1"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "noyau") || selectedRegion)}
        />
        {/* Mitochondria */}
        <ellipse 
          cx="60" cy="80" rx="15" ry="8" transform="rotate(30, 60, 80)"
          fill={selectedRegion.id === "mito" ? "#3498DB" : "#A9CCE3"} 
          className="cursor-pointer hover:brightness-105 transition-all stroke-white stroke-[1]"
          onClick={() => setSelectedRegion(regions.find(r => r.id === "mito") || selectedRegion)}
        />
      </svg>
    );
  };

  const renderAnatomySVG = () => {
    const type = lesson?.anatomyData?.type;
    if (type === "heart") return renderHeartSVG();
    if (type === "brain") return renderBrainSVG();
    if (type === "kidney") return renderKidneySVG();
    if (type === "cell") return renderCellSVG();
    return null;
  };

  const checkpointForSection = useMemo(() => {
    return checkpoints.find(c => c.sectionIndex === currentSectionIndex);
  }, [checkpoints, currentSectionIndex]);

  return (
    <div className="relative min-h-screen bg-[#F5FAFA] pt-[56px] pb-28 font-sans text-[#0D2626] text-left">
      
      {/* Sticky Progress Bar under Topbar */}
      <div className="sticky top-[56px] left-0 right-0 z-30 bg-white border-b border-[#0a3d3d]/8 py-3">
        <div className="mx-auto max-w-[800px] px-4 md:px-6 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-[#7A9E9E]">SECTION</span>
          
          {/* Section Dots Progress bar */}
          <div className="flex items-center gap-[8px]">
            {sections.map((_, idx) => {
              const isPast = idx < currentSectionIndex;
              const isCurr = idx === currentSectionIndex;

              return (
                <div 
                  key={idx} 
                  onClick={() => setCurrentSectionIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isPast 
                      ? "w-6 bg-[#0E7C7B]" 
                      : isCurr
                        ? "w-8" 
                        : "w-2.5 bg-[#C8E8E8]"
                  }`}
                  style={{
                    backgroundColor: isCurr ? config.accent : undefined
                  }}
                />
              );
            })}
          </div>

          <span className="text-[11px] font-mono font-bold text-[#0D2626]">{currentSectionIndex + 1} / {sections.length}</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[800px] px-4 md:px-6 mt-8">
        
        {/* Navigation Breadcrumb */}
        <section className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#7A9E9E]">
            <Link href="/lessons" className="hover:text-[#0E7C7B]">Hub</Link>
            <span>/</span>
            <Link href={`/lessons/${subject.id}`} className="hover:text-[#0E7C7B]">{subject.name}</Link>
            <span>/</span>
            <Link href={`/lessons/${subject.id}/${chapterId}`} className="hover:text-[#0E7C7B] truncate max-w-[150px]">{chapter.title}</Link>
            <span>/</span>
            <span className="text-[#0E7C7B] truncate max-w-[150px] font-bold">{lesson.title}</span>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#0a3d3d]/10 pb-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-[#E0F2F2] text-[#0E7C7B] border border-[#0a3d3d]/8">
                <BookOpen className="h-3.5 w-3.5" /> Leçon {currentLessonIndex + 1} / {chapterLessons.length}
              </span>
              <h1 className="font-display text-3xl font-bold leading-tight text-[#0D2626] sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="text-xs text-[#7A9E9E] font-mono">
                Chapitre : {chapter.title} • Niveau {chapter.level}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1.5 rounded-full border border-[#0a3d3d]/8 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0D2626] shadow-xs">
                <Clock className="h-4 w-4 text-[#0E7C7B]" /> {lesson.estimatedMinutes} min
              </div>
              <button
                onClick={handleMarkAsCompleted}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  isCompleted 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                    : "border-[#0a3d3d]/8 bg-white text-[#7A9E9E] hover:border-[#0E7C7B] hover:text-[#0E7C7B]"
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-emerald-600" : "text-[#7A9E9E]"}`} />
                {isCompleted ? "Validée" : "Valider"}
              </button>
            </div>
          </div>
        </section>

        {/* Content Body Card */}
        <section className="bg-white rounded-[24px] border border-[#0a3d3d]/8 p-6 md:p-8 shadow-[0_2px_12px_rgba(10,61,61,0.03)] space-y-8 mb-8">
          
          {/* Section title & content */}
          <div className="space-y-4">
            <h3 className="font-display text-[20px] font-bold text-[#0D2626]">
              {sections[currentSectionIndex]?.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#0D2626] whitespace-pre-line font-sans">
              {sections[currentSectionIndex]?.content}
            </p>
          </div>

          {/* Interactive Anatomical Viewer Area (Section 0 specific) */}
          {lesson.hasAnatomy && currentSectionIndex === 0 && lesson.anatomyData && (
            <div className="rounded-[20px] border border-[#0a3d3d]/8 bg-[#F5FAFA] p-5 flex flex-col md:flex-row items-center gap-6">
              {/* SVG Image Area */}
              <div className="shrink-0 flex items-center justify-center bg-white p-4 rounded-xl border border-[#0a3d3d]/6">
                {renderAnatomySVG()}
              </div>

              {/* Informational Panel */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0F2F2] text-[#0E7C7B] text-[12px] font-bold">
                    {lesson.anatomyData.type === "heart" ? "🫀" : lesson.anatomyData.type === "brain" ? "🧠" : lesson.anatomyData.type === "kidney" ? "🩺" : "🧬"}
                  </span>
                  <h4 className="font-sans text-[14px] font-bold text-[#0D2626]">
                    Modèle Anatomique Interactif
                  </h4>
                </div>

                <p className="text-[12px] text-[#7A9E9E] leading-relaxed">
                  {lesson.anatomyData.type === "heart" 
                    ? "Cliquez sur les différentes cavités du cœur à gauche pour explorer leurs caractéristiques."
                    : lesson.anatomyData.type === "brain"
                      ? "Cliquez sur les différentes zones du cerveau à gauche pour explorer leurs caractéristiques."
                      : lesson.anatomyData.type === "kidney"
                        ? "Cliquez sur les différentes structures rénales à gauche pour explorer leurs caractéristiques."
                        : "Cliquez sur les différents organites de la cellule pour explorer leurs caractéristiques."}
                </p>

                <div className="rounded-xl border border-[#0a3d3d]/8 bg-white p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedRegion.color }} />
                    <h5 className="text-[11px] font-bold text-[#0D2626] uppercase tracking-wider">
                      {selectedRegion.name}
                    </h5>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[#7A9E9E]">
                    {selectedRegion.desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Checkpoint Question Card */}
          {checkpointForSection && (
            <div className="relative rounded-[20px] border border-[#0a3d3d]/12 bg-[#F5FAFA] p-5 md:p-6 space-y-4 overflow-visible">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] bg-[#E0F2F2] text-[#0E7C7B] px-2.5 py-0.5 rounded-md border border-[#0a3d3d]/8">
                TEST DE COMPRÉHENSION
              </span>
              <h4 className="font-sans text-[15px] font-bold text-[#0D2626] leading-snug">
                {checkpointForSection.question}
              </h4>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2">
                {checkpointForSection.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isAnswered = checkpointAnswers[currentSectionIndex] !== undefined;
                  const isSelected = checkpointAnswers[currentSectionIndex] === idx;
                  const showCorrect = isAnswered && option.isCorrect;
                  const showWrong = isSelected && !option.isCorrect;

                  let cardStyle = "border-[#0a3d3d]/8 bg-white hover:border-[#0E7C7B] text-[#0D2626]";
                  let badgeStyle = "bg-[#F5FAFA] text-[#7A9E9E]";

                  if (showCorrect) {
                    cardStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900";
                    badgeStyle = "bg-emerald-500 text-white";
                  } else if (showWrong) {
                    cardStyle = "border-red-500 bg-red-50/50 text-red-900";
                    badgeStyle = "bg-red-500 text-white";
                  } else if (isSelected) {
                    cardStyle = "border-[#0E7C7B] bg-[#E0F2F2]/40";
                    badgeStyle = "bg-[#0E7C7B] text-white";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={(e) => handleCheckpointSelect(currentSectionIndex, idx, option.isCorrect, e)}
                      disabled={isAnswered}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium text-left transition-all duration-150 ${cardStyle} ${!isAnswered ? "cursor-pointer active:scale-[0.99]" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 transition-colors ${badgeStyle}`}>
                          {letter}
                        </span>
                        <span>{option.text}</span>
                      </div>

                      {/* Icon status indicator */}
                      {showCorrect && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                      {showWrong && <X className="h-4 w-4 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Confetti particles */}
              {checkpointParticles[currentSectionIndex] && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const distance = 50 + Math.random() * 60;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x, y, scale: 0.2 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute w-2.5 h-2.5 rounded-full left-1/2 top-1/2 -ml-1 -mt-1"
                        style={{ backgroundColor: config.accent }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Slide-down Explanation Box */}
              {checkpointAnswers[currentSectionIndex] !== undefined && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden border-t border-[#0a3d3d]/8 pt-4 mt-2"
                >
                  <div className="bg-[#E0F2F2]/30 rounded-xl p-3.5 border border-[#0e7c7b]/10 space-y-1">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#0E7C7B] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Explication
                    </h5>
                    <p className="text-[12px] leading-relaxed text-[#3D5C5C]">
                      {checkpointForSection.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Point Floater (+1 animation) */}
          <AnimatePresence>
            {checkpointPoints[currentSectionIndex] && (
              <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -60, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed z-50 font-bold text-sm pointer-events-none bg-white px-2 py-1 rounded-lg border border-[#0a3d3d]/8 shadow-sm flex items-center gap-1"
                style={{ 
                  left: checkpointPoints[currentSectionIndex]!.x - 40, 
                  top: checkpointPoints[currentSectionIndex]!.y - 25,
                  color: config.accent
                }}
              >
                <Award className="h-4 w-4" /> +1 point !
              </motion.div>
            )}
          </AnimatePresence>

          {/* Last section summary box */}
          {currentSectionIndex === sections.length - 1 && (
            <div className="rounded-[20px] bg-[#E0F2F2]/40 border border-[#0E7C7B]/20 p-5 space-y-3">
              <h4 className="font-display text-[15px] font-bold text-[#0D2626] flex items-center gap-2">
                <span>📚</span> Synthèse & Points Clés
              </h4>
              <ul className="list-disc list-inside text-xs leading-relaxed text-[#3D5C5C] space-y-1.5 pl-1">
                {lesson.summaryPoints?.map((pt: string, idx: number) => (
                  <li key={idx}>{pt}</li>
                )) || (
                  <>
                    <li>Le cœur s'organise en quatre cavités distinctes et asymétriques.</li>
                    <li>L'hémodynamique repose sur l'alternance d'ouverture/fermeture valvulaire.</li>
                    <li>L'auscultation B1-B2 reste le pilier fondamental de la sémiologie d'urgence.</li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* End-of-lesson action cards */}
          {currentSectionIndex === sections.length - 1 && (
            <LessonEndActions
              moduleId={moduleId}
              chapterId={chapterId}
              lessonId={lesson.id}
              nextLessonId={nextLesson?.id}
              nextLessonTitle={nextLesson?.title}
              flashcardCount={lesson.flashcardCount}
            />
          )}

        </section>

      </main>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#0a3d3d]/10 bg-white/90 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(10,61,61,0.08)] py-4">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-4 md:px-6">
          {/* Previous Button */}
          <button
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
            className={`inline-flex items-center gap-1 px-4 py-2.5 rounded-full text-xs font-semibold transition-all border ${
              currentSectionIndex === 0 
                ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50/50" 
                : "border-[#0a3d3d]/8 text-[#7A9E9E] hover:border-[#0E7C7B] hover:text-[#0E7C7B] cursor-pointer"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Précédent
          </button>

          {/* Mid progress info */}
          <span className="text-[11px] font-semibold text-[#7A9E9E] font-mono uppercase">
            Section {currentSectionIndex + 1} de {sections.length}
          </span>

          {/* Next / Terminer Button */}
          <button
            onClick={handleNextSection}
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white hover:brightness-105 transition-all shadow-xs cursor-pointer"
            style={{ backgroundColor: config.accent }}
          >
            <span>{currentSectionIndex === sections.length - 1 ? "Terminer" : "Suivant"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
