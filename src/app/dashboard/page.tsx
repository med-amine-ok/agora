"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useUserStore } from "@/presentation/store/useUserStore";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import {
  Flame,
  CheckCircle,
  BookOpen,
  Play,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const { user, friends } = useUserStore();
  const { startSession } = useQuizStore();

  // Weekly study activity mock data
  const activityData = [
    { name: "Lun", questions: 12 },
    { name: "Mar", questions: 25 },
    { name: "Mer", questions: 18 },
    { name: "Jeu", questions: 35 },
    { name: "Ven", questions: 15 },
    { name: "Sam", questions: 40 },
    { name: "Dim", questions: 22 },
  ];

  // Leaderboard mock data
  const leaderboard = [
    { rank: 1, name: "Meriem Bensalah", points: 1540, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meriem" },
    { rank: 2, name: "Dr. Amine (Vous)", points: 1240, avatar: user?.avatar },
    { rank: 3, name: "Youcef Khelifi", points: 1180, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Youcef" },
    { rank: 4, name: "Yanis Algiers", points: 980, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yanis" },
    { rank: 5, name: "Lina Chaoui", points: 890, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina" },
  ];

  const handleQuickQuiz = (mode: "free" | "blitz" | "room") => {
    if (mode === "free") {
      router.push("/medquest/free");
    } else if (mode === "blitz") {
      router.push("/medquest/blitz");
    } else {
      router.push("/medquest/room/lobby");
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-teal-dark">
              Bonjour, {user?.name.split(" ")[0]}
            </h1>
            <p className="text-text-mid text-sm mt-1">
              Prêt pour votre session d'étude quotidienne ? Vos objectifs vous attendent.
            </p>
          </div>
          <div className="text-xs text-text-light font-mono bg-surface-brand/45 px-3 py-1.5 rounded-sm border border-teal-light/10 w-fit self-start md:self-auto">
            📅 Session active — 27 Mai 2026
          </div>
        </div>

        {/* Row 1 - 3 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Streak */}
          <Card className="flex items-center gap-6 border-l-4 border-accent-brand relative overflow-hidden">
            <div className="w-12 h-12 rounded-sm bg-accent-brand/10 flex items-center justify-center text-accent-brand shrink-0">
              <Flame className="w-7 h-7 fill-accent-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-light uppercase tracking-wider block">Streak Actuel</span>
              <span className="font-mono text-2xl font-bold text-teal-dark mt-0.5">
                {user?.streak} jours
              </span>
            </div>
            <div className="absolute right-4 text-4xl opacity-10 font-mono font-black select-none pointer-events-none">
              STK
            </div>
          </Card>

          {/* Card 2 - Accuracy Ring */}
          <Card className="flex items-center gap-6 border-l-4 border-teal relative overflow-hidden">
            <div className="w-12 h-12 rounded-sm bg-surface-brand flex items-center justify-center text-teal shrink-0">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-light uppercase tracking-wider block">Précision Globale</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-2xl font-bold text-teal-dark">78.4%</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +2.1%
                </span>
              </div>
            </div>
            {/* Tiny SVG progress ring */}
            <div className="relative w-12 h-12 shrink-0">
              <svg width="48" height="48" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#0E7C7B"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 * (1 - 0.784)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-teal-dark">
                78%
              </span>
            </div>
          </Card>

          {/* Card 3 - Total Sessions */}
          <Card className="flex items-center gap-6 border-l-4 border-teal-light relative overflow-hidden">
            <div className="w-12 h-12 rounded-sm bg-teal-light/10 flex items-center justify-center text-teal-light shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-light uppercase tracking-wider block">Sessions Résolues</span>
              <span className="font-mono text-2xl font-bold text-teal-dark mt-0.5">142</span>
            </div>
            <div className="absolute right-4 text-4xl opacity-10 font-mono font-black select-none pointer-events-none">
              QCM
            </div>
          </Card>
        </div>

        {/* Row 2 - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Column Left (60%): Resume Progress */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col justify-between border-teal-light/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-brand pb-3">
                  <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal" />
                    Reprendre là où vous étiez
                  </h3>
                  <span className="text-xs bg-surface-brand text-teal font-semibold px-2.5 py-0.5 rounded-full">
                    Cardiologie
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-xl font-bold text-text-dark">
                    Traitement de l'Insuffisance Cardiaque
                  </h4>
                  <p className="text-text-mid text-sm leading-relaxed">
                    Module 3 : Les thérapeutiques majeures (Bêta-bloquants, IEC, ARA II, et Inhibiteurs de SGLT2).
                  </p>
                </div>
                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-text-mid">
                    <span>Progression du module</span>
                    <span className="font-mono text-teal">67% lu</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal h-full rounded-full transition-all duration-500" style={{ width: "67%" }} />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <Link href="/lessons/cardiologie/insuffisance-cardiaque">
                  <Button className="flex items-center gap-2">
                    Continuer la leçon
                    <Play className="w-4 h-4 fill-white" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Column Right (40%): MedQuest Quick Launch */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col space-y-4">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2 border-b border-border-brand pb-3">
                <Zap className="w-5 h-5 text-accent-brand" />
                Lancement MedQuest
              </h3>
              <div className="flex flex-col gap-2.5 flex-1 justify-center">
                <button
                  onClick={() => handleQuickQuiz("free")}
                  className="flex items-center justify-between p-3.5 bg-white-brand border border-border-brand rounded-sm hover:border-teal hover:bg-surface-brand/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✏️</span>
                    <div>
                      <h4 className="text-xs font-bold text-teal-dark uppercase tracking-wide">Mode Libre</h4>
                      <p className="text-[11px] text-text-light">Séance d'étude sans stress ni chrono</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-light group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => handleQuickQuiz("blitz")}
                  className="flex items-center justify-between p-3.5 bg-white-brand border border-accent-brand/20 rounded-sm hover:border-accent-brand hover:bg-orange-50/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold text-accent-brand uppercase tracking-wide">Mode Blitz</h4>
                      <p className="text-[11px] text-text-light">Vitesse et survie, classement mondial</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-light group-hover:text-accent-brand group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => handleQuickQuiz("room")}
                  className="flex items-center justify-between p-3.5 bg-white-brand border border-border-brand rounded-sm hover:border-teal-light hover:bg-surface-brand/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <div>
                      <h4 className="text-xs font-bold text-teal-light uppercase tracking-wide">Mode Salle</h4>
                      <p className="text-[11px] text-text-light">Affrontez vos collègues en temps réel</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-light group-hover:text-teal-light group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Row 3 - Weekly Chart (Full Width) */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-brand pb-4 mb-6">
            <div>
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal" />
                Activité de la semaine
              </h3>
              <p className="text-text-mid text-xs mt-0.5">Nombre total de QCMs répondus par jour.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-surface-brand text-teal-dark border border-teal-light/20 rounded-full">
                Moyenne : 24 QCM/jour
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#555555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(14, 124, 123, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid rgba(28,28,28,0.1)",
                    fontSize: "12px",
                    fontFamily: "var(--font-outfit)"
                  }}
                />
                <Bar dataKey="questions" fill="#0E7C7B" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Row 4 - 2 Columns (Friends and Leaderboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Friends online list */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border-brand pb-3 mb-4">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2">
                <Users className="w-5 h-5 text-teal" />
                Amis en ligne
              </h3>
              <Link href="/profile" className="text-xs font-semibold text-teal hover:underline flex items-center gap-1">
                Tous les amis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3.5 flex-1">
              {friends.map((friend: any) => (
                <div key={friend.id} className="flex items-center justify-between p-2 rounded-sm hover:bg-surface-brand/10 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.name}`}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full border border-teal-light/20 bg-teal-dark/5"
                      />
                      {friend.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-light border-2 border-white rounded-full animate-[pulse_4s_infinite]" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate text-text-dark">{friend.name}</span>
                      <span className="text-xs text-text-light truncate font-mono">@{friend.username}</span>
                    </div>
                  </div>
                  <div>
                    {friend.online ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                        friend.status === "in-blitz"
                          ? "bg-accent-brand/10 text-accent-brand border border-accent-brand/20 animate-pulse"
                          : friend.status === "studying"
                          ? "bg-teal/10 text-teal border border-teal/20"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {friend.status === "in-blitz" ? "⚡ En Blitz" : friend.status === "studying" ? "📚 Étudie" : "En ligne"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-light font-medium uppercase font-mono">Hors ligne</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Blitz Leaderboard preview */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border-brand pb-3 mb-4">
              <h3 className="font-bold text-teal-dark font-sans flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-brand" />
                Classement Général
              </h3>
              <Link href="/statistics" className="text-xs font-semibold text-teal hover:underline flex items-center gap-1">
                Classement complet <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2.5 flex-1 justify-center flex flex-col">
              {leaderboard.map((item) => {
                const isCurrentUser = item.name.includes("Vous");
                return (
                  <div
                    key={item.rank}
                    className={`flex items-center justify-between p-2.5 rounded-sm transition-all ${
                      isCurrentUser ? "bg-surface-brand/60 border border-teal-light/20 shadow-sm" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-mono text-sm font-bold w-6 text-center shrink-0 ${
                        item.rank === 1 ? "text-amber-500 text-lg" : item.rank === 2 ? "text-slate-400" : item.rank === 3 ? "text-amber-700" : "text-text-light"
                      }`}>
                        {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                      </span>
                      <img
                        src={item.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.name}`}
                        alt={item.name}
                        className="w-8 h-8 rounded-full border border-teal-light/10 bg-teal-dark/5 shrink-0"
                      />
                      <span className={`text-sm truncate ${isCurrentUser ? "font-bold text-teal-dark" : "text-text-dark"}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-teal">
                      {item.points} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
