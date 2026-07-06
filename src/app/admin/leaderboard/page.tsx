"use client";

import React, { useState } from "react";
import { 
  Award, 
  Search, 
  RefreshCw, 
  Download, 
  Trophy, 
  Medal,
  Calendar
} from "lucide-react";

interface TopStudent {
  rank: number;
  name: string;
  accuracy: string;
  xp: number;
  faculty: string;
}

const mockWeeklyLeaderboard: TopStudent[] = [
  { rank: 1, name: "Sarah Bouhired", accuracy: "94.2%", xp: 850, faculty: "Faculté d'Alger" },
  { rank: 2, name: "Amine Khelil", accuracy: "79.1%", xp: 720, faculty: "Faculté d'Alger" },
  { rank: 3, name: "Ryad Merad", accuracy: "72.4%", xp: 540, faculty: "Faculté d'Oran" }
];

const mockMonthlyLeaderboard: TopStudent[] = [
  { rank: 1, name: "Sarah Bouhired", accuracy: "92.1%", xp: 2450, faculty: "Faculté d'Alger" },
  { rank: 2, name: "Karima Tali", accuracy: "84.5%", xp: 1530, faculty: "Faculté de Constantine" },
  { rank: 3, name: "Amine Khelil", accuracy: "72.4%", xp: 1240, faculty: "Faculté d'Alger" }
];

export default function LeaderboardManagementPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [rankings, setRankings] = useState<TopStudent[]>(mockWeeklyLeaderboard);

  const handlePeriodChange = (val: "weekly" | "monthly") => {
    setPeriod(val);
    setRankings(val === "weekly" ? mockWeeklyLeaderboard : mockMonthlyLeaderboard);
  };

  const handleResetSeason = () => {
    if (confirm("Réinitialiser le classement de la saison actuelle ? Cette action est irréversible et archivera les données.")) {
      setRankings([]);
      alert("Classement saisonnier réinitialisé.");
    }
  };

  const handleExportRankings = () => {
    alert("Exportation du classement au format CSV effectuée.");
  };

  const filteredRankings = rankings.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" /> Classements & Compétitions
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Supervisez le classement des étudiants, gérez les saisons de duels et exportez les rapports.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleResetSeason}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-error/10 text-error hover:bg-error/5 text-xs font-semibold transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Réinitialiser la Saison
          </button>
          <button 
            onClick={handleExportRankings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal/10 bg-white-custom p-4 rounded-xl shadow-sm">
        <div className="flex bg-surface p-1 rounded-lg">
          <button
            onClick={() => handlePeriodChange("weekly")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              period === "weekly" ? "bg-white-custom text-teal shadow-xs" : "text-text-light hover:text-teal"
            }`}
          >
            Hebdomadaire
          </button>
          <button
            onClick={() => handlePeriodChange("monthly")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              period === "monthly" ? "bg-white-custom text-teal shadow-xs" : "text-text-light hover:text-teal"
            }`}
          >
            Mensuel
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Rechercher un candidat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark placeholder-text-light/50"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-light/50" />
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="border border-teal/10 bg-white-custom rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-teal/10 bg-surface/20 text-text-light uppercase tracking-wider font-mono text-[10px]">
                <th className="p-4 w-16">Rang</th>
                <th className="p-4">Candidat</th>
                <th className="p-4">Faculté / Établissement</th>
                <th className="p-4">Précision Moyenne</th>
                <th className="p-4 text-right">Points Gagnés</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.length > 0 ? (
                filteredRankings.map((std) => (
                  <tr key={std.rank} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                    <td className="p-4">
                      {std.rank === 1 ? (
                        <Medal className="h-5 w-5 text-accent" />
                      ) : std.rank === 2 ? (
                        <Medal className="h-5 w-5 text-text-light" />
                      ) : (
                        <span className="font-mono font-bold text-text-light pl-1">{std.rank}</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-text-dark">{std.name}</td>
                    <td className="p-4 text-text-light">{std.faculty}</td>
                    <td className="p-4 font-mono font-bold text-teal">{std.accuracy}</td>
                    <td className="p-4 text-right font-mono font-bold text-accent">{std.xp} XP</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-light/50 italic">
                    Aucun étudiant classé pour cette période
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
