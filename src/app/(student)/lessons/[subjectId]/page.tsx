"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Award, BookOpen, CheckCircle2, ChevronDown, ChevronRight, Circle, GraduationCap, Sparkles } from "lucide-react";
import { getSubjectById, getLessonRoute, getSubjectRoute, LESSONS_DATA } from "../mockLessonsData";

export default function SubjectLessonsPage() {
  const params = useParams();
  const subjectId = (params?.subjectId as string) || LESSONS_DATA[0].id;

  const subject = useMemo(() => getSubjectById(subjectId), [subjectId]);
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({
    [subject.units[0]?.id ?? ""]: true,
  });

  const toggleUnit = (unitId: string) => {
    setOpenUnits((current) => ({
      ...current,
      [unitId]: !current[unitId],
    }));
  };

  const completedLessons = subject.units
    .flatMap((unit) => unit.lessons)
    .filter((lesson) => lesson.completed).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(214,163,0,0.10),_transparent_24%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-text-light transition-colors hover:text-teal-dark">
            <ArrowLeft className="h-4 w-4" /> Retour au hub des leçons
          </Link>

          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-text-light">Parcours du module</p>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-dark sm:text-5xl">{subject.name}</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-light">
                Vue structurée du module avec unités, leçons et accès direct à chaque page de lecture.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white-custom px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <GraduationCap className="h-4 w-4 text-teal" /> {subject.unitCount} unités
              </div>
              <div className="flex items-center gap-2 rounded-full border border-accent/15 bg-white-custom px-4 py-2 text-xs font-semibold text-accent shadow-sm">
                <Award className="h-4 w-4" /> {subject.lessonCount} leçons
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-teal/10 bg-teal-dark px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-light">
                <Sparkles className="h-3.5 w-3.5" /> Progression du module
              </div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Accédez au détail de chaque leçon depuis ce module.</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/75">
                La structure suit le dossier de référence: un point d'entrée par matière, puis des unités lisibles avec des leçons ouvertes individuellement.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                <span>{completedLessons} leçons validées</span>
                <span>{subject.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-teal-light transition-all duration-500" style={{ width: `${subject.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-white/65">
                <span>Progression moyenne</span>
                <span>{subject.progress}%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-4">
            {subject.units.map((unit) => {
              const isOpen = !!openUnits[unit.id];

              return (
                <div key={unit.id} className="overflow-hidden rounded-3xl border border-teal/10 bg-white-custom shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.id)}
                    className="flex w-full items-center justify-between gap-4 border-b border-teal/10 px-5 py-4 text-left transition-colors hover:bg-surface/35"
                  >
                    <div>
                      <h2 className="text-base font-bold text-text-dark sm:text-lg">{unit.title}</h2>
                      <p className="mt-1 text-xs text-text-light">{unit.lessons.length} leçons mockées pour le détail du module.</p>
                    </div>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-teal-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="divide-y divide-teal/10">
                      {unit.lessons.map((lesson) => {
                        const lessonRoute = getLessonRoute(subject.id, lesson.id);

                        return (
                          <Link
                            key={lesson.id}
                            href={lessonRoute}
                            className="flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/30"
                          >
                            <div className="flex min-w-0 gap-3">
                              <div className="mt-0.5 shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-5 w-5 fill-teal/5 text-teal" />
                                ) : (
                                  <Circle className="h-5 w-5 text-text-light" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-text-dark">{lesson.title}</p>
                                  <span className="rounded-full border border-teal/10 bg-surface/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-dark">
                                    {lesson.format}
                                  </span>
                                </div>
                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-light">{lesson.summary}</p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right text-[10px] font-mono uppercase tracking-[0.22em] text-text-light">
                              <p>{lesson.duration}</p>
                              <p className="mt-2 inline-flex items-center gap-1 text-teal-dark">
                                Ouvrir <ChevronRight className="h-3.5 w-3.5" />
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-teal/10 bg-white-custom p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-dark">
                <BookOpen className="h-3.5 w-3.5 text-teal" /> Aperçu du module
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-light">{subject.overview}</p>

              <div className="mt-6 space-y-3 text-sm text-text-dark">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface/45 px-4 py-3">
                  <span>Progression du module</span>
                  <span className="font-mono font-bold text-teal-dark">{subject.progress}%</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface/45 px-4 py-3">
                  <span>Leçons accessibles</span>
                  <span className="font-mono font-bold text-teal-dark">{subject.lessonCount}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface/45 px-4 py-3">
                  <span>Unités répertoriées</span>
                  <span className="font-mono font-bold text-teal-dark">{subject.unitCount}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-teal/10 bg-white-custom p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-text-light">
                <Award className="h-4 w-4 text-accent" /> Raccourcis
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={getLessonRoute(subject.id, subject.units[0]?.lessons[0]?.id ?? "")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 text-sm font-semibold text-white-custom transition-colors hover:bg-teal-dark"
                >
                  Ouvrir la première leçon <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
                <Link
                  href={getSubjectRoute(subject.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white-custom px-5 py-3 text-sm font-semibold text-teal-dark transition-colors hover:bg-surface/60"
                >
                  Revenir au module
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}