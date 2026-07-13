"use client";

import React, { useState } from "react";
import { Flashcard } from "@/types/flashcard";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import { Edit2, Trash2, Check, X, FileText, CheckSquare, HelpCircle } from "lucide-react";

interface FlashcardBrowserRowProps {
  card: Flashcard;
}

export default function FlashcardBrowserRow({ card }: FlashcardBrowserRowProps) {
  const { deleteCard, updateCard } = useFlashcardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [frontText, setFrontText] = useState(card.front);
  const [backText, setBackText] = useState(card.back);

  const handleSave = () => {
    updateCard(card.id, { front: frontText, back: backText });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFrontText(card.front);
    setBackText(card.back);
    setIsEditing(false);
  };

  const getCardIcon = () => {
    switch (card.type) {
      case "definition":
        return <FileText className="h-4 w-4 text-teal" />;
      case "true_false":
        return <CheckSquare className="h-4 w-4 text-[#FF6B35]" />;
      default:
        return <HelpCircle className="h-4 w-4 text-[#E8A838]" />;
    }
  };

  const getTypeLabel = () => {
    switch (card.type) {
      case "definition":
        return "Définition";
      case "true_false":
        return "Vrai/Faux";
      case "fill_blank":
        return "Texte à trou";
      default:
        return card.type;
    }
  };

  return (
    <div className="border-b border-[#0A3D3D]/5 py-4 px-2 hover:bg-[#F5FAFA]/60 transition-colors duration-150 group">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
              Recto (Question / Notion)
            </label>
            <textarea
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              className="w-full px-3 py-2 border border-[#0A3D3D]/10 rounded-lg text-xs font-medium text-text-dark bg-white outline-none focus:border-teal/30"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
              Verso (Réponse / Explication)
            </label>
            <textarea
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              className="w-full px-3 py-2 border border-[#0A3D3D]/10 rounded-lg text-xs font-medium text-text-dark bg-white outline-none focus:border-teal/30"
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#0A3D3D]/10 bg-white text-[11px] font-bold text-text-mid hover:bg-surface/50 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal text-white-custom text-[11px] font-bold hover:bg-teal-dark cursor-pointer"
            >
              <Check className="h-3 w-3" />
              Enregistrer
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Front Question */}
            <p className="text-xs font-semibold text-text-dark leading-relaxed break-words">
              Q: {card.front}
            </p>
            {/* Back Answer */}
            <p className="text-xs text-text-light leading-relaxed break-words bg-[#F5FAFA] p-2 rounded-lg border border-[#0A3D3D]/5">
              R: {card.back}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center pt-1.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#E0F2F2] text-teal-dark border border-teal/10">
                {getCardIcon()}
                {getTypeLabel()}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#F5FAFA] text-text-light border border-[#0A3D3D]/8">
                {card.source === "ai_generated" ? "✨ Générée par l'IA" : "👤 Créée manuellement"}
              </span>
              {card.difficulty && (
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-orange-50 text-orange-600 border border-orange-100 uppercase">
                  {card.difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons on Hover */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg border border-[#0A3D3D]/10 bg-white hover:bg-[#F5FAFA] text-text-mid hover:text-teal transition-all cursor-pointer"
              title="Modifier la carte"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                if (confirm("Voulez-vous vraiment supprimer cette carte ?")) {
                  deleteCard(card.id);
                }
              }}
              className="p-1.5 rounded-lg border border-[#0A3D3D]/10 bg-white hover:bg-red-50 text-text-mid hover:text-error transition-all cursor-pointer"
              title="Supprimer la carte"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
