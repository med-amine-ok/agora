"use client";

import React from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import { BookOpen, GraduationCap, Award } from "lucide-react";
import { MedicalIconMap } from "@/presentation/components/icons/MedicalIcons";

export interface Subject {
  id: string;
  name: string;
  lessonCount: number;
  unitCount: number;
  progress: number;
  color: string; // theme color
  difficulty: "Facile" | "Moyen" | "Difficile";
  tint: "default" | "teal" | "accent" | "red" | "blue" | "green";
}

export const SUBJECTS_DATA: Subject[] = [
  { id: "cardiologie", name: "Cardiologie", lessonCount: 12, unitCount: 3, progress: 67, color: "#C0392B", difficulty: "Moyen", tint: "red" },
  { id: "neurologie", name: "Neurologie", lessonCount: 9, unitCount: 2, progress: 30, color: "#8E44AD", difficulty: "Difficile", tint: "default" },
  { id: "biochimie", name: "Biochimie", lessonCount: 15, unitCount: 4, progress: 40, color: "#2980B9", difficulty: "Difficile", tint: "blue" },
  { id: "anatomie", name: "Anatomie", lessonCount: 20, unitCount: 5, progress: 25, color: "#E67E22", difficulty: "Difficile", tint: "accent" },
  { id: "physiologie", name: "Physiologie", lessonCount: 14, unitCount: 3, progress: 50, color: "#27AE60", difficulty: "Moyen", tint: "green" },
  { id: "hematologie", name: "Hématologie", lessonCount: 8, unitCount: 2, progress: 0, color: "#C0392B", difficulty: "Moyen", tint: "red" },
  { id: "nephrologie", name: "Néphrologie", lessonCount: 10, unitCount: 2, progress: 15, color: "#1ABC9C", difficulty: "Difficile", tint: "teal" },
  { id: "pharmacologie", name: "Pharmacologie", lessonCount: 18, unitCount: 4, progress: 0, color: "#F39C12", difficulty: "Moyen", tint: "accent" },
  { id: "microbiologie", name: "Microbiologie", lessonCount: 11, unitCount: 3, progress: 85, color: "#16A085", difficulty: "Facile", tint: "teal" },
  { id: "pathologie", name: "Pathologie", lessonCount: 7, unitCount: 2, progress: 10, color: "#7F8C8D", difficulty: "Difficile", tint: "default" }
];

export default function LessonsHub() {
  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand/40 pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark">
              Hub des Leçons
            </h1>
            <p className="text-text-mid text-sm mt-1">
              Accédez au programme officiel d'externat et de préparation au concours de résidanat en Algérie.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-green-dark/5 px-3.5 py-1.5 rounded-sm border border-green-light/20 text-xs font-semibold text-green-dark font-mono">
              <GraduationCap className="w-4.5 h-4.5" /> 10 Modules Médicaux
            </div>
          </div>
        </div>

        {/* Global Progress banner */}
        <div className="bg-green-dark text-white rounded-md p-6 relative overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-green-light/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl space-y-3 relative z-10">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-green-light" />
              Progression Générale d'Études
            </h2>
            <p className="text-green-light/80 text-sm leading-relaxed">
              Vous avez complété 35% du programme de préparation. Continuez à étudier quotidiennement pour valider vos objectifs d'apprentissage clinique.
            </p>
            <div className="space-y-1.5 pt-2 max-w-md">
              <div className="flex justify-between text-xs font-mono text-green-light">
                <span>42 / 134 Leçons Validées</span>
                <span>31%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-green-light h-full rounded-full transition-all" style={{ width: "31%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS_DATA.map((subject) => {
            // Find custom SVG icon
            const IconComponent = MedicalIconMap[subject.name] || BookOpen;

            return (
              <Link key={subject.id} href={`/lessons/${subject.id}`}>
                <Card
                  hoverEffect
                  borderTint={subject.tint}
                  className="h-full flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 bg-green-dark/5 rounded-sm border border-green-light/10 inline-flex" style={{ color: subject.color }}>
                        <IconComponent size={28} />
                      </span>
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${
                        subject.difficulty === "Difficile"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : subject.difficulty === "Moyen"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {subject.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-green-dark text-lg group-hover:text-green-mid transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-text-mid text-xs font-medium flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {subject.unitCount} unités · {subject.lessonCount} leçons
                      </p>
                    </div>
                  </div>

                  {/* Card progress */}
                  <div className="space-y-2 mt-6 pt-4 border-t border-border-brand/40">
                    <div className="flex justify-between text-xs font-semibold text-text-mid">
                      <span>Complétion</span>
                      <span className="font-mono">{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
