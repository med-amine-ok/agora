"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useUserStore } from "@/presentation/store/useUserStore";
import { useRoomStore } from "@/presentation/store/useRoomStore";
import { Zap, Play, Users, History } from "lucide-react";

export default function MedQuestHub() {
  const router = useRouter();
  const { user } = useUserStore();
  const { joinRoom } = useRoomStore();
  const [roomCode, setRoomCode] = useState("");
  const [loadingRoom, setLoadingRoom] = useState(false);

  const recentSessions = [
    { id: 1, mode: "Libre", subject: "Cardiologie", lesson: "Insuffisance Cardiaque", score: "8/10", date: "Hier, 18:30", accuracy: "80%" },
    { id: 2, mode: "Blitz", subject: "Tous", lesson: "Contre la montre", score: "28 pts", date: "26 Mai, 20:15", accuracy: "70%" },
    { id: 3, mode: "Salon", subject: "Anatomie", lesson: "Canal Inguinal", score: "🥇 1er/3", date: "24 Mai, 15:40", accuracy: "100%" }
  ];

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !user) return;
    setLoadingRoom(true);
    try {
      const roomId = await joinRoom(roomCode.trim().toUpperCase(), user);
      router.push(`/medquest/room/${roomId}/lobby`);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'accès au salon.");
    } finally {
      setLoadingRoom(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand/40 pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark">MedQuest Hub</h1>
            <p className="text-text-mid text-sm mt-1">
              Entraînez-vous de manière active et ciblez vos forces et vos faiblesses.
            </p>
          </div>
        </div>

        {/* 3 Large Mode Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1 - Free Mode */}
          <Card borderTint="teal" className="flex flex-col justify-between h-full bg-gradient-to-b from-beige-light to-green-light/5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-sm bg-green-dark/5 border border-green-light/20 flex items-center justify-center text-3xl select-none text-green-mid">
                ✏️
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-dark font-sans">Mode Libre</h3>
                <p className="text-sm text-text-mid leading-relaxed">
                  Entraînez-vous à votre rythme. Sélectionnez une matière, configurez votre séance, et accédez aux fiches d'explications immédiatement après chaque réponse.
                </p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/medquest/free">
                <Button className="w-full flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-white" /> Entraînement Libre
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2 - Blitz Mode */}
          <Card
            borderTint="accent"
            className="flex flex-col justify-between h-full bg-gradient-to-b from-beige-light to-gold-brand/5 relative overflow-hidden shadow-sm border border-gold-brand/35"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-sm bg-gold-brand/10 border border-gold-brand/25 flex items-center justify-center text-3xl select-none text-gold-brand">
                  ⚡
                </div>
                <span className="text-[10px] font-bold tracking-wider font-mono bg-gold-brand text-white px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                  🔥 Classement mondial
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-dark font-sans flex items-center gap-2">
                  Mode Blitz
                </h3>
                <p className="text-sm text-text-mid leading-relaxed">
                  Survivez face à l'horloge. Vous commencez avec 30s. Une bonne réponse vous accorde <strong className="text-green-dark">+5s</strong>, une mauvaise réponse vous pénalise de <strong className="text-error-brand">−5s</strong>.
                </p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/medquest/blitz">
                <Button variant="accent" className="w-full flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 fill-white" /> Lancer le Blitz
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 3 - Room Mode */}
          <Card borderTint="default" className="flex flex-col justify-between h-full bg-gradient-to-b from-beige-light to-blue-accent/5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-sm bg-blue-accent/10 border border-blue-accent/20 flex items-center justify-center text-3xl select-none text-blue-accent">
                👥
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-dark font-sans">Mode Salon</h3>
                <p className="text-sm text-text-mid leading-relaxed">
                  Créez des salons de révisions privés ou rejoignez un salon de promotion pour vous mesurer en direct à d'autres carabins. Classement en temps réel.
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <Link href="/medquest/room">
                <Button variant="outline" className="w-full">
                  Créer un salon d'étude
                </Button>
              </Link>

              {/* Join input inside room mode */}
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code (ex: AX7K)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  disabled={loadingRoom}
                  className="flex-1 px-3 py-2 border border-border-brand rounded-sm text-sm bg-white text-text-dark focus:outline-none focus:border-green-mid uppercase font-mono tracking-widest text-center"
                />
                <Button type="submit" size="sm" variant="secondary" className="px-3.5" disabled={loadingRoom}>
                  {loadingRoom ? "..." : "Rejoindre"}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Recent Sessions Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-border-brand/40 pb-4 mb-4">
            <h3 className="font-bold text-green-dark font-sans flex items-center gap-2">
              <History className="w-5 h-5 text-green-mid" />
              Historique des Sessions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase">
                  <th className="py-3 px-2">Mode</th>
                  <th className="py-3 px-2">Matière</th>
                  <th className="py-3 px-2">Leçon / Défi</th>
                  <th className="py-3 px-2">Score / Points</th>
                  <th className="py-3 px-2">Précision</th>
                  <th className="py-3 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border-brand/20">
                {recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-beige-base/40">
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                        session.mode === "Blitz"
                          ? "bg-gold-brand/10 text-gold-brand border border-gold-brand/20"
                          : session.mode === "Libre"
                          ? "bg-green-mid/10 text-green-mid border border-green-mid/20"
                          : "bg-blue-accent/15 text-blue-dark border border-blue-accent/20"
                      }`}>
                        {session.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-text-dark">{session.subject}</td>
                    <td className="py-3.5 px-2 text-text-mid">{session.lesson}</td>
                    <td className="py-3.5 px-2 font-mono font-bold text-green-dark">{session.score}</td>
                    <td className="py-3.5 px-2 font-mono text-text-mid">{session.accuracy}</td>
                    <td className="py-3.5 px-2 text-right text-text-light text-xs font-semibold">{session.date}</td>
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
