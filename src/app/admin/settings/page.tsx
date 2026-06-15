"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Settings, Save, AlertTriangle } from "lucide-react";

export default function AdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [blitzLimit, setBlitzLimit] = useState(3);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Paramètres de la plateforme Agora enregistrés !");
    }, 1000);
  };

  return (
    <SidebarLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-16 select-none">
        
        {/* Navigation Actions */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-serif text-3xl font-bold text-green-dark flex items-center gap-2">
              <Settings className="w-8 h-8 text-green-mid" /> Configuration Générale
            </h1>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {/* Settings categories */}
        <div className="space-y-6">
          {/* Category 1: Platform safety */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-2.5">
              Sécurité et Maintenance
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-semibold text-text-dark block">Mode Maintenance</span>
                  <p className="text-[11px] text-text-light leading-relaxed">
                    Bloque l'accès aux pages de révision des étudiants pour effectuer des migrations sur la base de données.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="accent-green-mid w-5 h-5 cursor-pointer shrink-0 mt-1"
                />
              </div>

              {maintenanceMode && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                  <div>
                    <strong>Attention :</strong> L'activation de ce flag affichera une page de maintenance pour tous les utilisateurs non-administrateurs.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Category 2: Mode constraints */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-2.5">
              Limites du Mode Blitz
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <label className="font-semibold text-text-dark block">Nombre maximal de tentatives quotidiennes</label>
                <p className="text-[11px] text-text-light leading-relaxed mb-2">
                  Limite le nombre de fois qu'un étudiant non-premium peut démarrer une session Blitz par jour (les serveurs mondiaux de classement étant sollicités).
                </p>
                <select
                  value={blitzLimit}
                  onChange={(e) => setBlitzLimit(Number(e.target.value))}
                  className="p-2 border border-border-brand bg-white rounded-sm text-xs text-text-dark focus:outline-none"
                >
                  <option value={3}>3 tentatives / jour</option>
                  <option value={5}>5 tentatives / jour</option>
                  <option value={10}>10 tentatives / jour</option>
                  <option value={999}>Illimité</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
