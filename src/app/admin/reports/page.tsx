"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, ShieldAlert, Check, AlertCircle } from "lucide-react";

interface ContentReport {
  id: string;
  type: "Contradiction" | "Typo" | "Réponse Fausse";
  location: string;
  reporter: string;
  description: string;
  status: "unresolved" | "resolved";
}

export default function AdminReports() {
  const [reports, setReports] = useState<ContentReport[]>([
    { id: "r1", type: "Réponse Fausse", location: "QCM #241 (Pédiatrie)", reporter: "youcef_k", description: "La supplémentation de vitamine D en Algérie pour un allaitement exclusif doit être de 400 à 800 UI par jour selon les recommandations locales révisées, or la correction indique 100 UI.", status: "unresolved" },
    { id: "r2", type: "Contradiction", location: "Cours d'Insuffisance Cardiaque", reporter: "meriem_b", description: "Le texte mentionne d'abord les IEC en thérapeutique de 1ère intention, mais un encadré plus bas contredit en disant d'initier uniquement les bêta-bloquants.", status: "unresolved" },
    { id: "r3", type: "Typo", location: "QCM #189 (Cardiologie)", reporter: "lina_ch", description: "Erreur de frappe dans l'énoncé du choix C: 'dihydropiridiniques' au lieu de 'dihydropyridiniques'.", status: "resolved" }
  ]);

  const handleResolve = (id: string) => {
    setReports(reports.map(r => {
      if (r.id === id) {
        return { ...r, status: "resolved" };
      }
      return r;
    }));
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
          <h1 className="font-serif text-3xl font-bold text-green-dark flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-green-mid" /> Rapports & Signalements
          </h1>
          <p className="text-text-mid text-sm mt-1">
            Traitez les signalements d'erreurs rédigés par les carabins de la plateforme Agora.
          </p>
        </div>

        {/* Reports Table */}
        <Card className="p-6">
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border border-border-brand/40 bg-white-brand rounded-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 max-w-2xl text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                      report.type === "Réponse Fausse" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {report.type}
                    </span>
                    <span className="font-semibold text-green-dark">{report.location}</span>
                    <span className="text-[10px] text-text-light font-mono">Signalé par @{report.reporter}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-text-mid leading-relaxed">
                    {report.description}
                  </p>
                </div>
                
                <div className="shrink-0 self-end sm:self-center">
                  {report.status === "resolved" ? (
                    <span className="text-xs text-green-mid font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Résolu
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => handleResolve(report.id)} className="flex items-center gap-1 text-xs">
                      <Check className="w-3.5 h-3.5" /> Résoudre
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
