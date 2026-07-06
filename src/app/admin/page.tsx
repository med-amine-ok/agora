"use client";

import React, { useState } from "react";
import { useAgoraStore } from "@/store/useAgoraStore";
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  Users, 
  PlusCircle, 
  Trash, 
  RefreshCw,
  Play,
  FileText,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Activity,
  Flame
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MockStudentDetail {
  id: string;
  name: string;
  email: string;
  accuracy: string;
  xp: number;
  dateJoined: string;
}

interface MockMCQ {
  id: string;
  question: string;
  module: string;
  answersCount: number;
}

interface MockReport {
  id: string;
  user: string;
  type: "Bug" | "Contenu" | "Utilisateur";
  description: string;
  priority: "Haute" | "Moyenne" | "Basse";
  status: "En attente" | "Résolu";
}

const mockStudentsList: MockStudentDetail[] = [
  { id: "1", name: "Amine Khelil", email: "amine.k@univ-alger.dz", accuracy: "72.4%", xp: 1240, dateJoined: "Aujourd'hui" },
  { id: "2", name: "Sarah Bouhired", email: "sarah.b@univ-alger.dz", accuracy: "92.1%", xp: 2450, dateJoined: "Aujourd'hui" },
  { id: "3", name: "Ryad Merad", email: "ryad.m@univ-oran.dz", accuracy: "68.9%", xp: 950, dateJoined: "Hier" },
  { id: "4", name: "Yanis Meziani", email: "yanis@univ-alger.dz", accuracy: "79.8%", xp: 840, dateJoined: "Il y a 2 jours" }
];

const mockMCQList: MockMCQ[] = [
  { id: "101", question: "Quel tracé ECG évoque un infarctus de la paroi inférieure ?", module: "Cardiologie", answersCount: 4 },
  { id: "102", question: "Quelle est la présentation ECG classique d'une embolie pulmonaire ?", module: "Pneumologie", answersCount: 4 },
  { id: "103", question: "Une élévation de la lipase sérique à 3x la normale suggère :", module: "Gastro-entérologie", answersCount: 4 }
];

const mockReportsList: MockReport[] = [
  { id: "r1", user: "Karima T.", type: "Contenu", description: "Correction requise sur la question ECG #104", priority: "Moyenne", status: "En attente" },
  { id: "r2", user: "Fouad B.", type: "Bug", description: "Bouton de validation inactif sur mobile (Safari)", priority: "Haute", status: "En attente" },
  { id: "r3", user: "Ziri A.", type: "Utilisateur", description: "Nom d'utilisateur inapproprié signalé", priority: "Basse", status: "Résolu" }
];

