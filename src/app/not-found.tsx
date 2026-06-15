"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/presentation/components/ui/Button";

export default function NotFound() {
  // SVG ECG pulse line path
  const ecgPath = "M 0 50 H 30 L 35 30 L 40 70 L 45 10 L 50 90 L 55 40 L 60 60 L 65 50 H 150";

  return (
    <div className="min-h-screen bg-beige-base text-text-dark font-sans flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      
      {/* Aesthetic blur overlays */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-light/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-brand/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg text-center space-y-8 relative z-10">
        
        {/* Heart & Alert Status */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.15, 1, 1.15, 1],
              transition: {
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm"
          >
            <Heart className="w-8 h-8 fill-red-600" />
          </motion.div>
          
          <span className="font-mono text-xs font-bold tracking-widest text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase">
            Page Introuvable
          </span>
        </div>

        {/* Text descriptions */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-green-dark leading-none tracking-tight">
            Asystolie Clinique
          </h1>
          <p className="text-text-mid text-sm max-w-sm mx-auto leading-relaxed">
            Le défibrillateur est chargé à 360 Joules, mais cette URL a flatliné... Les données demandées n'existent pas ou ont été déplacées.
          </p>
        </div>

        {/* ECG Line visual simulation */}
        <div className="w-full h-32 flex items-center justify-center bg-white-brand border border-border-brand/40 rounded-sm relative overflow-hidden p-6 shadow-inner">
          <svg className="w-full h-full" viewBox="0 0 150 100" preserveAspectRatio="none">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(28, 28, 28, 0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Flatline to QRS recovering ECG line */}
            <motion.path
              d={ecgPath}
              fill="none"
              stroke="#C0392B"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, strokeDasharray: "150", strokeDashoffset: "150" }}
              animate={{
                strokeDashoffset: [150, 0],
                transition: {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            />
          </svg>
          
          {/* Recovery sound pulse text */}
          <span className="absolute bottom-2.5 right-3.5 font-mono text-[9px] text-text-light font-black tracking-widest uppercase animate-pulse">
            Bip... Bip... Bip...
          </span>
        </div>

        {/* Home routing action */}
        <div className="pt-4 flex justify-center">
          <Link href="/dashboard">
            <Button className="flex items-center gap-2 px-6 py-3 shadow-md">
              <ArrowLeft className="w-4 h-4" /> Réanimer vers l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
