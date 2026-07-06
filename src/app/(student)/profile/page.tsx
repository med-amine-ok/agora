"use client";

import React, { useState } from "react";
import { useAgoraStore } from "@/store/useAgoraStore";
import { Award, BookOpen, Clock, Flame, GraduationCap, Trophy, User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAgoraStore();
  const [university, setUniversity] = useState("Université d'Alger 1 (Faculté de Médecine)");
  const [year, setYear] = useState("4ème Année - Externe");

  const badges = [
    { title: "Premier Pouls", desc: "A complété sa première leçon clinique", icon: "❤️" },
    { title: "Maître de l'ECG", desc: "Score parfait sur le module de cardiologie", icon: "⚡" },
    { title: "Champion du Blitz", desc: "Top 3 dans une arène Blitz hebdomadaire", icon: "🏆" },
    { title: "Clinicien Précis", desc: "A atteint 90% de précision sur 50 questions", icon: "🎯" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header section with profile overview */}
      <div className="p-6 rounded-2xl border border-teal/10 bg-white-custom/80 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="h-20 w-20 rounded-full bg-teal text-white-custom flex items-center justify-center font-bold text-3xl shadow-md border-2 border-teal-light/20">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-dark">{user?.name}</h1>
            <p className="text-xs text-text-light flex items-center gap-1.5 justify-center md:justify-start mt-1">
              <GraduationCap className="h-4 w-4 text-teal" /> {university}
            </p>
            <p className="text-[11px] font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full inline-block mt-2">
              {year}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button className="px-4 py-2 border border-teal/20 hover:border-teal rounded-lg text-xs font-semibold text-teal-dark hover:bg-surface/35 transition-all">
          Modifier Profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Stats */}
        <div className="md:col-span-1 p-6 rounded-2xl border border-teal/10 bg-white-custom/80 backdrop-blur-md shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-text-dark border-b border-teal/5 pb-2">Statistiques Globales</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-light flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-accent" /> Série Active
              </span>
              <span className="text-xs font-bold text-text-dark">{user?.streak || 0} jours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-light flex items-center gap-1.5">
                <Award className="h-4 w-4 text-teal" /> XP Cumulés
              </span>
              <span className="text-xs font-bold text-text-dark">{user?.points || 0} XP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-light flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-teal" /> Leçons validées
              </span>
              <span className="text-xs font-bold text-text-dark">8 cours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Achievements */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-teal/10 bg-white-custom/80 backdrop-blur-md shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-text-dark border-b border-teal/5 pb-2">Badges de Mérite</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge, idx) => (
              <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-surface/35 border border-teal/5 hover:border-teal/20 transition-all">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-text-dark">{badge.title}</h4>
                  <p className="text-[10px] text-text-light leading-normal mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
