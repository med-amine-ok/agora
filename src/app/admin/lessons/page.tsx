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
  Check,
  ToggleLeft,
  ToggleRight,
  Globe,
  Settings
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
        content: "### 1- Introduction\nLe squelette humain soutient le corps et protège les organes vitaux. Le cartilage hyalin recouvre les articulations mobiles pour limiter les frictions."
      },
      {
        title: "2. Constitution du Squelette et Classification",
        content: "### 2- Constitution\nLe squelette adulte comporte 206 os constants répartis entre le squelette axial (crâne, colonne) et appendiculaire (membres)."
      },
      {
        title: "3. Morphologie et Structure Histologique",
        content: "### 3- Morphologie\nOn distingue les os longs, courts, plats et irréguliers. Le tissu osseux compact forme la corticale externe."
      },
      {
        title: "4. Croissance, Vascularisation et Pathologies",
        content: "### 4- Croissance et Pathologies\nL'ossification endochondrale est responsable de la croissance en longueur. Les fractures se consolident via un cal osseux."
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
        explanation: "Le cartilage hyalin est le plus répandu au niveau des articulations mobiles."
      },
      {
        sectionIndex: 1,
        question: "Combien d'os constants comporte le squelette humain adulte ?",
        options: [
          { text: "186 os", isCorrect: false },
          { text: "206 os", isCorrect: true },
          { text: "226 os", isCorrect: false },
          { text: "156 os", isCorrect: false }
        ],
        explanation: "Le squelette adulte compte 206 os constants."
      },
      {
        sectionIndex: 2,
        question: "Quelle partie de l'os long forme la corticale externe ?",
        options: [
          { text: "L'os compact", isCorrect: true },
          { text: "L'os spongieux", isCorrect: false },
          { text: "Le cartilage articulaire", isCorrect: false },
          { text: "La moelle jaune", isCorrect: false }
        ],
        explanation: "Le tissu osseux compact constitue la couche rigide externe de l'os."
      },
      {
        sectionIndex: 3,
        question: "Quel processus assure la croissance en longueur des os longs ?",
        options: [
          { text: "L'ossification membraneuse", isCorrect: false },
          { text: "L'ossification endochondrale", isCorrect: true },
          { text: "L'ossification périostique", isCorrect: false },
          { text: "La résorption ostéoclastique", isCorrect: false }
        ],
        explanation: "L'ossification endochondrale permet le développement longitudinal à partir du cartilage."
      }
    ],
    anatomyConfig: {
      type: "skeleton",
      regions: [
        { id: "axial", name: "Squelette Axial", description: "Comprend le crâne, la colonne vertébrale et la cage thoracique." },
        { id: "scapulaire", name: "Ceinture Scapulaire", description: "Comprend les clavicules et scapulas rattachant les membres supérieurs." },
        { id: "pelvienne", name: "Ceinture Pelvienne", description: "Comprend les os coxaux rattachant les membres inférieurs." },
        { id: "appendiculaire", name: "Squelette Appendiculaire", description: "Formé par les membres supérieurs et inférieurs." }
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

  // Section Preview states
  const [previewModes, setPreviewModes] = useState<boolean[]>([false, false, false, false]);

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
    } else if (type === "heart") {
      setAnatomyRegions([
        { id: "atrium_d", name: "Atrium droit", description: "" },
        { id: "atrium_g", name: "Atrium gauche", description: "" },
        { id: "ventricule_d", name: "Ventricule droit", description: "" },
        { id: "ventricule_g", name: "Ventricule gauche", description: "" }
      ]);
    } else if (type === "brain") {
      setAnatomyRegions([
        { id: "frontal", name: "Lobe frontal", description: "" },
        { id: "parietal", name: "Lobe pariétal", description: "" },
        { id: "occipital", name: "Lobe occipital", description: "" },
        { id: "temporal", name: "Lobe temporal", description: "" }
      ]);
    } else if (type === "kidney") {
      setAnatomyRegions([
        { id: "cortex", name: "Cortex rénal", description: "" },
        { id: "medulla", name: "Médullaire rénale", description: "" },
        { id: "bassinet", name: "Bassinet (pyélon)", description: "" },
        { id: "nephron", name: "Néphrons", description: "" }
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
      { title: "1. Introduction et Généralités", content: "" },
      { title: "2. Constitution et Classification", content: "" },
      { title: "3. Structure et Histologie", content: "" },
      { title: "4. Croissance et Pathologies", content: "" }
    ]);
    setCheckpoints([
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
    setSections(lesson.sections);
    setCheckpoints(lesson.checkpoints);
    if (lesson.anatomyConfig) {
      setAnatomyType(lesson.anatomyConfig.type);
      setAnatomyRegions(lesson.anatomyConfig.regions);
    } else {
      setAnatomyType("none");
      setAnatomyRegions([]);
    }
    setActiveTab("general");
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette leçon définitivement ?")) {
      setLessons(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check that each checkpoint has exactly 1 correct answer
    for (let i = 0; i < checkpoints.length; i++) {
      const corrects = checkpoints[i].options.filter(o => o.isCorrect).length;
      if (corrects !== 1) {
        alert(`Le checkpoint ${i + 1} doit avoir exactement UNE bonne réponse cochée.`);
        return;
      }
    }

    const lessonData: Lesson = {
      id: editingLesson ? editingLesson.id : `l${lessons.length + 1}`,
      title: editorTitle,
      subject: editorSubject,
      unit: editorUnit,
      status: editorStatus,
      sections,
      checkpoints,
      anatomyConfig: anatomyType !== "none" ? { type: anatomyType, regions: anatomyRegions } : undefined,
      versions: editingLesson 
        ? [`Modifié le ${new Date().toLocaleDateString()}`, ...editingLesson.versions]
        : ["Création initiale"]
    };

    if (editingLesson) {
      setLessons(prev => prev.map(l => l.id === editingLesson.id ? lessonData : l));
    } else {
      setLessons(prev => [...prev, lessonData]);
    }

    setShowEditor(false);
  };

  const togglePreviewMode = (idx: number) => {
    const updated = [...previewModes];
    updated[idx] = !updated[idx];
    setPreviewModes(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div className="text-left">
          <h1 className="font-display text-[20px] sm:text-[24px] font-semibold text-[#0D2626]">
            Gestion des Leçons Cliniques
          </h1>
          <p className="text-xs sm:text-[13px] text-[#7A9E9E] mt-1 font-sans">
            Configurez vos cours structurés en 4 parties avec quiz checkpoints et repères anatomiques.
          </p>
        </div>

        {!showEditor && (
          <button 
            onClick={startCreate}
            className="w-full sm:w-auto h-[34px] px-3.5 bg-[#0E7C7B] hover:bg-[#0E7C7B]/90 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans"
          >
            <Plus className="h-4 w-4" /> 
            <span>Nouvelle leçon</span>
          </button>
        )}
      </div>

      {/* Editor Full Screen Workspace (In-place replacing the list) */}
      {showEditor ? (
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden shadow-xs flex flex-col font-sans">
          {/* Editor Header */}
          <div className="p-4 sm:p-5 border-b border-[rgba(10,61,61,0.08)] flex items-center justify-between bg-[#F5FAFA]">
            <div className="text-left">
              <h3 className="font-display text-sm sm:text-base font-bold text-[#0D2626] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0E7C7B]" />
                {editingLesson ? "Modifier la leçon" : "Créer une leçon"}
              </h3>
              <p className="text-[10px] text-[#7A9E9E] mt-0.5 uppercase tracking-wider font-semibold font-sans">
                {editingLesson ? `ID: ${editingLesson.id}` : "Nouveau cours"}
              </p>
            </div>
            <button 
              onClick={() => setShowEditor(false)}
              className="p-1.5 rounded-lg hover:bg-[rgba(10,61,61,0.06)] text-[#7A9E9E] hover:text-[#0D2626] cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Editor Navigation Tabs */}
          <div className="flex border-b border-[rgba(10,61,61,0.08)] gap-1 px-4 py-1 bg-white overflow-x-auto">
            {(["general", "sections", "checkpoints", "anatomy"] as const).map((tab) => {
              const labels = {
                general: "Général",
                sections: "1. Contenu",
                checkpoints: "2. Quiz",
                anatomy: "3. Anatomie"
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab 
                      ? "border-[#0E7C7B] text-[#0E7C7B]" 
                      : "border-transparent text-[#7A9E9E] hover:text-[#0D2626]"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Scrollable Form Content */}
          <div className="p-4 sm:p-6 space-y-6 bg-white min-h-[400px]">
            <form onSubmit={handleSave} id="lesson-form" className="space-y-6">
              {/* TAB: GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-5 text-left max-w-2xl">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A9E9E]">Titre de la leçon</label>
                    <input
                      type="text"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      placeholder="ex: Le système squelettique"
                      className="w-full h-9 px-3 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15 outline-none font-medium bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A9E9E]">Matière</label>
                      <select
                        value={editorSubject}
                        onChange={(e) => setEditorSubject(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] focus:border-[#0E7C7B] outline-none font-semibold bg-white animate-fade-in"
                      >
                        <option value="Anatomie">Anatomie</option>
                        <option value="Cardiologie">Cardiologie</option>
                        <option value="Pneumologie">Pneumologie</option>
                        <option value="Gastro-entérologie">Gastro-entérologie</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A9E9E]">Chapitre relationnel</label>
                      <input
                        type="text"
                        value={editorUnit}
                        onChange={(e) => setEditorUnit(e.target.value)}
                        placeholder="ex: Repères osseux"
                        className="w-full h-9 px-3 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] focus:border-[#0E7C7B] outline-none font-medium bg-white"
                      />
                    </div>
                  </div>

                  {/* Visibility Status Toggle */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-[#7A9E9E] block">Statut de visibilité</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setEditorStatus(editorStatus === "publié" ? "brouillon" : "publié")}
                        className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0D2626]"
                      >
                        {editorStatus === "publié" ? (
                          <ToggleRight className="h-6 w-6 text-[#0E7C7B]" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-[#7A9E9E]" />
                        )}
                        <span>
                          {editorStatus === "publié" ? "Publié (Visible aux étudiants)" : "Brouillon (Masqué)"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#E0F2F2]/40 p-4 rounded-xl space-y-2 border border-[#0E7C7B]/10">
                    <h4 className="text-xs font-bold text-[#0E7C7B] flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Structure en 4 Sections Obligatoire
                    </h4>
                    <p className="text-xs text-[#3D5C5C] leading-relaxed">
                      Pour assurer l'uniformité visuelle, chaque leçon doit comporter exactement 4 sections de contenu avec leurs checkpoints de validation.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: SECTIONS */}
              {activeTab === "sections" && (
                <div className="space-y-5 text-left">
                  {sections.map((section, idx) => (
                    <div key={idx} className="p-4 border border-[rgba(10,61,61,0.08)] rounded-xl bg-[#F5FAFA] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-[#E0F2F2] text-[#0E7C7B] px-2 py-0.5 rounded-full font-bold">
                          Section {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePreviewMode(idx)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#0E7C7B] hover:text-[#085050]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{previewModes[idx] ? "Éditeur" : "Aperçu"}</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Titre de la section</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[idx].title = e.target.value;
                            setSections(updated);
                          }}
                          className="w-full h-8 px-3 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-semibold"
                          placeholder={`Titre de la section ${idx + 1}`}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Contenu (Markdown)</label>
                        {previewModes[idx] ? (
                          <div className="p-3 bg-white border border-[rgba(10,61,61,0.08)] rounded-lg text-xs text-[#0D2626] font-sans prose prose-sm max-h-40 overflow-y-auto">
                            {section.content ? (
                              <div className="whitespace-pre-wrap">{section.content}</div>
                            ) : (
                              <span className="text-[#7A9E9E] italic">Aucun contenu rédigé...</span>
                            )}
                          </div>
                        ) : (
                          <textarea
                            rows={5}
                            value={section.content}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[idx].content = e.target.value;
                              setSections(updated);
                            }}
                            placeholder="Contenu détaillé (supporte le markdown)..."
                            className="w-full p-2.5 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white font-mono"
                            required
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: CHECKPOINTS */}
              {activeTab === "checkpoints" && (
                <div className="space-y-5 text-left">
                  {checkpoints.map((checkpoint, idx) => (
                    <div key={idx} className="p-4 border border-[rgba(10,61,61,0.08)] rounded-xl bg-[#F5FAFA] space-y-4">
                      <span className="text-[10px] font-mono uppercase bg-[#E0F2F2] text-[#0E7C7B] px-2 py-0.5 rounded-full font-bold">
                        Checkpoint lié à la Section {idx + 1}
                      </span>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Question du Quiz</label>
                        <input
                          type="text"
                          value={checkpoint.question}
                          onChange={(e) => {
                            const updated = [...checkpoints];
                            updated[idx].question = e.target.value;
                            setCheckpoints(updated);
                          }}
                          className="w-full h-8 px-3 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white"
                          placeholder="ex: Quel cartilage est hyalin ?"
                          required
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Options (Cochez la bonne réponse)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {checkpoint.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[rgba(10,61,61,0.08)]">
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
                                className="w-full bg-transparent text-xs outline-none text-[#0D2626]"
                                placeholder={`Option ${optIdx + 1}`}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Explication pédagogique</label>
                        <input
                          type="text"
                          value={checkpoint.explanation}
                          onChange={(e) => {
                            const updated = [...checkpoints];
                            updated[idx].explanation = e.target.value;
                            setCheckpoints(updated);
                          }}
                          className="w-full h-8 px-3 rounded-lg border border-[rgba(10,61,61,0.12)] text-xs text-[#0D2626] outline-none focus:border-[#0E7C7B] bg-white"
                          placeholder="ex: Le cartilage hyalin recouvre..."
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: ANATOMY */}
              {activeTab === "anatomy" && (
                <div className="space-y-5 text-left font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#7A9E9E]">Type de Modèle Anatomique SVG</label>
                    
                    {/* Organ Selector Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                      {([
                        { type: "none", name: "Aucun" },
                        { type: "skeleton", name: "Squelette" },
                        { type: "heart", name: "Cœur" },
                        { type: "brain", name: "Cerveau" },
                        { type: "kidney", name: "Rein" },
                        { type: "cell", name: "Cellule" }
                      ] as const).map((org) => {
                        const selected = anatomyType === org.type;
                        return (
                          <button
                            key={org.type}
                            type="button"
                            onClick={() => handleAnatomyTypeChange(org.type)}
                            className={`p-3 text-center border rounded-lg transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              selected
                                ? "border-[#0E7C7B] bg-[#E0F2F2]/30 text-[#0E7C7B]"
                                : "border-[rgba(10,61,61,0.12)] bg-white text-[#3D5C5C] hover:bg-[#F5FAFA]"
                            }`}
                          >
                            <span className="text-xs font-bold">{org.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {anatomyType !== "none" && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-[#0D2626]">Configuration des zones interactives</h4>
                      <p className="text-[11px] text-[#7A9E9E]">
                        Configurez les légendes et descriptions cliniques associées aux identifiants de ce modèle SVG.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {anatomyRegions.map((region, idx) => (
                          <div key={idx} className="p-3 bg-[#F5FAFA] border border-[rgba(10,61,61,0.08)] rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono bg-white border border-[rgba(10,61,61,0.12)] px-2 py-0.5 rounded text-[#7A9E9E]">
                                ID: {region.id}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={region.name}
                                onChange={(e) => {
                                  const updated = [...anatomyRegions];
                                  updated[idx].name = e.target.value;
                                  setAnatomyRegions(updated);
                                }}
                                placeholder="Nom de la zone"
                                className="w-full h-8 px-2 rounded border border-[rgba(10,61,61,0.12)] bg-white text-xs text-[#0D2626] font-semibold"
                                required
                              />
                              <input
                                type="text"
                                value={region.description}
                                onChange={(e) => {
                                  const updated = [...anatomyRegions];
                                  updated[idx].description = e.target.value;
                                  setAnatomyRegions(updated);
                                }}
                                placeholder="Description clinique"
                                className="w-full h-8 px-2 rounded border border-[rgba(10,61,61,0.12)] bg-white text-xs text-[#0D2626]"
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Editor Footer Actions */}
          <div className="p-4 border-t border-[rgba(10,61,61,0.08)] bg-[#F5FAFA] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 border border-[rgba(10,61,61,0.12)] rounded-lg text-xs font-semibold text-[#3D5C5C] hover:bg-[#E0F2F2]/20 cursor-pointer"
            >
              Annuler
            </button>
            <div className="flex gap-2">
              {activeTab !== "anatomy" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "general") setActiveTab("sections");
                    else if (activeTab === "sections") setActiveTab("checkpoints");
                    else if (activeTab === "checkpoints") setActiveTab("anatomy");
                  }}
                  className="px-4 py-2 bg-[#0E7C7B] text-white hover:bg-[#0E7C7B]/95 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Continuer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="lesson-form"
                  className="px-5 py-2 bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Enregistrer la Leçon
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lessons Table Grid */
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F5FAFA] border-b border-[rgba(10,61,61,0.08)]">
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Titre de la leçon</th>
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Matière</th>
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Chapitre</th>
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Sections</th>
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Repères anatomiques</th>
                  <th className="py-3 px-4 text-left font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Statut</th>
                  <th className="py-3 px-4 text-right font-bold text-[11px] text-[#7A9E9E] uppercase tracking-[0.04em] font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((less) => (
                  <tr key={less.id} className="border-b border-[rgba(10,61,61,0.05)] hover:bg-[#F5FAFA] transition-all font-sans group">
                    <td className="py-3 px-4 font-semibold text-[#0D2626] text-xs">{less.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#E0F2F2] text-[#0E7C7B] text-[10px] font-bold">
                        {less.subject}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#7A9E9E] text-xs font-mono">{less.unit}</td>
                    <td className="py-3 px-4 text-[#3D5C5C] text-xs font-medium">{less.sections.length} parties</td>
                    <td className="py-3 px-4">
                      {less.anatomyConfig ? (
                        <span className="px-2 py-0.5 rounded border border-[#0E7C7B]/20 text-[#0E7C7B] font-mono text-[9px] font-bold uppercase bg-white">
                          {less.anatomyConfig.type}
                        </span>
                      ) : (
                        <span className="text-[#7A9E9E]/50 italic text-[11px]">aucun</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        less.status === "publié" ? "bg-[#0E7C7B]/10 text-[#0E7C7B]" : "bg-[#E8A838]/10 text-[#E8A838]"
                      }`}>
                        {less.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => startEdit(less)}
                          className="h-7 w-7 rounded-lg border border-[rgba(10,61,61,0.12)] hover:bg-[rgba(10,61,61,0.06)] flex items-center justify-center text-[#0E7C7B] cursor-pointer transition-all"
                          title="Éditer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(less.id)}
                          className="h-7 w-7 rounded-lg border border-[rgba(215,38,56,0.15)] hover:bg-[rgba(215,38,56,0.05)] flex items-center justify-center text-[#D72638] cursor-pointer transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
