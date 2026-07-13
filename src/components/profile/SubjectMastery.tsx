"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, HelpCircle, Trophy, Clock, ShieldAlert, Award } from "lucide-react";

interface SubjectData {
  id: string;
  name: string;
  icon: string;
  percent: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  quizzesCompleted: number;
  badge: string;
  remainingTime: string;
  chapters: Array<{
    title: string;
    lessons: string;
    precision: number;
  }>;
}

export default function SubjectMastery() {
  const subjects: SubjectData[] = [
    {
      id: "s1",
      name: "Cardiologie",
      icon: "❤️",
      percent: 80,
      lessonsCompleted: 24,
      lessonsTotal: 30,
      quizzesCompleted: 12,
      badge: "Avancé",
      remainingTime: "3h restantes",
      chapters: [
        { title: "Le Cœur & Anatomie", lessons: "8/10", precision: 85 },
        { title: "Hémodynamique", lessons: "10/10", precision: 79 },
        { title: "Interprétation ECG", lessons: "6/10", precision: 64 },
      ]
    },
    {
      id: "s2",
      name: "Neurologie",
      icon: "🧠",
      percent: 50,
      lessonsCompleted: 12,
      lessonsTotal: 24,
      quizzesCompleted: 8,
      badge: "Intermédiaire",
      remainingTime: "8h restantes",
      chapters: [
        { title: "Système Nerveux Central", lessons: "8/12", precision: 75 },
        { title: "Pathologies Vasculaires", lessons: "4/12", precision: 67 },
      ]
    },
    {
      id: "s3",
      name: "Pneumologie",
      icon: "🫁",
      percent: 40,
      lessonsCompleted: 8,
      lessonsTotal: 20,
      quizzesCompleted: 5,
      badge: "Novice",
      remainingTime: "12h restantes",
      chapters: [
        { title: "Ventilation mécanique", lessons: "4/10", precision: 52 },
        { title: "BPCO & Asthme", lessons: "4/10", precision: 44 },
      ]
    }
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getBadgeColor = (badge: string) => {
    if (badge === "Avancé") return "bg-teal/15 text-teal border-teal/20";
    if (badge === "Intermédiaire") return "bg-accent/15 text-accent border-accent/20";
    return "bg-text-light/15 text-text-light border-text-light/20";
  };

  return (
    <div className="space-y-4">
      {subjects.map((sub) => {
        const isExpanded = expandedId === sub.id;
        return (
          <div
            key={sub.id}
            className="rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm overflow-hidden transition-all"
          >
            {/* Header info */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : sub.id)}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-surface/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-surface/50">{sub.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-text-dark">{sub.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeColor(sub.badge)}`}>
                      {sub.badge}
                    </span>
                    <span className="text-[10px] text-text-light flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {sub.remainingTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress and Stats */}
              <div className="w-full md:w-auto flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 text-xs text-text-light">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-teal" />
                    <strong>{sub.lessonsCompleted}</strong> / {sub.lessonsTotal} cours
                  </span>
                  <span className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    <strong>{sub.quizzesCompleted}</strong> quiz
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full md:w-44">
                  <div className="h-2 flex-1 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-teal" style={{ width: `${sub.percent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-teal font-mono shrink-0">{sub.percent}%</span>
                </div>
              </div>
            </div>

            {/* Chapters Accordion */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-surface/10 border-t border-teal/5"
                >
                  <div className="p-5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                      Progression des Chapitres
                    </p>
                    <div className="space-y-2">
                      {sub.chapters.map((chap, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white-custom/80 border border-teal/5 text-xs"
                        >
                          <span className="font-semibold text-text-dark">{chap.title}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-text-light">{chap.lessons} leçons</span>
                            <span className="font-bold text-teal font-mono">{chap.precision}% Précision</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
