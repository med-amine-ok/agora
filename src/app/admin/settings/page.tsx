"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Save, 
  Database, 
  AlertOctagon, 
  Shield, 
  Mail, 
  Sliders,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("Agora 2");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [blitzTimer, setBlitzTimer] = useState(15);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [saved, setSaved] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      alert("Sauvegarde de la base de données SQL réussie (agora_backup_2026.sql).");
    }, 1500);
  };

  const handleResetDatabase = () => {
    if (confirm("ATTENTION : Cette action va effacer TOUTES les données utilisateur, les classements et les salons d'Agora. Continuer ?")) {
      const confirmation = prompt("Veuillez saisir 'DANGER_RESET' pour confirmer :");
      if (confirmation === "DANGER_RESET") {
        alert("Base de données réinitialisée aux valeurs par défaut d'usine.");
      } else {
        alert("Action annulée.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <Settings className="h-6 w-6 text-accent" /> Configuration Générale
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Configurez les paramètres globaux d'Agora, ajustez les timers de jeu et gérez la base de données.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Platform Config */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
              <Sliders className="h-4 w-4 text-teal" /> PARAMÈTRES GÉNÉRAUX
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Nom du site</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Inscriptions</label>
                <select
                  value={registrationOpen ? "open" : "closed"}
                  onChange={(e) => setRegistrationOpen(e.target.value === "open")}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                >
                  <option value="open">Ouvertes à tous les étudiants</option>
                  <option value="closed">Fermées / Sur invitation</option>
                </select>
              </div>
            </div>
          </div>

          {/* MedQuest Game Rules defaults */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
              <Shield className="h-4 w-4 text-accent" /> CONFIGURATION DE JEU (MEDQUEST)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Durée d'une question Blitz (sec)</label>
                <input
                  type="number"
                  value={blitzTimer}
                  onChange={(e) => setBlitzTimer(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                  min={5}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Capacité max par salon</label>
                <input
                  type="number"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                  min={2}
                  max={8}
                />
              </div>
            </div>
          </div>

          {/* Notification / Email config */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
              <Mail className="h-4 w-4 text-teal" /> PARAMÈTRES E-MAILS ET ALÈRTES
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-text-main font-semibold">
                <input type="checkbox" defaultChecked /> Alerter les administrateurs pour chaque nouveau signalement
              </label>
              <label className="flex items-center gap-2 text-xs text-text-main font-semibold">
                <input type="checkbox" defaultChecked /> Envoyer un résumé hebdomadaire des scores aux étudiants
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal hover:bg-teal-dark text-white-custom text-xs font-bold transition-all shadow-sm"
            >
              <Save className="h-4 w-4" />
              {saved ? "Modifications Enregistrées !" : "Enregistrer la Configuration"}
            </button>
          </div>
        </div>

        {/* Right Column: DB actions & Danger Zone */}
        <div className="space-y-6">
          {/* Backups & DB Info */}
          <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-text-dark flex items-center gap-1.5 border-b border-teal/5 pb-2">
              <Database className="h-4 w-4 text-teal" /> GESTION DES BACKUPS
            </h3>

            <p className="text-xs text-text-main leading-relaxed">
              Effectuez des sauvegardes instantanées de la base de données SQL pour prévenir toute perte de données.
            </p>

            <button
              type="button"
              onClick={handleBackup}
              disabled={backingUp}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-teal/10 hover:bg-surface text-xs font-bold text-text-dark transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-teal ${backingUp ? "animate-spin" : ""}`} />
              {backingUp ? "Sauvegarde en cours..." : "Lancer une Sauvegarde"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl border border-error/20 bg-error/5 shadow-sm space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-error flex items-center gap-1.5 border-b border-error/10 pb-2">
              <AlertOctagon className="h-4 w-4 text-error" /> ZONE DE DANGER
            </h3>

            <p className="text-[11px] text-error leading-relaxed">
              Les actions suivantes détruisent de façon irréversible les enregistrements de production. Soyez vigilant.
            </p>

            <button
              type="button"
              onClick={handleResetDatabase}
              className="w-full py-2 rounded-xl bg-error text-white-custom hover:bg-error/90 text-xs font-bold transition-all shadow-sm"
            >
              Réinitialiser la Plateforme
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
