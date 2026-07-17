"use client";

import React, { useState } from "react";
import { useAgoraStore } from "@/store/useAgoraStore";
import { useRouter } from "next/navigation";
import {
  Users as UsersIcon,
  Activity as ActivityIcon,
  HelpCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
  Download,
  AlertTriangle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Monitor
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for registration chart
const registrationData = [
  { date: "17 Juin", count: 850 },
  { date: "24 Juin", count: 960 },
  { date: "01 Juil", count: 1040 },
  { date: "08 Juil", count: 1150 },
  { date: "15 Juil", count: 1247 }
];

// Mock data for sessions by mode
const sessionModeData = [
  { name: "Libre", value: 3870, color: "#0E7C7B", percentage: "46%" },
  { name: "Blitz", value: 2180, color: "#FF6B35", percentage: "26%" },
  { name: "Salle", value: 1420, color: "#5DC8C6", percentage: "17%" },
  { name: "Flashcards", value: 962, color: "#E8A838", percentage: "11%" }
];

interface MockStudent {
  id: string;
  name: string;
  email: string;
  university: string;
  year: string;
  date: string;
}

const mockStudents: MockStudent[] = [
  { id: "1", name: "Amine Khelil", email: "amine.k@univ-alger.dz", university: "USTHB Alger", year: "3ème", date: "Aujourd'hui, 11:20" },
  { id: "2", name: "Sarah Bouhired", email: "sarah.b@univ-alger.dz", university: "Fac Med Alger", year: "4ème", date: "Aujourd'hui, 09:45" },
  { id: "3", name: "Ryad Merad", email: "ryad.m@univ-oran.dz", university: "Univ Oran 1", year: "3ème", date: "Hier, 18:30" },
  { id: "4", name: "Yanis Meziani", email: "yanis@univ-alger.dz", university: "Fac Med Alger", year: "2ème", date: "Hier, 15:10" },
  { id: "5", name: "Lina Chaoui", email: "lina.c@univ-constantine.dz", university: "Univ Constantine", year: "3ème", date: "15 Juil, 10:15" },
  { id: "6", name: "Meriem Bensaoula", email: "meriem.b@univ-tlemcen.dz", university: "Univ Tlemcen", year: "5ème", date: "14 Juil, 16:40" },
  { id: "7", name: "Fares Belkaid", email: "fares.b@univ-alger.dz", university: "Fac Med Alger", year: "3ème", date: "13 Juil, 11:05" },
  { id: "8", name: "Celia Ould", email: "celia.o@univ-bejaia.dz", university: "Univ Bejaia", year: "3ème", date: "12 Juil, 09:20" },
  { id: "9", name: "Sofiane Zebboudj", email: "sofiane.z@univ-alger.dz", university: "USTHB Alger", year: "1ère", date: "11 Juil, 14:15" },
  { id: "10", name: "Nour el Houda", email: "nour.h@univ-annaba.dz", university: "Univ Annaba", year: "4ème", date: "10 Juil, 17:35" }
];

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAgoraStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  // Simple check for roles
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-6 rounded-2xl border border-[#D72638]/25 bg-[#D72638]/5 text-[#D72638] shadow-lg">
          <AlertTriangle className="h-10 w-10 mx-auto mb-3" />
          <h2 className="font-bold text-sm">Accès Restreint</h2>
          <p className="text-xs mt-1">L'autorisation d'administrateur est requise pour afficher ce panneau d'opérations.</p>
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2.5 rounded-full bg-[#FF6B35] text-[#F5FAFA] text-xs font-semibold hover:bg-[#FF6B35]/90 transition-all cursor-pointer"
        >
          S'authentifier comme Admin
        </button>
      </div>
    );
  }

  const currentDateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div className="text-left">
          <h1 className="font-display text-[24px] font-semibold text-[#0D2626]">
            Vue d'ensemble
          </h1>
          <p className="text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Plateforme Agora — {currentDateStr}
          </p>
        </div>
        <button className="h-[34px] px-3.5 border border-[rgba(10,61,61,0.12)] rounded-lg bg-white text-xs font-semibold text-[#3D5C5C] hover:bg-[#F5FAFA] flex items-center gap-2 transition-all cursor-pointer font-sans">
          <Download className="h-4 w-4" />
          <span>Rapport mensuel</span>
        </button>
      </div>

      {/* Attention banner */}
      <div className="bg-[rgba(215,38,56,0.04)] border border-[rgba(215,38,56,0.20)] border-l-4 border-l-[#D72638] rounded-r-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D2626] font-sans">
            <span className="text-[#D72638]">🔴</span>
            <span>12 flashcards en attente de validation</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D2626] font-sans">
            <span className="text-[#E8A838]">🟡</span>
            <span>3 signalements utilisateur à traiter</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D2626] font-sans">
            <span className="text-[#E8A838]">🟡</span>
            <span>2 questions signalées comme incorrectes</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/flashcards")}
          className="self-end sm:self-center px-4 py-1.5 bg-[#D72638] hover:bg-[#D72638]/90 text-white rounded-lg text-xs font-bold transition-all cursor-pointer font-sans"
        >
          Traiter les urgences →
        </button>
      </div>

      {/* 4 Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Utilisateurs */}
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 relative overflow-hidden text-left">
          <h4 className="text-[10px] font-bold text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">
            Utilisateurs
          </h4>
          <p className="text-[28px] font-medium text-[#0D2626] font-mono mt-2 mb-1 leading-none">
            1 247
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#085050] bg-[rgba(14,124,123,0.08)] rounded-full px-2 py-0.5 font-sans">
            <TrendingUp className="h-3 w-3" /> +12 ce mois
          </span>
          <div className="absolute top-4 right-4 h-8 w-8 bg-[#E0F2F2] rounded-lg flex items-center justify-center text-[#0E7C7B]">
            <UsersIcon className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 relative overflow-hidden text-left">
          <h4 className="text-[10px] font-bold text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">
            Sessions
          </h4>
          <p className="text-[28px] font-medium text-[#0D2626] font-mono mt-2 mb-1 leading-none">
            8 432
          </p>
          <span className="text-[11px] text-[#7A9E9E] font-medium font-sans">
            aujourd'hui
          </span>
          <div className="absolute top-4 right-4 h-8 w-8 bg-[#E0F2F2] rounded-lg flex items-center justify-center text-[#0E7C7B]">
            <ActivityIcon className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 relative overflow-hidden text-left">
          <h4 className="text-[10px] font-bold text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">
            Questions
          </h4>
          <p className="text-[28px] font-medium text-[#0D2626] font-mono mt-2 mb-1 leading-none">
            342
          </p>
          <span className="text-[11px] text-[#7A9E9E] font-medium font-sans">
            dans la BDD
          </span>
          <div className="absolute top-4 right-4 h-8 w-8 bg-[#E0F2F2] rounded-lg flex items-center justify-center text-[#0E7C7B]">
            <HelpCircle className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Salles actives */}
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 relative overflow-hidden text-left">
          <h4 className="text-[10px] font-bold text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">
            Salles actives
          </h4>
          <p className="text-[28px] font-medium text-[#0D2626] font-mono mt-2 mb-1 leading-none">
            14
          </p>
          <span className="text-[11px] text-[#7A9E9E] font-medium font-sans">
            en ce moment
          </span>
          <div className="absolute top-4 right-4 h-8 w-8 bg-[#E0F2F2] rounded-lg flex items-center justify-center text-[#0E7C7B]">
            <Trophy className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Line chart */}
        <div className="lg:col-span-2 bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 text-left">
          <h3 className="text-sm font-semibold text-[#0D2626] mb-4 font-sans">
            Inscriptions — 30 derniers jours
          </h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E7C7B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0E7C7B" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(10,61,61,0.05)" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#7A9E9E', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#7A9E9E', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid rgba(10,61,61,0.12)",
                    boxShadow: "0 4px 16px rgba(10,61,61,0.12)"
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#0D2626" }}
                />
                <Area type="monotone" dataKey="count" stroke="#0E7C7B" strokeWidth={2} fillOpacity={1} fill="url(#tealGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Donut chart */}
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-5 text-left flex flex-col">
          <h3 className="text-sm font-semibold text-[#0D2626] mb-4 font-sans">
            Sessions par mode
          </h3>
          <div className="h-[180px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sessionModeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sessionModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-auto grid grid-cols-2 gap-2 text-left">
            {sessionModeData.map((mode, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: mode.color }} />
                <span className="text-xs text-[#3D5C5C] font-sans truncate">{mode.name}</span>
                <span className="text-xs font-semibold text-[#0D2626] ml-auto font-mono">{mode.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden text-left">
        <div className="p-5 border-b border-[rgba(10,61,61,0.08)] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#0D2626] font-sans">
            Inscriptions récentes
          </h3>
          <span className="text-xs text-[#7A9E9E] font-medium font-sans">
            10 derniers utilisateurs inscrits
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F5FAFA] border-b border-[rgba(10,61,61,0.08)]">
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Avatar</th>
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Nom</th>
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Email</th>
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Université</th>
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Année</th>
                <th className="py-2.5 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Date</th>
                <th className="py-2.5 px-4 text-right font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((st) => (
                <tr key={st.id} className="border-b border-[rgba(10,61,61,0.05)] hover:bg-[#F5FAFA] transition-all font-sans group">
                  <td className="py-2 px-4">
                    <div className="h-8 w-8 rounded-full bg-[#E0F2F2] flex items-center justify-center font-bold text-xs text-[#0E7C7B]">
                      {st.name.slice(0, 2).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-2 px-4 font-semibold text-[#0D2626] text-xs">{st.name}</td>
                  <td className="py-2 px-4 text-[#7A9E9E] text-xs">{st.email}</td>
                  <td className="py-2 px-4 text-[#3D5C5C] text-xs">{st.university}</td>
                  <td className="py-2 px-4 text-[#3D5C5C] text-xs">{st.year}</td>
                  <td className="py-2 px-4 text-[#7A9E9E] text-xs">{st.date}</td>
                  <td className="py-2 px-4 text-right relative">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={() => router.push(`/admin/users?id=${st.id}`)}
                        className="px-2 py-1 bg-[rgba(14,124,123,0.10)] text-[#0E7C7B] hover:bg-[#0E7C7B] hover:text-white rounded text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Voir profil
                      </button>
                      <button
                        onClick={() => setActiveRowMenu(activeRowMenu === st.id ? null : st.id)}
                        className="h-7 w-7 rounded-lg hover:bg-[rgba(10,61,61,0.06)] flex items-center justify-center text-[#7A9E9E] hover:text-[#0D2626] cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {activeRowMenu === st.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveRowMenu(null)} />
                        <div className="absolute right-4 mt-1 w-40 bg-white border border-[rgba(10,61,61,0.12)] rounded-lg shadow-lg py-1 z-50 text-left">
                          <button
                            onClick={() => {
                              setActiveRowMenu(null);
                              if (confirm(`Suspendre le compte de ${st.name} ?`)) {
                                alert("Compte suspendu !");
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#0D2626] hover:bg-[#F5FAFA]"
                          >
                            Suspendre
                          </button>
                          <button
                            onClick={() => {
                              setActiveRowMenu(null);
                              if (confirm(`Supprimer définitivement le compte de ${st.name} ?`)) {
                                alert("Compte supprimé !");
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
