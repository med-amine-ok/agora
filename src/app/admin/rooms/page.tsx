"use client";

import React, { useState } from "react";
import { 
  Play, 
  Users, 
  XOctagon, 
  Eye, 
  ShieldAlert, 
  MessageSquare,
  Activity,
  User,
  Radio
} from "lucide-react";

interface GameRoom {
  id: string;
  name: string;
  creator: string;
  players: string[];
  status: "En attente" | "En cours" | "Terminé";
  messages: { sender: string; text: string }[];
}

const mockRooms: GameRoom[] = [
  { id: "R101", name: "Duel Cardiologie Alger", creator: "Yanis M.", players: ["Yanis M.", "Sarah B."], status: "En cours", messages: [{ sender: "Yanis M.", text: "Bonne chance !" }, { sender: "Sarah B.", text: "Merci, que le meilleur gagne !" }] },
  { id: "R102", name: "Blitz Pneumo Session 2", creator: "Fouad B.", players: ["Fouad B.", "Amine K.", "Meriem T."], status: "En attente", messages: [{ sender: "Fouad B.", text: "On attend le 4ème ?" }] },
  { id: "R103", name: "Entraînement Externe Oran", creator: "Ryad M.", players: ["Ryad M."], status: "En attente", messages: [] }
];

export default function RoomsMonitoringPage() {
  const [rooms, setRooms] = useState<GameRoom[]>(mockRooms);
  const [inspectingRoom, setInspectingRoom] = useState<GameRoom | null>(null);

  const handleCloseRoom = (id: string) => {
    if (confirm(`Voulez-vous forcer la fermeture du salon ${id} ?`)) {
      setRooms(prev => prev.filter(r => r.id !== id));
      if (inspectingRoom?.id === id) setInspectingRoom(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <Radio className="h-6 w-6 text-accent animate-pulse" /> Surveillance des Salons Multi-joueurs
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Supervisez les duels en direct, inspectez le chat et fermez les salons inactifs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal animate-ping" />
          <span className="text-[10px] font-mono font-bold text-teal uppercase">Mise à jour en temps réel</span>
        </div>
      </div>

      {/* Main Grid: Rooms List and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rooms List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <Users className="h-4 w-4 text-teal" /> SALONS ACTIFS
          </h3>

          <div className="space-y-3">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className="p-4 rounded-xl border border-teal/10 bg-white-custom shadow-sm hover:border-teal/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-accent">#{room.id}</span>
                    <h4 className="text-sm font-bold text-text-dark">{room.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-text-light">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-teal" /> Créateur: {room.creator}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-teal" /> {room.players.length} joueurs connectés
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    room.status === "En cours" ? "bg-teal/10 text-teal animate-pulse" : "bg-accent/10 text-accent"
                  }`}>
                    {room.status}
                  </span>

                  <button
                    onClick={() => setInspectingRoom(room)}
                    className="p-1.5 rounded border border-teal/10 text-teal hover:bg-teal/5"
                    title="Inspecter le salon"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleCloseRoom(room.id)}
                    className="p-1.5 rounded border border-error/10 text-error hover:bg-error/5"
                    title="Fermer le salon"
                  >
                    <XOctagon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Inspector Panel */}
        <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6">
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
            <ShieldAlert className="h-4 w-4 text-accent" /> INSPECTEUR DE SALON
          </h3>

          {inspectingRoom ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-text-light uppercase block">Identifiant</span>
                <span className="text-sm font-bold text-text-dark font-mono block">#{inspectingRoom.id}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-text-light uppercase block">Joueurs du Salon</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {inspectingRoom.players.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-surface/50 border border-teal/5 text-[10px] font-semibold text-text-main">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-text-light uppercase flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-teal" /> Flux du chat de la room
                </span>
                <div className="p-3 rounded-lg bg-surface/30 border border-teal/5 space-y-2 h-48 overflow-y-auto font-mono text-[10px] text-text-main">
                  {inspectingRoom.messages.length > 0 ? (
                    inspectingRoom.messages.map((m, i) => (
                      <p key={i}>
                        <span className="font-bold text-teal">{m.sender} :</span> {m.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-text-light/50 italic text-center py-4">Aucun message échangé</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleCloseRoom(inspectingRoom.id)}
                className="w-full py-2 rounded-xl bg-error text-white-custom hover:bg-error/90 text-xs font-bold transition-all"
              >
                Fermer le Salon par Force
              </button>
            </div>
          ) : (
            <p className="text-xs text-text-light/60 italic text-center py-12">
              Sélectionnez un salon à inspecter pour analyser les conversations et les joueurs connectés.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
