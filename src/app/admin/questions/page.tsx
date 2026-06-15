"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import CSVImporter from "@/presentation/components/admin/CSVImporter";
import { ChevronLeft, Plus, Search, Filter, Edit2, Trash2, HelpCircle } from "lucide-react";

interface AdminQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: "facile" | "moyen" | "difficile";
  subject: string;
}

export default function AdminQuestions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tous");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tous");
  const [showImporter, setShowImporter] = useState(false);

  const [questions, setQuestions] = useState<AdminQuestion[]>([
    {
      id: "q1",
      text: "Quel est le traitement de première intention recommandé pour l'insuffisance cardiaque à fraction d'éjection réduite (FEVG ≤ 40%) ?",
      options: ["Inhibiteurs de l'ECA (IEC) + Bêta-bloquants", "Monothérapie par diurétique de l'anse", "Digoxine seule", "inhibiteurs calciques dihydropyridiniques"],
      correctIndex: 0,
      difficulty: "moyen",
      subject: "Cardiologie"
    },
    {
      id: "q2",
      text: "Quel signe ECG confirme immédiatement un syndrome coronaire aigu avec sus-décalage du segment ST (SCA ST+) ?",
      options: ["Onde T inversée asymétrique", "Sus-décalage du segment ST ≥ 1 mm dans au moins deux dérivations contiguës", "Bloc de branche droit complet isolé", "Sous-décalage horizontal de ST en antérieur"],
      correctIndex: 1,
      difficulty: "facile",
      subject: "Cardiologie"
    },
    {
      id: "q3",
      text: "Quelle structure vasculo-nerveuse majeure traverse le canal inguinal chez l'homme ?",
      options: ["Le cordon spermatique", "Le ligament rond", "Le nerf fémoral", "L'artère obturatrice"],
      correctIndex: 0,
      difficulty: "difficile",
      subject: "Anatomie"
    },
    {
      id: "q4",
      text: "Quelle est la posologie recommandée pour la supplémentation systématique en Vitamine D chez un nourrisson de 6 mois sous allaitement maternel exclusif en Algérie ?",
      options: ["100 UI / jour", "400 à 800 UI / jour", "2000 UI / jour", "Une dose unique de 100 000 UI tous les 6 mois"],
      correctIndex: 1,
      difficulty: "moyen",
      subject: "Pédiatrie"
    }
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleImport = async (rows: any[]) => {
    // Simulated CSV Import Validation
    const errors: { row: number; reason: string }[] = [];
    const validQuestions: AdminQuestion[] = [];

    rows.forEach((row, idx) => {
      const lineNum = idx + 2; // header is line 1

      if (!row.text || row.text.length < 10) {
        errors.push({ row: lineNum, reason: "Le texte de la question est trop court ou vide." });
        return;
      }
      if (!row.options || row.options.length < 2) {
        errors.push({ row: lineNum, reason: "Il doit y avoir au moins 2 options valides." });
        return;
      }
      if (row.correctIndex === undefined || isNaN(row.correctIndex) || row.correctIndex < 0 || row.correctIndex >= row.options.length) {
        errors.push({ row: lineNum, reason: "L'index de réponse correcte est invalide." });
        return;
      }

      validQuestions.push({
        id: row.id,
        text: row.text,
        options: row.options,
        correctIndex: row.correctIndex,
        difficulty: row.difficulty === "easy" ? "facile" : row.difficulty === "hard" ? "difficile" : "moyen",
        subject: row.subject
      });
    });

    if (validQuestions.length > 0) {
      setQuestions(prev => [...prev, ...validQuestions]);
    }

    return {
      successCount: validQuestions.length,
      errors
    };
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "Tous" || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === "Tous" || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDiff;
  });

  const subjects = ["Tous", "Cardiologie", "Anatomie", "Pédiatrie"];
  const difficulties = ["Tous", "facile", "moyen", "difficile"];

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-green-dark">Banque de Questions</h1>
              <p className="text-text-mid text-sm mt-1">
                Gérez la banque de QCMs cliniques. Importez des fichiers CSV en lot ou ajoutez manuellement.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowImporter(!showImporter)}>
                {showImporter ? "Masquer l'importateur" : "Importation CSV"}
              </Button>
              <Button className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> Manuel
              </Button>
            </div>
          </div>
        </div>

        {/* CSV Importer display drawer */}
        {showImporter && (
          <Card className="p-6 border-dashed border-2 border-green-mid/30 bg-green-light/5 animate-slide-up">
            <CSVImporter onImport={handleImport} />
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-border-brand/40 text-sm">
          <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-teal-dark flex items-center gap-1">
                <Filter className="w-4 h-4" /> Matière :
              </span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="p-2 border border-border-brand bg-white rounded-sm text-xs text-text-dark focus:outline-none"
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-teal-dark">Difficulté :</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-2 border border-border-brand bg-white rounded-sm text-xs text-text-dark focus:outline-none"
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Rechercher par mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light" />
          </div>
        </Card>

        {/* Question Tables */}
        <Card className="p-6">
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                  <th className="py-3 px-2 w-[55%]">Énoncé du QCM</th>
                  <th className="py-3 px-2">Matière</th>
                  <th className="py-3 px-2">Index réponse</th>
                  <th className="py-3 px-2">Difficulté</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-beige-base/20 transition-colors">
                    <td className="py-3.5 px-2 font-semibold text-green-dark leading-snug">{q.text}</td>
                    <td className="py-3.5 px-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-green-dark/5 text-green-dark border border-green-mid/10">
                        {q.subject}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-center">{q.correctIndex}</td>
                    <td className="py-3.5 px-2 capitalize">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        q.difficulty === "facile"
                          ? "bg-emerald-50 text-emerald-700"
                          : q.difficulty === "difficile"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="p-1.5 border border-border-brand text-text-light hover:text-green-mid rounded-sm bg-white"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 border border-border-brand text-text-light hover:text-red-600 rounded-sm bg-white"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
