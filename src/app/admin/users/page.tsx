"use client";

import React, { useState } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  UserX, 
  Trash2, 
  ShieldAlert, 
  Key, 
  History, 
  X,
  CheckCircle,
  Eye,
  Activity,
  Award,
  BookOpen,
  Mail,
  UserCheck
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  year: string;
  accuracy: string;
  xp: number;
  status: "actif" | "suspendu";
  history: string[];
}

const mockStudents: Student[] = [
  { id: "1", name: "Amine Khelil", email: "amine.k@univ-alger.dz", university: "USTHB Alger", year: "3ème", accuracy: "72.4%", xp: 1240, status: "actif", history: ["A complété 'Infarctus aigu'", "A rejoint le salon MedQuest #3", "A lu la fiche de révision 'Péricardite'"] },
  { id: "2", name: "Sarah Bouhired", email: "sarah.b@univ-alger.dz", university: "Fac Med Alger", year: "4ème", accuracy: "92.1%", xp: 2450, status: "actif", history: ["A complété 'Embolie Pulmonaire'", "Nouveau record de vitesse de réponse", "Badge 'Diagnosticien Précis' obtenu"] },
  { id: "3", name: "Ryad Merad", email: "ryad.m@univ-oran.dz", university: "Univ Oran 1", year: "3ème", accuracy: "68.9%", xp: 950, status: "actif", history: ["A complété 'Insuffisance Cardiaque'", "Défi perdu contre Sarah B."] },
  { id: "4", name: "Yanis Meziani", email: "yanis@univ-alger.dz", university: "Fac Med Alger", year: "2ème", accuracy: "79.8%", xp: 840, status: "suspendu", history: ["Rapports multiples de comportement", "Compte suspendu le 02 Juillet"] },
  { id: "5", name: "Karima Tali", email: "karima.t@univ-constantine.dz", university: "Univ Constantine", year: "3ème", accuracy: "84.5%", xp: 1530, status: "actif", history: ["A complété 'Pneumonie communautaire'", "A rejoint l'arène de duel"] }
];

