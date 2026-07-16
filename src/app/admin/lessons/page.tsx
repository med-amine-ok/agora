"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  History,
  X,
  BookOpen,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  Eye,
  Check
} from "lucide-react";

interface Section {
  title: string;
  content: string;
}

interface Checkpoint {
  sectionIndex: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

interface AnatomyRegion {
  id: string;
  name: string;
  description: string;
}

interface AnatomyConfig {
  type: "none" | "skeleton" | "heart" | "brain" | "kidney" | "cell";
  regions: AnatomyRegion[];
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  unit: string;
  status: "publié" | "brouillon";
  sections: Section[];
  checkpoints: Checkpoint[];
  anatomyConfig?: AnatomyConfig;
  versions: string[];
}

const mockLessons: Lesson[] = [
  { 
    id: "l1", 
    title: "Le système squelettique", 
    subject: "Anatomie", 
    unit: "Repères osseux", 
    status: "publié", 
    sections: [
      {
        title: "1. Introduction, Définitions et Rôle du Cartilage",
        content: "### 1- Introduction\nLe squelette humain soutient le corps..."
      },
      {
        title: "2. Constitution du Squelette et Classification",
        content: "### 4- Constitution du squelette humain..."
      },
      {
        title: "3. Morphologie et Structure Histologique",
        content: "### 6- Morphologie osseuse..."
      },
      {
        title: "4. Croissance, Vascularisation et Pathologies",
        content: "### 8- Développement des os..."
      }
    ],
    checkpoints: [
      {
        sectionIndex: 0,
        question: "Quel type de cartilage se trouve préférentiellement au niveau des surfaces articulaires ?",
        options: [
          { text: "Le cartilage fibreux", isCorrect: false },
          { text: "Le cartilage hyalin", isCorrect: true },
          { text: "Le cartilage élastique", isCorrect: false },
          { text: "Le fibrocartilage", isCorrect: false }
        ],
        explanation: "Le cartilage hyalin est le plus répandu."
      }
    ],
    anatomyConfig: {
      type: "skeleton",
      regions: [
        { id: "axial", name: "Squelette Axial", description: "Comprend le crâne, la colonne vertébrale..." },
        { id: "scapulaire", name: "Ceinture Scapulaire", description: "Comprend les clavicules et scapulas..." }
      ]
    },
    versions: ["Version 2 (Modifiée par Admin)", "Version 1 (Création initiale)"]
  }
];

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // Editor Tabs
  const [activeTab, setActiveTab] = useState<"general" | "sections" | "checkpoints" | "anatomy">("general");

