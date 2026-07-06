"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  UserX, 
  Trash2, 
  ShieldAlert, 
  Key, 
  History, 
  X,
  CheckCircle,
  Eye
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  accuracy: string;
  xp: number;
  status: "actif" | "suspendu";
  history: string[];
}

const mockStudents: Student[] = [
  { id: "1", name: "Amine Khelil", email: "amine.k@univ-alger.dz", university: "Faculté d'Alger", accuracy: "72.4%", xp: 1240, status: "actif", history: ["A complété 'Infarctus aigu'", "A rejoint le salon MedQuest #3", "A lu la fiche de révision 'Péricardite'"] },
  { id: "2", name: "Sarah Bouhired", email: "sarah.b@univ-alger.dz", university: "Faculté d'Alger", accuracy: "92.1%", xp: 2450, status: "actif", history: ["A complété 'Embolie Pulmonaire'", "Nouveau record de vitesse de réponse", "Badge 'Diagnosticien Précis' obtenu"] },
  { id: "3", name: "Ryad Merad", email: "ryad.m@univ-oran.dz", university: "Faculté d'Oran", accuracy: "68.9%", xp: 950, status: "actif", history: ["A complété 'Insuffisance Cardiaque'", "Défi perdu contre Sarah B."] },
  { id: "4", name: "Yanis Meziani", email: "yanis@univ-alger.dz", university: "Faculté d'Alger", accuracy: "79.8%", xp: 840, status: "suspendu", history: ["Rapports multiples de comportement", "Compte suspendu le 02 Juillet"] },
  { id: "5", name: "Karima Tali", email: "karima.t@univ-constantine.dz", university: "Faculté de Constantine", accuracy: "84.5%", xp: 1530, status: "actif", history: ["A complété 'Pneumonie communautaire'", "A rejoint l'arène de duel"] }
];

export default function UsersManagementPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const filtered = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = facultyFilter === "all" || st.university.includes(facultyFilter);
    return matchesSearch && matchesFaculty;
  });

  const handleSuspend = (id: string) => {
    setStudents(prev => prev.map(st => {
      if (st.id === id) {
        const newStatus = st.status === "actif" ? "suspendu" : "actif";
        const updated = { ...st, status: newStatus as "actif" | "suspendu" };
        if (selectedStudent?.id === id) setSelectedStudent(updated);
        return updated;
      }
      return st;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      setStudents(prev => prev.filter(st => st.id !== id));
      if (selectedStudent?.id === id) setSelectedStudent(null);
    }
  };

  const handleResetPassword = (name: string) => {
    alert(`Un lien de réinitialisation de mot de passe a été envoyé à l'adresse e-mail de ${name}.`);
  };

  const handlePromoteAdmin = (name: string) => {
    alert(`${name} a été promu administrateur.`);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" /> Gestion des Étudiants
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Recherchez, filtrez, modifiez les comptes étudiants et inspectez leur historique.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal/10 bg-white-custom p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Rechercher par nom, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark placeholder-text-light/50"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-light/50" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-teal" />
          <select 
            value={facultyFilter} 
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs font-semibold text-text-dark outline-none focus:border-teal"
          >
            <option value="all">Toutes les facultés</option>
            <option value="Alger">Faculté d'Alger</option>
            <option value="Oran">Faculté d'Oran</option>
            <option value="Constantine">Faculté de Constantine</option>
          </select>
        </div>
      </div>

      {/* Students list table */}
      <div className="border border-teal/10 bg-white-custom rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-teal/10 bg-surface/20 text-text-light uppercase tracking-wider font-mono text-[10px]">
                <th className="p-4">Nom</th>
                <th className="p-4">Université</th>
                <th className="p-4">Précision</th>
                <th className="p-4">Expérience</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                  <td className="p-4 font-semibold text-text-dark">{st.name}<br/><span className="text-[10px] text-text-light font-normal">{st.email}</span></td>
                  <td className="p-4 text-text-light">{st.university}</td>
                  <td className="p-4 font-mono font-bold text-teal">{st.accuracy}</td>
                  <td className="p-4 font-mono font-bold text-accent">{st.xp} XP</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      st.status === "actif" ? "bg-teal/10 text-teal" : "bg-error/10 text-error"
                    }`}>
                      {st.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setSelectedStudent(st)}
                      className="p-1.5 rounded border border-teal/10 text-teal hover:bg-teal/5"
                      title="Inspecter le profil"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleSuspend(st.id)}
                      className={`p-1.5 rounded border ${st.status === "actif" ? "border-accent/10 text-accent hover:bg-accent/5" : "border-teal/10 text-teal hover:bg-teal/5"}`}
                      title={st.status === "actif" ? "Suspendre" : "Réactiver"}
                    >
                      <UserX className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(st.id)}
                      className="p-1.5 rounded border border-error/10 text-error hover:bg-error/5"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Drawer Component */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-text-dark/40 backdrop-blur-xs flex justify-end z-50 transition-all">
          <div className="w-full max-w-md bg-white-custom h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-teal/10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-teal/10 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-text-dark">{selectedStudent.name}</h2>
                  <p className="text-xs text-text-light">{selectedStudent.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 rounded-full hover:bg-surface text-text-light"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface/30 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-text-light block">Université</span>
                  <span className="text-xs font-bold text-text-dark mt-1 block">{selectedStudent.university}</span>
                </div>
                <div className="p-3 bg-surface/30 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-text-light block">Expérience</span>
                  <span className="text-xs font-bold text-accent mt-1 block">{selectedStudent.xp} XP</span>
                </div>
                <div className="p-3 bg-surface/30 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-text-light block">Précision Moyenne</span>
                  <span className="text-xs font-bold text-teal mt-1 block">{selectedStudent.accuracy}</span>
                </div>
                <div className="p-3 bg-surface/30 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-text-light block">Statut Compte</span>
                  <span className="text-xs font-bold text-text-dark mt-1 block uppercase">{selectedStudent.status}</span>
                </div>
              </div>

              {/* Action Buttons inside drawer */}
              <div className="space-y-2 border-t border-teal/10 pt-4">
                <h4 className="text-[10px] font-mono uppercase text-text-light tracking-wider font-bold">Actions d'administration</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleResetPassword(selectedStudent.name)}
                    className="flex items-center gap-1.5 p-2 border border-teal/10 rounded-lg text-[11px] font-semibold text-text-dark hover:bg-surface/50 text-left transition-all"
                  >
                    <Key className="h-3.5 w-3.5 text-teal" /> Réinitialiser le mot de passe
                  </button>
                  <button 
                    onClick={() => handlePromoteAdmin(selectedStudent.name)}
                    className="flex items-center gap-1.5 p-2 border border-teal/10 rounded-lg text-[11px] font-semibold text-text-dark hover:bg-surface/50 text-left transition-all"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-accent" /> Promouvoir en administrateur
                  </button>
                </div>
              </div>

              {/* Activity History */}
              <div className="space-y-3 border-t border-teal/10 pt-4">
                <h4 className="text-[10px] font-mono uppercase text-text-light tracking-wider font-bold flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-teal" /> Historique d'Apprentissage
                </h4>
                <div className="space-y-2">
                  {selectedStudent.history.map((log, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-teal/5 bg-surface/10 text-[10px] font-mono text-text-main">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2 bg-text-dark text-white-custom rounded-xl text-xs font-semibold hover:bg-text-dark/95 transition-all mt-6"
            >
              Fermer le profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
