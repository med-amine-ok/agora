"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flashcard, FlashcardRating } from "@/types/flashcard";
import { HelpCircle, Check, X as XIcon, Image as ImageIcon, BookOpen, Sparkles, ArrowRight } from "lucide-react";
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
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Interactive tilt effect state (Apple hover tilt)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setSelectedTrueFalse(null);
    setShake(false);
    setIsFlipping(false);
  }, [card, setIsFlipped]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleFlipToggle();
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

  const handleFlipToggle = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsFlipping(false), 750);
  };

  const handleTrueFalseSelect = (val: boolean) => {
    if (selectedTrueFalse !== null) return;
    setSelectedTrueFalse(val);
    const isCorrect = val === card.isAffirmationTrue;
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    // Let button fill animation run before flipping
    setTimeout(() => {
      handleFlipToggle();
    }, 900);
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

  // Mouse tilt tracking (Apple Style)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const cardEl = cardRef.current;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt limit
    setRotateX(-y / 20);
    setRotateY(x / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const renderFront = () => {
    switch (card.type) {
      case "true_false":
        return (
          <div className="flex flex-col h-full items-center justify-between p-8 relative z-10">
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
                className={`relative overflow-hidden py-3.5 rounded-xl border text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                  selectedTrueFalse === true
                    ? card.isAffirmationTrue
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "border-teal/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {selectedTrueFalse === true && (
                  <motion.div 
                    layoutId="tf-fill-t"
                    className="absolute inset-0 bg-white/10" 
                    initial={{ scaleX: 0 }} 
                    animate={{ scaleX: 1 }} 
                    transition={{ duration: 0.4 }}
                  />
                )}
                <Check className="h-4 w-4 relative z-10" /> <span className="relative z-10">VRAI</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrueFalseSelect(false);
                }}
                className={`relative overflow-hidden py-3.5 rounded-xl border text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                  selectedTrueFalse === false
                    ? !card.isAffirmationTrue
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "border-teal/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {selectedTrueFalse === false && (
                  <motion.div 
                    layoutId="tf-fill-f"
                    className="absolute inset-0 bg-white/10" 
                    initial={{ scaleX: 0 }} 
                    animate={{ scaleX: 1 }} 
                    transition={{ duration: 0.4 }}
                  />
                )}
                <XIcon className="h-4 w-4 relative z-10" /> <span className="relative z-10">FAUX</span>
              </button>
            </div>
          </div>
        );

      case "image_label":
        return (
          <div className="flex flex-col h-full items-center justify-between p-7 relative z-10">
            <div>{getBadge()}</div>
            {card.imageUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg mt-3"
              >
                <img 
                  src={card.imageUrl} 
                  alt="Medical diagram" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#092626]/80 via-transparent to-transparent" />
              </motion.div>
            ) : (
              <div className="w-full h-48 bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-teal/20 mt-3">
                <ImageIcon className="h-10 w-10 text-teal/40" />
              </div>
            )}
            <p className="text-xs sm:text-sm font-bold text-teal-light text-center my-auto px-2 max-w-sm leading-relaxed">
              {card.front}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFlipToggle();
              }}
              className="w-full py-3 rounded-xl bg-teal text-white text-xs font-bold uppercase tracking-wider hover:bg-teal-dark transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Révéler la réponse
            </button>
          </div>
        );

      case "fill_blank":
        return (
          <div className="flex flex-col h-full items-center justify-between p-8 relative z-10">
            <div>{getBadge()}</div>
            <p className="font-display text-base sm:text-lg text-center font-semibold text-white my-auto leading-relaxed max-w-sm">
              {renderFillBlankText(card.front)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFlipToggle();
              }}
              className="w-full py-3 rounded-xl bg-teal text-white text-xs font-bold uppercase tracking-wider hover:bg-teal-dark transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Révéler la réponse
            </button>
          </div>
        );

      case "definition":
      default:
        return (
          <div className="flex flex-col h-full items-center justify-between p-8 relative z-10">
            <div>{getBadge()}</div>
            <div className="my-auto space-y-4 text-center">
              <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-normal max-w-sm">
                &ldquo;{card.front}&rdquo;
              </h2>
            </div>
            {/* Elegant static footer */}
            <div className="text-[10px] text-teal-light/50 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <span>Appuyez sur Espace</span>
              <span>•</span>
              <span>Tapez pour retourner</span>
            </div>
          </div>
        );
    }
  };

  const renderBack = () => {
    return (
      <div className="flex flex-col h-full items-center justify-between p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-teal/10 text-teal-light border border-teal/20">
            ✓ Réponse
          </span>
        </motion.div>
        
        {card.type === "image_label" && card.imageBackUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="w-full h-36 rounded-xl overflow-hidden border border-white/10 shadow-lg my-3"
          >
            <img 
              src={card.imageBackUrl} 
              alt="Annotated labels" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="my-auto space-y-4 w-full">
          {card.type === "true_false" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className={`text-center py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider border ${
                card.isAffirmationTrue 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {card.isAffirmationTrue ? "✓ Correct ! C'est VRAI" : "✗ Faux ! C'était FAUX"}
            </motion.div>
          )}
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="font-sans text-sm sm:text-base text-teal-light text-center leading-relaxed font-bold"
          >
            {card.back}
          </motion.p>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[9px] text-teal-light/35 font-bold uppercase tracking-widest mt-4"
        >
          AGORA MEDQUEST ARENA
        </motion.p>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl mx-auto px-4 relative">
      
      {/* Background depth layers behind the card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-teal/5 filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 filter blur-[100px]" />
      </div>

      {/* Side Rating Panel (staggered entry after flip) */}
      <RatingButtons onRate={onRate} visible={isFlipped} />

      {/* 3D Flippable Card Platform */}
      <div 
        className="relative w-full max-w-[420px] h-[480px] select-none shrink-0"
        style={{ perspective: 1500 }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ 
            scale: isFlipping ? [1, 1.02, 0.98, 1] : 1,
            z: isFlipping ? 50 : 0,
            x: shake ? [0, -10, 10, -10, 10, 0] : 0,
            rotateX: rotateX,
            rotateY: isFlipped ? 180 - rotateY : rotateY
          }}
          whileHover={{ 
            y: -8,
            boxShadow: "0 30px 60px rgba(10,61,61,0.25)"
          }}
          transition={{ 
            rotateY: { duration: 0.75, ease: [0.65, 0, 0.35, 1] },
            scale: { duration: 0.75, ease: "easeInOut" },
            z: { duration: 0.75 },
            x: { duration: 0.5 },
            rotateX: { type: "spring", stiffness: 300, damping: 20 }
          }}
          style={{ 
            transformStyle: "preserve-3d",
            boxShadow: "0 15px 40px rgba(10,61,61,0.15)"
          }}
          className="w-full h-full relative cursor-grab active:cursor-grabbing rounded-3xl"
          onClick={() => {
            if (card.type !== "true_false" || isFlipped) {
              handleFlipToggle();
            }
          }}
        >
          {/* FRONT FACE */}
          <div 
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-tr from-[#051f1f] via-[#092c2c] to-[#0e3c3c] border border-teal-light/20 backdrop-blur-md overflow-hidden"
          >
            {/* Top-left radial soft light highlight */}
            <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-radial-gradient from-white/10 via-transparent to-transparent pointer-events-none" 
                 style={{ backgroundImage: "radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 60%)" }} />
            
            {/* Medical subtle Grid Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,124,123,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,124,123,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* Glass reflective edge highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {renderFront()}
          </div>

          {/* BACK FACE */}
          <div 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-tr from-[#051f1f] via-[#092c2c] to-[#0e3c3c] border border-teal-light/20 backdrop-blur-md overflow-hidden"
          >
            {/* Top-left radial soft light highlight */}
            <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-radial-gradient from-white/10 via-transparent to-transparent pointer-events-none"
                 style={{ backgroundImage: "radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 60%)" }} />
            
            {/* Medical Grid Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,124,123,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,124,123,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* Glass reflective edge highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {renderBack()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
