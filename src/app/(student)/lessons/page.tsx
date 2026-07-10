"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Clock, 
  Search, 
  Sparkles, 
  Star, 
  Award,
  Layers,
  Users,
  Heart, 
  Brain, 
  FlaskConical, 
  Bone, 
  Dna, 
  Droplet, 
  Filter, 
  Pill, 
  Microscope, 
  Stethoscope,
  ChevronRight
} from "lucide-react";
import { LESSONS_DATA, getSubjectRoute } from "./mockLessonsData";

// Map subject IDs to Lucide React components (reverted back to Lucide icons)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cardiologie: Heart,
  neurologie: Brain,
  biochimie: FlaskConical,
  anatomie: Bone,
  physiologie: Dna,
  hematologie: Droplet,
  nephrologie: Filter,
  pharmacologie: Pill,
  microbiologie: Microscope,
  pathologie: Stethoscope,
};

export default function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSubjects = LESSONS_DATA.filter((subject) => {
    return subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           subject.focus.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4] pt-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.06),_transparent_35%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Bar */}
        <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-teal/5 pb-8">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-dark sm:text-4xl">
              Parcours d'apprentissage
            </h1>
            <p className="text-sm text-text-light">
              Progressez étape par étape vers la maîtrise.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                placeholder="Que souhaitez-vous apprendre aujourd'hui ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-teal/10 bg-white py-2.5 pl-10 pr-4 text-xs shadow-sm transition-all focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
            <button className="rounded-full bg-teal px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-teal-dark transition-colors shrink-0">
              Demander
            </button>
          </div>
        </section>

        {/* Section: Vos parcours */}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-text-dark">
            Vos parcours
          </h2>

          {/* Active Course Banner (Cardiologie) */}
          <Link href="/lessons/cardiologie">
            <div className="group relative overflow-hidden rounded-3xl border border-teal/10 bg-white p-6 shadow-sm transition-all hover:border-teal/20 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer">
              
              {/* Left Side: Illustration & Details */}
              <div className="flex items-center gap-5">
                {/* Heart Illustration Container using Lucide Heart */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100/50 p-2 shrink-0">
                  <Heart className="w-10 h-10 text-[#f43f5e] fill-[#f43f5e]/10 transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                    FONDAMENTAL
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-text-dark group-hover:text-teal transition-colors">
                    Cardiologie
                  </h3>
                  <p className="text-xs text-text-light leading-relaxed">
                    Le cœur et le système circulatoire en profondeur
                  </p>
                </div>
              </div>

              {/* Right Side: Circular Progress */}
              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="flex items-center gap-2">
                  {/* Custom Circle Progress */}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-teal/10 bg-teal/5">
                    <svg className="absolute transform -rotate-90 w-8 h-8">
                      <circle cx="16" cy="16" r="14" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
                      <circle cx="16" cy="16" r="14" stroke="#0d9488" strokeWidth="2" fill="transparent"
                        strokeDasharray={88}
                        strokeDashoffset={88 - (88 * 67) / 100}
                      />
                    </svg>
                    <span className="text-[9px] font-bold text-teal">67%</span>
                  </div>
                  <span className="text-xs font-semibold text-text-mid">complété</span>
                </div>

                {/* Star Button */}
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-teal/10 bg-white hover:bg-surface text-text-light hover:text-teal transition-all">
                  <Star className="h-4 w-4" />
                </button>
              </div>

            </div>
          </Link>
        </section>

        {/* Section: Learning path levels */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-light">
            TOUS LES MODULES
          </div>

          {/* Grid Layout of Subjects */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject, index) => {
              const subjectRoute = getSubjectRoute(subject.id);
              const LucideIcon = iconMap[subject.id] || Microscope;
              const isNew = index === 2 || index === 8; // Simulate some "Nouveau" badges dynamically

              return (
                <Link key={subject.id} href={subjectRoute}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.18 }}
                    className="group rounded-3xl border border-teal/10 bg-white p-5 shadow-sm hover:shadow-md hover:border-teal/20 transition-all cursor-pointer flex flex-col justify-between h-[280px] text-left"
                  >
                    <div>
                      {/* Premium themed icon container using Lucide React component */}
                      <div className="mb-4 flex justify-start">
                        <div 
                          className="flex h-16 w-16 items-center justify-center rounded-2xl border p-3 shrink-0 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            color: subject.color,
                            backgroundColor: `${subject.color}12`,
                            borderColor: `${subject.color}25`
                          }}
                        >
                          <LucideIcon className="w-10 h-10 stroke-[1.5]" />
                        </div>
                      </div>

                      {/* Level indicator & Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">
                          Niveau {index + 1}
                        </span>
                        {isNew && (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-600">
                            Nouveau
                          </span>
                        )}
                      </div>

                      {/* Title & description */}
                      <h3 className="font-display text-base font-extrabold text-text-dark mt-2 group-hover:text-teal transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-text-light mt-1.5 leading-relaxed line-clamp-2">
                        {subject.focus}
                      </p>
                    </div>

                    {/* Progress slider bar */}
                    <div className="mt-4 pt-4 border-t border-teal/5">
                      <div className="flex items-center justify-between text-[10px] text-text-light mb-1.5 font-medium">
                        <span>Progression</span>
                        <span className="font-bold text-teal">{subject.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
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
          </div>
        </section>

        {/* Bottom features bar */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-teal/5 pt-8 mt-4">
          
          <div className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/5 text-teal shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-dark">Apprentissage structuré</h4>
              <p className="text-[10px] text-text-light">Parcours conçus par des experts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/5 text-teal shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-dark">Progression personnalisée</h4>
              <p className="text-[10px] text-text-light">Apprenez à votre rythme</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/5 text-teal shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-dark">Suivi détaillé</h4>
              <p className="text-[10px] text-text-light">Visualisez vos progrès</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/5 text-teal shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-dark">Communauté active</h4>
              <p className="text-[10px] text-text-light">Échangez et progressez ensemble</p>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
