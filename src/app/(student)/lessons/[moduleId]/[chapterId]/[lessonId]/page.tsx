"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Info
} from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "../../../mockLessonsData";
import LessonEndActions from "@/components/lessons/LessonEndActions";

// Interactive anatomical structure details
const HEART_REGIONS = [
  { id: "aorte", name: "Aorte", desc: "Distribue le sang oxygéné provenant du ventricule gauche vers tout l'organisme.", color: "#E74C3C" },
  { id: "od", name: "Oreillette Droite", desc: "Reçoit le sang désoxygéné renvoyé par les veines caves supérieure et inférieure.", color: "#3498DB" },
  { id: "vg", name: "Ventricule Gauche", desc: "Propulse le sang oxygéné à haute pression dans la circulation systémique.", color: "#C0392B" },
  { id: "vd", name: "Ventricule Droit", desc: "Pompe le sang désoxygéné vers la circulation pulmonaire pour le réoxygéner.", color: "#2980B9" }
];

export default function LessonReaderPage() {
  const params = useParams();
  const router = useRouter();
  
  const moduleId = (params?.moduleId as string) || "cardiologie";
  const chapterId = (params?.chapterId as string) || "c1";
  const lessonId = (params?.lessonId as string) || "l1";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);
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

  const [isCompleted, setIsCompleted] = useState(lesson?.isCompleted ?? false);
  const [selectedRegion, setSelectedRegion] = useState(HEART_REGIONS[0]);

  // Find next lesson for CTA
  const nextLesson = useMemo(() => {
    if (currentLessonIndex !== -1 && currentLessonIndex < chapterLessons.length - 1) {
      return chapterLessons[currentLessonIndex + 1];
    }
    return undefined;
  }, [chapterLessons, currentLessonIndex]);

  // Custom heart rendering helper for the AnatomyViewer
  const renderHeartSVG = () => {
    return (
      <svg viewBox="0 0 200 220" className="w-full max-w-[280px] h-auto drop-shadow-md select-none">
        {/* Outline / Shadows */}
        <path d="M100 20 C60 10 20 50 20 100 C20 150 70 190 100 210 C130 190 180 150 180 100 C180 50 140 10 100 20 Z" fill="#FADBD8" className="transition-all duration-300" />
        
        {/* Aorte (Top red arch) */}
        <path 
          d="M80 60 C80 30 120 30 120 60 L120 90 L80 90 Z" 
          fill={selectedRegion.id === "aorte" ? "#E74C3C" : "#CD6155"} 
          className="cursor-pointer hover:brightness-110 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(HEART_REGIONS[0])}
        />
        
        {/* Oreillette Droite (Left blue) */}
        <path 
          d="M40 80 C40 60 70 60 70 80 L70 120 L40 120 Z" 
          fill={selectedRegion.id === "od" ? "#3498DB" : "#5499C7"} 
          className="cursor-pointer hover:brightness-110 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(HEART_REGIONS[1])}
        />
        
        {/* Ventricule Gauche (Right red bottom) */}
        <path 
          d="M100 120 L160 120 C160 150 130 180 100 195 Z" 
          fill={selectedRegion.id === "vg" ? "#C0392B" : "#EC7063"} 
          className="cursor-pointer hover:brightness-110 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(HEART_REGIONS[2])}
        />
        
        {/* Ventricule Droit (Left blue bottom) */}
        <path 
          d="M40 120 L100 120 L100 195 C70 180 40 150 40 120 Z" 
          fill={selectedRegion.id === "vd" ? "#2980B9" : "#7FB3D5"} 
          className="cursor-pointer hover:brightness-110 transition-all stroke-white stroke-[2]"
          onClick={() => setSelectedRegion(HEART_REGIONS[3])}
        />

        {/* Labels overlay indicators */}
        <circle cx="100" cy="50" r="4" fill="white" className="pointer-events-none" />
        <circle cx="55" cy="95" r="4" fill="white" className="pointer-events-none" />
        <circle cx="130" cy="145" r="4" fill="white" className="pointer-events-none" />
        <circle cx="70" cy="145" r="4" fill="white" className="pointer-events-none" />
      </svg>
    );
  };

  const handleMarkAsCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4]">
      {/* Background Decorative Gradient */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.08]" 
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${subject.color}, transparent 35%), radial-gradient(circle at top right, #d6a300, transparent 28%)`
        }}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-light">
            <Link href="/lessons" className="hover:text-teal">Hub</Link>
            <span>/</span>
            <Link href={`/lessons/${subject.id}`} className="hover:text-teal">{subject.name}</Link>
            <span>/</span>
            <Link href={`/lessons/${subject.id}/${chapterId}`} className="hover:text-teal">{chapter.title}</Link>
            <span>/</span>
            <span className="text-teal truncate max-w-[200px]">{lesson.title}</span>
          </div>

          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-teal/5 text-teal border border-teal/10">
                <BookOpen className="h-3.5 w-3.5" /> Leçon {currentLessonIndex + 1} / {chapterLessons.length}
              </span>
              <h1 className="font-display text-3xl font-bold leading-tight text-text-dark sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="text-sm text-text-light">
                Chapitre : {chapter.title} • Niveau {chapter.level}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <Clock className="h-4 w-4 text-teal" /> {lesson.estimatedMinutes} min
              </div>
              <button
                onClick={handleMarkAsCompleted}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                  isCompleted 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                    : "border-teal/15 bg-white text-text-light hover:border-teal/30 hover:text-teal"
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-emerald-600" : "text-text-light"}`} />
                {isCompleted ? "Validée" : "Marquer comme lue"}
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Main Lesson Body */}
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-3xl border border-teal/10 bg-white p-6 shadow-sm md:p-8 space-y-8">
              
              {/* Interactive Anatomical Viewer Area */}
              {lesson.hasAnatomy && (
                <div className="rounded-2xl border border-teal/10 bg-surface/30 p-6 flex flex-col md:flex-row items-center gap-8">
                  {/* SVG Image Area */}
                  <div className="shrink-0 flex items-center justify-center">
                    {renderHeartSVG()}
                  </div>

                  {/* Informational Panel */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/10 text-teal text-[10px] font-bold">
                        🫀
                      </span>
                      <h4 className="font-display text-base font-bold text-text-dark">
                        Visualisateur Anatomique Interactif
                      </h4>
                    </div>

                    <p className="text-xs text-text-light leading-relaxed">
                      Cliquez sur les différentes cavités ou structures du cœur à gauche pour explorer leurs rôles physiologiques respectifs.
                    </p>

                    <div className="rounded-xl border border-teal/10 bg-white p-4 space-y-1.5 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedRegion.color }} />
                        <h5 className="text-xs font-bold text-text-dark uppercase tracking-wider">
                          {selectedRegion.name}
                        </h5>
                      </div>
                      <p className="text-xs leading-relaxed text-text-mid">
                        {selectedRegion.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Course Content */}
              <div className="prose prose-teal max-w-none text-sm text-text-dark space-y-6 leading-relaxed">
                <p className="font-semibold text-base text-text-dark">
                  Introduction aux structures fondamentales
                </p>
                <p>
                  Dans cette leçon de physiologie et d'anatomie, nous étudions l'architecture et le fonctionnement mécanique des structures cibles. La compréhension de la morphologie externe et interne est indispensable pour l'analyse clinique, le diagnostic différentiel rapide et la prise en charge médicale initiale.
                </p>
                
                <h3 className="font-display text-xl font-bold text-text-dark pt-4">
                  1. Physiopathologie et Mécanismes Cibles
                </h3>
                <p>
                  Les fonctions de régulation cardiaque reposent sur l'équilibre dynamique entre les pressions systémiques et pulmonaires. Toute altération morphologique ou dysfonctionnement des valves influe directement sur le débit cardiaque global et l'irrigation des organes nobles.
                </p>

                <div className="flex gap-3 rounded-2xl bg-teal/5 p-4 border border-teal/10 text-teal-dark my-4">
                  <Info className="h-5 w-5 shrink-0 mt-0.5 text-teal" />
                  <p className="text-xs leading-relaxed">
                    <strong>Rappel clinique :</strong> Les signes cliniques majeurs de dysfonctionnement incluent la dyspnée d'effort rapide, la fatigue chronique inexpliquée et les douleurs thoraciques à l'effort.
                  </p>
                </div>

                <h3 className="font-display text-xl font-bold text-text-dark pt-4">
                  2. Arbre Décisionnel d'Investigation
                </h3>
                <p>
                  L'examen initial doit comprendre une évaluation clinique méticuleuse des bruits du cœur, un tracé électrocardiographique standard (ECG) à la recherche de troubles de la conduction, et des dosages biologiques spécifiques (comme les troponines en situation d'urgence).
                </p>
              </div>

              {/* Lesson End Actions CTA strip */}
              <LessonEndActions
                moduleId={moduleId}
                chapterId={chapterId}
                lessonId={lesson.id}
                nextLessonId={nextLesson?.id}
                nextLessonTitle={nextLesson?.title}
                flashcardCount={lesson.flashcardCount}
              />

            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Outline / Sidebar navigation list */}
            <div className="rounded-3xl border border-teal/10 bg-white p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-text-light">
                Progression du chapitre
              </span>
              <div className="space-y-3">
                {chapterLessons.map((item, idx) => {
                  const isCurrent = item.id === lessonId;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => !item.isLocked && router.push(`/lessons/${moduleId}/${chapterId}/${item.id}`)}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isCurrent 
                          ? "border-teal bg-teal/5 text-teal font-semibold" 
                          : item.isLocked
                          ? "border-transparent opacity-40 cursor-not-allowed"
                          : "border-transparent hover:bg-surface text-text-mid"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-teal fill-teal/5 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-text-light shrink-0" />
                        )}
                        <span className="truncate">{item.title}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="rounded-3xl border border-teal/10 bg-white p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-text-light">
                Raccourcis
              </span>
              <div className="grid gap-2.5">
                <Link
                  href={`/lessons/${moduleId}/${chapterId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white py-2.5 text-xs font-semibold text-teal-dark hover:bg-surface transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Revenir au chapitre
                </Link>
                <Link
                  href="/lessons"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white py-2.5 text-xs font-semibold text-teal-dark hover:bg-surface transition-colors"
                >
                  Tous les cours
                </Link>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
