"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Download,
  Calendar,
  Layers,
  BookOpen
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

const mockUserGrowth = [
  { month: "Jan", users: 400, active: 240 },
  { month: "Fév", users: 600, active: 380 },
  { month: "Mar", users: 800, active: 510 },
  { month: "Avr", users: 950, active: 620 },
  { month: "Mai", users: 1100, active: 780 },
  { month: "Juin", users: 1280, active: 940 }
];

const mockSubjectPopularity = [
  { name: "Cardiologie", value: 450, color: "#0E7C7B" },
  { name: "Pneumologie", value: 320, color: "#5DC8C6" },
  { name: "Gastro-entérologie", value: 280, color: "#FF6B35" },
  { name: "Pédiatrie", value: 210, color: "#0A3D3D" },
  { name: "Gynécologie", value: 160, color: "#E0F2F2" }
];

const mockQuizCompletion = [
  { day: "Lun", complétés: 85, ratés: 12 },
  { day: "Mar", complétés: 94, ratés: 8 },
  { day: "Mer", complétés: 120, ratés: 15 },
  { day: "Jeu", complétés: 110, ratés: 11 },
  { day: "Ven", complétés: 98, ratés: 14 },
  { day: "Sam", complétés: 76, ratés: 6 },
  { day: "Dim", complétés: 82, ratés: 9 }
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("6m");
  const [exported, setExported] = useState(false);

  const triggerExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-accent" /> Analyses Détaillées
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Mesurez l'engagement des étudiants, la rétention et la complétion des modules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs font-semibold text-text-dark outline-none focus:border-teal"
          >
            <option value="7d">7 Derniers jours</option>
            <option value="30d">30 Derniers jours</option>
            <option value="6m">6 Derniers mois</option>
          </select>

          <button 
            onClick={triggerExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            {exported ? "Exporté !" : "Exporter les données"}
          </button>
        </div>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Taux de Rétention (J7)
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            78.4%
          </p>
          <div className="text-[10px] text-teal font-semibold mt-1">
            +2.1% par rapport au mois dernier
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Utilisateurs Actifs Quotidiens
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            482 DAU
          </p>
          <div className="text-[10px] text-text-light mt-1">
            Moyenne de 45 min par session
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Taux de Réussite Moyen
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            74.8%
          </p>
          <div className="text-[10px] text-accent font-semibold mt-1">
            +0.8% sur la cardiologie
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Quiz Complétés ce mois
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            12 400
          </p>
          <div className="text-[10px] text-text-light mt-1">
            85% avec explications lues
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User growth & DAU Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <Users className="h-4 w-4 text-teal" /> CROISSANCE ET UTILISATEURS ACTIFS (DAU)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockUserGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E7C7B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0E7C7B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6E8E8E" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8E8E" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#0E7C7B" fillOpacity={1} fill="url(#colorUsers)" name="Utilisateurs" />
                <Area type="monotone" dataKey="active" stroke="#FF6B35" fillOpacity={1} fill="url(#colorActive)" name="Actifs (DAU)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Popularity */}
        <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <Layers className="h-4 w-4 text-accent" /> POPULARITÉ DES MATIÈRES
          </h3>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockSubjectPopularity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockSubjectPopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {mockSubjectPopularity.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5 text-text-main font-semibold">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="truncate">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Quiz Completion activity */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <BookOpen className="h-4 w-4 text-teal" /> ACTIVITÉ DE COMPLÉTION DES QUIZ PAR JOUR
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockQuizCompletion}>
                <XAxis dataKey="day" stroke="#6E8E8E" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8E8E" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="complétés" fill="#0E7C7B" radius={[4, 4, 0, 0]} name="QCM Réussis" />
                <Bar dataKey="ratés" fill="#FF6B35" radius={[4, 4, 0, 0]} name="QCM Échoués" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
