"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { useAgoraStore } from "@/store/useAgoraStore";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Heart, AlertCircle, ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import Link from "next/link";

interface BlitzQuestion {
  text: string;
  options: string[];
  correctIndex: number;
}

const mockBlitzQuestions: BlitzQuestion[] = [
  {
    text: "Quelle est l'intervention pharmacologique immédiate en cas de syndrome coronarien aigu suspecté ?",
    options: ["Aspirine (160-325 mg à mâcher)", "Bêtabloquant par voie orale", "Héparine sous-cutanée", "Furosémide intraveineux"],
    correctIndex: 0,
  },
  {
    text: "Quel signe ECG est pathognomonique d'un bloc de branche gauche (BBG) ?",
    options: ["Onde R dominante en V1", "Ondes R larges et échancrées dans les dérivations latérales (V5, V6)", "Sus-décalage du ST en II, III, aVF", "Onde delta précédant le QRS"],
    correctIndex: 1,
  },
];

export default function BlitzMedQuestPage() {
  const { updateQuestScore, activeQuestScore } = useAgoraStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Floating score popup triggers
  const [scorePopups, setScorePopups] = useState<{ id: number; text: string }[]>([]);
  const [popupId, setPopupId] = useState(0);

  const activeQuestion = mockBlitzQuestions[currentIdx];

  // Timer loop
  useEffect(() => {
    if (isGameOver) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isGameOver]);

  const handleTimeOut = () => {
    // Automatically proceed or game over if last question
    if (currentIdx < mockBlitzQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(15);
      setSelectedOption(null);
    } else {
      setIsGameOver(true);
    }
  };

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const isCorrect = idx === activeQuestion.correctIndex;
    if (isCorrect) {
      updateQuestScore(100);
      
      // Trigger floating score popup
      const newId = popupId + 1;
      setPopupId(newId);
      setScorePopups((prev) => [...prev, { id: newId, text: "+100 XP" }]);
      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== newId));
      }, 1000);
    }

    // Short delay before next question
    setTimeout(() => {
      if (currentIdx < mockBlitzQuestions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setTimeLeft(15);
        setSelectedOption(null);
      } else {
        setIsGameOver(true);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setSelectedOption(null);
    useAgoraStore.setState({ activeQuestScore: 0 });
  };

  // Heartbeat pulse frequency increases as time runs out
  const getPulseDuration = () => {
    if (timeLeft > 10) return 1.5;
    if (timeLeft > 5) return 0.8;
    return 0.4;
  };

  return (
    <>

      <main className="relative z-10 flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full flex flex-col justify-center min-h-[80vh]">
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent pointer-events-none" />

        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/medquest"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-light hover:text-teal"
          >
            <ArrowLeft className="h-4 w-4" /> Quitter l'arène
          </Link>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
            <Zap className="h-4 w-4 fill-accent" />
            Arène Blitz active
          </span>
        </div>

        {!isGameOver ? (
          <div className="p-8 rounded-2xl border border-accent bg-white-custom shadow-xl relative overflow-hidden space-y-8">
            {/* Background pulsating pulse line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-accent/10 overflow-hidden">
              <motion.div
                animate={{ scaleX: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: getPulseDuration() }}
                className="h-full bg-accent"
              />
            </div>

            {/* Top row: Timer & Heartbeat indicator */}
            <div className="flex items-center justify-between">
              {/* Circular countdown ring */}
              <div className="relative h-16 w-16 flex items-center justify-center">
                <svg className="absolute transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="rgba(10, 61, 61, 0.08)"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="var(--accent)"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={163}
                    animate={{ strokeDashoffset: (1 - timeLeft / 15) * 163 }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <span className="text-sm font-bold font-mono text-text-dark">
                  {timeLeft}s
                </span>
              </div>

              {/* Heartbeat pulse icon animation */}
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: getPulseDuration() }}
                className="flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent"
              >
                <Heart className="h-6 w-6 fill-accent" />
              </motion.div>

              {/* Active Arena XP Score */}
              <div className="text-right relative">
                <span className="text-[9px] uppercase font-mono tracking-wider text-text-light font-bold">
                  Score
                </span>
                <p className="text-2xl font-bold font-mono text-accent">
                  {activeQuestScore} XP
                </p>

                {/* Flying score popups */}
                <AnimatePresence>
                  {scorePopups.map((popup) => (
                    <motion.span
                      key={popup.id}
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -40, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-4 right-0 text-sm font-bold font-mono text-success z-20"
                    >
                      {popup.text}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4 pt-4 border-t border-teal/10">
              <span className="px-2.5 py-0.5 rounded bg-surface/50 text-teal-dark text-[9px] uppercase font-mono tracking-wider font-semibold">
                Question {currentIdx + 1} sur {mockBlitzQuestions.length}
                Question {currentIdx + 1} sur {mockBlitzQuestions.length}
              </span>
              <h2 className="font-display text-lg font-bold text-text-dark">
                {activeQuestion.text}
              </h2>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 gap-3">
              {activeQuestion.options.map((opt, oIdx) => {
                const selected = selectedOption === oIdx;
                const correct = activeQuestion.correctIndex === oIdx;

                let btnStyle = "border-teal/12 bg-white-custom hover:bg-surface/10 text-text-dark";
                if (selected) {
                  btnStyle = "border-accent bg-accent/5 text-accent font-semibold";
                }
                if (selectedOption !== null) {
                  if (correct) {
                    btnStyle = "border-success bg-success/5 text-success font-semibold";
                  } else if (selected) {
                    btnStyle = "border-error bg-error/5 text-error font-semibold";
                  } else {
                    btnStyle = "border-teal/5 opacity-55 text-text-light";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(oIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Game Over / Summary Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border border-teal/10 bg-white-custom shadow-xl text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Trophy className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-text-dark">
                Manche terminée
              </h2>
              <p className="text-xs text-text-light">
                Votre score de précision diagnostique a été enregistré dans le profil.
              </p>
            </div>

            <div className="py-6 border-y border-teal/10 max-w-sm mx-auto flex justify-around">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-text-light">
                  XP gagnés
                </p>
                <p className="text-3xl font-extrabold font-mono text-accent">
                  {activeQuestScore}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-text-light">
                  Précision
                </p>
                <p className="text-3xl font-extrabold font-mono text-teal-dark">
                  {activeQuestScore > 0 ? "100%" : "0%"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent/90 text-white-custom text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Recommencer l'arène
              </button>
              <Link
                href="/medquest"
                className="px-6 py-2.5 rounded-full border border-teal/15 bg-white-custom/50 text-teal hover:bg-white-custom text-xs font-semibold transition-all"
              >
                Retour aux salons
              </Link>
            </div>
          </motion.div>
        )}
      </main>

       
    </>
  );
}
