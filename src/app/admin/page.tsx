"use client";

import React from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import {
  ShieldAlert,
  Users,
  BookOpen,
  HelpCircle,
  Activity,
  AlertTriangle,
  FolderLock,
  MessageSquare,
  Settings,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Étudiants Inscrits", count: "1,240", change: "+12% ce mois", icon: Users, tint: "text-blue-accent bg-blue-light/20" },
    { title: "Matières & Unités", count: "18", change: "42 leçons actives", icon: BookOpen, tint: "text-green-mid bg-green-light/20" },
    { title: "Banque de QCMs", count: "3,892", change: "+145 cette semaine", icon: HelpCircle, tint: "text-amber-600 bg-amber-50" },
    { title: "Signalements actifs", count: "4", change: "2 critiques", icon: ShieldAlert, tint: "text-red-600 bg-red-50" }
  ];

  const quickLinks = [
    { title: "Gestion des Matières", desc: "Trier et ordonner les unités par drag & drop.", href: "/admin/subjects", icon: BookOpen },
    { title: "Gestion des Leçons", desc: "Rédiger et éditer des cours officiels avec TipTap.", href: "/admin/lessons", icon: BookOpen },
    { title: "Banque de Questions", desc: "Importer des QCMs par CSV et configurer la correction.", href: "/admin/questions", icon: HelpCircle },
    { title: "Administration Utilisateurs", desc: "Gérer les permissions des carabins et modérer.", href: "/admin/users", icon: Users },
    { title: "Signalements de Contenu", desc: "Consulter les corrections et signalements d'erreurs.", href: "/admin/reports", icon: ShieldAlert },
    { title: "Configuration Plateforme", desc: "Activer le mode maintenance et les limitations.", href: "/admin/settings", icon: Settings }
  ];

  const recentAlerts = [
    { id: "a1", type: "Rapport", source: "Insuffisance Cardiaque", msg: "Moins de 5 QCMs valides pour cette leçon.", date: "Hier" },
    { id: "a2", type: "Correction", source: "QCM #241 (Pédiatrie)", msg: "Contradiction signalée dans la justification de l'option B.", date: "Il y a 2h" },
    { id: "a3", type: "Alerte", source: "Système", msg: "Taux de réussite anormalement bas en Gynécologie (32%).", date: "Il y a 1 jour" }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-brand pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark flex items-center gap-2">
              <FolderLock className="w-8 h-8 text-green-mid" /> Panneau d'Administration
            </h1>
            <p className="text-text-mid text-sm mt-1">
              Pilotez le contenu académique et modérez l'activité de la plateforme Agora.
            </p>
          </div>
          <div className="text-xs text-amber-800 bg-amber-50 font-semibold border border-amber-200 px-3 py-1.5 rounded-sm">
            🛡️ Mode Super-Administrateur
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-5 flex items-center gap-4 relative overflow-hidden border-border-brand/45">
                <div className={`w-12 h-12 rounded-sm flex items-center justify-center shrink-0 ${stat.tint}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-text-light uppercase tracking-wider block font-bold font-mono">{stat.title}</span>
                  <span className="font-mono text-2xl font-extrabold text-green-dark mt-0.5">{stat.count}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{stat.change}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Management Links (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-green-mid" /> Modules de Gestion
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <Link href={link.href} key={idx} className="block group">
                    <Card className="p-5 h-full flex flex-col justify-between hover:border-green-mid transition-all cursor-pointer">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-green-dark uppercase tracking-wider flex items-center gap-2">
                          <Icon className="w-4 h-4 text-green-mid" /> {link.title}
                        </h4>
                        <p className="text-[11px] text-text-light leading-relaxed">
                          {link.desc}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-green-mid group-hover:underline flex items-center gap-0.5 mt-4">
                        Accéder <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Actionable Alerts & System Logs (1/3) */}
          <div className="space-y-6">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> Alertes et Rapports
            </h3>

            <Card className="p-5 space-y-4">
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="text-xs border-b border-border-brand/20 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase mb-1">
                      <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">{alert.type}</span>
                      <span className="text-text-light">{alert.date}</span>
                    </div>
                    <span className="font-bold text-green-dark block">{alert.source}</span>
                    <p className="text-[11px] text-text-mid leading-relaxed mt-0.5">{alert.msg}</p>
                  </div>
                ))}
              </div>

              <Link href="/admin/reports" className="block text-center pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Voir tous les signalements
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
