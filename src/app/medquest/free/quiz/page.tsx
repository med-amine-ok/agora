"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import { useUserStore } from "@/presentation/store/useUserStore";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RefreshCw, BarChart2, BookOpen, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FreeModeQuiz() {
  const router = useRouter();
  const { user, incrementStreak } = useUserStore();
  const {
    questions,
    currentIndex,
    selectedAnswer,
    answers,
    score,
    sessionComplete,
    sessionStarted,
    selectAnswer,
    nextQuestion,
    completeSession,
    resetSession
  } = useQuizStore();

  const handleRestart = () => {
    resetSession();
    router.push("/medquest/free");
  };

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    selectAnswer(idx);

    // If correct, increment study streak
    const currentQ = questions[currentIndex];
    if (idx === currentQ.correctIndex) {
      incrementStreak();
    }
  };

  // Guard if session wasn't initialized
  if (!sessionStarted || questions.length === 0) {
    return (
      <SidebarLayout>
        <div className="max-w-[680px] mx-auto text-center space-y-4 py-16">
          <AlertIcon className="w-12 h-12 text-gold-brand mx-auto animate-pulse" />
          <h2 className="font-serif text-2xl font-bold text-green-dark">Aucune session active</h2>
          <p className="text-text-mid text-sm">Veuillez configurer votre séance avant d'accéder au quiz.</p>
          <Link href="/medquest/free">
            <Button size="sm">Retourner à la configuration</Button>
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  // End screen
  if (sessionComplete) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <SidebarLayout>
        <div className="max-w-[680px] mx-auto space-y-8 pb-16 text-center select-none">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark">Séance Terminée</h1>
            <p className="text-text-mid text-sm">Excellent travail ! Vous avez finalisé vos questions.</p>
          </div>

          <Card className="p-8 border-border-brand/40 space-y-8 flex flex-col items-center">
            {/* Score */}
            <div className="space-y-1">
              <span className="text-text-light text-xs uppercase tracking-wider block">Score Final</span>
              <span className="font-mono text-7xl font-extrabold text-green-dark">
                {score} <span className="text-2xl text-text-light">/ {questions.length}</span>
              </span>
            </div>

            {/* Circular progress SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg width="144" height="144" viewBox="0 0 36 36" className="transform -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(28,28,28,0.05)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#2D6A4F"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 * (1 - accuracy / 100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-bold text-green-dark">{accuracy}%</span>
                <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider">Précision</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
              <Button onClick={handleRestart} className="flex items-center justify-center gap-2 py-3.5">
                <RefreshCw className="w-4.5 h-4.5" /> Recommencer
              </Button>
              <Link href="/statistics">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-3.5">
                  <BarChart2 className="w-4.5 h-4.5 text-blue-accent" /> Statistiques
                </Button>
              </Link>
              <Link href="/lessons">
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2 py-3.5">
                  <BookOpen className="w-4.5 h-4.5 text-green-dark" /> Cours
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  // Active quiz screen
  const currentQuestion = questions[currentIndex];
  const answeredOption = answers[currentQuestion.id];
  const isAnswered = answeredOption !== undefined;
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <SidebarLayout>
      <div className="max-w-[680px] mx-auto space-y-6 pb-16 select-none">
        
        {/* Progress Header */}
        <div className="flex items-center justify-between text-xs text-text-light font-semibold font-mono pb-2 border-b border-border-brand/35">
          <button
            onClick={handleRestart}
            className="hover:text-green-mid flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4.5 h-4.5" /> Abandonner
          </button>
          <span>
            Question {currentIndex + 1} sur {questions.length}
          </span>
          <span className="bg-green-dark/10 text-green-dark px-2.5 py-0.5 rounded-full font-sans">
            {currentQuestion.subject}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-green-mid h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <Card className="p-6 border-border-brand/35 bg-beige-light">
          <p className="font-serif text-xl sm:text-2xl font-bold text-green-dark leading-snug">
            {currentQuestion.text}
          </p>
        </Card>

        {/* Option Grid */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            const letter = optionLetters[idx];
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const isSelectedOption = idx === selectedAnswer || idx === answeredOption;

            let btnClass = "border-border-brand text-text-dark bg-white hover:bg-beige-light";
            let stateIcon = null;

            if (isAnswered) {
              if (isCorrectOption) {
                btnClass = "border-green-mid bg-green-mid/10 text-green-dark font-semibold animate-pulse-green";
                stateIcon = <CheckCircle className="w-5 h-5 text-green-mid shrink-0" />;
              } else if (isSelectedOption) {
                btnClass = "border-error-brand bg-red-50 text-error-brand font-semibold animate-shake";
                stateIcon = <XCircle className="w-5 h-5 text-error-brand shrink-0" />;
              } else {
                btnClass = "border-border-brand/40 text-text-light bg-white opacity-60";
              }
            } else if (isSelectedOption) {
              btnClass = "border-green-mid bg-green-mid/10 text-green-dark font-semibold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 border rounded-sm flex items-center justify-between gap-4 text-left text-sm transition-all relative ${btnClass} ${
                  !isAnswered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                    isSelectedOption
                      ? "bg-green-mid text-white border-green-mid"
                      : "bg-gray-100 text-text-mid border-border-brand/40"
                  }`}>
                    {letter}
                  </span>
                  <span>{option}</span>
                </div>
                {stateIcon}
              </button>
            );
          })}
        </div>

        {/* Explanation sheet */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-green-dark/5 border-l-4 border-green-mid text-sm text-text-mid space-y-3">
                <span className="font-bold text-green-dark uppercase tracking-wider text-xs flex items-center gap-1.5 font-sans">
                  <Info className="w-4 h-4 text-green-mid" /> Explication clinique
                </span>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
                <div className="pt-2 border-t border-green-mid/10 flex justify-between text-xs text-text-light font-mono font-semibold">
                  <span>Source : {currentQuestion.source || "Support de cours"}</span>
                  <span className="capitalize">Difficulté : {currentQuestion.difficulty === 'easy' ? "Facile" : currentQuestion.difficulty === 'medium' ? "Moyen" : "Difficile"}</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation bar */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => useQuizStore.setState({ currentIndex: currentIndex - 1, selectedAnswer: answers[questions[currentIndex - 1].id] })}
            className="flex items-center gap-2 py-2.5 px-4"
          >
            <ChevronLeft className="w-4.5 h-4.5" /> Précédent
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              disabled={!isAnswered}
              onClick={nextQuestion}
              className="flex items-center gap-2 py-2.5 px-5"
            >
              Suivant <ChevronRight className="w-4.5 h-4.5" />
            </Button>
          ) : (
            <Button
              disabled={!isAnswered}
              onClick={completeSession}
              className="flex items-center gap-2 py-2.5 px-5 bg-green-dark text-white hover:bg-black"
            >
              Terminer la séance <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
