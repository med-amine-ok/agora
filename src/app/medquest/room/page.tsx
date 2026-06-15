"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import { ChevronLeft, Users, Zap, Plus, ArrowRight, Clipboard } from "lucide-react";

export default function RoomLobbySetup() {
  const router = useRouter();
  const { user } = useUserStore();
  const { createRoom, joinRoom } = useRoomStore();

  // Create Room state
  const [subject, setSubject] = useState("Cardiologie");
  const [questionCount, setQuestionCount] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [creating, setCreating] = useState(false);

  // Join Room state
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const subjects = ["Cardiologie", "Anatomie", "Biochimie", "Neurologie"];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    try {
      const roomId = await createRoom(subject, questionCount, maxPlayers, user);
      router.push(`/medquest/room/${roomId}/lobby`);
    } catch (err: any) {
      alert(err.message || "Erreur lors de la création du salon.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    if (!user || inviteCode.length !== 6) {
      setJoinError("Veuillez saisir un code à 6 caractères.");
      return;
    }
    setJoining(true);
    try {
      const roomId = await joinRoom(inviteCode.toUpperCase(), user);
      router.push(`/medquest/room/${roomId}/lobby`);
    } catch (err: any) {
      setJoinError(err.message || "Code invalide ou salon inexistant.");
    } finally {
      setJoining(false);
    }
  };

  const mockActiveRooms = [
    { code: "CARD5X", subject: "Cardiologie", host: "Lina", players: "3/6", status: "En attente" },
    { code: "ANAT8W", subject: "Anatomie", host: "Ali", players: "2/4", status: "En attente" }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Page Header */}
        <div className="space-y-2">
          <Link
            href="/medquest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid"
          >
            <ChevronLeft className="w-4 h-4" /> Retour au hub
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark">
            Salons Multijoueurs
          </h1>
          <p className="text-text-mid text-sm">
            Créez une salle d'étude privée ou rejoignez des collègues de promotion en direct.
          </p>
        </div>

        {/* Create vs Join Split Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Room Form */}
          <Card className="p-6 border-border-brand/40 space-y-4">
            <h3 className="font-bold text-green-dark text-lg flex items-center gap-2 border-b border-border-brand/40 pb-2">
              <Plus className="w-5 h-5 text-green-mid" /> Créer un Salon
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-dark uppercase">Matière du Quiz</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:border-green-mid"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-dark uppercase">Questions</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none"
                  >
                    {[10, 20, 30].map(c => <option key={c} value={c}>{c} QCMs</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-dark uppercase">Joueurs Max</label>
                  <select
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full p-2.5 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none"
                  >
                    {[2, 4, 6, 8, 10].map(p => <option key={p} value={p}>{p} Joueurs</option>)}
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={creating} className="w-full py-3 flex items-center justify-center gap-2 mt-2">
                {creating ? "Création du salon..." : "Lancer le salon privé"}
              </Button>
            </form>
          </Card>

          {/* Join Room Form */}
          <Card className="p-6 border-border-brand/40 space-y-4">
            <h3 className="font-bold text-green-dark text-lg flex items-center gap-2 border-b border-border-brand/40 pb-2">
              <Users className="w-5 h-5 text-blue-accent" /> Rejoindre un Salon
            </h3>

            <form onSubmit={handleJoin} className="space-y-4 flex flex-col h-full justify-between">
              <div className="space-y-3">
                <p className="text-text-mid text-xs leading-relaxed">
                  Saisissez le code d'invitation à 6 caractères fourni par l'hôte de la session d'étude.
                </p>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-dark uppercase">Code d'invitation</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="CODE6X"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full p-3 border border-border-brand bg-white rounded-sm text-lg font-mono font-bold uppercase tracking-widest text-center focus:outline-none focus:border-green-mid"
                  />
                </div>

                {joinError && (
                  <p className="text-xs text-error-brand font-semibold text-center">{joinError}</p>
                )}
              </div>

              <Button type="submit" disabled={joining} variant="secondary" className="w-full py-3 flex items-center justify-center gap-2 mt-4">
                {joining ? "Connexion..." : "Se connecter au salon"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Invited / Active Rooms list */}
        <Card className="p-6">
          <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 mb-4">
            Salons Actifs de votre Promotion
          </h3>
          <div className="space-y-3">
            {mockActiveRooms.map((rm) => (
              <div key={rm.code} className="flex flex-wrap items-center justify-between p-3.5 bg-beige-light border border-border-brand/35 rounded-sm hover:border-green-mid transition-all">
                <div className="flex items-center gap-3.5">
                  <span className="font-mono font-bold text-sm bg-green-dark/5 text-green-dark border border-green-mid/20 px-2.5 py-1 rounded-sm">
                    {rm.code}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-green-dark block">{rm.subject}</span>
                    <span className="text-[10px] text-text-light font-mono">Créé par @{rm.host}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-text-mid font-semibold">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {rm.players}</span>
                  <button 
                    onClick={() => {
                      setInviteCode(rm.code);
                    }}
                    className="text-blue-accent hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    Insérer code <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </SidebarLayout>
  );
}
