"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { LESSONS_DATA, getSubjectRoute } from "./mockLessonsData";

export default function LessonsPage() {
  const catalogAverageProgress = Math.round(
    LESSONS_DATA.reduce((sum, subject) => sum + subject.progress, 0) / LESSONS_DATA.length
  );

  const catalogLessonCount = LESSONS_DATA.reduce((sum, subject) => sum + subject.lessonCount, 0);
  const catalogUnitCount = LESSONS_DATA.reduce((sum, subject) => sum + subject.unitCount, 0);
  const estimatedValidatedLessons = Math.round((catalogLessonCount * catalogAverageProgress) / 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(214,163,0,0.10),_transparent_24%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-text-light">
                Hub des leçons
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-dark sm:text-5xl">
                Parcours médical condensé, présenté par modules et unités.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-light">
                Cette vue reprend l'esprit du dossier de référence : un catalogue de matières, des unités lisibles, puis des leçons détaillées. Sélectionnez un module ci-dessous pour découvrir ses leçons.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white-custom px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <GraduationCap className="h-4 w-4 text-teal" /> {LESSONS_DATA.length} modules
              </div>
              <div className="flex items-center gap-2 rounded-full border border-accent/15 bg-white-custom px-4 py-2 text-xs font-semibold text-accent shadow-sm">
                <Award className="h-4 w-4" /> {catalogUnitCount} unités d'aperçu
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-teal/10 bg-teal-dark px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-light">
                <Sparkles className="h-3.5 w-3.5" /> Progression générale
              </div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Votre progression d'apprentissage sur l'ensemble du catalogue.
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/75">
                Suivez votre avancement à travers les différents modules d'enseignement.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>{estimatedValidatedLessons} leçons validées</span>
                <span>{catalogLessonCount} leçons totales</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-teal-light transition-all duration-500" style={{ width: `${catalogAverageProgress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-white/65">
                <span>Progression moyenne</span>
                <span>{catalogAverageProgress}%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS_DATA.map((subject) => {
            const subjectRoute = getSubjectRoute(subject.id);

            return (
              <Link key={subject.id} href={subjectRoute}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.18 }}
                  className="group rounded-3xl border border-teal/10 bg-white-custom p-5 text-left shadow-sm hover:shadow-md hover:border-teal/20 transition-all cursor-pointer h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold shrink-0"
                          style={{
                            color: subject.color,
                            borderColor: `${subject.color}22`,
                            backgroundColor: `${subject.color}12`,
                          }}
                        >
                          {subject.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-text-dark transition-colors group-hover:text-teal-dark">
                            {subject.name}
                          </h3>
                          <p className="text-xs text-text-light">
                            {subject.unitCount} unités · {subject.lessonCount} leçons
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          subject.difficulty === "Difficile"
                            ? "border-red-100 bg-red-50 text-red-700"
                            : subject.difficulty === "Moyen"
                            ? "border-amber-100 bg-amber-50 text-amber-700"
                            : "border-emerald-100 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {subject.difficulty}
                      </span>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-text-light line-clamp-3">
                      {subject.overview}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-text-light mb-2">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-teal-dark">
                        <Clock className="h-3.5 w-3.5" /> {subject.progress}% validé
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal hover:underline font-bold">
                        Ouvrir le module
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
