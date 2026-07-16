"use client";

import React, { useState, useMemo } from "react";
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
  HelpCircle,
  BookOpen,
  Layers,
  Activity,
  Check
} from "lucide-react";
import { LESSONS_DATA } from "../../(student)/lessons/mockLessonsData";

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface QuestionMCQ {
  id: string;
  question: string;
  type: "QCM" | "QCS" | "Cas clinique";
  difficulty: "Facile" | "Moyen" | "Difficile";
  subjectId: string;
  lessonId: string; // ID of the lesson or "all"
  options: QuestionOption[];
  explanation: string;
}

const mockQuestions: QuestionMCQ[] = [
  { 
    id: "q1", 
    question: "Quel marqueur enzymatique s'élève le plus précocement lors d'un infarctus du myocarde ?", 
    type: "QCS",
    difficulty: "Facile", 
    subjectId: "cardiologie", 
    lessonId: "l1",
    options: [
      { text: "La Myoglobine", isCorrect: true },
      { text: "La Troponine I", isCorrect: false },
      { text: "La CK-MB", isCorrect: false },
      { text: "La LDH", isCorrect: false }
    ],
    explanation: "La myoglobine s'élève dès la 2ème heure, bien que peu spécifique." 
  },
  { 
    id: "q2", 
    question: "Devant un sus-décalage du segment ST diffus, concave vers le haut avec sous-décalage du PQ, quel diagnostic évoquer ?", 
    type: "QCM",
    difficulty: "Moyen", 
    subjectId: "cardiologie", 
    lessonId: "l3",
    options: [
      { text: "Péricardite aiguë (Stade I)", isCorrect: true },
      { text: "Myocardite aiguë", isCorrect: false },
      { text: "Infarctus du myocarde", isCorrect: false },
      { text: "Angine de poitrine", isCorrect: false }
    ],
    explanation: "Les signes ECG typiques de la péricardite aiguë associent un sus-décalage de ST diffus et concave." 
  }
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionMCQ[]>(mockQuestions);
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionMCQ | null>(null);
  
  // Form states
  const [editorText, setEditorText] = useState("");
  const [editorType, setEditorType] = useState<"QCM" | "QCS" | "Cas clinique">("QCS");
  const [editorDiff, setEditorDiff] = useState<"Facile" | "Moyen" | "Difficile">("Moyen");
  const [editorSubjectId, setEditorSubjectId] = useState(LESSONS_DATA[0].id);
  const [editorLessonId, setEditorLessonId] = useState("all");
  const [editorOptions, setEditorOptions] = useState<QuestionOption[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);
  const [editorExpl, setEditorExpl] = useState("");

  // Get active subject and lessons for the editor
  const activeSubject = useMemo(() => {
    return LESSONS_DATA.find((s) => s.id === editorSubjectId) || LESSONS_DATA[0];
  }, [editorSubjectId]);

  const activeLessons = useMemo(() => {
    return activeSubject.units.flatMap((u) => u.lessons);
  }, [activeSubject]);

  const startCreate = () => {
    setEditingQuestion(null);
    setEditorText("");
    setEditorType("QCS");
    setEditorDiff("Moyen");
    setEditorSubjectId(LESSONS_DATA[0].id);
    setEditorLessonId("all");
    setEditorOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ]);
    setEditorExpl("");
    setShowEditor(true);
  };

  const startEdit = (q: QuestionMCQ) => {
    setEditingQuestion(q);
    setEditorText(q.question);
    setEditorType(q.type);
    setEditorDiff(q.difficulty);
    setEditorSubjectId(q.subjectId);
    setEditorLessonId(q.lessonId);
    setEditorOptions(q.options);
    setEditorExpl(q.explanation);
    setShowEditor(true);
  };

  const handleOptionChange = (index: number, field: keyof QuestionOption, value: any) => {
    setEditorOptions(prev => prev.map((opt, i) => {
      if (i === index) {
        return { ...opt, [field]: value };
      }
      // If single choice and setting correctness to true, other correct values must be false
      if (editorType === "QCS" && field === "isCorrect" && value === true) {
        return { ...opt, isCorrect: false };
      }
      return opt;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorText.trim()) return;

    // Validate that at least one option is correct
    const hasCorrect = editorOptions.some(opt => opt.isCorrect);
    if (!hasCorrect) {
      alert("Veuillez cocher au moins une réponse correcte.");
      return;
    }

    const payload: QuestionMCQ = {
      id: editingQuestion ? editingQuestion.id : Math.floor(Math.random() * 1000).toString(),
      question: editorText,
      type: editorType,
      difficulty: editorDiff,
      subjectId: editorSubjectId,
      lessonId: editorLessonId,
      options: editorOptions,
      explanation: editorExpl
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? payload : q));
    } else {
      setQuestions(prev => [payload, ...prev]);
    }
    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette question ?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleImport = () => {
    alert("Simulation d'importation CSV : Format MedQuest questions.");
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
            <FileQuestion className="h-6 w-6 text-accent" /> Gestion de la Banque de Questions MCQ
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Créez et configurez des QCM, QCS ou Cas cliniques rattachés aux modules et leçons cliniques.
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
        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-teal/10 pb-3">
            <h3 className="font-display text-base font-bold text-text-dark flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal" />
              {editingQuestion ? "Modifier la Question" : "Rédiger une Question"}
            </h3>
            <button 
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-text-light hover:text-teal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Question Text */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Énoncé de la question (ou description clinique)</label>
              <textarea
                rows={3}
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                placeholder="Ex. Quel diagnostic évoquer devant un patient présentant..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-medium"
                required
              />
            </div>

            {/* Type, Difficulty, Subject, Lesson row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Format</label>
                <select
                  value={editorType}
                  onChange={(e) => setEditorType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold animate-all"
                >
                  <option value="QCS">QCS (Une seule réponse)</option>
                  <option value="QCM">QCM (Réponses multiples)</option>
                  <option value="Cas clinique">Cas Clinique</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Difficulté</label>
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
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Matière / Spécialité</label>
                <select
                  value={editorSubjectId}
                  onChange={(e) => {
                    setEditorSubjectId(e.target.value);
                    setEditorLessonId("all");
                  }}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                >
                  {LESSONS_DATA.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Leçon Clinique liée</label>
                <select
                  value={editorLessonId}
                  onChange={(e) => setEditorLessonId(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                >
                  <option value="all">Toutes (Général)</option>
                  {activeLessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Options Management */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Options de réponse (Cochez les cases correctes)</label>
              <div className="space-y-3">
                {editorOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-surface/5 p-3 rounded-xl border border-teal/10">
                    <input
                      type={editorType === "QCS" ? "radio" : "checkbox"}
                      name="correctAnswer"
                      checked={opt.isCorrect}
                      onChange={(e) => {
                        const val = e.target.checked;
                        handleOptionChange(idx, "isCorrect", val);
                      }}
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                      placeholder={`Option de réponse ${idx + 1}`}
                      className="w-full px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Explication Clinique & Correction</label>
              <textarea
                rows={3}
                value={editorExpl}
                onChange={(e) => setEditorExpl(e.target.value)}
                placeholder="Pourquoi cette/ces réponse(s) sont valides et rationnelles..."
                className="w-full mt-1 p-2.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
              />
            </div>

            {/* Form actions */}
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
                Enregistrer la question
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
                <th className="p-4">Type</th>
                <th className="p-4">Difficulté</th>
                <th className="p-4">Option(s) correcte(s)</th>
                <th className="p-4">Explication</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const subjectName = LESSONS_DATA.find(s => s.id === q.subjectId)?.name || q.subjectId;
                const correctOptions = q.options.filter(o => o.isCorrect).map(o => o.text).join(", ");
                return (
                  <tr key={q.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                    <td className="p-4 font-semibold text-text-dark max-w-xs">{q.question}</td>
                    <td className="p-4 text-teal font-bold">{subjectName}</td>
                    <td className="p-4 font-mono font-bold text-text-light">{q.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        q.difficulty === "Facile" ? "bg-teal/10 text-teal" : q.difficulty === "Moyen" ? "bg-accent/10 text-accent" : "bg-error/10 text-error"
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-text-dark max-w-xs truncate">{correctOptions || "Aucune"}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
