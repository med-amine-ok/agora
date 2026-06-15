"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import {
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle,
  HelpCircle,
  Clock,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from "recharts";

export default function Statistics() {
  const [timeFilter, setTimeFilter] = useState("30"); // 7, 30, all
  const [modeFilter, setModeFilter] = useState("Tous"); // Tous, Libre, Blitz, Salle

  // 30 days precision mock data
  const precisionHistory = [
    { day: "J-10", precision: 72 },
    { day: "J-9", precision: 75 },
    { day: "J-8", precision: 74 },
    { day: "J-7", precision: 79 },
    { day: "J-6", precision: 77 },
    { day: "J-5", precision: 80 },
    { day: "J-4", precision: 76 },
    { day: "J-3", precision: 81 },
    { day: "J-2", precision: 78 },
    { day: "Hier", precision: 82 },
  ];

  // Subject performance radar data
  const subjectRadarData = [
    { subject: "Cardiologie", score: 85 },
    { subject: "Anatomie", score: 58 },
    { subject: "Pédiatrie", score: 65 },
    { subject: "Infectiologie", score: 90 },
    { subject: "Gynécologie", score: 45 },
    { subject: "Neurologie", score: 70 },
  ];

  // Weekly session history (last 8 weeks)
  const weeklySessions = [
    { week: "S-7", count: 8 },
    { week: "S-6", count: 12 },
    { week: "S-5", count: 15 },
    { week: "S-4", count: 10 },
    { week: "S-3", count: 18 },
    { week: "S-2", count: 22 },
    { week: "S-1", count: 25 },
    { week: "Active", count: 28 },
  ];

  // Weakest subjects mock list
  const weakSubjects = [
    { name: "Gynécologie Obstétrique", score: 45, tint: "red" },
    { name: "Anatomie (Plexus Brachial)", score: 58, tint: "red" },
    { name: "Pédiatrie (Croissance)", score: 65, tint: "accent" }
  ];

  // Full history list
  const historyList = [
    { date: "Aujourd'hui, 14:20", mode: "Libre", lesson: "Insuffisance Cardiaque", score: "8/10", precision: "80%" },
    { date: "Hier, 18:30", mode: "Blitz", lesson: "Contre la montre", score: "14 pts", precision: "70%" },
    { date: "26 Mai, 20:15", mode: "Salle", lesson: "Membre Supérieur", score: "🥇 1er/4", precision: "90%" },
    { date: "25 Mai, 09:12", mode: "Libre", lesson: "Rachitisme Carentiel", score: "9/10", precision: "90%" },
    { date: "24 Mai, 16:45", mode: "Blitz", lesson: "Contre la montre", score: "22 pts", precision: "84%" }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-teal-dark">Analyses de Performance</h1>
            <p className="text-text-mid text-sm mt-1">
              Visualisez l'état d'avancement de votre préparation clinique.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-brand/20 p-4 border border-border-brand rounded-sm text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-teal-dark flex items-center gap-1">
              <Filter className="w-4 h-4" /> Filtres :
            </span>
            
            {/* Time toggle */}
            <div className="flex border border-border-brand rounded-sm bg-white-brand overflow-hidden">
              <button
                onClick={() => setTimeFilter("7")}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  timeFilter === "7" ? "bg-teal text-white" : "text-text-mid hover:bg-gray-50"
                }`}
              >
                7 jours
              </button>
              <button
                onClick={() => setTimeFilter("30")}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  timeFilter === "30" ? "bg-teal text-white" : "text-text-mid hover:bg-gray-50"
                }`}
              >
                30 jours
              </button>
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  timeFilter === "all" ? "bg-teal text-white" : "text-text-mid hover:bg-gray-50"
                }`}
              >
                Tout
              </button>
            </div>

            {/* Mode toggle */}
            <div className="flex border border-border-brand rounded-sm bg-white-brand overflow-hidden">
              {["Tous", "Libre", "Blitz", "Salle"].map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                    modeFilter === m ? "bg-teal text-white" : "text-text-mid hover:bg-gray-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 1 - 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 flex flex-col justify-between h-full relative border-l-4 border-teal">
            <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Sessions Résolues</span>
            <span className="font-mono text-3xl font-extrabold text-teal-dark mt-2">142</span>
          </Card>
          
          <Card className="p-5 flex flex-col justify-between h-full relative border-l-4 border-teal-light">
            <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Précision Moyenne</span>
            <span className="font-mono text-3xl font-extrabold text-teal-dark mt-2">78.4%</span>
          </Card>

          <Card className="p-5 flex flex-col justify-between h-full relative border-l-4 border-accent-brand">
            <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Questions Répondues</span>
            <span className="font-mono text-3xl font-extrabold text-teal-dark mt-2">1,420</span>
          </Card>

          <Card className="p-5 flex flex-col justify-between h-full relative border-l-4 border-teal-dark">
            <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">Meilleur Streak</span>
            <span className="font-mono text-3xl font-extrabold text-teal-dark mt-2 flex items-center gap-1">
              🔥 22j
            </span>
          </Card>
        </div>

        {/* Row 2 - 2 Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Left: Precision Line Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
              <TrendingUp className="w-5 h-5 text-teal" />
              Précision sur 30 jours
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={precisionHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} />
                  <XAxis dataKey="day" stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555555" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      border: "1px solid rgba(28,28,28,0.1)",
                      fontSize: "12px",
                      fontFamily: "var(--font-outfit)"
                    }}
                  />
                  <Line type="monotone" dataKey="precision" stroke="#0E7C7B" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart Right: Subject Performance Radar Chart */}
          <Card className="p-6">
            <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
              <Award className="w-5 h-5 text-accent-brand" />
              Performance par matière
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={subjectRadarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#555555", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#999999", fontSize: 8 }} />
                  <Radar name="Score moyen" dataKey="score" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row 3 - Weekly session bar chart */}
        <Card className="p-6">
          <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand/40 pb-3 mb-4">
            <BookOpen className="w-5 h-5 text-teal" />
            Sessions complétées par semaine
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#555555" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid rgba(28,28,28,0.1)",
                    fontSize: "12px",
                    fontFamily: "var(--font-outfit)"
                  }}
                />
                <Bar dataKey="count" fill="#0A3D3D" radius={[3, 3, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Row 4 - 2 Columns (Weakest and History log) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Weakest list - 40% */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-border-brand/40 pb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-dark uppercase tracking-wider font-mono">Matières les plus faibles</span>
                </div>
                
                <div className="space-y-4 pt-2">
                  {weakSubjects.map((sub, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-text-dark">{sub.name}</span>
                        <span className="font-mono font-bold text-red-600">{sub.score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sub.tint === "red" ? "bg-red-500" : "bg-accent-brand"
                          }`}
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <Link href="/lessons">
                  <Button variant="secondary" size="sm" className="flex items-center gap-1 text-xs">
                    Réviser ces modules <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Session history - 60% */}
          <div className="lg:col-span-3">
            <Card className="p-6 h-full">
              <div className="border-b border-border-brand/40 pb-2 mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-dark uppercase tracking-wider font-mono">Historique des sessions</span>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-brand/40 text-text-light font-semibold uppercase font-mono pb-2">
                      <th className="py-2 px-1">Mode</th>
                      <th className="py-2 px-1">Leçon</th>
                      <th className="py-2 px-1">Score</th>
                      <th className="py-2 px-1">Précision</th>
                      <th className="py-2 px-1 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-brand/20">
                    {historyList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-surface-brand/5">
                        <td className="py-2.5 px-1">
                          <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            item.mode === "Blitz"
                              ? "bg-accent-brand/10 text-accent-brand border border-accent-brand/20"
                              : item.mode === "Libre"
                              ? "bg-teal/10 text-teal border border-teal/20"
                              : "bg-teal-light/15 text-teal-dark border border-teal-light/20"
                          }`}>
                            {item.mode}
                          </span>
                        </td>
                        <td className="py-2.5 px-1 font-semibold text-text-dark">{item.lesson}</td>
                        <td className="py-2.5 px-1 font-mono font-bold text-teal">{item.score}</td>
                        <td className="py-2.5 px-1 font-mono text-text-mid">{item.precision}</td>
                        <td className="py-2.5 px-1 text-right text-text-light">{item.date.split(",")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
