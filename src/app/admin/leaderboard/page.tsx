"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Search, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

interface LeaderboardRecord {
  rank: number;
  name: string;
  points: number;
  streak: number;
  email: string;
}

export default function AdminLeaderboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<LeaderboardRecord[]>([
    { rank: 1, name: "Meriem Bensalah", points: 1540, streak: 12, email: "meriem@agora.dz" },
    { rank: 2, name: "Dr. Amine Bensalah", points: 1240, streak: 14, email: "amine@agora.dz" },
    { rank: 3, name: "Youcef Khelifi", points: 1180, streak: 8, email: "youcef@agora.dz" },
    { rank: 4, name: "Yanis Algiers", points: 980, streak: 10, email: "yanis@agora.dz" },
    { rank: 5, name: "Lina Chaoui", points: 890, streak: 6, email: "lina@agora.dz" }
  ]);

  const handleResetScore = (name: string) => {
    if (confirm(`Voulez-vous réinitialiser le score Blitz de ${name} ?`)) {
      setRecords(records.map(r => {
        if (r.name === name) {
          return { ...r, points: 0, streak: 0 };
        }
        return r;
      }));
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Navigation Actions */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <h1 className="font-serif text-3xl font-bold text-green-dark">Modération des Classements</h1>
          <p className="text-text-mid text-sm mt-1">
            Gérez le classement du Mode Blitz et modérez les scores anormaux ou frauduleux.
          </p>
        </div>

        {/* Search */}
        <Card className="p-4 flex gap-4 items-center justify-between border-border-brand/40 text-sm">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Rechercher un carabin par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light" />
          </div>
        </Card>

        {/* Table */}
        <Card className="p-6">
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                  <th className="py-3 px-2">Rang</th>
                  <th className="py-3 px-2">Nom complet</th>
                  <th className="py-3 px-2">Points Blitz</th>
                  <th className="py-3 px-2">Série Max</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-beige-base/20 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-green-dark">#{idx + 1}</td>
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-text-dark block">{r.name}</span>
                      <span className="text-[10px] text-text-light font-mono">{r.email}</span>
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-green-mid">{r.points} pts</td>
                    <td className="py-3.5 px-2 font-mono text-text-mid">🔥 {r.streak}j</td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => handleResetScore(r.name)}
                        className="p-1.5 border border-border-brand text-text-light hover:text-amber-600 rounded-sm bg-white cursor-pointer"
                        title="Réinitialiser le score"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
