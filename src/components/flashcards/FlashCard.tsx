"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flashcard, FlashcardRating } from "@/types/flashcard";
import { HelpCircle, Check, X as XIcon, Image as ImageIcon } from "lucide-react";
import RatingButtons from "./RatingButtons";

interface FlashCardProps {
  card: Flashcard;
  onRate: (rating: FlashcardRating) => void;
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
}

export default function FlashCard({
  card,
  onRate,
  isFlipped,
  setIsFlipped,
}: FlashCardProps) {
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setSelectedTrueFalse(null);
    setShake(false);
  }, [card, setIsFlipped]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (isFlipped) {
        if (e.key === "1") onRate("again");
        if (e.key === "2") onRate("hard");
        if (e.key === "3") onRate("ok");
        if (e.key === "4") onRate("easy");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, onRate, setIsFlipped]);

  const handleTrueFalseSelect = (val: boolean) => {
    setSelectedTrueFalse(val);
    const isCorrect = val === card.isAffirmationTrue;
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => {
      setIsFlipped(true);
    }, 600);
  };

  const getBadgeText = () => {
    switch (card.type) {
      case "definition": return "Définition";
      case "image_question": return "Image & Question";
      case "true_false": return "Vrai ou Faux";
      case "fill_blank": return "Texte à compléter";
      case "image_label": return "Schéma annoté";
      default: return "Flashcard";
    }
  };

  // Render front of the card
  const renderFront = () => {
    switch (card.type) {
      case "true_false":
        return (
          <div className="flex flex-col h-full items-center justify-between p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
              <HelpCircle className="h-3.5 w-3.5" /> Vrai ou Faux ?
            </span>
            <p className="font-display text-xl text-center font-bold text-text-dark my-auto leading-relaxed">
              "{card.front}"
            </p>
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleTrueFalseSelect(true)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  selectedTrueFalse === true
                    ? card.isAffirmationTrue
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200"
                      : "bg-red-50 border-red-500 text-red-700"
                    : "border-teal/20 bg-emerald-50/10 text-teal hover:bg-emerald-50/20"
                }`}
              >
                <Check className="h-4 w-4" /> VRAI
              </button>
              <button
                onClick={() => handleTrueFalseSelect(false)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  selectedTrueFalse === false
                    ? !card.isAffirmationTrue
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200"
                      : "bg-red-50 border-red-500 text-red-700"
                    : "border-error/20 bg-red-50/10 text-error hover:bg-red-50/20"
                }`}
              >
                <XIcon className="h-4 w-4" /> FAUX
              </button>
            </div>
          </div>
        );

      case "image_question":
      case "image_label":
        return (
          <div className="flex flex-col h-full items-center justify-between p-6">
            {card.imageUrl ? (
              <img 
                src={card.imageUrl} 
                alt="Medical system" 
                className="w-full h-44 object-cover rounded-xl border border-teal/10 shadow-sm"
              />
            ) : (
              <div className="w-full h-44 bg-surface rounded-xl flex items-center justify-center border border-dashed border-teal/20">
                <ImageIcon className="h-10 w-10 text-teal/40" />
              </div>
            )}
            <p className="text-sm font-sans font-medium text-text-dark text-center my-auto px-2">
              {card.front}
            </p>
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-2.5 rounded-xl bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-all shadow-sm"
            >
              Révéler la réponse
            </button>
          </div>
        );

      case "fill_blank":
        return (
          <div className="flex flex-col h-full items-center justify-between p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-teal/5 text-teal border border-teal/10">
              🔤 Complétez la phrase
            </span>
            <p className="font-display text-lg text-center font-bold text-text-dark my-auto leading-relaxed">
              {card.front}
            </p>
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-2.5 rounded-xl bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-all shadow-sm"
            >
              Révéler la réponse
            </button>
          </div>
        );

      default: // definition
        return (
          <div className="flex flex-col h-full items-center justify-between p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-teal/5 text-teal border border-teal/10">
              💡 {getBadgeText()}
            </span>
            <h2 className="font-display text-2xl font-bold text-center text-text-dark my-auto leading-normal">
              {card.front}
            </h2>
            <p className="text-[10px] text-text-light font-medium uppercase tracking-wider">
              Cliquez ou Espace pour retourner
            </p>
          </div>
        );
    }
  };

  // Render back of the card
  const renderBack = () => {
    return (
      <div className="flex flex-col h-full items-center justify-between p-6 overflow-y-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase bg-teal/5 text-teal border border-teal/10">
          ✓ Réponse
        </span>
        
        {/* Back Image (specifically for image_label types) */}
        {card.type === "image_label" && card.imageBackUrl && (
          <img 
            src={card.imageBackUrl} 
            alt="Annotated labels" 
            className="w-full h-32 object-cover rounded-xl border border-teal/10 shadow-sm mb-3"
          />
        )}

        <div className="my-auto space-y-3">
          {card.type === "true_false" && (
            <div className={`text-center py-1.5 px-4 rounded-full text-xs font-bold ${
              card.isAffirmationTrue 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {card.isAffirmationTrue ? "✓ Correct ! C'est VRAI" : "✗ C'était FAUX"}
            </div>
          )}
          <p className="font-sans text-sm text-text-dark text-center leading-relaxed font-medium">
            {card.back}
          </p>
        </div>

        {/* Rating Buttons */}
        <RatingButtons onRate={onRate} />
      </div>
    );
  };

  return (
    <div 
      className="relative w-full max-w-[420px] h-[480px] select-none mx-auto"
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={{ 
          rotateY: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          x: { duration: 0.5 }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative cursor-pointer"
        onClick={() => {
          if (card.type !== "true_false" || isFlipped) {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* Front Face */}
        <div 
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-teal/10 shadow-[0_8px_30px_rgb(31,132,118,0.06)]"
        >
          {renderFront()}
        </div>

        {/* Back Face */}
        <div 
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
          className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-teal/10 shadow-[0_8px_30px_rgb(31,132,118,0.06)]"
        >
          {renderBack()}
        </div>
      </motion.div>
    </div>
  );
}
