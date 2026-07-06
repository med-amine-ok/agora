"use client";

import React, { useState } from "react";
import { 
  FileQuestion, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  Upload, 
  X,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface QuestionMCQ {
  id: string;
  question: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  subject: string;
  correctAnswer: string;
  explanation: string;
}

const mockQuestions: QuestionMCQ[] = [
  { id: "q1", question: "Quel marqueur enzymatique s'élève le plus précocement lors d'un infarctus du myocarde ?", difficulty: "Facile", subject: "Cardiologie", correctAnswer: "La Myoglobine", explanation: "La myoglobine s'élève dès la 2ème heure, bien que peu spécifique." },
  { id: "q2", question: "Devant un sus-décalage du segment ST diffus, concave vers le haut avec sous-décalage du PQ, quel diagnostic évoquer ?", difficulty: "Moyen", subject: "Cardiologie", correctAnswer: "Péricardite aiguë (Stade I)", explanation: "Les signes ECG typiques de la péricardite aiguë associent un sus-décalage de ST diffus et concave." },
  { id: "q3", question: "Quel signe ECG confirme la gravité immédiate d'une hyperkaliémie ?", difficulty: "Difficile", subject: "Cardiologie", correctAnswer: "Élargissement des complexes QRS", explanation: "L'élargissement des complexes QRS précède la survenue d'une fibrillation ventriculaire." }
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionMCQ[]>(mockQuestions);
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionMCQ | null>(null);
  
  // Form states
  const [editorText, setEditorText] = useState("");
  const [editorDiff, setEditorDiff] = useState<"Facile" | "Moyen" | "Difficile">("Moyen");
  const [editorSubject, setEditorSubject] = useState("Cardiologie");
  const [editorCorrect, setEditorCorrect] = useState("");
  const [editorExpl, setEditorExpl] = useState("");

  const startCreate = () => {
    setEditingQuestion(null);
    setEditorText("");
    setEditorDiff("Moyen");
    setEditorSubject("Cardiologie");
    setEditorCorrect("");
    setEditorExpl("");
    setShowEditor(true);
  };

  const startEdit = (q: QuestionMCQ) => {
    setEditingQuestion(q);
    setEditorText(q.question);
    setEditorDiff(q.difficulty);
    setEditorSubject(q.subject);
    setEditorCorrect(q.correctAnswer);
    setEditorExpl(q.explanation);
    setShowEditor(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorText.trim() || !editorCorrect.trim()) return;

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? {
        ...q,
        question: editorText,
        difficulty: editorDiff,
        subject: editorSubject,
        correctAnswer: editorCorrect,
        explanation: editorExpl
      } : q));
    } else {
      const newQ: QuestionMCQ = {
        id: Math.floor(Math.random() * 1000).toString(),
        question: editorText,
        difficulty: editorDiff,
        subject: editorSubject,
        correctAnswer: editorCorrect,
        explanation: editorExpl
      };
      setQuestions(prev => [newQ, ...prev]);
    }
    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette question ?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleImport = () => {
    alert("Simulation d'importation : Sélectionnez un fichier CSV de questions MedQuest.");
  };

  const handleExport = () => {
    alert("Exportation des questions lancée au format JSON.");
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-accent" /> Gestion de la Banque de Questions
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Créez des questions MCQ interactives, précisez les explications cliniques et gérez les imports/exports.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal/10 hover:bg-surface text-xs font-semibold text-text-dark transition-all"
          >
            <Upload className="h-3.5 w-3.5" /> Importer CSV
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal/10 hover:bg-surface text-xs font-semibold text-text-dark transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Exporter JSON
          </button>
          <button 
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
          >
            <Plus className="h-4 w-4" /> Nouvelle Question
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      {showEditor && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4 max-w-2xl">
          <div className="flex items-center justify-between border-b border-teal/10 pb-3">
            <h3 className="font-display text-sm font-bold text-text-dark">
              {editingQuestion ? "Modifier la Question" : "Rédiger une Question"}
            </h3>
            <button 
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-text-light hover:text-teal"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Énoncé de la question</label>
              <textarea
                rows={3}
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                placeholder="Ex. Quel diagnostic évoquer devant..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Niveau de difficulté</label>
                <select
                  value={editorDiff}
                  onChange={(e) => setEditorDiff(e.target.value as any)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Matière</label>
                <select
                  value={editorSubject}
                  onChange={(e) => setEditorSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                >
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Pneumologie">Pneumologie</option>
                  <option value="Gastro-entérologie">Gastro-entérologie</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Bonne Réponse</label>
              <input
                type="text"
                value={editorCorrect}
                onChange={(e) => setEditorCorrect(e.target.value)}
                placeholder="Indiquez la réponse correcte..."
                className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Explication Clinique</label>
              <textarea
                rows={3}
                value={editorExpl}
                onChange={(e) => setEditorExpl(e.target.value)}
                placeholder="Pourquoi cette réponse est correcte..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
              />
            </div>

            <div className="flex gap-2 justify-end border-t border-teal/10 pt-4">
              <button 
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 rounded-lg border border-teal/10 hover:bg-surface text-xs font-semibold text-text-dark"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-teal text-white-custom hover:bg-teal-dark rounded-lg text-xs font-bold shadow-sm"
              >
                Valider MCQ
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Questions list table */}
      <div className="border border-teal/10 bg-white-custom rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-teal/10 bg-surface/20 text-text-light uppercase tracking-wider font-mono text-[10px]">
                <th className="p-4">Énoncé</th>
                <th className="p-4">Matière</th>
                <th className="p-4">Difficulté</th>
                <th className="p-4">Bonne Réponse</th>
                <th className="p-4">Explication</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                  <td className="p-4 font-semibold text-text-dark max-w-xs">{q.question}</td>
                  <td className="p-4 text-teal font-bold">{q.subject}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      q.difficulty === "Facile" ? "bg-teal/10 text-teal" : q.difficulty === "Moyen" ? "bg-accent/10 text-accent" : "bg-error/10 text-error"
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-text-dark">{q.correctAnswer}</td>
                  <td className="p-4 text-text-light max-w-xs truncate">{q.explanation}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => startEdit(q)}
                      className="p-1.5 rounded border border-teal/10 text-teal hover:bg-teal/5"
                      title="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(q.id)}
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
    </div>
  );
}