  // Form State
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubject, setEditorSubject] = useState("Anatomie");
  const [editorUnit, setEditorUnit] = useState("Repères osseux");
  const [editorStatus, setEditorStatus] = useState<"publié" | "brouillon">("brouillon");
  
  // Sections state (fixed at 4 sections)
  const [sections, setSections] = useState<Section[]>([
    { title: "1. Introduction et Généralités", content: "" },
    { title: "2. Constitution et Classification", content: "" },
    { title: "3. Structure et Histologie", content: "" },
    { title: "4. Croissance et Pathologies", content: "" }
  ]);

  // Checkpoints State
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    {
      sectionIndex: 0,
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    },
    {
      sectionIndex: 1,
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    },
    {
      sectionIndex: 2,
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    },
    {
      sectionIndex: 3,
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    }
  ]);

  // Anatomy Config State
  const [anatomyType, setAnatomyType] = useState<AnatomyConfig["type"]>("none");
  const [anatomyRegions, setAnatomyRegions] = useState<AnatomyRegion[]>([]);

  const handleAnatomyTypeChange = (type: AnatomyConfig["type"]) => {
    setAnatomyType(type);
    if (type === "skeleton") {
      setAnatomyRegions([
        { id: "axial", name: "Squelette Axial", description: "" },
        { id: "scapulaire", name: "Ceinture Scapulaire", description: "" },
        { id: "pelvienne", name: "Ceinture Pelvienne", description: "" },
        { id: "appendiculaire", name: "Squelette Appendiculaire", description: "" }
      ]);
    } else if (type === "cell") {
      setAnatomyRegions([
        { id: "membrane", name: "Membrane cellulaire", description: "" },
        { id: "cyto", name: "Cytoplasme", description: "" },
        { id: "noyau", name: "Noyau", description: "" },
        { id: "mito", name: "Mitochondrie", description: "" }
      ]);
    } else {
      setAnatomyRegions([]);
    }
  };

  const startCreate = () => {
    setEditingLesson(null);
    setEditorTitle("");
    setEditorSubject("Anatomie");
    setEditorUnit("Repères osseux");
    setEditorStatus("brouillon");
    setSections([
      { title: "1. Introduction et Rôles Généraux", content: "" },
      { title: "2. Constitution et Classification", content: "" },
      { title: "3. Structure Interne et Externe", content: "" },
      { title: "4. Développement et Pathologies cliniques", content: "" }
    ]);
    setCheckpoints(Array.from({ length: 4 }, (_, index) => ({
      sectionIndex: index,
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      explanation: ""
    })));
    setAnatomyType("none");
    setAnatomyRegions([]);
    setActiveTab("general");
    setShowEditor(true);
  };

  const startEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditorTitle(lesson.title);
    setEditorSubject(lesson.subject);
    setEditorUnit(lesson.unit);
    setEditorStatus(lesson.status);
    setSections(lesson.sections.length === 4 ? lesson.sections : [
      { title: "1. Section 1", content: "" },
      { title: "2. Section 2", content: "" },
      { title: "3. Section 3", content: "" },
      { title: "4. Section 4", content: "" }
    ]);
    if (lesson.checkpoints && lesson.checkpoints.length === 4) {
      setCheckpoints(lesson.checkpoints);
    } else {
      setCheckpoints(Array.from({ length: 4 }, (_, index) => ({
        sectionIndex: index,
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false }
        ],
        explanation: ""
      })));
    }
    setAnatomyType(lesson.anatomyConfig?.type || "none");
    setAnatomyRegions(lesson.anatomyConfig?.regions || []);
    setActiveTab("general");
    setShowEditor(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim()) return;

    const anatomyConfig: AnatomyConfig | undefined = anatomyType !== "none" ? {
      type: anatomyType,
      regions: anatomyRegions
    } : undefined;

    if (editingLesson) {
      setLessons(prev => prev.map(l => {
        if (l.id === editingLesson.id) {
          return {
            ...l,
            title: editorTitle,
            subject: editorSubject,
            unit: editorUnit,
            status: editorStatus,
            sections,
            checkpoints,
            anatomyConfig,
            versions: [`Modifié le ${new Date().toLocaleDateString()}`, ...l.versions]
          };
        }
        return l;
      }));
    } else {
      const newLesson: Lesson = {
        id: Math.floor(Math.random() * 1000).toString(),
        title: editorTitle,
        subject: editorSubject,
        unit: editorUnit,
        status: editorStatus,
        sections,
        checkpoints,
        anatomyConfig,
        versions: [`Création le ${new Date().toLocaleDateString()}`]
      };
      setLessons(prev => [newLesson, ...prev]);
    }

    setShowEditor(false);
    setEditingLesson(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement cette leçon ?")) {
      setLessons(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent" /> Gestion des Leçons Cliniques
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Configurez vos cours divisés en 4 sections avec quiz checkpoints intégrés et schémas d'anatomie 3D/SVG.
          </p>
        </div>

        {!showEditor && (
          <button 
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
          >
            <Plus className="h-4 w-4" /> Nouvelle Leçon Clinique
          </button>
        )}
      </div>

      {/* Editor Modal/Panel */}
      {showEditor && (
        <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-teal/10 pb-4">
            <h3 className="font-display text-base font-bold text-text-dark flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal" />
              {editingLesson ? `Édition : ${editingLesson.title}` : "Création d'une Leçon Structurée"}
            </h3>
            <button 
              onClick={() => setShowEditor(false)}
              className="p-1 rounded-full hover:bg-surface text-text-light"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation tabs inside editor */}
          <div className="flex border-b border-teal/10 gap-1 pb-px overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "general" 
                  ? "border-teal text-teal" 
                  : "border-transparent text-text-light hover:text-text-dark"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Informations Générales
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sections")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "sections" 
                  ? "border-teal text-teal" 
                  : "border-transparent text-text-light hover:text-text-dark"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> 1. Contenu (4 Sections)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("checkpoints")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "checkpoints" 
                  ? "border-teal text-teal" 
                  : "border-transparent text-text-light hover:text-text-dark"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" /> 2. Quiz Checkpoints
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("anatomy")}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "anatomy" 
                  ? "border-teal text-teal" 
                  : "border-transparent text-text-light hover:text-text-dark"
              }`}
            >
              <Activity className="h-3.5 w-3.5" /> 3. Config Anatomie SVG
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* TAB 1: GENERAL INFO */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-text-light font-bold">Titre de la leçon</label>
                    <input
                      type="text"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      placeholder="ex: Le système squelettique"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-text-light font-bold">Matière</label>
                    <select
                      value={editorSubject}
                      onChange={(e) => setEditorSubject(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-medium"
                    >
                      <option value="Anatomie">Anatomie</option>
                      <option value="Cardiologie">Cardiologie</option>
                      <option value="Pneumologie">Pneumologie</option>
                      <option value="Gastro-entérologie">Gastro-entérologie</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-text-light font-bold">Chapitre relationnel</label>
                    <input
                      type="text"
                      value={editorUnit}
                      onChange={(e) => setEditorUnit(e.target.value)}
                      placeholder="ex: Repères osseux"
                      className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-text-light font-bold block mb-1">Statut de visibilité</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-text-main font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="publié"
                        checked={editorStatus === "publié"}
                        onChange={() => setEditorStatus("publié")}
                      /> Publié (Visible aux étudiants)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-main font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="brouillon"
                        checked={editorStatus === "brouillon"}
                        onChange={() => setEditorStatus("brouillon")}
                      /> Brouillon (Masqué)
                    </label>
                  </div>
                </div>

                <div className="bg-teal/5 p-4 rounded-xl space-y-2 border border-teal/10">
                  <h4 className="text-xs font-bold text-teal flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Structure en 4 Sections Obligatoire
                  </h4>
                  <p className="text-xs text-text-main leading-relaxed">
                    Afin d'offrir une expérience utilisateur fluide et cohérente sur l'application mobile et web, chaque leçon doit être impérativement divisée en 4 parties distinctes.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sections")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white-custom hover:bg-teal-dark rounded-lg text-xs font-bold transition-all"
                  >
                    Suivant : Rédiger le contenu <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SECTIONS (4 REQUIRED) */}
            {activeTab === "sections" && (
              <div className="space-y-6">
                {sections.map((section, idx) => (
                  <div key={idx} className="p-4 border border-teal/10 rounded-xl bg-surface/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-teal/10 text-teal px-2 py-0.5 rounded-full font-bold">
                        Section {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono text-text-light font-bold">Titre de la section</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].title = e.target.value;
                          setSections(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                        placeholder="ex: 1. Introduction générale et Cartilage"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono text-text-light font-bold">Contenu (Markdown ou texte brut)</label>
                      <textarea
                        rows={6}
                        value={section.content}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].content = e.target.value;
                          setSections(updated);
                        }}
                        placeholder="Insérez le contenu de la section ici..."
                        className="w-full p-3 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-mono"
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className="px-4 py-2 border border-teal/10 rounded-lg text-xs font-bold text-text-dark hover:bg-surface"
                  >
                    Retour aux Généralités
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("checkpoints")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white-custom hover:bg-teal-dark rounded-lg text-xs font-bold transition-all"
                  >
                    Suivant : Créer les checkpoints <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CHECKPOINTS */}
            {activeTab === "checkpoints" && (
              <div className="space-y-6">
                {checkpoints.map((checkpoint, idx) => (
                  <div key={idx} className="p-4 border border-teal/10 rounded-xl bg-surface/10 space-y-4">
                    <span className="text-[10px] font-mono uppercase bg-teal/10 text-teal px-2 py-0.5 rounded-full font-bold">
                      Checkpoint lié à la Section {idx + 1}
                    </span>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono text-text-light font-bold">Question du Quiz</label>
                      <input
                        type="text"
                        value={checkpoint.question}
                        onChange={(e) => {
                          const updated = [...checkpoints];
                          updated[idx].question = e.target.value;
                          setCheckpoints(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                        placeholder="ex: Quel type de cartilage est le plus répandu dans l'organisme ?"
                      />
                    </div>

                    {/* Options Grid */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono text-text-light font-bold">Options de réponse (Cochez la bonne réponse)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {checkpoint.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2 bg-white-custom p-2 rounded-lg border border-teal/10">
                            <input
                              type="radio"
                              name={`correct-option-${idx}`}
                              checked={opt.isCorrect}
                              onChange={() => {
                                const updated = [...checkpoints];
                                updated[idx].options = updated[idx].options.map((o, oIdx) => ({
                                  ...o,
                                  isCorrect: oIdx === optIdx
                                }));
                                setCheckpoints(updated);
                              }}
                            />
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const updated = [...checkpoints];
                                updated[idx].options[optIdx].text = e.target.value;
                                setCheckpoints(updated);
                              }}
                              className="w-full bg-transparent text-xs outline-none text-text-dark"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono text-text-light font-bold">Explication pédagogique</label>
                      <input
                        type="text"
                        value={checkpoint.explanation}
                        onChange={(e) => {
                          const updated = [...checkpoints];
                          updated[idx].explanation = e.target.value;
                          setCheckpoints(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                        placeholder="ex: Le cartilage hyalin recouvre les surfaces articulaires..."
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sections")}
                    className="px-4 py-2 border border-teal/10 rounded-lg text-xs font-bold text-text-dark hover:bg-surface"
                  >
                    Retour aux Sections
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("anatomy")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white-custom hover:bg-teal-dark rounded-lg text-xs font-bold transition-all"
                  >
                    Suivant : Anatomie interactive <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: ANATOMY CONFIG */}
            {activeTab === "anatomy" && (
              <div className="space-y-6">
                <div className="p-4 border border-teal/10 rounded-xl bg-surface/10 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono text-text-light font-bold block">Type de Modèle Anatomique SVG</label>
                    <select
                      value={anatomyType}
                      onChange={(e) => handleAnatomyTypeChange(e.target.value as AnatomyConfig["type"])}
                      className="w-full px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-semibold"
                    >
                      <option value="none">Aucun (Pas d'anatomie interactive sur cette leçon)</option>
                      <option value="skeleton">Modèle de Squelette (Squelette Axial, Ceintures...)</option>
                      <option value="cell">Modèle Cellulaire (Noyau, Membrane, Cytoplasme...)</option>
                    </select>
                  </div>

                  {anatomyType !== "none" && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-teal">Configuration des Zones de Légende Interactives</h4>
                      <p className="text-[11px] text-text-light leading-relaxed">
                        Pour chaque ID du SVG correspondant, saisissez la légende et la description qui s'affichera lors du clic étudiant.
                      </p>

                      <div className="space-y-4">
                        {anatomyRegions.map((region, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white-custom p-3 rounded-lg border border-teal/10">
                            <div>
                              <label className="text-[9px] uppercase font-mono text-text-light font-bold">ID SVG (Path ID)</label>
                              <input
                                type="text"
                                value={region.id}
                                disabled
                                className="w-full mt-1 px-2 py-1 rounded bg-surface/30 text-xs text-text-light font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase font-mono text-text-light font-bold">Nom de la Région</label>
                              <input
                                type="text"
                                value={region.name}
                                onChange={(e) => {
                                  const updated = [...anatomyRegions];
                                  updated[idx].name = e.target.value;
                                  setAnatomyRegions(updated);
                                }}
                                className="w-full mt-1 px-2 py-1 rounded border border-teal/15 text-xs text-text-dark font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase font-mono text-text-light font-bold">Description Clinique</label>
                              <input
                                type="text"
                                value={region.description}
                                onChange={(e) => {
                                  const updated = [...anatomyRegions];
                                  updated[idx].description = e.target.value;
                                  setAnatomyRegions(updated);
                                }}
                                placeholder="ex: Structure osseuse..."
                                className="w-full mt-1 px-2 py-1 rounded border border-teal/15 text-xs text-text-dark"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("checkpoints")}
                    className="px-4 py-2 border border-teal/10 rounded-lg text-xs font-bold text-text-dark hover:bg-surface"
                  >
                    Retour aux Checkpoints
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal hover:bg-teal-dark text-white-custom rounded-lg text-xs font-bold shadow-sm"
                  >
                    Enregistrer toute la Leçon
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Lessons table */}
      {!showEditor && (
        <div className="border border-teal/10 bg-white-custom rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-teal/10 bg-surface/20 text-text-light uppercase tracking-wider font-mono text-[10px]">
                  <th className="p-4">Titre de la leçon</th>
                  <th className="p-4">Matière relationnelle</th>
                  <th className="p-4">Unité / Module</th>
                  <th className="p-4">Sections</th>
                  <th className="p-4">Modèle d'anatomie</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((less) => (
                  <tr key={less.id} className="border-b border-teal/5 hover:bg-surface/10 transition-colors">
                    <td className="p-4 font-semibold text-text-dark">{less.title}</td>
                    <td className="p-4 text-teal font-bold">{less.subject}</td>
                    <td className="p-4 text-text-light font-mono">{less.unit}</td>
                    <td className="p-4 text-text-main font-semibold">
                      {less.sections.length} sections
                    </td>
                    <td className="p-4">
                      {less.anatomyConfig ? (
                        <span className="px-2 py-0.5 rounded bg-teal/10 text-teal font-mono text-[9px] font-bold">
                          {less.anatomyConfig.type}
                        </span>
                      ) : (
                        <span className="text-text-light italic text-[11px]">aucun</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        less.status === "publié" ? "bg-teal/10 text-teal" : "bg-accent/10 text-accent"
                      }`}>
                        {less.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => startEdit(less)}
                        className="p-1.5 rounded border border-teal/10 text-teal hover:bg-teal/5"
                        title="Éditer la leçon"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(less.id)}
                        className="p-1.5 rounded border border-error/10 text-error hover:bg-error/5"
                        title="Supprimer la leçon"
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
      )}
    </div>
  );
}
