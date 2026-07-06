"use client";

import React from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import { BookOpen, GraduationCap, Award, ArrowRight } from "lucide-react";
import { MedicalIconMap } from "@/presentation/components/icons/MedicalIcons";
import { SUBJECTS_DATA } from "./subjectsData";
import { motion } from "framer-motion";

export default function LessonsHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <SidebarLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-10 pb-16"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-teal-dark">
              Hub des Leçons
            </h1>
            <p className="text-text-mid text-sm mt-1">
              Accédez au programme officiel d'externat et de préparation au concours de résidanat.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-teal-ghost px-4 py-2 rounded-full border border-teal-light/20 text-xs font-semibold text-teal font-mono">
              <GraduationCap className="w-4 h-4" /> 10 Modules Médicaux
            </div>
          </div>
        </motion.div>

        {/* Global Progress banner */}
        <motion.div
          variants={itemVariants}
          className="bg-teal-dark text-white rounded-xl p-8 relative overflow-hidden shadow-sm border border-teal/10"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-light/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl space-y-4 relative z-10">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2 text-white">
              <Award className="w-6 h-6 text-teal-light" />
              Progression Générale d'Études
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Vous avez complété 35% du programme de préparation. Continuez à étudier quotidiennement pour valider vos objectifs d'apprentissage clinique.
            </p>
            <div className="space-y-2 pt-2 max-w-md">
              <div className="flex justify-between text-xs font-mono text-teal-light font-semibold">
                <span>42 / 134 Leçons Validées</span>
                <span>31%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-light h-full rounded-full transition-all duration-500" style={{ width: "31%" }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS_DATA.map((subject) => {
            const IconComponent = MedicalIconMap[subject.name] || BookOpen;

            return (
              <Link key={subject.id} href={`/lessons/${subject.id}`}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card
                    className="h-full flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all duration-300 border-border border"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="p-3 bg-teal-ghost rounded-lg border border-teal-light/10 inline-flex" style={{ color: subject.color }}>
                          <IconComponent size={24} />
                        </span>
                        <span className={`text-[10px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full ${
                          subject.difficulty === "Difficile"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : subject.difficulty === "Moyen"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {subject.difficulty}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-display text-lg font-bold text-teal-dark group-hover:text-teal transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-text-mid text-xs font-semibold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-text-light" /> {subject.unitCount} unités · {subject.lessonCount} leçons
                        </p>
                      </div>
                    </div>

                    {/* Card progress */}
                    <div className="space-y-2 mt-6 pt-4 border-t border-border">
                      <div className="flex justify-between text-xs font-semibold text-text-mid">
                        <span>Complétion</span>
                        <span className="font-mono">{subject.progress}%</span>
                      </div>
                      <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </SidebarLayout>
  );
}
