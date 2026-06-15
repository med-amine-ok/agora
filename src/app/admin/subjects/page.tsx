"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Save, Plus, HelpCircle, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Subject {
  id: string;
  name: string;
  questionCount: number;
}

interface SortableItemProps {
  id: string;
  subject: Subject;
}

function SortableItem({ id, subject }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-white border border-border-brand/40 rounded-sm hover:border-green-mid hover:shadow-sm select-none"
    >
      <div className="flex items-center gap-3">
        {/* Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-text-light hover:text-text-dark cursor-grab active:cursor-grabbing bg-transparent border-none"
          type="button"
          aria-label="Faire glisser pour réordonner"
        >
          <GripVertical className="w-4 h-4 shrink-0" />
        </button>
        <span className="text-sm font-bold text-green-dark">{subject.name}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-mid font-mono">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> {subject.questionCount} QCMs
        </span>
      </div>
    </div>
  );
}

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "s1", name: "Cardiologie", questionCount: 420 },
    { id: "s2", name: "Anatomie", questionCount: 280 },
    { id: "s3", name: "Pédiatrie", questionCount: 350 },
    { id: "s4", name: "Neurologie", questionCount: 190 },
    { id: "s5", name: "Infectiologie", questionCount: 210 },
    { id: "s6", name: "Gynécologie Obstétrique", questionCount: 150 }
  ]);

  const [saving, setSaving] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Allow regular clicks/buttons inside the card
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSubjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Ordre des matières enregistré avec succès !");
    }, 1200);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSub: Subject = {
      id: `s-${Date.now()}`,
      name: newSubjectName.trim(),
      questionCount: 0
    };

    setSubjects([...subjects, newSub]);
    setNewSubjectName("");
  };

  return (
    <SidebarLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        
        {/* Navigation & Actions */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-green-dark">Gestion des Matières</h1>
              <p className="text-text-mid text-sm mt-1">
                Organisez l'ordre d'affichage des spécialités médicales à l'aide du glisser-déposer.
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 self-start sm:self-auto">
              <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer l'ordre"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left panel: Add subject (1/3) */}
          <div className="md:col-span-1">
            <Card className="p-6 space-y-4 border-border-brand/40">
              <h3 className="font-bold text-green-dark text-sm border-b border-border-brand/40 pb-2.5">
                Nouvelle Matière
              </h3>

              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-dark uppercase">Nom de la spécialité</label>
                  <input
                    type="text"
                    placeholder="ex: Gastro-entérologie"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full p-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none focus:border-green-mid"
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="w-full flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Créer
                </Button>
              </form>
            </Card>
          </div>

          {/* Right panel: Sortable List (2/3) */}
          <div className="md:col-span-2 space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={subjects.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {subjects.map((sub) => (
                    <SortableItem key={sub.id} id={sub.id} subject={sub} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
