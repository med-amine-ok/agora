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
  Radio,
  Tv
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
    <div className="space-y-6 text-left">
      {/* Header banner */}
      <div className="flex items-start justify-between border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div>
          <h1 className="font-display text-[24px] font-semibold text-[#0D2626] flex items-center gap-2">
            <Radio className="h-6 w-6 text-[#FF6B35] animate-pulse" /> Surveillance des Salons Multi-joueurs
          </h1>
          <p className="text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Supervisez les duels cliniques en direct, inspectez le chat des salons et fermez les rooms inactives.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#E0F2F2] px-3 py-1.5 rounded-lg border border-[#0E7C7B]/10 font-sans">
          <span className="h-2 w-2 rounded-full bg-[#0E7C7B] animate-ping" />
          <span className="text-[10px] font-bold text-[#0E7C7B] uppercase tracking-wider">Live stream</span>
        </div>
      </div>

      {/* Main Grid: Rooms List and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Rooms List */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#7A9E9E] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
            <Users className="h-4 w-4 text-[#0E7C7B]" /> SALONS ACTIFS ({rooms.length})
          </h3>

          <div className="space-y-3">
            {rooms.map((room) => (
              <div 
                key={room.id}
                className="p-4 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs hover:border-[rgba(10,61,61,0.15)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#FF6B35]">#{room.id}</span>
                    <h4 className="text-xs font-bold text-[#0D2626]">{room.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[#7A9E9E]">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-[#0E7C7B]" /> Créateur: {room.creator}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-[#0E7C7B]" /> {room.players.length} joueurs connectés
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    room.status === "En cours" ? "bg-[#0E7C7B]/10 text-[#0E7C7B] animate-pulse" : "bg-[#FF6B35]/10 text-[#FF6B35]"
                  }`}>
                    {room.status}
                  </span>

                  <button
                    onClick={() => setInspectingRoom(room)}
                    className="h-8 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-[#0E7C7B] hover:bg-[#F5FAFA] flex items-center justify-center cursor-pointer"
                    title="Inspecter le salon"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    <span className="text-[10px] font-bold">Inspecter</span>
                  </button>

                  <button
                    onClick={() => handleCloseRoom(room.id)}
                    className="h-8 w-8 rounded-lg border border-[rgba(215,38,56,0.15)] text-[#D72638] hover:bg-red-50 flex items-center justify-center cursor-pointer"
                    title="Fermer le salon"
                  >
                    <XOctagon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {rooms.length === 0 && (
              <div className="rounded-xl border border-dashed border-[rgba(10,61,61,0.15)] p-12 text-center space-y-3 bg-white">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F2F2] text-[#0E7C7B]">
                  <Tv className="h-6 w-6" />
                </div>
                <h3 className="font-display text-sm font-bold text-[#0D2626]">Aucun salon actif</h3>
                <p className="text-[12px] text-[#7A9E9E] max-w-sm mx-auto">
                  Il n'y a actuellement aucun salon multi-joueurs en attente ou en cours.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Room Inspector Panel */}
        <div className="p-5 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-5 text-left h-fit">
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#7A9E9E] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
            <ShieldAlert className="h-4 w-4 text-[#FF6B35]" /> INSPECTEUR DE SALON
          </h3>

          {inspectingRoom ? (
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-[#7A9E9E] uppercase tracking-wider block">Identifiant</span>
                <span className="text-xs font-bold text-[#0D2626] font-mono block mt-0.5">#{inspectingRoom.id}</span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-[#7A9E9E] uppercase tracking-wider block">Nom du salon</span>
                <span className="text-xs font-bold text-[#0D2626] block mt-0.5">{inspectingRoom.name}</span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-[#7A9E9E] uppercase tracking-wider block">Membres du salon</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {inspectingRoom.players.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#E0F2F2] border border-[#0E7C7B]/10 text-[10px] font-bold text-[#0E7C7B]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[rgba(10,61,61,0.05)]">
                <span className="text-[9px] font-bold text-[#7A9E9E] uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-[#0E7C7B]" /> Flux du chat de la room
                </span>
                <div className="p-3 rounded-lg bg-[#F5FAFA] border border-[rgba(10,61,61,0.05)] space-y-2 h-44 overflow-y-auto font-mono text-[10px] text-[#3D5C5C]">
                  {inspectingRoom.messages.length > 0 ? (
                    inspectingRoom.messages.map((m, i) => (
                      <p key={i} className="leading-relaxed">
                        <strong className="text-[#0E7C7B]">{m.sender} :</strong> {m.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-[#7A9E9E] italic text-center pt-8">Aucun message échangé.</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleCloseRoom(inspectingRoom.id)}
                className="w-full py-2 bg-[#D72638] text-white hover:bg-[#D72638]/90 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[10px] uppercase tracking-wider shadow-xs mt-2"
              >
                <XOctagon className="h-4 w-4" /> Forcer la fermeture du salon
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-[#7A9E9E] italic text-xs">
              Sélectionnez un salon à inspecter pour surveiller ses logs et son chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
