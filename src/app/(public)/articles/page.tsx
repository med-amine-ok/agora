"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Calendar, ArrowRight, Heart, BookOpen, AlertCircle } from "lucide-react";
import { useArticlesStore } from "@/store/useArticlesStore";

const CATEGORIES = ["Tous", "Cardiologie", "Pneumologie", "Pédiatrie", "Méthodologie", "Physiologie"];

export default function ArticlesPage() {
  const { articles } = useArticlesStore();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Select the first article in list (or one with highest ID) as featured
  const featuredArticle = useMemo(() => {
    return articles.find(a => a.category === "Méthodologie") || articles[0] || null;
  }, [articles]);

  // Filter and search articles (excluding the featured one to avoid immediate redundancy,
  // but keeping it if list is tiny)
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Category check
      const matchesCategory =
        selectedCategory === "Tous" || article.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search check
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F5FAFA] pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page title and description */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-teal-dark">
            Le Médiblog d'Agora
          </h1>
          <p className="text-sm md:text-base text-text-light max-w-2xl mx-auto">
            Mises au point cliniques rigoureuses, fiches de synthèse pour le résidanat et conseils de méthodologie médicale par vos aînés.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredArticle && !searchQuery && selectedCategory === "Tous" && (
          <div className="w-full">
            <h2 className="text-xs font-mono uppercase tracking-widest text-text-light/60 mb-3 font-bold">
              À la Une d'Agora
            </h2>
            <div className="bg-white-custom border border-teal/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Cover Image container */}
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[400px] bg-teal-dark overflow-hidden group">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/50 to-transparent" />
              </div>

              {/* Text details container */}
              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-white-custom px-2.5 py-0.5 rounded-full">
                      {featuredArticle.category}
                    </span>
                    <span className="text-text-light text-xs font-mono">• {featuredArticle.readTime}</span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-teal-dark leading-snug hover:text-teal transition-colors">
                    <Link href={`/articles/${featuredArticle.id}`}>
                      {featuredArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-text-light leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-teal/10 flex items-center justify-between">
                  <span className="text-[10px] text-text-light font-mono font-medium">
                    Par {featuredArticle.author}
                  </span>
                  <Link href={`/articles/${featuredArticle.id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#F5FAFA] bg-teal hover:bg-teal-dark rounded-xl transition-all shadow-xs cursor-pointer">
                      Lire l'article <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Discovery & Navigation (Chess.com philosophy) */}
        <div className="border-t border-teal/10 pt-10 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-teal-dark">Que voulez-vous lire aujourd'hui ?</h2>
              <p className="text-xs text-text-light">Sélectionnez une spécialité médicale ou recherchez une notion.</p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, tag ou auteur..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-teal/15 bg-white-custom text-xs outline-hidden focus:border-teal text-text-dark font-sans shadow-xs"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-light/50" />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === category
                    ? "bg-teal border-teal text-[#F5FAFA] shadow-xs"
                    : "bg-white-custom border-teal/10 text-text-light hover:border-teal/30 hover:text-teal"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

        </div>

        {/* Article Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white-custom border border-teal/10 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <Link href={`/articles/${article.id}`} className="flex flex-col h-full justify-between">
                    <div className="space-y-4">
                      {/* Cover image with light zoom */}
                      <div className="h-44 w-full relative overflow-hidden bg-teal-dark">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-104 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white-custom/90 text-teal px-2 py-0.5 rounded-full shadow-xs">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      <div className="px-6 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-text-light font-mono">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-teal-dark group-hover:text-teal transition-colors leading-snug">
                          {article.title}
                        </h4>

                        <p className="text-xs text-text-light leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-teal/5 mt-6 flex items-center justify-between text-[10px] text-text-light font-mono">
                      <span>Par {article.author}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-accent fill-accent/10" /> {article.likes}
                        </span>
                        <span className="flex items-center gap-0.5 font-bold text-teal group-hover:text-teal-dark">
                          Lire <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-accent animate-bounce" />
                <h4 className="font-display text-lg font-bold text-teal-dark">Aucun article trouvé</h4>
                <p className="text-xs text-text-light">Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
