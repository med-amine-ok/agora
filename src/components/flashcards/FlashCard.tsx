"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Flashcard, FlashcardRating } from "@/types/flashcard";
import { HelpCircle, Check, X as XIcon, Image as ImageIcon, BookOpen, Sparkles } from "lucide-react";
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

  const getBadge = () => {
    switch (card.type) {
      case "definition": 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal/10 text-teal-light border border-teal/20">
            <BookOpen className="h-3 w-3 text-teal-light" /> Définition
          </span>
        );
      case "true_false": 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <HelpCircle className="h-3 w-3 text-orange-400" /> Vrai ou Faux ?
          </span>
        );
      case "fill_blank": 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            🔤 Texte à compléter
          </span>
        );
      case "image_label": 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ImageIcon className="h-3 w-3 text-rose-400" /> Schéma annoté
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal/10 text-teal-light border border-teal/20">
            <Sparkles className="h-3 w-3 text-teal-light" /> Flashcard
          </span>
        );
    }
  };

  // Process fill-in-the-blank brackets
  const renderFillBlankText = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span 
            key={index} 
            className="inline-block px-3 py-0.5 mx-1 rounded-md bg-teal/10 border border-teal/30 text-teal-light font-black"
          >
            ???
          </span>
        );
      }
      return part;
    });
  };

  // Render front of the card
  const renderFront = () => {
    switch (card.type) {
      case "true_false":
        return (
          <div className="flex flex-col h-full items-center justify-between p-7">
            <div>{getBadge()}</div>
            <p className="font-display text-lg sm:text-xl text-center font-bold text-white my-auto leading-relaxed max-w-sm">
              &ldquo;{card.front}&rdquo;
            </p>
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrueFalseSelect(true);
                }}
                className={`py-3.5 rounded-xl border text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                  selectedTrueFalse === true
                    ? card.isAffirmationTrue
                      ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/20"
                    : "border-teal/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <Check className="h-4 w-4" /> VRAI
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrueFalseSelect(false);
                }}
                className={`py-3.5 rounded-xl border text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                  selectedTrueFalse === false
                    ? !card.isAffirmationTrue
                      ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/20"
                    : "border-teal/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <XIcon className="h-4 w-4" /> FAUX
              </button>
            </div>
          </div>
        );

      case "image_label":
        return (
          <div className="flex flex-col h-full items-center justify-between p-6">
            <div>{getBadge()}</div>
            {card.imageUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg mt-3">
                <img 
                  src={card.imageUrl} 
                  alt="Medical diagram" 
                  className="w-full h-full object-cover"
                />
                {/* Visual pulse overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2626]/80 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-teal/20 mt-3">
                <ImageIcon className="h-10 w-10 text-teal/40" />
              </div>
            )}
            <p className="text-xs sm:text-sm font-bold text-teal-light text-center my-auto px-2 max-w-sm leading-relaxed">
              {card.front}
            </p>
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3 rounded-xl bg-teal text-white text-xs font-bold uppercase tracking-wider hover:bg-teal-dark transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Révéler la réponse
            </button>
          </div>
        );

      case "fill_blank":
        return (
          <div className="flex flex-col h-full items-center justify-between p-7">
            <div>{getBadge()}</div>
            <p className="font-display text-base sm:text-lg text-center font-semibold text-white my-auto leading-relaxed max-w-sm">
              {renderFillBlankText(card.front)}
            </p>
            <button
              onClick={() => setIsFlipped(true)}
              className="w-full py-3 rounded-xl bg-teal text-white text-xs font-bold uppercase tracking-wider hover:bg-teal-dark transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Révéler la réponse
            </button>
          </div>
        );

      case "definition":
      default:
        return (
          <div className="flex flex-col h-full items-center justify-between p-7">
            <div>{getBadge()}</div>
            <div className="my-auto space-y-4 text-center">
              <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-normal max-w-sm">
                &ldquo;{card.front}&rdquo;
              </h2>
            </div>
            <p className="text-[10px] text-teal-light/50 font-bold uppercase tracking-wider animate-pulse">
              Cliquez ou Espace pour retourner
            </p>
          </div>
        );
    }
  };

  // Render back of the card
  const renderBack = () => {
    return (
      <div className="flex flex-col h-full items-center justify-between p-7 overflow-y-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal/10 text-teal-light border border-teal/20">
          ✓ Réponse
        </span>
        
        {/* Back Image (specifically for image_label types) */}
        {card.type === "image_label" && card.imageBackUrl && (
          <div className="w-full h-36 rounded-xl overflow-hidden border border-white/10 shadow-lg my-3">
            <img 
              src={card.imageBackUrl} 
              alt="Annotated labels" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="my-auto space-y-4 w-full">
          {card.type === "true_false" && (
            <div className={`text-center py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider border ${
              card.isAffirmationTrue 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              {card.isAffirmationTrue ? "✓ Correct ! C'est VRAI" : "✗ Faux ! C'était FAUX"}
            </div>
          )}
          <p className="font-sans text-sm sm:text-base text-teal-light text-center leading-relaxed font-bold">
            {card.back}
          </p>
        </div>

        <p className="text-[9px] text-teal-light/35 font-bold uppercase tracking-widest mt-4">
          AGORA MEDQUEST ARENA
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl mx-auto px-4">
      {/* Side Rating Panel (Placed to the left of the card, stacked vertically) */}
      <RatingButtons onRate={onRate} visible={isFlipped} />

      {/* 3D Flippable Card Platform */}
      <div 
        className="relative w-full max-w-[420px] h-[480px] select-none shrink-0"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ 
            rotateY: isFlipped ? 180 : 0, 
            scale: isFlipped ? [1, 0.94, 1.01, 1] : [1, 0.94, 1.01, 1],
            x: shake ? [0, -10, 10, -10, 10, 0] : 0 
          }}
          transition={{ 
            rotateY: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.5, ease: "easeInOut" },
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
            className="absolute inset-0 w-full h-full rounded-3xl bg-[#0D2E2E]/90 border border-teal/20 shadow-[0_15px_40px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            {renderFront()}
          </div>

          {/* Back Face */}
          <div 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-[#0D2E2E]/90 border border-teal/20 shadow-[0_15px_40px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            {renderBack()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
