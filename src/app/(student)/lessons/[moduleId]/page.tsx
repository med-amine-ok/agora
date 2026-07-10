"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GraduationCap, Award, Sparkles, BookOpen } from "lucide-react";
import { getSubjectById, MOCK_CHAPTERS } from "../mockLessonsData";
import ChapterGrid from "@/components/lessons/ChapterGrid";
import ChapterScrollRow from "@/components/lessons/ChapterScrollRow";

export default function SubjectDetailPage() {
  const params = useParams();
  const moduleId = (params?.moduleId as string) || "cardiologie";

  const subject = useMemo(() => getSubjectById(moduleId), [moduleId]);

  // Filter chapters belonging to this module
  const moduleChapters = useMemo(() => {
    return MOCK_CHAPTERS.filter((c) => c.moduleId === moduleId);
  }, [moduleId]);

  const completedLessonsCount = moduleChapters.reduce((sum, c) => sum + c.completedLessons, 0);
  const totalLessonsCount = moduleChapters.reduce((sum, c) => sum + c.lessonCount, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(214,163,0,0.10),_transparent_24%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        
        {/* Back Link & Header */}
        <section className="space-y-4">
          <Link 
            href="/lessons" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-light transition-colors hover:text-teal"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au hub des leçons
          </Link>

          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-teal">
                Parcours du module
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-dark sm:text-5xl">
                {subject.name}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-light">
                {subject.focus}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <GraduationCap className="h-4 w-4 text-teal" /> {moduleChapters.length} chapitres
              </div>
              <div className="flex items-center gap-2 rounded-full border border-accent/15 bg-white px-4 py-2 text-xs font-semibold text-accent shadow-sm">
                <Award className="h-4 w-4" /> {totalLessonsCount} leçons
              </div>
            </div>
          </div>
        </section>

        {/* Active Progress Banner */}
        <section className="rounded-3xl border border-teal/10 bg-teal-dark px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-light">
                <Sparkles className="h-3.5 w-3.5" /> Progression du module
              </div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Accédez au détail de chaque chapitre pour commencer l'apprentissage.
              </h2>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>{completedLessonsCount} leçons validées</span>
                <span>{subject.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-teal-light transition-all duration-500" style={{ width: `${subject.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-white/65">
                <span>Progression</span>
                <span>{subject.progress}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase Horizontal Scroll Row first */}
        {moduleChapters.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-text-dark">
              Aperçu rapide
            </h2>
            <ChapterScrollRow
              moduleName="Chapitres récents"
              chapters={moduleChapters}
              levelLabel="Cardiologie"
            />
          </section>
        )}

        {/* Primary Chapter Grid */}
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-text-dark">
            Tous les chapitres
          </h2>
          {moduleChapters.length > 0 ? (
            <ChapterGrid chapters={moduleChapters} />
          ) : (
            <div className="rounded-2xl border border-dashed border-teal/20 p-8 text-center text-text-light text-sm bg-white">
              Aucun chapitre disponible pour ce module.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
