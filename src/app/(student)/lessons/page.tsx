"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, 
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
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  Compass,
  Zap,
  BookOpen,
  HelpCircle,
  Trophy
} from "lucide-react";
import { LESSONS_DATA, getSubjectRoute, MOCK_CHAPTERS, MOCK_LESSON_LIST } from "./mockLessonsData";

// Map subject IDs to Lucide React components
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = useMemo(() => {
    return LESSONS_DATA.filter((subject) => {
      return subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             subject.focus.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // Find overall progress details for Hero Card (using Cardiologie as primary simulation source)
  const cardiologySubject = useMemo(() => {
    return LESSONS_DATA.find(s => s.id === "cardiologie") || LESSONS_DATA[0];
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5FAFA] pt-24 pb-20 font-sans">
      {/* Subtle glowing mesh backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,132,118,0.06),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(244,143,0,0.04),_transparent_40%)]" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark transition-colors font-mono cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
        </button>

        {/* Page Title & Search Bar */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-teal/10 pb-8">
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-teal-dark">
              Votre Parcours Médical
            </h1>
            <p className="text-sm text-text-light max-w-lg leading-relaxed">
              Ne parcourez plus des listes de fiches. Progressez à travers un parcours guidé et structuré, conçu pour la réussite au résidanat.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                placeholder="Rechercher une spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-teal/10 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs transition-all focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
          </div>
        </header>

        {/* Hero Section: Continue Learning Card */}
        {!searchQuery && (
          <section className="w-full">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-text-light/70 mb-4 font-bold">
              Continuer l'Apprentissage
            </h2>
            
            <Link href="/lessons/cardiologie">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative overflow-hidden rounded-3xl border border-teal/15 bg-gradient-to-br from-teal-dark to-[#0f4d45] p-8 text-white shadow-lg cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                {/* Decorative glow */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                
                <div className="space-y-4 max-w-xl z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-accent">
                      <Heart className="h-4 w-4 fill-accent stroke-accent" />
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-light">
                      Cardiologie • 67% complété
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-white/60 font-medium">Prochaine étape :</span>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      Activité Électrique du Cœur
                    </h3>
                    <p className="text-xs text-white/70 max-w-md">
                      Comprendre la conduction cardiaque intrinsèque et la formation de l'onde ECG.
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-2 pt-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-white/50 font-mono">
                      <span>16 Leçons validées</span>
                      <span>8 Restantes</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between gap-6 z-10 shrink-0">
                  <span className="hidden md:block text-5xl font-display font-light text-white/15 group-hover:text-white/20 transition-colors">
                    01
                  </span>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white text-xs font-bold rounded-2xl transition-all shadow-md group-hover:scale-[1.02] active:scale-[0.98]">
                    Reprendre l'étude <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </Link>
          </section>
        )}

        {/* Section: Subjects / Learning Paths */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-text-light/70 font-bold">
            Vos Parcours de Spécialités
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredSubjects.map((subject, index) => {
              const LucideIcon = iconMap[subject.id] || Microscope;
              const isCardio = subject.id === "cardiologie";
              const isNeuro = subject.id === "neurologie";
              const isBioch = subject.id === "biochimie";
              
              return (
                <Link key={subject.id} href={getSubjectRoute(subject.id)}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="group relative rounded-3xl border border-teal/10 bg-white p-6 shadow-xs hover:shadow-md hover:border-teal/20 transition-all cursor-pointer flex flex-col justify-between gap-6 text-left"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                          style={{
                            color: subject.color,
                            backgroundColor: `${subject.color}10`,
                            borderColor: `${subject.color}20`
                          }}
                        >
                          <LucideIcon className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-teal-dark group-hover:text-teal transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-[11px] text-text-light line-clamp-1">
                            {subject.focus}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono" style={{ color: subject.color }}>
                          {subject.progress}%
                        </span>
                        <p className="text-[9px] text-text-light font-mono uppercase">Complété</p>
                      </div>
                    </div>

                    {/* Milestone Mini-Timeline inside Card */}
                    <div className="pt-4 border-t border-teal/5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
                      
                      {/* Milestone 1 */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/15 text-teal">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="text-[9px] font-mono text-text-mid font-medium">Bases</span>
                      </div>
                      
                      <div className="h-0.5 flex-1 bg-teal/20 min-w-[15px]" />

                      {/* Milestone 2 */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isCardio ? "bg-teal/15 text-teal" : isNeuro ? "bg-accent/15 text-accent animate-pulse" : "bg-[#F5FAFA] text-text-light"}`}>
                          {isCardio ? (
                            <Check className="h-3 w-3 stroke-[3]" />
                          ) : isNeuro ? (
                            <div className="h-2 w-2 rounded-full bg-accent" />
                          ) : (
                            <Lock className="h-2.5 w-2.5" />
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-text-mid">Anatomie</span>
                      </div>

                      <div className={`h-0.5 flex-1 min-w-[15px] ${isCardio ? "bg-teal/20" : "bg-teal/5"}`} />

                      {/* Milestone 3 */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isCardio ? "bg-accent/15 text-accent animate-pulse" : "bg-[#F5FAFA] text-text-light"}`}>
                          {isCardio ? (
                            <div className="h-2 w-2 rounded-full bg-accent" />
                          ) : (
                            <Lock className="h-2.5 w-2.5" />
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-text-mid">Physiologie</span>
                      </div>

                      <div className="h-0.5 flex-1 bg-teal/5 min-w-[15px]" />

                      {/* Milestone 4 */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5FAFA] text-text-light">
                          <Lock className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-[9px] font-mono text-text-light">Pathologie</span>
                      </div>

                      <div className="h-0.5 flex-1 bg-teal/5 min-w-[15px]" />

                      {/* Final Assessment */}
                      <div className="flex flex-col items-center gap-1.5 min-w-[70px]">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5FAFA] text-text-light">
                          <Trophy className="h-3 w-3" />
                        </div>
                        <span className="text-[9px] font-mono text-text-light">Examen</span>
                      </div>

                    </div>

                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