const systemLogs = [
  "[SYSTÈME] 10:12:11 - Connexion sécurisée établie avec la base de données.",
  "[AUTHENTIFICATION] 10:14:43 - Session initiée pour l'utilisateur : Yanis Meziani.",
  "[ARÈNE] 10:15:22 - Création de salon MedQuest : Blitz #A28D1.",
  "[SYSTÈME] 10:16:02 - Sauvegarde automatique effectuée avec succès."
];

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAgoraStore();
  
  // States
  const [mcqList, setMcqList] = useState<MockMCQ[]>(mockMCQList);
  const [reportsList, setReportsList] = useState<MockReport[]>(mockReportsList);
  const [newQuestion, setNewQuestion] = useState("");
  const [newModule, setNewModule] = useState("Cardiologie");

  const handleAddMCQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newItem: MockMCQ = {
      id: Math.floor(Math.random() * 1000).toString(),
      question: newQuestion,
      module: newModule,
      answersCount: 4
    };

    setMcqList((prev) => [newItem, ...prev]);
    setNewQuestion("");
  };

  const handleDeleteMCQ = (id: string) => {
    setMcqList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResolveReport = (id: string) => {
    setReportsList((prev) => 
      prev.map((rep) => rep.id === id ? { ...rep, status: "Résolu" as const } : rep)
    );
  };

  // Restrict access if not logged in or role is student
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-6 rounded-2xl border border-error/25 bg-error/5 text-error shadow-lg">
          <ShieldCheck className="h-10 w-10 mx-auto mb-3" />
          <h2 className="font-bold text-sm">Accès Restreint</h2>
          <p className="text-xs mt-1">L'autorisation d'administrateur est requise pour afficher ce panneau d'opérations.</p>
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2.5 rounded-full bg-accent text-white-custom text-xs font-semibold hover:bg-accent/90 transition-all"
        >
          S'authentifier comme Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" /> Vue d'ensemble de la Plateforme
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Supervisez les statistiques, les rapports et gérez le contenu d'Agora.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/5 border border-teal/10 text-[10px] font-mono font-bold text-teal">
            <Database className="h-3.5 w-3.5" /> SYNCHRONISATION EN DIRECT
          </span>
        </div>
      </div>

      {/* Operational Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Utilisateurs Totaux
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            1 280
          </p>
          <div className="flex items-center gap-1 text-[10px] text-teal font-semibold mt-1">
            <TrendingUp className="h-3 w-3" /> +14% ce mois-ci
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Salons Actifs (MedQuest)
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            18 Salons
          </p>
          <div className="flex items-center gap-1 text-[10px] text-text-light mt-1">
            <Activity className="h-3 w-3 text-accent" /> 42 joueurs en direct
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Sessions Aujourd'hui
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            342 Sessions
          </p>
          <div className="flex items-center gap-1 text-[10px] text-teal font-semibold mt-1">
            <UserCheck className="h-3 w-3" /> Pic d'activité à 21:00
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-teal/10 bg-surface/30">
          <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
            Questions au Total
          </span>
          <p className="text-2xl font-bold font-mono text-text-dark mt-1">
            4 120 QCM
          </p>
          <div className="flex items-center gap-1 text-[10px] text-text-light mt-1">
            <FileText className="h-3 w-3 text-teal" /> 12 matières médicales
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Large Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Panel */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
              <PlusCircle className="h-4 w-4 text-accent" /> ACTIONS RAPIDES DE GESTION
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => router.push("/admin/questions")}
                className="p-3 text-center rounded-xl border border-teal/10 hover:border-teal bg-surface/10 hover:bg-surface/30 text-xs font-semibold text-text-dark transition-all"
              >
                + Ajouter QCM
              </button>
              <button 
                onClick={() => router.push("/admin/users")}
                className="p-3 text-center rounded-xl border border-teal/10 hover:border-teal bg-surface/10 hover:bg-surface/30 text-xs font-semibold text-text-dark transition-all"
              >
                Gérer Étudiants
              </button>
              <button 
                onClick={() => router.push("/admin/rooms")}
                className="p-3 text-center rounded-xl border border-teal/10 hover:border-teal bg-surface/10 hover:bg-surface/30 text-xs font-semibold text-text-dark transition-all"
              >
                Inspecter Salons
              </button>
              <button 
                onClick={() => router.push("/admin/reports")}
                className="p-3 text-center rounded-xl border border-teal/10 hover:border-teal bg-surface/10 hover:bg-surface/30 text-xs font-semibold text-text-dark transition-all"
              >
                Voir Rapports ({reportsList.filter(r => r.status === "En attente").length})
              </button>
            </div>
          </div>

          {/* Table: Registrations & Reports */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6">
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
                <Users className="h-4 w-4 text-teal" /> INSCRIPTIONS RÉCENTES
              </h3>
              
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-teal/10 text-text-light uppercase tracking-wider font-mono text-[10px]">
                      <th className="py-2.5">Nom</th>
                      <th className="py-2.5">E-mail</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudentsList.map((st) => (
                      <tr key={st.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                        <td className="py-3 font-semibold text-text-dark">{st.name}</td>
                        <td className="py-3 text-text-light">{st.email}</td>
                        <td className="py-3 text-text-light">{st.dateJoined}</td>
                        <td className="py-3 text-right font-mono font-bold text-accent">{st.xp} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
                <AlertTriangle className="h-4 w-4 text-error" /> DERNIERS RAPPORTS SIGNALÉS
              </h3>
              
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-teal/10 text-text-light uppercase tracking-wider font-mono text-[10px]">
                      <th className="py-2.5">Auteur</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Description</th>
                      <th className="py-2.5">Priorité</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsList.map((rep) => (
                      <tr key={rep.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                        <td className="py-3 font-semibold text-text-dark">{rep.user}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            rep.type === "Bug" ? "bg-error/10 text-error" : rep.type === "Contenu" ? "bg-teal/10 text-teal" : "bg-accent/10 text-accent"
                          }`}>
                            {rep.type}
                          </span>
                        </td>
                        <td className="py-3 text-text-main line-clamp-1 max-w-[200px]">{rep.description}</td>
                        <td className="py-3 font-semibold">
                          <span className={`${rep.priority === "Haute" ? "text-error" : rep.priority === "Moyenne" ? "text-accent" : "text-text-light"}`}>
                            {rep.priority}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {rep.status === "En attente" ? (
                            <button
                              onClick={() => handleResolveReport(rep.id)}
                              className="px-2.5 py-1 rounded bg-teal text-white-custom hover:bg-teal-dark text-[10px] font-semibold transition-all"
                            >
                              Résoudre
                            </button>
                          ) : (
                              <span className="text-[10px] text-text-light/50 font-bold font-mono">RÉSOLU</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - System Logs */}
        <div className="space-y-8">
          {/* Live Terminal Log Monitor */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-teal/5 pb-3">
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5">
                <Terminal className="h-4 w-4 animate-pulse text-accent" /> FLUX D'ACTIVITÉ SYSTÈME
              </h3>
            </div>

            <div className="p-4 rounded-lg bg-text-dark border border-teal/10 font-mono text-[10px] text-teal-light space-y-2 h-64 overflow-y-auto">
              {systemLogs.map((log, i) => (
                <p key={i} className="leading-relaxed">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
