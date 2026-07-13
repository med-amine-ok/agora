"use client";

import React from "react";
import { CheckCircle2, Circle, PlayCircle, Trophy } from "lucide-react";

interface SubjectStage {
  name: string;
  status: "completed" | "current" | "upcoming";
  percent?: number;
  icon?: string;
}

export default function LearningJourney() {
  // Simple journey mapping Algerian medical curriculum/subjects
  const stages: SubjectStage[] = [
    { name: "Anatomie", status: "completed", icon: "🦴" },
    { name: "Histologie", status: "completed", icon: "🔬" },
    { name: "Physiologie", status: "completed", icon: "🫁" },
    { name: "Cardiologie", status: "current", percent: 80, icon: "❤️" },
    { name: "Neurologie", status: "upcoming", icon: "🧠" },
    { name: "Pneumologie", status: "upcoming", icon: "💨" },
    { name: "Examen Final", status: "upcoming", icon: "🏆" }
  ];

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-text-dark">Mon Parcours Médical</h3>
        <p className="text-xs text-text-light">Votre progression dans le cursus de médecine</p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-teal/10">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Timeline indicator */}
              <div className="absolute -left-[23px] mt-0.5 z-10 bg-white-custom rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-teal" />
                ) : isCurrent ? (
                  <PlayCircle className="h-5 w-5 text-accent animate-pulse" />
                ) : stage.name === "Examen Final" ? (
                  <Trophy className="h-5 w-5 text-text-light/40" />
                ) : (
                  <Circle className="h-5 w-5 text-text-light/30" />
                )}
              </div>

              {/* Subject details card */}
              <div
                className={`flex-grow p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "border-accent/30 bg-accent/5 shadow-sm shadow-accent/5"
                    : isCompleted
                    ? "border-teal/10 bg-white-custom/40"
                    : "border-transparent bg-transparent opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stage.icon}</span>
                    <span className={`text-xs font-bold ${isCurrent ? "text-text-dark" : "text-text-main"}`}>
                      {stage.name}
                    </span>
                  </div>
                  {isCurrent && stage.percent !== undefined && (
                    <span className="text-xs font-bold text-accent font-mono">{stage.percent}%</span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                      Complété
                    </span>
                  )}
                </div>

                {isCurrent && stage.percent !== undefined && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${stage.percent}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
