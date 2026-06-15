"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { ChevronLeft, Plus, Trash2, Edit2, Calendar } from "lucide-react";

interface AdminPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<AdminPost[]>([
    { slug: "cas-clinique-sca-st-plus-vs-st-moins", title: "Analyse d'un Cas Clinique de Cardiologie : SCA ST+ vs ST-", category: "Cas Clinique", author: "Dr. Amine Bensalah", date: "12 Juin 2026" },
    { slug: "preparer-concours-residanat-sans-burnout", title: "Comment préparer le concours de Résidanat sans faire de burnout", category: "Conseils d'Études", author: "Meriem Bensalah", date: "05 Juin 2026" },
    { slug: "inhibiteurs-sglt2-insuffisance-cardiaque", title: "Les nouveaux inhibiteurs de SGLT2 dans l'insuffisance cardiaque", category: "Actualités Médicales", author: "Dr. Lina Chaoui", date: "28 Mai 2026" }
  ]);

  const handleDelete = (slug: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet article de blog ?")) {
      setPosts(posts.filter(p => p.slug !== slug));
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Navigation Actions */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour à l'administration
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-green-dark">Gestion des Articles du Blog</h1>
              <p className="text-text-mid text-sm mt-1">
                Publiez des cas cliniques, actualités scientifiques et conseils méthodologiques pour les étudiants.
              </p>
            </div>
            <Button className="flex items-center gap-1.5 self-start sm:self-auto">
              <Plus className="w-4 h-4" /> Nouvel Article
            </Button>
          </div>
        </div>

        {/* Table of posts */}
        <Card className="p-6">
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-brand/40 text-xs text-text-light font-mono uppercase pb-2">
                  <th className="py-3 px-2">Titre de l'article</th>
                  <th className="py-3 px-2">Catégorie</th>
                  <th className="py-3 px-2">Auteur</th>
                  <th className="py-3 px-2">Date de publication</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-brand/20">
                {posts.map((p) => (
                  <tr key={p.slug} className="hover:bg-beige-base/20 transition-colors">
                    <td className="py-3.5 px-2 font-semibold text-green-dark leading-snug">{p.title}</td>
                    <td className="py-3.5 px-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-green-dark/5 text-green-dark border border-green-mid/10">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-text-mid font-semibold">{p.author}</td>
                    <td className="py-3.5 px-2 text-text-light font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {p.date}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="p-1.5 border border-border-brand text-text-light hover:text-green-mid rounded-sm bg-white"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.slug)}
                          className="p-1.5 border border-border-brand text-text-light hover:text-red-600 rounded-sm bg-white cursor-pointer"
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
        </Card>
      </div>
    </SidebarLayout>
  );
}
