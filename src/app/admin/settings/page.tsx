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
  RefreshCw,
  Server,
  Lock,
  Globe,
  Bell,
  Activity,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

type SettingsTab = "general" | "game" | "security" | "notifications" | "database";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  
  // Settings States
  const [siteName, setSiteName] = useState("Agora 2");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [blitzTimer, setBlitzTimer] = useState(15);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [requireEmailDomain, setRequireEmailDomain] = useState("univ.dz");
  const [enableRecaptcha, setEnableRecaptcha] = useState(true);
  
  // Notifications States
  const [notifyOnReport, setNotifyOnReport] = useState(true);
  const [notifyOnWeeklySummary, setNotifyOnWeeklySummary] = useState(true);
  const [notifyOnHighLatency, setNotifyOnHighLatency] = useState(false);

  // Interaction states
  const [saved, setSaved] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

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

  const runSystemDiagnostics = () => {
    setRunningDiagnostics(true);
    setDiagnosticLogs([]);
    const logs = [
      "Initialisation de l'audit système...",
      "Vérification des connexions à la base de données: OK (Latency 4ms)",
      "Vérification du certificat SSL: Valide (expire dans 240 jours)",
      "Audit des tables de sécurité utilisateur: Aucun compte orphelin détecté",
      "Vérification de l'intégrité de la mémoire cache Redis: OK",
      "Diagnostic terminé. Tous les systèmes sont opérationnels."
    ];
    
    logs.forEach((log, idx) => {
      setTimeout(() => {
        setDiagnosticLogs(prev => [...prev, log]);
        if (idx === logs.length - 1) setRunningDiagnostics(false);
      }, (idx + 1) * 300);
    });
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
    <div className="space-y-6 text-left">
      {/* Header banner */}
      <div className="border-b border-[rgba(10,61,61,0.08)] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-[24px] font-semibold text-[#0D2626] flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#0E7C7B]" /> Configuration Générale
          </h1>
          <p className="text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Configurez les paramètres globaux de la plateforme Agora, ajustez la sécurité et surveillez la base de données.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans items-start">
        {/* Navigation Sidebar Pane */}
        <div className="bg-white rounded-xl border border-[rgba(10,61,61,0.08)] p-2 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "general" ? "bg-[#E0F2F2] text-[#0E7C7B]" : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
            }`}
          >
            <Sliders className="h-4 w-4" /> Général
          </button>
          <button
            onClick={() => setActiveTab("game")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "game" ? "bg-[#E0F2F2] text-[#0E7C7B]" : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
            }`}
          >
            <Shield className="h-4 w-4" /> Règles de Jeu (MedQuest)
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "security" ? "bg-[#E0F2F2] text-[#0E7C7B]" : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
            }`}
          >
            <Lock className="h-4 w-4" /> Sécurité & Accès
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "notifications" ? "bg-[#E0F2F2] text-[#0E7C7B]" : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
            }`}
          >
            <Mail className="h-4 w-4" /> Notifications & E-mails
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === "database" ? "bg-[#E0F2F2] text-[#0E7C7B]" : "text-[#7A9E9E] hover:bg-[#F5FAFA] hover:text-[#0D2626]"
            }`}
          >
            <Database className="h-4 w-4" /> Base de Données
          </button>
        </div>

        {/* Configurations Forms Area */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSave}>
            {activeTab === "general" && (
              <div className="p-6 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-5">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0D2626] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                  <Globe className="h-4 w-4 text-[#0E7C7B]" /> Paramètres Généraux
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Nom du site</label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-semibold"
                        required
                      />
                      <span className="text-[10px] text-[#7A9E9E] block">Nom affiché sur la page d'accueil et le menu étudiant.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Inscriptions</label>
                      <select
                        value={registrationOpen ? "open" : "closed"}
                        onChange={(e) => setRegistrationOpen(e.target.value === "open")}
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-semibold"
                      >
                        <option value="open">Ouvertes à tous les étudiants</option>
                        <option value="closed">Fermées / Sur invitation uniquement</option>
                      </select>
                      <span className="text-[10px] text-[#7A9E9E] block">Détermine si un étudiant externe peut s'inscrire librement.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "game" && (
              <div className="p-6 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-5">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0D2626] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                  <Shield className="h-4 w-4 text-[#FF6B35]" /> Configuration de Jeu (MedQuest)
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Durée d'une question Blitz (sec)</label>
                      <input
                        type="number"
                        value={blitzTimer}
                        onChange={(e) => setBlitzTimer(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono font-bold"
                        min={5}
                      />
                      <span className="text-[10px] text-[#7A9E9E] block">Temps imparti par défaut pour répondre en mode rapide.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Capacité max par salon</label>
                      <input
                        type="number"
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono font-bold"
                        min={2}
                        max={8}
                      />
                      <span className="text-[10px] text-[#7A9E9E] block">Nombre de joueurs maximum autorisés dans une arène active.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-5">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0D2626] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                  <Lock className="h-4 w-4 text-[#0E7C7B]" /> Sécurité & Contrôle d'Accès
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Domaine e-mail exigé</label>
                      <input
                        type="text"
                        value={requireEmailDomain}
                        onChange={(e) => setRequireEmailDomain(e.target.value)}
                        placeholder="univ.dz"
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                      />
                      <span className="text-[10px] text-[#7A9E9E] block">Restreindre l'inscription aux e-mails universitaires (laissez vide pour tout domaine).</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold">Expiration de session administrateur (min)</label>
                      <input
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] font-mono"
                      />
                      <span className="text-[10px] text-[#7A9E9E] block">Temps avant déconnexion automatique de l'interface console admin.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5FAFA] border border-[rgba(10,61,61,0.05)]">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#0D2626]">Activer Google reCAPTCHA v3</h4>
                      <p className="text-[10px] text-[#7A9E9E]">Protège les formulaires d'inscription contre le spam de robots.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={enableRecaptcha}
                        onChange={(e) => setEnableRecaptcha(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0E7C7B]" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-5">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0D2626] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                  <Mail className="h-4 w-4 text-[#0E7C7B]" /> Paramètres des Notifications & E-mails
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5FAFA] border border-[rgba(10,61,61,0.05)]">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#0D2626]">Alerte de signalement instantanée</h4>
                      <p className="text-[10px] text-[#7A9E9E]">Alerter les modérateurs par e-mail en cas de signalement de question ou flashcard.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyOnReport}
                        onChange={(e) => setNotifyOnReport(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0E7C7B]" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5FAFA] border border-[rgba(10,61,61,0.05)]">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#0D2626]">Rapport hebdomadaire étudiant</h4>
                      <p className="text-[10px] text-[#7A9E9E]">Envoyer un résumé des scores et de la progression XP aux utilisateurs le dimanche soir.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyOnWeeklySummary}
                        onChange={(e) => setNotifyOnWeeklySummary(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0E7C7B]" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5FAFA] border border-[rgba(10,61,61,0.05)]">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#0D2626]">Alerte Latence serveur</h4>
                      <p className="text-[10px] text-[#7A9E9E]">Notifier l'équipe technique si le serveur de jeu dépasse 150ms de latence.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyOnHighLatency}
                        onChange={(e) => setNotifyOnHighLatency(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0E7C7B]" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "database" && (
              <div className="space-y-6">
                {/* Database actions card */}
                <div className="p-6 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white shadow-xs space-y-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-[#0D2626] flex items-center gap-1.5 border-b border-[rgba(10,61,61,0.08)] pb-2">
                    <Database className="h-4 w-4 text-[#0E7C7B]" /> Sauvegarde & Audit
                  </h3>

                  <p className="text-xs text-[#214646]">
                    Effectuez une exportation complète de la base de données SQL. Le système produit un instantané structuré.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleBackup}
                      disabled={backingUp}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[#F5FAFA] text-xs font-bold text-[#0D2626] disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`h-4 w-4 text-[#0E7C7B] ${backingUp ? "animate-spin" : ""}`} />
                      {backingUp ? "Backup en cours..." : "Sauvegarder la base de données"}
                    </button>

                    <button
                      type="button"
                      onClick={runSystemDiagnostics}
                      disabled={runningDiagnostics}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#E0F2F2] text-[#0E7C7B] hover:bg-[#E0F2F2]/80 text-xs font-bold disabled:opacity-50 cursor-pointer"
                    >
                      <Server className="h-4 w-4" />
                      Lancer l'audit de sécurité
                    </button>
                  </div>

                  {/* Diagnostic logs output console */}
                  {diagnosticLogs.length > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-[#071F1F] border border-teal-800 text-left space-y-1">
                      <div className="flex items-center justify-between border-b border-teal-900 pb-1.5 mb-2">
                        <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest flex items-center gap-1">
                          <Activity className="h-3 w-3 animate-pulse" /> Console Diagnostics Auditeur
                        </span>
                        {runningDiagnostics && <span className="text-[8px] font-mono text-teal-400 animate-pulse">Exécution...</span>}
                      </div>
                      <div className="space-y-1 font-mono text-[10px] text-teal-100 max-h-40 overflow-y-auto">
                        {diagnosticLogs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <span className="text-teal-500 font-bold">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Red Bordered Danger Zone */}
                <div className="p-6 rounded-xl border border-red-200 bg-red-50/50 shadow-xs space-y-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-red-600 flex items-center gap-1.5 border-b border-red-200 pb-2">
                    <AlertOctagon className="h-4 w-4 text-red-600" /> ZONE DE DANGER CRITIQUE
                  </h3>

                  <p className="text-[11px] text-red-700 leading-relaxed font-semibold">
                    Les actions ci-dessous ont des conséquences irréversibles. Soyez extrêmement vigilant.
                  </p>

                  <button
                    type="button"
                    onClick={handleResetDatabase}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                  >
                    Réinitialiser la base de données Agora
                  </button>
                </div>
              </div>
            )}

            {/* Bottom sticky/aligned controls for configuration changes */}
            {activeTab !== "database" && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#0E7C7B] hover:bg-[#0A3D3D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {saved ? "Modifications Enregistrées !" : "Enregistrer la Configuration"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
