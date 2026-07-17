"use client";

import React, { useState, useMemo } from "react";
import { 
  FileQuestion, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  X,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Layers,
  Activity,
  Check,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles
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
  },
  { 
    id: "q3", 
    question: "Quelle est la principale cause d'obstruction chronique des voies aériennes chez le sujet tabagique ?", 
    type: "QCS",
    difficulty: "Facile", 
    subjectId: "pneumologie", 
    lessonId: "l1",
    options: [
      { text: "L'asthme bronchique", isCorrect: false },
      { text: "La BPCO (Bronchopneumopathie Chronique Obstructive)", isCorrect: true },
      { text: "La mucoviscidose", isCorrect: false },
      { text: "La dilatation des bronches", isCorrect: false }
    ],
    explanation: "La BPCO est directement liée à l'inhalation chronique de fumée de tabac." 
  }
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionMCQ[]>(mockQuestions);
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionMCQ | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

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

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || q.type === typeFilter;
      const matchesDiff = diffFilter === "all" || q.difficulty === diffFilter;
      const matchesSubject = subjectFilter === "all" || q.subjectId === subjectFilter;
      return matchesSearch && matchesType && matchesDiff && matchesSubject;
    });
  }, [questions, searchQuery, typeFilter, diffFilter, subjectFilter]);

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

  const handleOptionChange = (idx: number, key: keyof QuestionOption, val: any) => {
    const updated = [...editorOptions];
    if (key === "isCorrect" && editorType === "QCS") {
      // If single choice, reset all other options
      updated.forEach((opt, oIdx) => {
        opt.isCorrect = oIdx === idx;
      });
    } else {
      updated[idx] = { ...updated[idx], [key]: val };
    }
    setEditorOptions(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Check options correctness validation
    const correctCount = editorOptions.filter(o => o.isCorrect).length;
    if (correctCount === 0) {
      alert("Veuillez sélectionner au moins une bonne réponse.");
      return;
    }
    if (editorType === "QCS" && correctCount !== 1) {
      alert("Une question à choix unique (QCS) doit comporter exactement une bonne réponse.");
      return;
    }

    const questionData: QuestionMCQ = {
      id: editingQuestion ? editingQuestion.id : `q${questions.length + 1}`,
      question: editorText,
      type: editorType,
      difficulty: editorDiff,
      subjectId: editorSubjectId,
      lessonId: editorLessonId,
      options: editorOptions,
      explanation: editorExpl
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? questionData : q));
    } else {
      setQuestions(prev => [...prev, questionData]);
    }

    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous supprimer définitivement cette question ?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleExport = () => {
    // Basic CSV serialization mock
    const headers = ["ID", "Question", "Type", "Difficulty", "Subject", "Lesson", "Explanation"];
    const rows = questions.map(q => [
      q.id,
      `"${q.question.replace(/"/g, '""')}"`,
      q.type,
      q.difficulty,
      q.subjectId,
      q.lessonId,
      `"${q.explanation.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agora_qcm_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    // Very basic CSV parser mock
    const lines = importText.split("\n").filter(l => l.trim());
    const newQs: QuestionMCQ[] = [];
    
    // Skip header line if it looks like one
    const startIdx = lines[0].toLowerCase().includes("question") ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length >= 2) {
        newQs.push({
          id: `q_imp_${Date.now()}_${i}`,
          question: parts[0].replace(/^["']|["']$/g, "").trim(),
          type: "QCS",
          difficulty: "Moyen",
          subjectId: "cardiologie",
          lessonId: "all",
          options: [
            { text: parts[1].replace(/^["']|["']$/g, "").trim(), isCorrect: true },
            { text: parts[2] ? parts[2].replace(/^["']|["']$/g, "").trim() : "Option 2", isCorrect: false },
            { text: parts[3] ? parts[3].replace(/^["']|["']$/g, "").trim() : "Option 3", isCorrect: false },
            { text: parts[4] ? parts[4].replace(/^["']|["']$/g, "").trim() : "Option 4", isCorrect: false }
          ],
          explanation: parts[5] ? parts[5].replace(/^["']|["']$/g, "").trim() : "Importé par lot."
        });
      }
    }

    if (newQs.length > 0) {
      setQuestions(prev => [...prev, ...newQs]);
      alert(`${newQs.length} questions importées avec succès !`);
      setShowImportModal(false);
      setImportText("");
    } else {
      alert("Format invalide. Assurez-vous d'avoir au moins la question et la réponse correcte séparées par une virgule.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div className="text-left">
          <h1 className="font-display text-[20px] sm:text-[24px] font-semibold text-[#0D2626]">
            Banque de Questions QCM
          </h1>
          <p className="text-xs sm:text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Créez, importez ou éditez vos questions à choix multiples pour l'entraînement clinique et les blitz.
          </p>
        </div>

        {!showEditor && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowImportModal(true)}
              className="flex-grow sm:flex-grow-0 h-[34px] px-3.5 border border-[rgba(10,61,61,0.12)] bg-white text-xs font-semibold text-[#3D5C5C] hover:bg-[#F5FAFA] flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans rounded-lg"
            >
              <Upload className="h-3.5 w-3.5" /> 
              <span>Importer</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex-grow sm:flex-grow-0 h-[34px] px-3.5 border border-[rgba(10,61,61,0.12)] bg-white text-xs font-semibold text-[#3D5C5C] hover:bg-[#F5FAFA] flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans rounded-lg"
            >
              <Download className="h-3.5 w-3.5" /> 
              <span>Exporter</span>
            </button>
            <button 
              onClick={startCreate}
              className="w-full sm:w-auto h-[34px] px-3.5 bg-[#0E7C7B] hover:bg-[#0E7C7B]/90 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <Plus className="h-4 w-4" /> 
              <span>Nouvelle question</span>
            </button>
          </div>
        )}
      </div>

      {/* Editor Full Screen Workspace (In-place replacing the list) */}
      {showEditor ? (
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden shadow-xs flex flex-col font-sans">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[rgba(10,61,61,0.08)] flex items-center justify-between bg-[#F5FAFA]">
            <div className="text-left">
              <h3 className="font-display text-sm sm:text-base font-bold text-[#0D2626] flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0E7C7B]" />
                {editingQuestion ? "Modifier la Question MCQ" : "Nouvelle Question MCQ"}
              </h3>
              <p className="text-[10px] text-[#7A9E9E] mt-0.5 uppercase tracking-wider font-semibold">
                {editingQuestion ? `Question ID: ${editingQuestion.id}` : "Rédaction de contenu"}
              </p>
            </div>
            <button 
              onClick={() => setShowEditor(false)}
              className="p-1.5 rounded-lg hover:bg-[rgba(10,61,61,0.06)] text-[#7A9E9E] hover:text-[#0D2626] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form fields */}
          <div className="p-4 sm:p-6 text-left space-y-5 bg-white min-h-[400px]">
            <form onSubmit={handleSave} id="question-form" className="space-y-5 max-w-3xl">
              {/* Question text */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Énoncé de la question (ou description clinique)</label>
                <textarea
                  rows={4}
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="Saisissez l'énoncé complet..."
                  className="w-full p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] font-medium"
                  required
                />
              </div>

              {/* Metadata settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Format</label>
                  <select
                    value={editorType}
                    onChange={(e) => setEditorType(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-semibold"
                  >
                    <option value="QCS">QCS (Choix simple)</option>
                    <option value="QCM">QCM (Choix multiple)</option>
                    <option value="Cas clinique">Cas Clinique</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Difficulté</label>
                  <select
                    value={editorDiff}
                    onChange={(e) => setEditorDiff(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-semibold"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Matière / Spécialité</label>
                  <select
                    value={editorSubjectId}
                    onChange={(e) => {
                      setEditorSubjectId(e.target.value);
                      setEditorLessonId("all");
                    }}
                    className="w-full h-9 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-semibold"
                  >
                    {LESSONS_DATA.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Leçon Clinique liée</label>
                  <select
                    value={editorLessonId}
                    onChange={(e) => setEditorLessonId(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-semibold"
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

              {/* Options Row Highlight style */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#7A9E9E] block">Options de réponse (Cochez les cases correctes)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editorOptions.map((opt, idx) => {
                    const highlight = opt.isCorrect;
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          highlight 
                            ? "border-[#0E7C7B] bg-[#E0F2F2]/10" 
                            : "border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] hover:border-[rgba(10,61,61,0.15)]"
                        }`}
                      >
                        <input
                          type={editorType === "QCS" ? "radio" : "checkbox"}
                          name="correctAnswer"
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            const val = e.target.checked;
                            handleOptionChange(idx, "isCorrect", val);
                          }}
                          className="h-4.5 w-4.5 text-[#0E7C7B] border-[rgba(10,61,61,0.15)] focus:ring-[#0E7C7B] cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                          placeholder={`Option de réponse ${idx + 1}`}
                          className="w-full bg-transparent text-xs text-[#0D2626] font-semibold outline-none border-b border-transparent focus:border-[rgba(10,61,61,0.12)] pb-0.5"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Explication Clinique & Rationnel de correction</label>
                <textarea
                  rows={3}
                  value={editorExpl}
                  onChange={(e) => setEditorExpl(e.target.value)}
                  placeholder="Pourquoi cette/ces option(s) sont correctes..."
                  className="w-full p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B]"
                  required
                />
              </div>
            </form>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 border border-[rgba(10,61,61,0.12)] rounded-lg text-xs font-semibold text-[#3D5C5C] hover:bg-[#E0F2F2]/20 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="question-form"
              className="px-5 py-2 bg-[#0E7C7B] text-white hover:bg-[#0E7C7B]/95 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Enregistrer la question
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative flex-grow max-w-md w-full">
              <input
                type="text"
                placeholder="Rechercher une question ou explication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-[rgba(10,61,61,0.04)] border border-[rgba(10,61,61,0.08)] text-xs text-[#0D2626] outline-none focus:bg-white focus:border-[#0E7C7B] placeholder-[#7A9E9E] font-sans"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#7A9E9E]" />
            </div>

            {/* Filter selects */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs text-[#3D5C5C] font-semibold">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtrer :</span>
              </div>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-grow sm:flex-grow-0 h-8 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] bg-white outline-none font-semibold"
              >
                <option value="all">Tous formats</option>
                <option value="QCS">QCS (Choix simple)</option>
                <option value="QCM">QCM (Choix multiple)</option>
                <option value="Cas clinique">Cas clinique</option>
              </select>

              {/* Difficulty filter */}
              <select
                value={diffFilter}
                onChange={(e) => setDiffFilter(e.target.value)}
                className="flex-grow sm:flex-grow-0 h-8 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] bg-white outline-none font-semibold"
              >
                <option value="all">Toutes difficultés</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>

              {/* Subject filter */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-grow sm:flex-grow-0 h-8 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] bg-white outline-none font-semibold"
              >
                <option value="all">Toutes matières</option>
                {LESSONS_DATA.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions Grid Table */}
          <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F5FAFA] border-b border-[rgba(10,61,61,0.08)]">
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Énoncé</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Type</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Difficulté</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Matière</th>
                    <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Options</th>
                    <th className="py-3 px-4 text-right font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="border-b border-[rgba(10,61,61,0.05)] hover:bg-[#F5FAFA] transition-all font-sans group">
                      <td className="py-3 px-4 text-xs font-semibold text-[#0D2626] max-w-md truncate">{q.question}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[rgba(93,200,198,0.15)] text-[#0E7C7B] text-[10px] font-bold">
                          {q.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          q.difficulty === "Facile" ? "bg-[#0E7C7B]/10 text-[#0E7C7B]" :
                          q.difficulty === "Moyen" ? "bg-[#E8A838]/10 text-[#E8A838]" :
                          "bg-[#D72638]/10 text-[#D72638]"
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#7A9E9E] text-xs font-mono uppercase">{q.subjectId}</td>
                      <td className="py-3 px-4 text-[#3D5C5C] text-xs font-medium">{q.options.length} choix</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => startEdit(q)}
                            className="h-7 w-7 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[rgba(10,61,61,0.06)] flex items-center justify-center text-[#0E7C7B] cursor-pointer transition-all"
                            title="Modifier"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(q.id)}
                            className="h-7 w-7 rounded-lg border border-[rgba(215,38,56,0.15)] hover:bg-[rgba(215,38,56,0.05)] flex items-center justify-center text-[#D72638] cursor-pointer transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#7A9E9E] text-xs italic">
                        Aucune question ne correspond à votre recherche...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CSV Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071F1F]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[rgba(10,61,61,0.12)] shadow-2xl max-w-lg w-full overflow-hidden text-left font-sans">
            <div className="p-5 border-b border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0D2626] flex items-center gap-2">
                <Upload className="h-4 w-4 text-[#0E7C7B]" />
                <span>Importation en masse CSV</span>
              </h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-full hover:bg-[rgba(10,61,61,0.06)] text-[#7A9E9E] hover:text-[#0D2626]"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleImportCSVSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Copier-coller le format CSV</label>
                <p className="text-[9px] text-[#7A9E9E] leading-relaxed">
                  Format: Question,Option1,Option2,Option3,Option4,Explication (Première ligne = option correcte)
                </p>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="ex: Quel est le muscle le plus long?,Le Sartorius,Le Biceps,Le Quadriceps,Le Deltoïde,Le Sartorius traverse la cuisse."
                  className="w-full p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] font-mono mt-2"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(10,61,61,0.08)]">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-[rgba(10,61,61,0.12)] rounded-lg text-xs font-semibold text-[#3D5C5C] hover:bg-[#E0F2F2]/20 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E7C7B] text-white hover:bg-[#0E7C7B]/95 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Importer les questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