export default function UsersManagementPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filters
  const filtered = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          st.email.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant définitivement ?")) {
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
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div className="text-left">
          <h1 className="font-display text-[20px] sm:text-[24px] font-semibold text-[#0D2626]">
            Gestion des Étudiants
          </h1>
          <p className="text-xs sm:text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Recherchez, filtrez, modifiez les comptes étudiants et inspectez leur historique d'activité.
          </p>
        </div>
      </div>

      {selectedStudent ? (
        /* Full Screen (In-place) details sheet */
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden shadow-xs flex flex-col font-sans">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[rgba(10,61,61,0.08)] flex items-center justify-between bg-[#F5FAFA]">
            <div className="text-left">
              <h3 className="font-display text-sm sm:text-base font-bold text-[#0D2626]">
                Fiche Étudiant Detaillee
              </h3>
              <p className="text-[10px] text-[#7A9E9E] uppercase tracking-wider font-semibold">
                ID: {selectedStudent.id}
              </p>
            </div>
            <button 
              onClick={() => setSelectedStudent(null)}
              className="p-1.5 rounded-lg hover:bg-[rgba(10,61,61,0.06)] text-[#7A9E9E] hover:text-[#0D2626] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6 text-left bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card & Security Actions */}
              <div className="space-y-5 md:col-span-1">
                <div className="flex flex-col items-center text-center bg-[#F5FAFA] p-6 rounded-xl border border-[rgba(10,61,61,0.08)] animate-fade-in">
                  <div className="h-20 w-20 rounded-full bg-[#E0F2F2] flex items-center justify-center font-bold text-2xl text-[#0E7C7B] mb-4">
                    {selectedStudent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-display font-bold text-[#0D2626] text-base">{selectedStudent.name}</h4>
                  <p className="text-xs text-[#7A9E9E] flex items-center gap-1.5 mt-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedStudent.email}</span>
                  </p>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold mt-3 ${
                    selectedStudent.status === "actif" ? "bg-[#0E7C7B]/10 text-[#0E7C7B]" : "bg-red-50 text-red-600"
                  }`}>
                    Compte {selectedStudent.status}
                  </span>
                </div>

                {/* Operations actions */}
                <div className="space-y-2.5 pt-4 border-t border-[rgba(10,61,61,0.08)]">
                  <h4 className="text-[10px] uppercase font-bold text-[#7A9E9E] tracking-wider">Actions de sécurité</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResetPassword(selectedStudent.name)}
                      className="h-9 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[#F5FAFA] text-xs font-semibold text-[#3D5C5C] flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Key className="h-4 w-4" />
                      <span>Réinitialiser MDP</span>
                    </button>
                    <button
                      onClick={() => handlePromoteAdmin(selectedStudent.name)}
                      className="h-9 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[#F5FAFA] text-xs font-semibold text-[#3D5C5C] flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Promouvoir Admin</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleSuspend(selectedStudent.id)}
                    className={`w-full h-9 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedStudent.status === "actif" 
                        ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" 
                        : "bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-200"
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>
                      {selectedStudent.status === "actif" ? "Suspendre l'étudiant" : "Activer l'étudiant"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Statistics & Timelines */}
              <div className="space-y-6 md:col-span-2">
                {/* Statistics Grid */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#7A9E9E] tracking-wider">Statistiques d'apprentissage</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#F5FAFA] p-4 rounded-xl border border-[rgba(10,61,61,0.08)] flex items-center gap-3">
                      <Award className="h-6 w-6 text-[#FF6B35]" />
                      <div>
                        <p className="text-[10px] text-[#7A9E9E] uppercase tracking-wider leading-none">Total XP</p>
                        <p className="text-lg font-bold text-[#0D2626] font-mono mt-1 leading-none">{selectedStudent.xp}</p>
                      </div>
                    </div>
                    <div className="bg-[#F5FAFA] p-4 rounded-xl border border-[rgba(10,61,61,0.08)] flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-[#0E7C7B]" />
                      <div>
                        <p className="text-[10px] text-[#7A9E9E] uppercase tracking-wider leading-none">Précision</p>
                        <p className="text-lg font-bold text-[#0E7C7B] font-mono mt-1 leading-none">{selectedStudent.accuracy}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* University info */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#7A9E9E] tracking-wider font-sans">Cursus</h4>
                  <div className="p-4 bg-white border border-[rgba(10,61,61,0.08)] rounded-xl space-y-2 bg-[#F5FAFA]/50 text-left">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7A9E9E]">Université</span>
                      <span className="font-semibold text-[#0D2626]">{selectedStudent.university}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7A9E9E]">Année d'étude</span>
                      <span className="font-semibold text-[#0D2626]">{selectedStudent.year} année</span>
                    </div>
                  </div>
                </div>

                {/* History timeline */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-[#7A9E9E] tracking-wider flex items-center gap-1">
                    <History className="h-3.5 w-3.5" />
                    <span>Historique d'activité</span>
                  </h4>
                  <div className="relative border-l border-[rgba(10,61,61,0.12)] ml-2.5 pl-4 space-y-4 py-1">
                    {selectedStudent.history.map((log, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-[#0E7C7B]" />
                        <p className="text-[#3D5C5C] font-medium leading-relaxed">{log}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] flex justify-end">
            <button
              onClick={() => setSelectedStudent(null)}
              className="px-4 py-2 border border-[rgba(10,61,61,0.12)] rounded-lg text-xs font-semibold text-[#3D5C5C] hover:bg-[#E0F2F2]/20 cursor-pointer"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-[rgba(10,61,61,0.08)] bg-white p-4 rounded-xl shadow-xs">
            <div className="relative w-full sm:w-80 text-left">
              <input
                type="text"
                placeholder="Rechercher par nom, e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] placeholder-[#7A9E9E]/70 font-sans"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7A9E9E]" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-[#0E7C7B]" />
              <select 
                value={facultyFilter} 
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="flex-grow sm:flex-grow-0 h-8 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs font-semibold text-[#0D2626] outline-none focus:border-[#0E7C7B]"
              >
                <option value="all">Toutes les facultés</option>
                <option value="Alger">Alger</option>
                <option value="Oran">Oran</option>
                <option value="Constantine">Constantine</option>
              </select>
            </div>
          </div>

          {/* Students list table */}
          <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F5FAFA] border-b border-[rgba(10,61,61,0.08)]">
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Nom</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Faculté</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Précision</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Niveau</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Expérience</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Statut</th>
                    <th className="py-3 px-4 text-right font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((st) => (
                    <tr key={st.id} className="border-b border-[rgba(10,61,61,0.05)] hover:bg-[#F5FAFA] transition-all font-sans group">
                      <td className="py-3 px-4 text-xs font-semibold text-[#0D2626]">{st.name}</td>
                      <td className="py-3 px-4 text-[#7A9E9E] text-xs">{st.university}</td>
                      <td className="py-3 px-4 text-[#0E7C7B] text-xs font-mono font-bold">{st.accuracy}</td>
                      <td className="py-3 px-4 text-[#3D5C5C] text-xs">{st.year}</td>
                      <td className="py-3 px-4 text-[#FF6B35] text-xs font-mono font-bold">{st.xp} XP</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          st.status === "actif" ? "bg-[#0E7C7B]/10 text-[#0E7C7B]" : "bg-red-50 text-red-600"
                        }`}>
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedStudent(st)}
                            className="h-7 w-7 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[rgba(10,61,61,0.06)] flex items-center justify-center text-[#0E7C7B] cursor-pointer transition-all"
                            title="Inspecter la fiche"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleSuspend(st.id)}
                            className={`h-7 w-7 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                              st.status === "actif" 
                                ? "border-red-200 hover:bg-red-50 text-red-500" 
                                : "border-teal-200 hover:bg-teal-50 text-teal-500"
                            }`}
                            title={st.status === "actif" ? "Suspendre" : "Activer"}
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#7A9E9E] text-xs italic">
                        Aucun étudiant ne correspond à votre recherche...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
