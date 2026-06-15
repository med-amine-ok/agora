"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Users, Trash2 } from "lucide-react";

interface AdminRoom {
  code: string;
  subject: string;
  host: string;
  playerCount: number;
  maxPlayers: number;
  status: "lobby" | "playing" | "results";
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<AdminRoom[]>([
    { code: "CARD5X", subject: "Cardiologie", host: "Lina Chaoui", playerCount: 3, maxPlayers: 6, status: "lobby" },
    { code: "ANAT8W", subject: "Anatomie", host: "Ali Larbi", playerCount: 2, maxPlayers: 4, status: "lobby" },
    { code: "PED9K3", subject: "Pédiatrie", host: "Meriem Bensalah", playerCount: 4, maxPlayers: 8, status: "playing" }
  ]);

  const handleCloseRoom = (code: string) => {
    if (confirm(`Voulez-vous forcer la fermeture du salon ${code} ?`)) {
      setRooms(rooms.filter(r => r.code !== code));
    }
  };

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
          <h1 className="font-serif text-3xl font-bold text-green-dark">Salons Actifs</h1>
          <p className="text-text-mid text-sm mt-1">
            Supervisez les salons d'études multijoueurs créés en temps réel et fermez-les en cas d'abus.
          </p>
        </div>

        {/* Room Table */}
        <Card className="p-6">
          {rooms.length === 0 ? (
            <p className="text-sm text-text-light text-center py-6">Aucun salon actif pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                    <th className="py-3 px-2">Code Unique</th>
                    <th className="py-3 px-2">Matière</th>
                    <th className="py-3 px-2">Créateur (Hôte)</th>
                    <th className="py-3 px-2">Joueurs</th>
                    <th className="py-3 px-2">Statut</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border-brand/20">
                  {rooms.map((r) => (
                    <tr key={r.code} className="hover:bg-beige-base/20 transition-colors">
                      <td className="py-3.5 px-2">
                        <span className="font-mono font-bold text-green-dark bg-green-dark/5 border border-green-mid/10 px-2.5 py-1 rounded-sm">
                          {r.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-text-dark">{r.subject}</td>
                      <td className="py-3.5 px-2 text-text-mid font-semibold">{r.host}</td>
                      <td className="py-3.5 px-2 font-mono text-text-mid flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {r.playerCount} / {r.maxPlayers}
                      </td>
                      <td className="py-3.5 px-2 capitalize">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          r.status === "playing"
                            ? "bg-amber-50 text-amber-700 animate-pulse"
                            : r.status === "results"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                          {r.status === "playing" ? "En jeu" : r.status === "results" ? "Résultats" : "Attente"}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => handleCloseRoom(r.code)}
                          className="p-1.5 border border-border-brand text-text-light hover:text-red-600 rounded-sm bg-white cursor-pointer"
                          title="Fermer le salon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </SidebarLayout>
  );
}
