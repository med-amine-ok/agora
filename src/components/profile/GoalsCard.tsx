"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function GoalsCard() {
  const goals = [
    {
      title: "Objectif du Jour",
      metric: "2 Leçons Cliniques",
      progress: "1 / 2 leçons",
      percent: 50,
      color: "bg-accent"
    },
    {
      title: "Objectif de la Semaine",
      metric: "Maîtrise Flashcards",
      progress: "12 / 15 Flashcards",
      percent: 80,
      color: "bg-teal"
    },
    {
      title: "Objectif Mensuel",
      metric: "Score Précision Global",
      progress: "84% Précision / 90%",
      percent: 84,
      color: "bg-teal-light"
    }
  ];

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-text-dark">Objectifs Actuels</h3>
        <p className="text-xs text-text-light">Vos cibles d'apprentissage pour rester motivé</p>
      </div>

      <div className="space-y-4">
        {goals.map((goal, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-text-dark">{goal.title}</p>
                <p className="text-[10px] text-text-light">{goal.metric}</p>
              </div>
              <span className="font-bold text-text-dark font-mono text-[11px]">
                {goal.progress}
              </span>
            </div>

            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
              <div className={`h-full ${goal.color}`} style={{ width: `${goal.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
