"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle, Flame, Award } from "lucide-react";

interface BadgeData {
  title: string;
  desc: string;
  icon: string;
  status: "unlocked" | "in_progress" | "locked";
  condition: string;
  progressPercent?: number;
}

export default function AchievementsGallery() {
  const achievements: BadgeData[] = [
    {
      title: "Premier Pouls",
      desc: "A complété sa première leçon clinique",
      icon: "❤️",
      status: "unlocked",
      condition: "Compléter n'importe quelle leçon",
      progressPercent: 100
    },
    {
      title: "Maître de l'ECG",
      desc: "Score parfait sur le module de cardiologie",
      icon: "⚡",
      status: "unlocked",
      condition: "Avoir un score de 100% sur le cours ECG",
      progressPercent: 100
    },
    {
      title: "Champion du Blitz",
      desc: "Top 3 dans une arène Blitz hebdomadaire",
      icon: "🏆",
      status: "unlocked",
      condition: "Monter sur le podium MedQuest Blitz",
      progressPercent: 100
    },
    {
      title: "Clinicien Précis",
      desc: "A atteint 90% de précision sur 50 questions",
      icon: "🎯",
      status: "in_progress",
      condition: "Résoudre 50 questions de QCM avec >90%",
      progressPercent: 78
    },
    {
      title: "Savant de Garde",
      desc: "A révisé pendant 30 jours d'affilée",
      icon: "🔥",
      status: "in_progress",
      condition: "Obtenir une série d'études active de 30 jours",
      progressPercent: 40
    },
    {
      title: "Diagnosticien Suprême",
      desc: "A résolu 10 cas cliniques complexes",
      icon: "🩺",
      status: "locked",
      condition: "Résoudre 10 cas cliniques niveau difficile",
      progressPercent: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => {
          const isUnlocked = ach.status === "unlocked";
          const isProgress = ach.status === "in_progress";
          const isLocked = ach.status === "locked";

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? "bg-teal-dark/5 border-teal/10 hover:border-teal/30"
                  : isProgress
                  ? "bg-white-custom/60 border-teal/5 hover:border-teal/20"
                  : "bg-surface/10 border-transparent opacity-60"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl filter saturate-100">{ach.icon}</span>
                  {isUnlocked ? (
                    <span className="text-teal flex items-center gap-1 text-[10px] font-bold uppercase">
                      <CheckCircle className="h-3.5 w-3.5" /> Débloqué
                    </span>
                  ) : isLocked ? (
                    <Lock className="h-3.5 w-3.5 text-text-light/50" />
                  ) : (
                    <span className="text-accent text-[10px] font-bold uppercase">
                      En Cours ({ach.progressPercent}%)
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-dark">{ach.title}</h4>
                  <p className="text-[10px] text-text-light mt-0.5 leading-relaxed">{ach.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-teal/5 space-y-2">
                <p className="text-[9px] text-text-light font-medium italic">
                  Défi : {ach.condition}
                </p>

                {isProgress && ach.progressPercent !== undefined && (
                  <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${ach.progressPercent}%` }} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
