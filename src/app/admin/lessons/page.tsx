"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Plus, Search, BookOpen, Clock, Edit2, Trash2, Filter } from "lucide-react";

interface AdminLesson {
  id: string;
  title: string;
  subject: string;
  readTime: number;
  questionCount: number;
  lastUpdated: string;
}

export default function AdminLessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [lessons, setLessons] = useState<AdminLesson[]>([
    { id: "insuffisance-cardiaque", title: "Traitement de l'Insuffisance Cardiaque", subject: "Cardiologie", readTime: 12, questionCount: 15, lastUpdated: "12 Mai 2026" },
    { id: "infarctus-myocarde", title: "Infarctus du Myocarde - SCA ST+ (Phase aiguë)", subject: "Cardiologie", readTime: 15, questionCount: 18, lastUpdated: "14 Mai 2026" },
    { id: "membre-superieur", title: "Vasculo-nerveux du membre supérieur", subject: "Anatomie", readTime: 10, questionCount: 8, lastUpdated: "20 Mai 2026" },
    { id: "rachitisme-carentiel", title: "Rachitisme carentiel et sa prophylaxie", subject: "Pédiatrie", readTime: 8, questionCount: 10, lastUpdated: "22 Mai 2026" },
    { id: "canal-inguinal", title: "Anatomie du Canal Inguinal", subject: "Anatomie", readTime: 9, questionCount: 6, lastUpdated: "24 Mai 2026" }
  ]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette leçon ?")) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const filteredLessons = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "Tous" || l.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ["Tous", "Cardiologie", "Anatomie", "Pédiatrie"];

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
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
              <h1 className="font-serif text-3xl font-bold text-green-dark">Gestion des Leçons</h1>
              <p className="text-text-mid text-sm mt-1">
                Rédigez, modifiez et structurez le contenu de référence scientifique d'Agora.
              </p>
            </div>
            <Link href="/admin/lessons/new">
              <Button className="flex items-center gap-1.5 self-start sm:self-auto">
                <Plus className="w-4 h-4" /> Nouvelle Leçon
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-border-brand/40 text-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-teal-dark flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Filtrer par matière :
            </span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="p-2 border border-border-brand bg-white rounded-sm text-xs text-text-dark focus:outline-none"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Rechercher une leçon par titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none focus:border-green-mid"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light" />
          </div>
        </Card>

        {/* Table list */}
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                  <th className="py-3 px-2">Titre du cours</th>
                  <th className="py-3 px-2">Spécialité</th>
                  <th className="py-3 px-2">Temps de lecture</th>
                  <th className="py-3 px-2">QCMs liés</th>
                  <th className="py-3 px-2">Mis à jour</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border-brand/20">
                {filteredLessons.map((l) => (
                  <tr key={l.id} className="hover:bg-beige-base/20 transition-colors">
                    <td className="py-3.5 px-2 font-semibold text-green-dark">{l.title}</td>
                    <td className="py-3.5 px-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-green-dark/5 text-green-dark border border-green-mid/10">
                        {l.subject}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-text-mid flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {l.readTime} min
                    </td>
                    <td className="py-3.5 px-2 font-mono text-text-mid">{l.questionCount} QCMs</td>
                    <td className="py-3.5 px-2 text-text-light font-mono text-xs">{l.lastUpdated}</td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/lessons/${l.id}/edit`}>
                          <button
                            className="p-1.5 border border-border-brand text-text-light hover:text-green-mid rounded-sm hover:bg-gray-50 cursor-pointer bg-white"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="p-1.5 border border-border-brand text-text-light hover:text-red-600 rounded-sm hover:bg-red-50 cursor-pointer bg-white"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination */}
          <div className="flex items-center justify-between border-t border-border-brand/40 pt-4 mt-6 text-xs text-text-light font-semibold">
            <span>Affichage de 1 à {filteredLessons.length} sur {filteredLessons.length} leçons</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled>Précédent</Button>
              <Button size="sm" variant="outline" disabled>Suivant</Button>
            </div>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
