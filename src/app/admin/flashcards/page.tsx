"use client";

import React, { useState } from "react";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { Check, X, ShieldAlert, BookOpen, AlertCircle } from "lucide-react";

export default function AdminFlashcardModeration() {
  const { flashcards, moderateCard } = useFlashcardStore();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // Filter pending review cards
  const pendingCards = flashcards.filter(c => c.status === "pending_review");

  const handleApprove = (id: string) => {
    moderateCard(id, "approve");
  };

  const handleReject = (id: string) => {
    const reason = rejectReason[id] || "Ne respecte pas les critères de clarté de la plateforme.";
    moderateCard(id, "reject", reason);
    setActiveRejectId(null);
  };

  const handleReasonChange = (id: string, text: string) => {
    setRejectReason(prev => ({ ...prev, [id]: text }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-xs text-text-dark">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-teal/10 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-display text-text-dark flex items-center gap-2">
            🛡️ Modération des Flashcards
          </h1>
          <p className="text-xs text-text-light">
            Validez les cartes proposées par les étudiants pour les rendre publiques.
          </p>
        </div>
        <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[10px]">
          {pendingCards.length} en attente
        </span>
      </div>

      {pendingCards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal/20 p-12 text-center space-y-3 bg-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal/5 text-teal">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-display text-sm font-bold text-text-dark">File de modération vide</h3>
          <p className="text-[11px] text-text-light max-w-sm mx-auto">
            Aucun utilisateur n'a de propositions de cartes communautaires en attente de révision.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingCards.map(card => (
            <div 
              key={card.id}
              className="p-5 rounded-2xl border border-teal/10 bg-white shadow-sm flex flex-col md:flex-row gap-5 items-start justify-between hover:shadow-md transition-all"
            >
              <div className="flex-1 space-y-3">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-teal/5 px-2 py-0.5 text-[9px] font-bold text-teal border border-teal/10 uppercase">
                    {card.type}
                  </span>
                  <span className="text-[10px] text-text-light font-medium">
                    Proposé par : <strong className="text-text-dark">{card.authorName || "Anonyme"}</strong>
                  </span>
                  <span className="text-[10px] text-text-light">•</span>
                  <span className="text-[10px] text-text-light uppercase font-semibold">
                    {card.moduleId}
                  </span>
                </div>

                {/* Card Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">Recto (Question / Concept)</span>
                    <p className="font-sans font-medium text-xs text-text-dark bg-surface/40 p-3 rounded-lg border border-teal/5">
                      {card.front}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-text-light uppercase tracking-wider block">Verso (Réponse)</span>
                    <p className="font-sans font-medium text-xs text-text-dark bg-surface/40 p-3 rounded-lg border border-teal/5">
                      {card.back}
                    </p>
                  </div>
                </div>

                {/* Conditional Fields (Images, true/false) */}
                {(card.imageUrl || card.isAffirmationTrue !== undefined) && (
                  <div className="flex flex-wrap gap-4 pt-1">
                    {card.isAffirmationTrue !== undefined && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-bold">
                        Affirmation : {card.isAffirmationTrue ? "VRAI" : "FAUX"}
                      </span>
                    )}
                    {card.imageUrl && (
                      <a 
                        href={card.imageUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-teal hover:underline text-[10px] font-semibold"
                      >
                        🖼️ Voir l'image associée
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-teal/5">
                <button
                  onClick={() => handleApprove(card.id)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal px-4 py-2.5 font-bold text-white hover:bg-teal-dark transition-all"
                >
                  <Check className="h-4 w-4" /> Approuver
                </button>

                {activeRejectId === card.id ? (
                  <div className="w-full md:w-48 space-y-2 mt-2">
                    <textarea
                      placeholder="Indiquez le motif..."
                      value={rejectReason[card.id] || ""}
                      onChange={(e) => handleReasonChange(card.id, e.target.value)}
                      className="w-full p-2 border border-error/25 bg-white text-[11px] rounded-lg focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(card.id)}
                        className="flex-1 py-1.5 bg-error text-white font-bold rounded-lg hover:bg-error/95"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setActiveRejectId(null)}
                        className="px-2 py-1.5 border border-teal/15 text-text-light font-bold rounded-lg hover:bg-surface"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveRejectId(card.id)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-error/20 bg-white px-4 py-2.5 font-bold text-error hover:bg-red-50 transition-all"
                  >
                    <X className="h-4 w-4" /> Rejeter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
