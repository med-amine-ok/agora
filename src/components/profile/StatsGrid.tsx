"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Award, BookOpen, Inbox, HelpCircle, Trophy, Clock } from "lucide-react";

interface StatsGridProps {
  streak: number;
  xp: number;
  lessonsCompleted: number;
  flashcardsMastered: number;
  quizzesCompleted: number;
  achievementsCount: number;
  studyHours: number;
}

export default function StatsGrid({
  streak,
  xp,
  lessonsCompleted,
  flashcardsMastered,
  quizzesCompleted,
  achievementsCount,
  studyHours,
}: StatsGridProps) {
  const cards = [
    {
      title: "Série d'Études",
      value: `${streak} jours`,
      desc: "Jours consécutifs d'apprentissage",
      icon: <Flame className="h-6 w-6 text-accent" />,
      bg: "hover:shadow-accent/10"
    },
    {
      title: "Expérience (XP)",
      value: `${xp.toLocaleString()} XP`,
      desc: "Points cumulés d'activité",
      icon: <Award className="h-6 w-6 text-teal" />,
      bg: "hover:shadow-teal/10"
    },
    {
      title: "Cours Complétés",
      value: `${lessonsCompleted} leçons`,
      desc: "Modules cliniques assimilés",
      icon: <BookOpen className="h-6 w-6 text-teal-light" />,
      bg: "hover:shadow-teal-light/10"
    },
    {
      title: "Flashcards Maîtrisées",
      value: `${flashcardsMastered} cartes`,
      desc: "Termes mémorisés (SRS)",
      icon: <Inbox className="h-6 w-6 text-teal" />,
      bg: "hover:shadow-teal/10"
    },
    {
      title: "Quiz Résolus",
      value: `${quizzesCompleted} QCM`,
      desc: "Questions d'évaluation validées",
      icon: <HelpCircle className="h-6 w-6 text-accent" />,
      bg: "hover:shadow-accent/10"
    },
    {
      title: "Objectifs & Badges",
      value: `${achievementsCount} trophées`,
      desc: "Médailles de mérite obtenues",
      icon: <Trophy className="h-6 w-6 text-teal-light" />,
      bg: "hover:shadow-teal-light/10"
    },
    {
      title: "Temps d'Étude",
      value: `${studyHours} heures`,
      desc: "Heures cliniques passées",
      icon: <Clock className="h-6 w-6 text-teal-dark" />,
      bg: "hover:shadow-teal-dark/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`p-5 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm transition-all flex flex-col justify-between ${card.bg}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-text-light">{card.title}</span>
            <div className="p-2 rounded-xl bg-surface/50">{card.icon}</div>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold font-display text-text-dark">{card.value}</h4>
            <p className="text-[10px] text-text-light mt-1 font-medium">{card.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
