"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Heart, AlertCircle, Bookmark, CheckSquare } from "lucide-react";
import { useArticlesStore } from "@/store/useArticlesStore";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { articles, likeArticle } = useArticlesStore();
  const [hasLiked, setHasLiked] = useState(false);

  const articleId = params.id as string;
  const article = useMemo(() => articles.find(a => a.id === articleId), [articles, articleId]);

  // Framer Motion scroll hook for sticky progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate related articles (up to 3 in same category, excluding active article)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3);
  }, [articles, article]);

  // Fallback related articles if same category has too few
  const backupRelatedArticles = useMemo(() => {
    if (!article) return [];
    const sameCat = articles.filter(a => a.id !== article.id && a.category === article.category);
    if (sameCat.length >= 3) return sameCat.slice(0, 3);

    const otherCat = articles.filter(a => a.id !== article.id && a.category !== article.category);
    return [...sameCat, ...otherCat].slice(0, 3);
  }, [articles, article]);

  const handleLike = () => {
    if (article && !hasLiked) {
      likeArticle(article.id);
      setHasLiked(true);
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F5FAFA] flex items-center justify-center pt-24 pb-16 font-sans">
        <div className="text-center space-y-4 max-w-sm px-4">
          <AlertCircle className="h-12 w-12 text-accent mx-auto animate-bounce" />
          <h2 className="font-display text-xl font-bold text-teal-dark">Article Introuvable</h2>
          <p className="text-xs text-text-light">
            Cet article n'existe pas ou a été retiré de la publication.
          </p>
          <Link href="/articles">
            <button className="flex items-center gap-1.5 px-4 py-2 mx-auto mt-4 text-xs font-bold text-[#F5FAFA] bg-teal hover:bg-teal-dark rounded-xl transition-all cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Retour aux Articles
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAFA] pt-24 pb-20 font-sans relative">
      
      {/* Sticky Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark transition-colors font-mono cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
        </button>

        {/* Article Meta Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-teal/10 text-teal px-2.5 py-0.5 rounded-full">
              {article.category}
            </span>
            <span className="text-text-light text-xs font-mono">• {article.readTime} de lecture</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-teal-dark leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-teal/10 pb-6 text-xs text-text-light font-mono">
            <div className="flex items-center gap-4">
              <span>Par <strong className="text-text-dark font-semibold">{article.author}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {article.date}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  hasLiked
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-white-custom border-teal/10 text-text-light hover:border-teal/20 hover:text-teal"
                }`}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-accent stroke-accent" : ""}`} /> {article.likes}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cover Image */}
        <div className="w-full h-[250px] sm:h-[350px] md:h-[420px] relative rounded-2xl overflow-hidden bg-teal-dark shadow-sm">
          <img
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Main Article Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Article text body */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Lead paragraph / excerpt */}
            <p className="text-sm md:text-base leading-relaxed text-text-main font-medium border-l-2 border-teal pl-4 italic">
              {article.excerpt}
            </p>

            {/* Render article body content formatted with Tailwind typography classes */}
            <div className="prose prose-sm md:prose-base text-text-dark max-w-none leading-relaxed space-y-6">
              {article.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("###")) {
                  return (
                    <h3 key={index} className="font-display text-lg sm:text-xl font-bold text-teal-dark mt-8 mb-4">
                      {paragraph.replace("###", "").trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith("-")) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-2 text-xs md:text-sm text-text-light">
                      {paragraph.split("\n").map((li, idx) => (
                        <li key={idx}>{li.replace("-", "").trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-xs md:text-sm text-text-light">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>

            {/* Medical Callout / Notes blocks */}
            {article.medicalNotes && article.medicalNotes.length > 0 && (
              <div className="space-y-4 pt-4">
                {article.medicalNotes.map((note, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-accent/20 bg-accent/5 flex gap-3 text-xs leading-relaxed text-text-dark">
                    <Bookmark className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-accent mb-1 font-mono uppercase tracking-wider text-[10px]">Note d'Analyse Clinique</h4>
                      <p>{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Likes section at bottom */}
            <div className="flex items-center gap-3 pt-8 border-t border-teal/10">
              <span className="text-xs text-text-light">Cet article vous a aidé dans vos révisions ?</span>
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  hasLiked
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-white-custom border-teal/10 text-text-light hover:border-teal/20 hover:text-teal"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${hasLiked ? "fill-accent stroke-accent" : ""}`} /> Like
              </button>
            </div>

          </div>

          {/* Sidebar summary/points (Chess.com layout style) */}
          <div className="lg:col-span-4 space-y-6">
            
            {article.summaryPoints && article.summaryPoints.length > 0 && (
              <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-xs space-y-4">
                <h4 className="font-display text-sm font-bold text-teal-dark flex items-center gap-2 border-b border-teal/10 pb-3">
                  <CheckSquare className="h-4 w-4 text-teal" /> Points Clés
                </h4>
                <ul className="space-y-3">
                  {article.summaryPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-2.5 text-xs text-text-light leading-relaxed">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full shrink-0 mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags Box */}
            <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom shadow-xs space-y-3">
              <h4 className="font-display text-sm font-bold text-teal-dark">Mots-Clés</h4>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#F5FAFA] border border-teal/5 text-[10px] text-text-light font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Related Articles Section (Chess.com style recommendation grid) */}
        <div className="border-t border-teal/10 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-teal-dark">Articles recommandés</h3>
            <Link href="/articles" className="text-xs font-bold text-teal hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {backupRelatedArticles.map((rel) => (
              <Link key={rel.id} href={`/articles/${rel.id}`} className="group flex flex-col justify-between p-5 rounded-xl border border-teal/10 bg-white-custom hover:shadow-sm hover:border-teal/20 transition-all">
                <div className="space-y-3">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded-full inline-block">
                    {rel.category}
                  </span>
                  <h4 className="text-xs md:text-sm font-bold text-text-dark group-hover:text-teal transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-text-light line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-teal/5 mt-4 text-[9px] text-text-light font-mono">
                  <span>{rel.readTime}</span>
                  <span className="flex items-center gap-0.5"><Heart className="h-3 w-3 fill-accent/10" /> {rel.likes}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
