"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar, Heart, Award, Sparkles } from "lucide-react";
import { User } from "@/store/useAgoraStore";

interface ProfileHeroProps {
  user: User | null;
  university: string;
  year: string;
  bio: string;
  specialty: string;
  onEditClick: () => void;
}

export default function ProfileHero({
  user,
  university,
  year,
  bio,
  specialty,
  onEditClick,
}: ProfileHeroProps) {
  const [xpPercent, setXpPercent] = useState(0);
  
  // Level system: user points / 1000 = level. Remainder is xp progress.
  const points = user?.points || 840;
  const level = Math.floor(points / 1000) + 1;
  const currentLevelXp = points % 1000;
  const nextLevelXp = 1000;
  const levelTitle = level >= 10 ? "Chef de Clinique" : level >= 5 ? "Interne Vétéran" : "Clinical Explorer";
  
  useEffect(() => {
    // Animate the progression ring to current level % on load
    const timer = setTimeout(() => {
      setXpPercent((currentLevelXp / nextLevelXp) * 100);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentLevelXp, nextLevelXp]);

  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (xpPercent / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-teal/15 bg-teal-dark text-white-custom shadow-xl">
      {/* ECG and grid inspired background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(93,200,198,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(93,200,198,0.15)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <svg className="absolute inset-0 w-full h-full hidden sm:block" viewBox="0 0 800 200" preserveAspectRatio="none">
          <path
            d="M0,100 L250,100 L260,90 L270,110 L280,30 L290,160 L300,110 L310,95 L320,100 L800,100"
            fill="none"
            stroke="var(--teal-light)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-8">
        {/* Avatar with Circular XP Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="h-28 w-28 sm:h-32 sm:w-32 -rotate-90">
            {/* Background ring */}
            <circle
              className="text-white/10"
              strokeWidth={stroke}
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius - 4}
              cx={radius + stroke}
              cy={radius + stroke}
            />
            {/* Animated XP progress ring */}
            <motion.circle
              className="text-teal-light"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius - 4}
              cx={radius + stroke}
              cy={radius + stroke}
            />
          </svg>
          
          {/* Avatar core content */}
          <div className="absolute h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] rounded-full bg-teal text-white-custom flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg border-2 border-white/20">
            {user?.name?.charAt(0) || "U"}
          </div>
          
          {/* XP Percentage tag */}
          <div className="absolute -bottom-1 bg-accent text-white-custom text-[10px] font-bold px-2 py-0.5 rounded-full shadow font-mono">
            {Math.round((currentLevelXp / nextLevelXp) * 100)}%
          </div>
        </div>

        {/* Identity & Passport details */}
        <div className="flex-1 text-center md:text-left space-y-4 w-full min-w-0">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white-custom truncate">
                {user?.name}
              </h1>
              <span className="inline-flex items-center gap-1 bg-teal-light/20 text-teal-light px-2.5 py-0.5 rounded-full text-xs font-semibold self-center shrink-0">
                <Award className="h-3 w-3" />
                Étudiant en Médecine
              </span>
            </div>
            <div className="text-xs sm:text-sm text-white/70 flex items-start justify-center md:justify-start gap-1.5">
              <GraduationCap className="h-4 w-4 text-teal-light shrink-0 mt-0.5" />
              <span className="text-left break-words">{university}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-white/50">
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold text-white/80">
                {year}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Algérie
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Membre depuis 2026
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row md:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center md:justify-start gap-3 w-full sm:w-auto">
              <div className="text-left bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Specialty Focus</p>
                <p className="text-xs sm:text-sm font-bold text-white-custom flex items-center gap-1 mt-0.5">
                  <Heart className="h-3 w-3 text-accent shrink-0" /> <span className="truncate">{specialty}</span>
                </p>
              </div>

              <div className="text-left bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">Niveau Médical</p>
                <p className="text-xs sm:text-sm font-bold text-teal-light flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3 shrink-0" /> <span>Lvl {level}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-teal text-white-custom hover:bg-teal-light/20 border border-teal-light/35 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-102 cursor-pointer self-center sm:self-auto"
            >
              Modifier le Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
