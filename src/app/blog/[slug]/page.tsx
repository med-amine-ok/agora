"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import { ArrowLeft, Clock, Calendar, Bookmark, Share2 } from "lucide-react";

export default function BlogPostDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock database lookup by slug
  const getPostBySlug = (s: string) => {
    const database: Record<string, { title: string; category: string; readTime: string; date: string; author: string; role: string; content: string }> = {
      "cas-clinique-sca-st-plus-vs-st-moins": {
        title: "Analyse d'un Cas Clinique de Cardiologie : SCA ST+ vs ST-",
        category: "Cas Clinique",
        readTime: "7 min",
        date: "12 Juin 2026",
        author: "Dr. Amine Bensalah",
        role: "Interne des Hôpitaux, CHU Mustapha Pacha",
        content: `
          <h3>Introduction</h3>
          <p>Le diagnostic différentiel des syndromes coronariens aigus (SCA) est l'une des compétences cliniques les plus cruciales lors des gardes de médecine générale ou cardiologique. Cet article propose une synthèse pratique des points d'évaluation électrocardiographiques (ECG) et des décisions thérapeutiques immédiates.</p>

          <h3>1. Physiopathologie et Mécanismes sous-jacents</h3>
          <p>La distinction biologique fondamentale entre le SCA ST+ (STEMI) et le SCA ST- (NSTEMI) réside dans le degré d'occlusion coronaire. 
          Le SCA ST+ est la conséquence directe d'une occlusion totale et brutale d'un tronc coronaire majeur, induisant une ischémie transmurale complète. Le SCA ST- traduit généralement une occlusion partielle ou subocclusive, avec persistance d'un flux résiduel (phénomène de collatéralité ou spasme résolu).</p>

          <h3>2. Repères Électrocardiographiques (ECG)</h3>
          <p>Devant une douleur thoracique suspecte, un ECG à 12 dérivations doit être réalisé et interprété dans les 10 minutes suivant le premier contact médical.</p>
          <ul>
            <li><strong>SCA ST+ :</strong> Sus-décalage du segment ST ≥ 1 mm dans au moins deux dérivations contiguës (ou ≥ 2 mm en V2-V3 chez l'homme, ≥ 1.5 mm chez la femme), avec image en miroir dans les dérivations opposées.</li>
            <li><strong>SCA ST- :</strong> Sous-décalage horizontal ou descendant du segment ST ≥ 0.5 mm, ou inversion profonde des ondes T (> 1 mm) dans au moins deux dérivations contiguës.</li>
          </ul>

          <blockquote>
            <strong>Règle d'or de la garde :</strong> Tout bloc de branche gauche (BBG) de survenue récente ou présumée récente associé à une symptomatologie ischémique doit être considéré et traité comme un SCA ST+.
          </blockquote>

          <h3>3. Conduite à tenir immédiate</h3>
          <p>La rapidité de prise en charge est le facteur pronostique majeur dans le SCA ST+ ("Time is muscle").</p>
          <ol>
            <li><strong>Double anti-agrégation plaquettaire :</strong> Aspirine de charge (150-300 mg per os ou IV) couplée à un inhibiteur de P2Y12 (Ticagrelor 180 mg ou Prasugrel 60 mg).</li>
            <li><strong>Anticoagulation efficace :</strong> Héparine non fractionnée (HNF) en bolus ou Enoxaparine.</li>
            <li><strong>Reperfusion coronaire :</strong> Si le délai de transport vers un centre de coronarographie est &lt; 120 minutes, l'angioplastie primaire est recommandée. Dans le cas contraire, une thrombolyse IV immédiate doit être discutée en l'absence de contre-indications.</li>
          </ol>
        `
      },
      "preparer-concours-residanat-sans-burnout": {
        title: "Comment préparer le concours de Résidanat sans faire de burnout",
        category: "Conseils d'Études",
        readTime: "12 min",
        date: "05 Juin 2026",
        author: "Meriem Bensalah",
        role: "Résidente en Pédiatrie, Alger",
        content: `
          <h3>Le Défi du Concours</h3>
          <p>Le concours de résidanat en Algérie est un marathon intellectuel intense qui demande non seulement des connaissances scientifiques approfondies mais surtout une discipline émotionnelle et une gestion du temps rigoureuse.</p>

          <h3>1. La Méthode des Blocs de Révisions</h3>
          <p>Le bachotage de dernière minute est inefficace pour mémoriser les dizaines de modules cliniques. La technique la plus efficace est l'espacement chronologique. Consacrez 4 heures par jour à la lecture active des cours officiels et 2 heures à la résolution des QCMs des années précédentes.</p>

          <h3>2. Cibler la Précision Active</h3>
          <p>Répéter la lecture passive des fiches de synthèse donne une fausse sensation de maîtrise (illusion de compétence). Forcez votre cerveau à extraire l'information en résolvant des QCMs sous contrainte (mode Blitz sur Agora) ou en expliquant le mécanisme de la pathologie à un confrère.</p>
        `
      }
    };

    return database[s] || {
      title: "Article Clinique de l'Agora",
      category: "Actualités Médicales",
      readTime: "5 min",
      date: "01 Janvier 2026",
      author: "Équipe Agora",
      role: "Comité de rédaction",
      content: "<p>Le contenu complet de cet article est en cours de révision et sera disponible très prochainement. Merci de votre patience.</p>"
    };
  };

  const post = getPostBySlug(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SidebarLayout>
      <div className="pb-24 select-none">
        
        {/* Navigation Actions Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-brand pb-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour au blog
          </Link>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 border border-border-brand rounded-sm text-text-light hover:text-text-dark bg-white-brand cursor-pointer"
              title="Copier le lien"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-sm border transition-colors cursor-pointer ${
                bookmarked
                  ? "bg-teal/10 border-teal text-teal"
                  : "border-border-brand text-text-light hover:text-text-dark bg-white-brand"
              }`}
              title={bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-teal" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content Pane - Max width 720px */}
        <div className="max-w-[720px] mx-auto space-y-8 text-text-dark">
          
          {/* Category & Metadata */}
          <div className="flex items-center gap-3 text-xs font-mono text-text-light font-semibold">
            <span className="bg-surface-brand text-green-dark px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-dark leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author info card */}
          <div className="flex items-center gap-3 p-4 bg-beige-light border border-border-brand/40 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-green-dark/5 flex items-center justify-center font-bold text-green-mid font-serif border border-green-light/20 shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-green-dark block">Par {post.author}</span>
              <span className="text-[10px] text-text-light font-mono block">{post.role}</span>
            </div>
          </div>

          {/* Article HTML Content */}
          <article
            className="font-sans text-[17px] leading-[1.8] space-y-6 text-justify blog-article-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {copied && (
            <div className="fixed bottom-6 right-6 bg-green-dark text-white px-4 py-2 text-xs rounded-sm shadow-lg font-mono">
              Lien copié dans le presse-papiers !
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
