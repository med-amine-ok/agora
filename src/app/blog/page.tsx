"use client";

import React, { useState } from "react";
import Link from "next/link";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { BookOpen, Search, Clock, Calendar, ArrowRight } from "lucide-react";

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export default function BlogHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Cas Clinique", "Conseils d'Études", "Actualités Médicales"];

  const posts: BlogPost[] = [
    {
      title: "Analyse d'un Cas Clinique de Cardiologie : SCA ST+ vs ST-",
      slug: "cas-clinique-sca-st-plus-vs-st-moins",
      excerpt: "Comment différencier rapidement les syndromes coronariens aigus à la garde des urgences. Critères ECG clés et conduite à tenir immédiate.",
      category: "Cas Clinique",
      readTime: "7 min",
      date: "12 Juin 2026",
      author: "Dr. Amine Bensalah",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400"
    },
    {
      title: "Comment préparer le concours de Résidanat sans faire de burnout",
      slug: "preparer-concours-residanat-sans-burnout",
      excerpt: "Méthodes de planification par blocs de révisions, gestion de la fatigue cognitive et stratégie pour aborder les QCMs complexes de physiopathologie.",
      category: "Conseils d'Études",
      readTime: "12 min",
      date: "05 Juin 2026",
      author: "Meriem Bensalah",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400"
    },
    {
      title: "Les nouveaux inhibiteurs de SGLT2 dans l'insuffisance cardiaque",
      slug: "inhibiteurs-sglt2-insuffisance-cardiaque",
      excerpt: "Une revue complète de l'évolution des directives cliniques pour la prise en charge de l'insuffisance cardiaque à fraction d'éjection réduite.",
      category: "Actualités Médicales",
      readTime: "9 min",
      date: "28 Mai 2026",
      author: "Dr. Lina Chaoui",
      image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=400"
    },
    {
      title: "Sémiologie Neurologique : Diagnostic des Syndromes Cordonaux",
      slug: "semiologie-neurologique-syndromes-cordonaux",
      excerpt: "Synthèse clinique des voies de la sensibilité lemniscale et extra-lemniscale avec repères anatomiques pour localiser une lésion médullaire.",
      category: "Cas Clinique",
      readTime: "8 min",
      date: "15 Mai 2026",
      author: "Dr. Ryad Kaced",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=400"
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16 select-none">
        
        {/* Header */}
        <div className="border-b border-border-brand pb-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-green-mid" /> Agora Blog Clinique
          </h1>
          <p className="text-text-mid text-sm mt-1">
            Articles de synthèse clinique rédigés par des internes et résidents d'Alger, d'Oran et de Constantine.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-brand/20 p-4 border border-border-brand rounded-sm text-sm">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm border cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-green-mid border-green-mid text-white"
                    : "border-border-brand bg-white text-text-mid hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border-brand rounded-sm text-xs bg-white text-text-dark focus:outline-none focus:border-green-mid"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light" />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-text-light">
            <p className="text-sm font-semibold">Aucun article ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className="flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow border-border-brand/45"
              >
                <div className="space-y-4">
                  {/* Category & Stats row */}
                  <div className="flex items-center justify-between text-[10px] text-text-light font-mono font-bold uppercase tracking-wider">
                    <span className="bg-surface-brand text-green-dark px-2.5 py-0.5 rounded-sm">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                      <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-green-dark group-hover:text-green-mid transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-mid leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-brand/35 mt-6 flex items-center justify-between text-xs">
                  <span className="font-mono text-text-light font-semibold">Par {post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-green-mid font-semibold hover:underline flex items-center gap-1 group/btn"
                  >
                    Lire l'article <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
