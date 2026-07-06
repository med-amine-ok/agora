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
  Stethoscope
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  iconName: "cardiologie" | "pneumologie" | "gastro" | "pediatrie";
  lessonsCount: number;
  visible: boolean;
}

const mockSubjects: Subject[] = [
  { id: "s1", name: "Cardiologie", iconName: "cardiologie", lessonsCount: 8, visible: true },
  { id: "s2", name: "Pneumologie", iconName: "pneumologie", lessonsCount: 6, visible: true },
  { id: "s3", name: "Gastro-entérologie", iconName: "gastro", lessonsCount: 5, visible: true },
  { id: "s4", name: "Pédiatrie", iconName: "pediatrie", lessonsCount: 4, visible: false }
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<"cardiologie" | "pneumologie" | "gastro" | "pediatrie">("cardiologie");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSub: Subject = {
      id: Math.floor(Math.random() * 1000).toString(),
      name: newName,
      iconName: newIcon,
      lessonsCount: 0,
      visible: true
    };

    setSubjects(prev => [...prev, newSub]);
    setNewName("");
    setShowAddForm(false);
  };

  const handleToggleVisibility = (id: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette matière ? Les leçons associées seront orphelines.")) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const updated = [...subjects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSubjects(updated);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "cardiologie":
        return <Activity className="h-5 w-5 text-accent" />;
      case "pneumologie":
        return <Wind className="h-5 w-5 text-teal" />;
      case "gastro":
        return <Flame className="h-5 w-5 text-accent" />;
      default:
        return <Stethoscope className="h-5 w-5 text-teal" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="border-b border-teal/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-accent" /> Gestion des Matières
          </h1>
          <p className="text-xs text-text-light mt-1 uppercase font-mono tracking-wider">
            Ajoutez de nouvelles matières, activez leur visibilité et organisez l'ordre d'apprentissage.
          </p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold transition-all"
        >
          <Plus className="h-4 w-4" /> Nouvelle Matière
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-sm space-y-4 max-w-md">
          <h3 className="text-xs font-mono font-bold text-text-dark uppercase">Créer une matière médicale</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Nom</label>
              <input
                type="text"
                placeholder="Ex. Cardiologie Clinique"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark placeholder-text-light/50"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-text-light font-bold">Icône indicative</label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value as any)}
                className="w-full mt-1 px-3 py-1.5 rounded-lg border border-teal/15 bg-white-custom text-xs outline-none focus:border-teal text-text-dark"
              >
                <option value="cardiologie">Cardiologie (Oscilloscope)</option>
                <option value="pneumologie">Pneumologie (Vent)</option>
                <option value="gastro">Gastro-entérologie (Feu)</option>
                <option value="pediatrie">Autre (Stéthoscope)</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-teal/10 hover:bg-surface text-xs font-semibold text-text-dark"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-teal text-white-custom hover:bg-teal-dark text-xs font-bold"
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Subjects re-orderable list */}
      <div className="space-y-3">
        {subjects.map((sub, index) => (
          <div 
            key={sub.id} 
            className={`p-4 rounded-xl border border-teal/10 bg-white-custom flex items-center justify-between gap-4 shadow-sm hover:border-teal/20 transition-all ${
              !sub.visible ? "opacity-75 bg-surface/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-surface/50 border border-teal/5">
                {renderIcon(sub.iconName)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-dark">{sub.name}</h3>
                <span className="text-[10px] text-text-light font-mono font-bold uppercase">{sub.lessonsCount} Leçons</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Order management buttons */}
              <button 
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-1 rounded text-text-light hover:bg-surface disabled:opacity-30"
              >
                <MoveUp className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => moveItem(index, "down")}
                disabled={index === subjects.length - 1}
                className="p-1 rounded text-text-light hover:bg-surface disabled:opacity-30"
              >
                <MoveDown className="h-3.5 w-3.5" />
              </button>

              {/* Visibility and delete */}
              <button 
                onClick={() => handleToggleVisibility(sub.id)}
                className={`p-1.5 rounded border ${sub.visible ? "border-teal/10 text-teal hover:bg-teal/5" : "border-text-light/10 text-text-light hover:bg-surface"}`}
                title={sub.visible ? "Rendre invisible" : "Rendre visible"}
              >
                {sub.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>

              <button 
                onClick={() => handleDelete(sub.id)}
                className="p-1.5 rounded border border-error/10 text-error hover:bg-error/5"
                title="Supprimer la matière"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
