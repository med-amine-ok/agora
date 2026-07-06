"use client";

import React from "react";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import { useAgoraStore } from "@/store/useAgoraStore";
import { Flame, Award, BookOpen, Trophy, Compass, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAgoraStore();

  const recommendedModules = [
    {
      id: "cardio-1",
      title: "ECG diagnostique : signes d'infarctus",
      module: "Cardiologie",
      duration: "15 min",
      xp: "50 XP",
      completedCheckpoints: 2,
      totalCheckpoints: 4,
    },
    {
      id: "pneu-1",
      title: "Protocoles de traitement du Pneumothorax",
      module: "Pneumologie",
      duration: "20 min",
      xp: "70 XP",
      completedCheckpoints: 0,
      totalCheckpoints: 3,
    },
  ];

  const dailyQuests = [
    { text: "Compléter un point d'étape de cardiologie", done: true },
    { text: "Participer à une arène MedQuest Blitz", done: false },
    { text: "Débloquer le résumé Cardiologie Niveau 2", done: false },
  ];

  return (
    <>
      <ECGBackground />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-dark">
              Marhaban, {user?.name || "Candidat en médecine"}
            </h1>
            <p className="text-xs text-text-light mt-1">
              Voici votre briefing quotidien de formation médicale. La précision est de rigueur.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/medquest/blitz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white-custom text-xs font-semibold shadow-lg shadow-accent/15 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              <Zap className="h-4 w-4 fill-white-custom" />
              Lancer l'Arène Blitz
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
                Série Quotidienne
              </span>
              <Flame className="h-5 w-5 text-accent fill-accent" />
            </div>
            <p className="text-2xl font-bold font-mono text-text-dark">
              {user?.streak || 0} Jours
            </p>
            <p className="text-[10px] text-text-light/80 mt-1">
              Continuez pour maintenir votre série.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
                Score Cumulé
              </span>
              <Award className="h-5 w-5 text-teal" />
            </div>
            <p className="text-2xl font-bold font-mono text-teal-dark">
              {user?.points || 0} XP
            </p>
            <p className="text-[10px] text-text-light/80 mt-1">
              Dans les 15 % meilleurs de la faculté d'Alger.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
                Module Actif
              </span>
              <BookOpen className="h-5 w-5 text-teal" />
            </div>
            <p className="text-lg font-bold text-text-dark truncate">
              Cardiologie : infarctus
            </p>
            <p className="text-[10px] text-teal mt-1 font-semibold">
              Prochain point d'étape : 3 sur 4
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main: Recommended Path */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-teal/10 pb-3">
              <h2 className="text-sm uppercase font-mono tracking-wider font-bold text-teal-dark">
                Leçons recommandées
              </h2>
              <Link
                href="/lessons"
                className="text-xs text-teal hover:underline flex items-center gap-1"
              >
                Tous les parcours <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {recommendedModules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-6 rounded-2xl border border-teal/10 bg-white-custom hover:border-teal/20 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded bg-surface/50 text-teal-dark text-[9px] uppercase font-mono tracking-wider font-semibold">
                      {mod.module}
                    </span>
                    <h3 className="text-base font-bold text-text-dark font-display">
                      {mod.title}
                    </h3>
                    <div className="flex gap-4 text-[10px] text-text-light">
                      <span>Durée estimée : {mod.duration}</span>
                      <span>•</span>
                      <span className="text-teal font-semibold">{mod.xp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress track */}
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-text-light">
                        {mod.completedCheckpoints}/{mod.totalCheckpoints} étapes
                      </p>
                      <div className="mt-1 h-1.5 w-24 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-teal transition-all duration-500"
                          style={{
                            width: `${(mod.completedCheckpoints / mod.totalCheckpoints) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      href="/lessons"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-teal hover:bg-teal-dark text-white-custom transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Daily Tasks */}
          <div className="space-y-6">
            <div className="border-b border-teal/10 pb-3">
              <h2 className="text-sm uppercase font-mono tracking-wider font-bold text-teal-dark">
                Objectifs du jour
              </h2>
            </div>

            <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
              {dailyQuests.map((quest, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 shrink-0 ${
                      quest.done ? "text-teal" : "text-text-light/20"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      quest.done ? "text-text-light line-through" : "text-text-dark font-medium"
                    }`}
                  >
                    {quest.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Badges Earned */}
            <div className="p-6 rounded-2xl border border-teal/10 bg-teal-dark text-white-custom shadow-sm space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-light">
                Titres débloqués
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-white-custom/10 text-[9px] font-semibold uppercase tracking-wider text-teal-light"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

       
    </>
  );
}
