"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import { container } from "@/infrastructure/di/container";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import TimerRing from "@/presentation/components/quiz/TimerRing";
import { X, Flame, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function BlitzQuiz() {
  const router = useRouter();
  const { user } = useUserStore();
  const {
    questions,
    currentIndex,
    selectedAnswer,
    answers,
    score,
    streak,
    timeRemaining,
    sessionComplete,
    sessionStarted,
    selectAnswer,
    nextQuestion,
    tickTimer,
    completeSession,
    resetSession
  } = useQuizStore();

  const [flash, setFlash] = useState<'green' | 'red' | null>(null);

  // Setup interval ticker when game is active
  useEffect(() => {
    if (!sessionStarted || sessionComplete) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, sessionComplete, tickTimer]);

  const handleOptionClick = (idx: number) => {
    if (selectedAnswer !== null || sessionComplete) return;

    const currentQ = questions[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;

    selectAnswer(idx);

    // Trigger visual screen edge flash
    setFlash(isCorrect ? 'green' : 'red');
    setTimeout(() => setFlash(null), 250);

    // If correct, play a brief spark confetti sometimes
    if (isCorrect && Math.random() > 0.6) {
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReplay = async () => {
    const activeSubject = questions[0]?.subject || "Cardiologie";
    resetSession();
    const newQuestions = await container.questionRepository.getQuestionsForSubject(activeSubject, 30);
    useQuizStore.getState().startSession(newQuestions, 'blitz');
  };

  const handleQuit = () => {
    resetSession();
    router.push("/medquest");
  };

  // Guard if session wasn't initialized
  if (!sessionStarted || questions.length === 0) {
    return (
      <div className="min-h-screen bg-beige-base text-text-dark font-sans flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <span className="text-4xl animate-bounce">⚡</span>
          <h2 className="font-serif text-2xl font-bold text-green-dark">Aucune partie active</h2>
          <p className="text-text-mid text-sm">Veuillez configurer votre Blitz avant de commencer.</p>
          <Link href="/medquest/blitz" className="inline-block mt-2">
            <Button size="sm">Retourner à la configuration</Button>
          </Link>
        </div>
      </div>
    );
  }

  // End screen / results
  if (sessionComplete) {
    const accuracy = questions.length > 0 ? Math.round((score / Math.min(currentIndex + 1, questions.length)) * 100) : 0;
    
    // Check if score is suspect
    const quizSession = {
      id: "blitz-session",
      mode: 'blitz' as const,
      questions,
      currentIndex,
      answers,
      score,
      streak,
      timeRemaining,
      isCompleted: true,
      startedAt: new Date().toISOString()
    };
    const audit = container.validateBlitzScore.execute(quizSession);

    return (
      <div className="min-h-screen bg-green-dark text-white font-sans flex items-center justify-center p-6 z-50 select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg bg-green-dark border border-white/10 rounded-lg p-8 space-y-8 text-center shadow-2xl relative"
        >
          <div className="space-y-2">
            <span className="text-5xl">⏰</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Défi Terminé !
            </h2>
            <p className="text-green-light text-sm">Le chronomètre est tombé à zéro.</p>
          </div>

          {audit.reason && (
            <div className="bg-amber-500/20 border border-amber-500/30 p-3.5 rounded-sm text-xs text-amber-300 text-left">
              ⚠️ <strong>Audit Anti-Triche :</strong> {audit.reason}
            </div>
          )}

          {/* Stats recap row */}
          <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
            <div className="space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">Score</span>
              <span className="text-3xl font-bold font-mono text-green-light">{score} pts</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">Précision</span>
              <span className="text-3xl font-bold font-mono text-green-light">{accuracy}%</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-mono">Meilleur Streak</span>
              <span className="text-3xl font-bold font-mono text-gold-brand">🔥 {streak}</span>
            </div>
          </div>

          {/* Leaderboard comparison */}
          <div className="bg-white/5 p-4 rounded-md border border-white/5 text-left space-y-3">
            <h4 className="text-xs font-bold text-green-light uppercase tracking-wider font-mono">Classement Blitz Amis</h4>
            <div className="space-y-2 divide-y divide-white/5 text-sm">
              <div className="flex justify-between items-center pt-1.5 text-white/40">
                <span className="font-mono">🥇 #1 Meriem Bensalah</span>
                <span className="font-mono font-bold">23 pts</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 text-green-light font-bold">
                <span className="font-mono">🥈 #2 Vous ({user?.name.split(" ")[0]})</span>
                <span className="font-mono">{score} pts</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 text-white/40">
                <span className="font-mono">🥉 #3 Youcef Khelifi</span>
                <span className="font-mono">18 pts</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="accent" onClick={handleReplay} className="py-3.5 flex items-center justify-center gap-2">
              <RotateCcw className="w-4.5 h-4.5" /> Rejouer
            </Button>
            <Button variant="outline" onClick={handleQuit} className="py-3.5 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/5">
              Quitter
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-beige-base text-text-dark font-sans flex flex-col justify-between transition-all duration-300 relative select-none">
      
      {/* Screen edge flash overlays */}
      {flash === 'green' && (
        <div className="absolute inset-0 border-[12px] border-green-mid/45 pointer-events-none z-50 animate-pulse" />
      )}
      {flash === 'red' && (
        <div className="absolute inset-0 border-[12px] border-error-brand/45 pointer-events-none z-50 animate-pulse" />
      )}

      {/* Header */}
      <header className="p-6 border-b border-border-brand/40 flex items-center justify-between z-10 bg-beige-light shadow-sm">
        <button
          onClick={handleQuit}
          className="text-text-light hover:text-text-dark transition-colors flex items-center gap-1 cursor-pointer font-bold text-sm"
        >
          <X className="w-5 h-5" /> Quitter
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-gold-brand/10 border border-gold-brand/20 px-3 py-1 rounded-full text-gold-brand text-xs font-mono font-bold animate-bounce-streak">
            <Flame className="w-4 h-4 fill-gold-brand" /> Série : {streak}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-light block uppercase font-mono tracking-wider">Score</span>
            <span className="text-xl font-mono font-bold text-green-dark">{score} pts</span>
          </div>
        </div>
      </header>

      {/* Main Fullscreen Gameplay Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-[800px] mx-auto w-full space-y-8 z-10">
        
        {/* SVG TimerRing */}
        <div className="relative">
          <TimerRing seconds={timeRemaining} maxSeconds={30} />
        </div>

        {/* Question Panel */}
        {currentQuestion && (
          <div className="w-full text-center space-y-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-green-dark leading-snug">
              {currentQuestion.text}
            </h2>

            {/* Options grid (2x2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = idx === currentQuestion.correctIndex;
                const isSelected = idx === selectedAnswer;

                let btnClass = "border-border-brand text-text-dark bg-white hover:border-green-mid hover:bg-green-mid/5";
                
                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnClass = "border-green-mid bg-green-mid text-white font-semibold";
                  } else if (isSelected) {
                    btnClass = "border-error-brand bg-error-brand text-white font-semibold animate-shake";
                  } else {
                    btnClass = "border-border-brand/40 text-text-light bg-white opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-5 border rounded-sm text-sm font-semibold transition-all flex items-center justify-center text-center leading-normal relative ${btnClass} ${
                      selectedAnswer === null ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span className="mr-2 font-mono font-black">{optionLetters[idx]}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-text-light font-semibold font-mono border-t border-border-brand/35 bg-beige-light z-10">
        Question {currentIndex + 1} du Défi Blitz • Répondez rapidement !
      </footer>
    </div>
  );
}
