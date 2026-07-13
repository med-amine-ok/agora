"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

interface LevelProgressProps {
  xp: number;
}

export default function LevelProgress({ xp }: LevelProgressProps) {
  const level = Math.floor(xp / 1000) + 1;
  const currentXp = xp % 1000;
  const targetXp = 1000;
  const percent = Math.min(100, Math.round((currentXp / targetXp) * 100));

  const getRank = (lvl: number) => {
    if (lvl >= 10) return "Clinicien Expert";
    if (lvl >= 7) return "Externe Sénior";
    if (lvl >= 4) return "Résident Junior";
    return "Clinical Explorer";
  };

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal/10">
            <Sparkles className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-dark">Progression de Niveau</h3>
            <p className="text-xs text-text-light font-medium">{getRank(level)}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold font-mono text-teal">Niveau {level}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-light font-semibold">
          <span>{currentXp} XP</span>
          <span>Objectif : {targetXp} XP</span>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-3 w-full bg-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-0 bg-teal rounded-full"
          />
        </div>

        <p className="text-[10px] text-text-light text-right">
          Encore <span className="font-bold text-teal">{targetXp - currentXp} XP</span> pour atteindre le niveau {level + 1}
        </p>
      </div>
    </div>
  );
}
