"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import ECGAnimation from "./ECGAnimation";
import ActionButtons from "./ActionButtons";

export default function NotFoundHero() {
  const [phase, setPhase] = useState<number>(1);

  // Logo floating animation settings
  const logoFloating = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 4,
        ease: "easeInOut" as const,
        repeat: Infinity,
      },
    },
  };

  // 404 Opacity pulse every 8 seconds
  const numPulse = {
    animate: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: 3,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatDelay: 5, // Total cycle is 8 seconds (3s animation + 5s delay)
      },
    },
  };

  return (
    <div className="w-full max-w-[900px] flex flex-col items-center text-center px-6 py-8 md:py-16 select-none">

{/* 404 Header */}
      <div className="h-[120px] flex items-center justify-center my-2 md:my-4">
        {phase >= 3 ? (
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate="animate"
            variants={numPulse}
            className="font-display text-7xl md:text-8xl lg:text-9xl font-bold text-teal-dark tracking-tight leading-none"
          >
            404
          </motion.h1>
        ) : (
          <div className="h-[96px] md:h-[128px]" />
        )}
      </div>

      {/* Hero ECG Animation */}
      <ECGAnimation onPhaseChange={setPhase} />

      

      {/* Content text */}
      <div className="min-h-[100px] flex flex-col items-center justify-center">
        {phase >= 5 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-3"
          >
            <h2 className="font-sans text-xl md:text-2xl font-medium text-teal-dark">
              Cette page est introuvable
            </h2>
            <p className="font-sans text-sm md:text-base text-text-light max-w-md mx-auto">
              Le contenu que vous recherchez semble avoir quitté le parcours d'apprentissage.
            </p>
          </motion.div>
        ) : (
          <div className="h-[60px] md:h-[72px]" />
        )}
      </div>

      {/* Action Buttons */}
      <ActionButtons phase={phase} />

    </div>
  );
}
