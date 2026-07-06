"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  EyeOff, 
  History,
  X,
  BookOpen
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  subject: string;
  unit: string;
  status: "publié" | "brouillon";
  content: string;
  versions: string[];
}

const mockLessons: Lesson[] = [
  { 
    id: "l1", 
    title: "Infarctus aigu du myocarde (SCA ST+)", 
    subject: "Cardiologie", 
    unit: "Unité Cardiovasculaire", 
    status: "publié", 
    content: "# Infarctus aigu du myocarde (SCA ST+)\n\n## Définition\nL'infarctus aigu du myocarde (SCA ST+) est provoqué par l'occlusion complète d'une artère coronaire.\n\n## Diagnostic ECG\n- Sus-décalage du segment ST (onde de Pardee) dans au moins deux dérivations contiguës.\n- Image en miroir.",
    versions: ["Version 2 (Modifiée par Dr. Belkacem)", "Version 1 (Création initiale)"]
  },
  { 
    id: "l2", 
    title: "Diagnostic de l'embolie pulmonaire", 
    subject: "Pneumologie", 
    unit: "Unité Respiratoire", 
    status: "publié", 
    content: "# Embolie Pulmonaire\n\n## Signes cliniques\n- Dyspnée aiguë\n- Douleur thoracique latéro-thoracique",
    versions: ["Version 1 (Création initiale)"]
  },
  { 
    id: "l3", 
    title: "Péricardite aiguë bénigne", 
    subject: "Cardiologie", 
    unit: "Unité Cardiovasculaire", 
    status: "brouillon", 
    content: "# Péricardite aiguë\n\n## ECG\n- Sus-décalage du ST concave vers le haut.",
    versions: ["Version 1 (Brouillon initial)"]
  }
];

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubject, setEditorSubject] = useState("Cardiologie");
  const [editorUnit, setEditorUnit] = useState("Unité Cardiovasculaire");
  const [editorStatus, setEditorStatus] = useState<"publié" | "brouillon">("brouillon");
  const [editorContent, setEditorContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const startCreate = () => {
    setEditingLesson(null);
    setEditorTitle("");
    setEditorSubject("Cardiologie");
    setEditorUnit("Unité Cardiovasculaire");
    setEditorStatus("brouillon");
    setEditorContent("");
    setShowEditor(true);
    setShowPreview(false);
  };

  const startEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditorTitle(lesson.title);
    setEditorSubject(lesson.subject);
    setEditorUnit(lesson.unit);
    setEditorStatus(lesson.status);
    setEditorContent(lesson.content);
    setShowEditor(true);
    setShowPreview(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim()) return;

    if (editingLesson) {
      // Edit existing
      setLessons(prev => prev.map(l => {
        if (l.id === editingLesson.id) {
          return {
            ...l,
            title: editorTitle,
            subject: editorSubject,
            unit: editorUnit,
            status: editorStatus,
            content: editorContent,
            versions: [`Modifié le ${new Date().toLocaleDateString()}`, ...l.versions]
          };
        }
        return l;
      }));
    } else {
      // Create new
      const newLesson: Lesson = {
        id: Math.floor(Math.random() * 1000).toString(),
        title: editorTitle,
        subject: editorSubject,
        unit: editorUnit,
        status: editorStatus,
        content: editorContent,
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
            <FileText className="h-6 w-6 text-accent" /> Gestion des Leçons Médicales
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Rédigez des cours cliniques en Markdown, classez-les par matière et révisez les versions antérieures.
          </p>
        </div>

        {!showEditor && (
          <button 
            onClick={startCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
          >
            <Plus className="h-4 w-4" /> Rédiger une Leçon
          </button>
        )}
      </div>

      {/* Editor Modal/Panel */}
      {showEditor && (
        <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-teal/10 pb-4">
            <h3 className="font-display text-base font-bold text-text-dark">
              {editingLesson ? `Édition : ${editingLesson.title}` : "Nouvelle Leçon"}
            </h3>
            <button 
              onClick={() => setShowEditor(false)}
              className="p-1 rounded-full hover:bg-surface text-text-light"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Titre</label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Matière</label>
                <select
                  value={editorSubject}
                  onChange={(e) => setEditorSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                >
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Pneumologie">Pneumologie</option>
                  <option value="Gastro-entérologie">Gastro-entérologie</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Unité clinique</label>
                <input
                  type="text"
                  value={editorUnit}
                  onChange={(e) => setEditorUnit(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-mono text-text-light font-bold">Contenu (Markdown)</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-teal font-semibold hover:underline"
                >
                  {showPreview ? "Retour à l'éditeur" : "Prévisualiser"}
                </button>
              </div>

              {showPreview ? (
                <div className="mt-1 p-4 rounded-xl border border-teal/10 bg-surface/20 min-h-60 prose max-w-none text-xs text-text-main whitespace-pre-wrap">
                  {editorContent || "*Aucun contenu rédigé*"}
                </div>
              ) : (
                <textarea
                  rows={10}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Rédigez en Markdown..."
                  className="w-full mt-1 p-3 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark font-mono"
                />
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold block mb-1">Statut</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-text-main font-semibold">
                  <input
                    type="radio"
                    name="status"
                    value="publié"
                    checked={editorStatus === "publié"}
                    onChange={() => setEditorStatus("publié")}
                  /> Publié
                </label>
                <label className="flex items-center gap-1.5 text-xs text-text-main font-semibold">
                  <input
                    type="radio"
                    name="status"
                    value="brouillon"
                    checked={editorStatus === "brouillon"}
                    onChange={() => setEditorStatus("brouillon")}
                  /> Brouillon
                </label>
              </div>
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
                Sauvegarder la Leçon
              </button>
            </div>
          </form>

          {editingLesson && (
            <div className="space-y-2 border-t border-teal/10 pt-4">
              <h4 className="text-[10px] font-mono uppercase text-text-light tracking-wider font-bold flex items-center gap-1">
                <History className="h-3.5 w-3.5 text-teal" /> Historique des versions
              </h4>
              <div className="space-y-1">
                {editingLesson.versions.map((ver, i) => (
                  <p key={i} className="text-[10px] font-mono text-text-light">{ver}</p>
                ))}
              </div>
            </div>
          )}
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
