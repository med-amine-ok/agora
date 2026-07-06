"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, TrendingUp, AlertTriangle, Calendar, Award } from "lucide-react";

const performanceData = [
  { module: "Cardiologie", score: 85, avg: 72 },
  { module: "Pneumologie", score: 64, avg: 68 },
  { module: "Gastro", score: 92, avg: 75 },
  { module: "Endocrino", score: 78, avg: 70 },
  { module: "Infectiologie", score: 70, avg: 71 },
];

const weeklyActivity = [
  { day: "Lun", questions: 12 },
  { day: "Mar", questions: 18 },
  { day: "Mer", questions: 8 },
  { day: "Jeu", questions: 25 },
  { day: "Ven", questions: 15 },
  { day: "Sam", questions: 30 },
  { day: "Dim", questions: 22 },
];

const subjectDistribution = [
  { name: "Matières fortes", value: 3 },
  { name: "À revoir", value: 2 },
];

const TEAL_COLORS = ["#0E7C7B", "#FF6B35"];

export default function StatisticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <ECGBackground />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="border-b border-teal/10 pb-6 mb-12 text-left">
          <h1 className="font-display text-3xl font-bold text-text-dark">
            Analyses diagnostiques
          </h1>
          <p className="text-xs text-text-light mt-1">
            Analyse fondée sur les données de votre progression et de votre vitesse de diagnostic.
          </p>
        </div>

        {/* Overview highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
              Position au classement
            </span>
            <p className="text-2xl font-bold font-mono text-text-dark mt-2">
              #42 / 1,280
            </p>
            <p className="text-[10px] text-text-light/85 mt-1">
              Dans les 3 % meilleurs cette semaine
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
              Précision moyenne
            </span>
            <p className="text-2xl font-bold font-mono text-teal-dark mt-2">
              79.8%
            </p>
            <p className="text-[10px] text-text-light/85 mt-1">
              +2,4 % par rapport à la semaine dernière
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
              Questions résolues
            </span>
            <p className="text-2xl font-bold font-mono text-text-dark mt-2">
              342 QCM
            </p>
            <p className="text-[10px] text-text-light/85 mt-1">
              Sur 5 modules cliniques
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
              Vitesse moyenne de réponse
            </span>
            <p className="text-2xl font-bold font-mono text-accent mt-2">
              11,2 secondes
            </p>
            <p className="text-[10px] text-text-light/85 mt-1">
              Dans les matchs de l'Arène Blitz
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart 1: Module performance vs average */}
            <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-teal/5 pb-3">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4" /> PERFORMANCE DES MODULES VS MOYENNE GLOBALE
                </h3>
              </div>
              <div className="h-64 w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="module" tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                      <Bar dataKey="score" fill="var(--teal)" radius={[4, 4, 0, 0]} name="Votre précision" />
                      <Bar dataKey="avg" fill="rgba(14, 124, 123, 0.15)" radius={[4, 4, 0, 0]} name="Précision moyenne" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Weekly Activity */}
            <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-teal/5 pb-3">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" /> FLUX HEBDOMADAIRE DE RÉSOLUTION DES QUESTIONS
                </h3>
              </div>
              <div className="h-64 w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                      <Line type="monotone" dataKey="questions" stroke="var(--accent)" strokeWidth={2} dot={{ fill: "var(--accent)" }} name="QCM" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel Column */}
          <div className="space-y-8">
            {/* Pie Chart: Strong vs review distribution */}
            <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark">
                RÉPARTITION DIAGNOSTIQUE DES MATIÈRES
              </h3>
              <div className="h-48 w-full flex items-center justify-center">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TEAL_COLORS[index % TEAL_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <span className="block h-2 w-2 rounded-full bg-teal mx-auto mb-1" />
                  <span className="text-text-light font-mono text-[10px]">MATIÈRES FORTES</span>
                  <p className="font-bold text-text-dark">3 matières</p>
                </div>
                <div>
                  <span className="block h-2 w-2 rounded-full bg-accent mx-auto mb-1" />
                  <span className="text-text-light font-mono text-[10px]">À REVOIR</span>
                  <p className="font-bold text-text-dark">2 matières</p>
                </div>
              </div>
            </div>

            {/* Weakness Alert Widget */}
            <div className="p-6 rounded-2xl border border-error/15 bg-error/5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-error">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold">
                  ALERTE DIAGNOSTIQUE
                </h4>
              </div>
              <p className="text-xs text-error/85 leading-relaxed">
                Votre performance en <strong>Pneumologie</strong> (en particulier sur les <em>protocoles du pneumothorax</em>) est actuellement inférieure à la moyenne nationale. Révisez ce module pour stabiliser votre classement global.
              </p>
            </div>
          </div>
        </div>
      </main>

       
    </>
  );
}
