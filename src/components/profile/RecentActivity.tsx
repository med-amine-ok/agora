"use client";

import React from "react";
import { CheckCircle2, Award, Zap, Trophy, BookOpen } from "lucide-react";

interface ActivityItem {
  time: string;
  title: string;
  desc: string;
  type: "lesson" | "flashcard" | "blitz" | "module";
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      time: "Aujourd'hui",
      title: "Interprétation de l'ECG pathologique",
      desc: "A complété le module clinique et validé le questionnaire",
      type: "lesson"
    },
    {
      time: "Hier",
      title: "Mémorisation Flashcards",
      desc: "A révisé et maîtrisé 25 flashcards sur la sémiologie cardiaque",
      type: "flashcard"
    },
    {
      time: "Il y a 3 jours",
      title: "Arène Blitz Hebdomadaire",
      desc: "A remporté un match Blitz et gagné 120 XP",
      type: "blitz"
    },
    {
      time: "La semaine dernière",
      title: "Cardiologie Générale",
      desc: "A complété le premier grand chapitre de Cardiologie",
      type: "module"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <CheckCircle2 className="h-4.5 w-4.5 text-teal" />;
      case "flashcard":
        return <Zap className="h-4.5 w-4.5 text-accent animate-pulse" />;
      case "blitz":
        return <Trophy className="h-4.5 w-4.5 text-teal-light" />;
      default:
        return <BookOpen className="h-4.5 w-4.5 text-teal-dark" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-5">
      <div>
        <h3 className="text-sm font-bold text-text-dark">Activités Récentes</h3>
        <p className="text-xs text-text-light">Journal de vos exploits d'apprentissage</p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-teal/10">
        {activities.map((act, idx) => (
          <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="absolute -left-[23px] bg-white-custom p-0.5 rounded-full z-10">
              <div className="p-1 rounded-full bg-surface">
                {getIcon(act.type)}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-text-dark">{act.title}</p>
              <p className="text-[10px] text-text-light">{act.desc}</p>
            </div>

            <span className="text-[10px] font-semibold text-text-light bg-surface/40 border border-teal/5 px-2 py-0.5 rounded-full self-start sm:self-center shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
