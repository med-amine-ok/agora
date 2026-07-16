"use client";

import React from "react";
import { FlashcardRating } from "@/types/flashcard";
import { motion, AnimatePresence } from "framer-motion";

interface RatingButtonsProps {
  onRate: (rating: FlashcardRating) => void;
  visible: boolean;
}

export default function RatingButtons({ onRate, visible }: RatingButtonsProps) {
  const options = [
    { 
      rating: "again" as const, 
      dotColor: "bg-rose-500 ring-rose-500/20", 
      label: "Encore", 
      time: "< 1 min", 
      hoverClass: "hover:bg-rose-500/10 hover:border-rose-500/40" 
    },
    { 
      rating: "hard" as const, 
      dotColor: "bg-orange-500 ring-orange-500/20", 
      label: "Difficile", 
      time: "< 10 min", 
      hoverClass: "hover:bg-orange-500/10 hover:border-orange-500/40" 
    },
    { 
      rating: "ok" as const, 
      dotColor: "bg-emerald-500 ring-emerald-500/20", 
      label: "OK", 
      time: "+1j", 
      hoverClass: "hover:bg-emerald-500/10 hover:border-emerald-500/40" 
    },
    { 
      rating: "easy" as const, 
      dotColor: "bg-teal-400 ring-teal-400/20", 
      label: "Facile", 
      time: "+4j", 
      hoverClass: "hover:bg-teal-400/10 hover:border-teal-400/40" 
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-[#0D2E2E]/80 backdrop-blur-lg border border-teal/20 p-5 rounded-3xl w-full md:w-56 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] space-y-4 shrink-0"
        >
          <div className="text-center md:text-left space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-light/50 block">
              ÉVALUATION
            </span>
            <p className="text-[10px] text-teal-light/70 leading-normal">
              Sélectionnez votre niveau de maîtrise pour espacer les révisions :
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            {options.map((opt, idx) => (
              <motion.button
                key={opt.rating}
                onClick={() => onRate(opt.rating)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 + idx * 0.08, type: "spring", stiffness: 100, damping: 15 }}
                className={`w-full flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/5 py-3 px-4 text-left shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ${opt.hoverClass}`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${opt.dotColor} ring-4 shrink-0`} />
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-black text-white leading-none">{opt.label}</div>
                  <span className="text-[9px] font-mono text-teal-light/50 font-bold mt-0.5 block">{opt.time}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
