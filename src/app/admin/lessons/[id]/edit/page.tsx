"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import ContentEditor from "@/presentation/components/admin/ContentEditor";
import { ChevronLeft, Save } from "lucide-react";

export default function AdminEditLesson() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Cardiologie");
  const [readTime, setReadTime] = useState(10);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Pre-populate editor from mock database
  useEffect(() => {
    if (!lessonId) return;

    // Simulate database lookup
    setTimeout(() => {
      if (lessonId === "insuffisance-cardiaque") {
        setTitle("Traitement de l'Insuffisance Cardiaque");
        setSubject("Cardiologie");
        setReadTime(12);
        setContent(`
          <h3>Physiopathologie de base</h3>
          <p>L’insuffisance cardiaque à fraction d’éjection altérée (IC-FEa) est définie par une fraction d’éjection du ventricule gauche inférieure ou égale à 40%. Cet état chronique affecte le débit systémique.</p>
        `);
      } else {
        setTitle("Titre du cours d'étude");
        setSubject("Anatomie");
        setReadTime(10);
        setContent("<p>Contenu clinique de la leçon en cours d'édition...</p>");
      }
      setLoading(false);
    }, 500);
  }, [lessonId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Modifications de la leçon enregistrées !");
      router.push("/admin/lessons");
    }, 1200);
  };

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* Navigation Actions */}
        <div className="space-y-2">
          <Link
            href="/admin/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à la liste des cours
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-green-dark">Modifier la Leçon</h1>
              <p className="text-text-mid text-sm mt-1">
                Ajustez et mettez à jour les concepts clés rédigés pour les étudiants.
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving || loading} className="flex items-center gap-1.5 self-start sm:self-auto">
              <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="p-6 space-y-4 border-border-brand/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Title */}
                <div className="md:col-span-2 space-y-1.5 text-sm">
                  <label className="block font-bold text-text-dark uppercase text-xs">Titre du cours</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 border border-border-brand bg-white rounded-sm text-text-dark focus:outline-none focus:border-green-mid"
                    required
                  />
                </div>

                {/* Read time */}
                <div className="space-y-1.5 text-sm">
                  <label className="block font-bold text-text-dark uppercase text-xs">Temps de lecture (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className="w-full p-2.5 border border-border-brand bg-white rounded-sm text-text-dark focus:outline-none"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5 text-sm">
                  <label className="block font-bold text-text-dark uppercase text-xs">Matière / Module</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 border border-border-brand bg-white rounded-sm text-text-dark focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Anatomie">Anatomie</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Neurologie">Neurologie</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* TipTap editor card */}
            <div className="space-y-2">
              <label className="block font-bold text-text-dark uppercase text-xs select-none">Corps de la leçon (Format Rich Text)</label>
              <ContentEditor value={content} onChange={setContent} />
            </div>
          </form>
        )}
      </div>
    </SidebarLayout>
  );
}
