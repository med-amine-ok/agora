"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown,
  Activity,
  Wind,
  Flame,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Clock,
  BookOpenCheck,
  ChevronLeft,
  X
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: "cardiologie" | "pneumologie" | "gastro" | "pediatrie" | "neurologie" | "nephrologie";
  description: string;
  lessonsCount: number;
  questionsCount: number;
  avgScore: number;
  activeStudents: number;
  completionRate: number;
  visible: boolean;
  lessons: { id: string; title: string; chaptersCount: number; questionsCount: number; status: "publié" | "brouillon" }[];
}

const mockSubjectsData: Subject[] = [
  { 
    id: "s1", 
    name: "Cardiologie", 
    code: "CARD",
    iconName: "cardiologie", 
    description: "Étude clinique et physiopathologique du système cardiovasculaire, des cardiopathies congénitales et acquises, et de l'électrophysiologie.",
    lessonsCount: 8, 
    questionsCount: 45,
    avgScore: 78.4,
    activeStudents: 142,
    completionRate: 85,
    visible: true,
    lessons: [
      { id: "c1_1", title: "Insuffisance Cardiaque Aiguë et Chronique", chaptersCount: 4, questionsCount: 12, status: "publié" },
      { id: "c1_2", title: "Infarctus du Myocarde avec sus-décalage (SCA ST+)", chaptersCount: 5, questionsCount: 15, status: "publié" },
      { id: "c1_3", title: "Troubles du rythme auriculaire et ventriculaire", chaptersCount: 3, questionsCount: 8, status: "publié" },
      { id: "c1_4", title: "Valvulopathies mitrales et aortiques", chaptersCount: 4, questionsCount: 10, status: "brouillon" }
    ]
  },
  { 
    id: "s2", 
    name: "Pneumologie", 
    code: "PNEU",
    iconName: "pneumologie", 
    description: "Prise en charge des pathologies pulmonaires restrictives, obstructives et infectieuses, physiologie ventilatoire et gazométrie.",
    lessonsCount: 6, 
    questionsCount: 32,
    avgScore: 72.1,
    activeStudents: 98,
    completionRate: 74,
    visible: true,
    lessons: [
      { id: "c2_1", title: "Asthme aigu grave et BPCO exacerbée", chaptersCount: 4, questionsCount: 10, status: "publié" },
      { id: "c2_2", title: "Pneumonies aiguës communautaires", chaptersCount: 3, questionsCount: 8, status: "publié" },
      { id: "c2_3", title: "Tuberculose pulmonaire et extrapulmonaire", chaptersCount: 4, questionsCount: 14, status: "publié" }
    ]
  },
  { 
    id: "s3", 
    name: "Gastro-entérologie", 
    code: "GAST",
    iconName: "gastro", 
    description: "Sémiologie et traitement des maladies de l'œsophage, de l'estomac, du foie, du pancréas et des intestins.",
    lessonsCount: 5, 
    questionsCount: 28,
    avgScore: 81.5,
    activeStudents: 110,
    completionRate: 91,
    visible: true,
    lessons: [
      { id: "c3_1", title: "Reflux Gastro-Œsophagien et Ulcères", chaptersCount: 3, questionsCount: 8, status: "publié" },
      { id: "c3_2", title: "Hépatites virales chroniques et Cirrhose", chaptersCount: 5, questionsCount: 12, status: "publié" },
      { id: "c3_3", title: "Maladies Inflammatoires Chroniques de l'Intestin (MICI)", chaptersCount: 4, questionsCount: 8, status: "publié" }
    ]
  },
  { 
    id: "s4", 
    name: "Pédiatrie", 
    code: "PEDI",
    iconName: "pediatrie", 
    description: "Croissance et développement de l'enfant, néonatologie et urgences pédiatriques courantes.",
    lessonsCount: 4, 
    questionsCount: 18,
    avgScore: 69.8,
    activeStudents: 64,
    completionRate: 62,
    visible: false,
    lessons: [
      { id: "c4_1", title: "Développement psychomoteur du nourrisson", chaptersCount: 3, questionsCount: 6, status: "publié" },
      { id: "c4_2", title: "Détresses respiratoires du nouveau-né", chaptersCount: 4, questionsCount: 12, status: "brouillon" }
    ]
  }
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjectsData);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Creation / Editing modes
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState<Subject["iconName"]>("cardiologie");

  const openCreateForm = () => {
    setEditingSubject(null);
    setName("");
    setCode("");
    setDescription("");
    setIconName("cardiologie");
    setShowAddForm(true);
    setSelectedSubject(null);
  };

  const openEditForm = (sub: Subject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setDescription(sub.description);
    setIconName(sub.iconName);
    setShowAddForm(true);
    setSelectedSubject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingSubject) {
      // Edit
      setSubjects(prev => prev.map(s => s.id === editingSubject.id ? {
        ...s,
        name,
        code: code.toUpperCase(),
        description,
        iconName
      } : s));
    } else {
      // Create
      const newSub: Subject = {
        id: "s" + Math.floor(Math.random() * 1000).toString(),
        name,
        code: code.toUpperCase(),
        iconName,
        description,
        lessonsCount: 0,
        questionsCount: 0,
        avgScore: 0,
        activeStudents: 0,
        completionRate: 0,
        visible: true,
        lessons: []
      };
      setSubjects(prev => [...prev, newSub]);
    }

    setShowAddForm(false);
    setEditingSubject(null);
  };

  const handleToggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    if (selectedSubject?.id === id) {
      setSelectedSubject(prev => prev ? { ...prev, visible: !prev.visible } : null);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Supprimer ce module ? Cette action est irréversible et affectera le parcours de formation.")) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      if (selectedSubject?.id === id) {
        setSelectedSubject(null);
      }
    }
  };

  const moveItem = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...subjects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSubjects(updated);
  };

  const renderIcon = (nameName: string, className = "h-5 w-5") => {
    switch (nameName) {
      case "cardiologie":
        return <Activity className={`${className} text-[#0E7C7B]`} />;
      case "pneumologie":
        return <Wind className={`${className} text-[#5DC8C6]`} />;
      case "gastro":
        return <Flame className={`${className} text-[#FF6B35]`} />;
      case "pediatrie":
        return <Stethoscope className={`${className} text-[#0E7C7B]`} />;
      default:
        return <BookOpen className={`${className} text-[#7A9E9E]`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(10,61,61,0.08)] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#0D2626] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#0E7C7B]" /> Gestion des Modules
          </h1>
          <p className="text-xs text-[#7A9E9E] mt-1 uppercase font-mono tracking-wider">
            Organisez les matières, supervisez le contenu d'apprentissage et suivez les indicateurs clés.
          </p>
        </div>

        {!showAddForm && !selectedSubject && (
          <button 
            onClick={openCreateForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E7C7B] text-white hover:bg-[#0A5C5C] text-xs font-bold transition-all shadow-sm self-start sm:self-center"
          >
            <Plus className="h-4 w-4" /> Nouveau Module
          </button>
        )}
      </div>

      {/* Workspace Area */}
      {showAddForm ? (
        <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl shadow-sm overflow-hidden p-6 space-y-4 max-w-xl">
          <div className="flex items-center justify-between border-b border-[rgba(10,61,61,0.08)] pb-3">
            <h3 className="text-sm font-bold text-[#0D2626]">
              {editingSubject ? `Modifier le module : ${editingSubject.name}` : "Créer un nouveau module médical"}
            </h3>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="p-1 text-[#7A9E9E] hover:bg-[rgba(10,61,61,0.05)] rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold block mb-1">Nom du module</label>
                <input
                  type="text"
                  placeholder="Ex. Cardiologie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold block mb-1">Code du module</label>
                <input
                  type="text"
                  placeholder="Ex. CARD"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold block mb-1">Description</label>
              <textarea
                placeholder="Décrivez les objectifs cliniques de cette matière..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.12)] bg-white text-xs outline-none focus:border-[#0E7C7B] text-[#0D2626] resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#7A9E9E] font-bold block mb-1">Illustration thématique</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(["cardiologie", "pneumologie", "gastro", "pediatrie"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIconName(t)}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      iconName === t 
                        ? "border-[#0E7C7B] bg-[#E0F2F2]/30 text-[#0E7C7B]" 
                        : "border-[rgba(10,61,61,0.08)] bg-white text-[#7A9E9E] hover:bg-slate-50"
                    }`}
                  >
                    {renderIcon(t, "h-6 w-6")}
                    <span className="text-[10px] capitalize font-semibold">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(10,61,61,0.08)]">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-[rgba(10,61,61,0.08)] hover:bg-[#F5FAFA] text-xs font-semibold text-[#0D2626]"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#0E7C7B] text-white hover:bg-[#0A5C5C] text-xs font-bold"
              >
                {editingSubject ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      ) : selectedSubject ? (
        /* Detailed Subject View & Analytics Dashboard */
        <div className="space-y-6">
          {/* Breadcrumb Back Button */}
          <button 
            onClick={() => setSelectedSubject(null)}
            className="flex items-center gap-1 text-xs text-[#0E7C7B] hover:text-[#0A5C5C] font-semibold"
          >
            <ChevronLeft className="h-4 w-4" /> Retour à la liste
          </button>

          {/* Module Title card */}
          <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4 items-start">
              <div className="p-4 rounded-xl bg-[#E0F2F2]/45 border border-[#5DC8C6]/20">
                {renderIcon(selectedSubject.iconName, "h-8 w-8")}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#0E7C7B]/10 text-[#0E7C7B] rounded text-[10px] font-bold font-mono">
                    {selectedSubject.code}
                  </span>
                  <h2 className="text-xl font-bold text-[#0D2626]">{selectedSubject.name}</h2>
                </div>
                <p className="text-xs text-[#7A9E9E] max-w-2xl">{selectedSubject.description || "Aucune description fournie pour ce module."}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button 
                onClick={(e) => openEditForm(selectedSubject, e)}
                className="p-2 rounded-lg border border-[rgba(10,61,61,0.08)] hover:bg-[#F5FAFA] text-[#0D2626]"
                title="Modifier les détails"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => handleToggleVisibility(selectedSubject.id, e)}
                className={`p-2 rounded-lg border ${
                  selectedSubject.visible 
                    ? "border-[#0E7C7B]/20 text-[#0E7C7B] hover:bg-[#0E7C7B]/5" 
                    : "border-[rgba(10,61,61,0.08)] text-[#7A9E9E]"
                }`}
                title={selectedSubject.visible ? "Désactiver la visibilité" : "Activer la visibilité"}
              >
                {selectedSubject.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[rgba(10,61,61,0.08)] p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between text-[#7A9E9E]">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Étudiants actifs</span>
                <Users className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-[#0D2626]">{selectedSubject.activeStudents}</p>
              <span className="text-[10px] text-[#0E7C7B] font-medium">Parcours en cours</span>
            </div>

            <div className="bg-white border border-[rgba(10,61,61,0.08)] p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between text-[#7A9E9E]">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Score Moyen</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-[#0D2626]">{selectedSubject.avgScore}%</p>
              <span className="text-[10px] text-[#FF6B35] font-medium">Moyenne des quiz</span>
            </div>

            <div className="bg-white border border-[rgba(10,61,61,0.08)] p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between text-[#7A9E9E]">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Taux de complétion</span>
                <Award className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-[#0D2626]">{selectedSubject.completionRate}%</p>
              <div className="w-full bg-[#F5FAFA] rounded-full h-1.5 mt-1.5">
                <div className="bg-[#0E7C7B] h-1.5 rounded-full" style={{ width: `${selectedSubject.completionRate}%` }}></div>
              </div>
            </div>

            <div className="bg-white border border-[rgba(10,61,61,0.08)] p-4 rounded-xl shadow-sm space-y-1">
              <div className="flex justify-between text-[#7A9E9E]">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Banque de questions</span>
                <BookOpenCheck className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-[#0D2626]">{selectedSubject.questionsCount}</p>
              <span className="text-[10px] text-[#7A9E9E] font-medium">Questions de quiz</span>
            </div>
          </div>

          {/* Lessons List in the Module */}
          <div className="bg-white border border-[rgba(10,61,61,0.08)] rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[rgba(10,61,61,0.08)] flex justify-between items-center bg-[#F5FAFA]/50">
              <h3 className="text-xs font-bold text-[#0D2626] uppercase tracking-wider font-mono">
                Leçons associées ({selectedSubject.lessons.length})
              </h3>
            </div>

            <div className="divide-y divide-[rgba(10,61,61,0.08)]">
              {selectedSubject.lessons.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#7A9E9E]">
                  Aucune leçon n'est actuellement liée à ce module.
                </div>
              ) : (
                selectedSubject.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5FAFA]/30">
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs font-bold text-[#0D2626]">{lesson.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-[#7A9E9E] font-mono">
                        <span>{lesson.chaptersCount} Chapitres</span>
                        <span>•</span>
                        <span>{lesson.questionsCount} Questions</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        lesson.status === "publié" 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {lesson.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#7A9E9E]/40" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Main Subjects grid */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub, index) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSubject(sub)}
                className={`p-5 rounded-xl border border-[rgba(10,61,61,0.08)] bg-white flex flex-col justify-between gap-4 shadow-sm hover:border-[#0E7C7B]/40 hover:shadow-md transition-all cursor-pointer text-left relative overflow-hidden group ${
                  !sub.visible ? "opacity-75 bg-[#F5FAFA]" : ""
                }`}
              >
                {/* Decorative border highlight */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#0E7C7B] opacity-0 group-hover:opacity-100 transition-all"></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-lg bg-[#E0F2F2]/45 border border-[#5DC8C6]/20">
                      {renderIcon(sub.iconName, "h-5 w-5")}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-[#0E7C7B]/10 text-[#0E7C7B] rounded">
                          {sub.code}
                        </span>
                        <h3 className="text-sm font-bold text-[#0D2626] group-hover:text-[#0E7C7B] transition-colors">{sub.name}</h3>
                      </div>
                      <p className="text-[11px] text-[#7A9E9E] line-clamp-2 max-w-[320px]">
                        {sub.description || "Pas de description fournie."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move order */}
                    <button 
                      onClick={(e) => moveItem(index, "up", e)}
                      disabled={index === 0}
                      className="p-1 rounded text-[#7A9E9E] hover:bg-[#F5FAFA] disabled:opacity-30"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={(e) => moveItem(index, "down", e)}
                      disabled={index === subjects.length - 1}
                      className="p-1 rounded text-[#7A9E9E] hover:bg-[#F5FAFA] disabled:opacity-30"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(10,61,61,0.05)] pt-3 text-[11px]">
                  <div className="flex items-center gap-4 text-[#7A9E9E] font-mono">
                    <span className="font-semibold">{sub.lessonsCount} Leçons</span>
                    <span className="font-semibold">{sub.questionsCount} Questions</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => openEditForm(sub, e)}
                      className="p-1 text-[#7A9E9E] hover:bg-[#F5FAFA] rounded"
                      title="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleToggleVisibility(sub.id, e)}
                      className={`p-1 rounded ${sub.visible ? "text-[#0E7C7B]" : "text-[#7A9E9E]"}`}
                      title={sub.visible ? "Masquer" : "Afficher"}
                    >
                      {sub.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button 
                      onClick={(e) => handleDelete(sub.id, e)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
