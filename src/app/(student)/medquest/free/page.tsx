"use client";

import React, { useState, useMemo, Suspense } from "react";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Sparkles, BookOpen, HelpCircle, RotateCcw, Award, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LESSONS_DATA, getSubjectById, getLessonMatch } from "../../lessons/mockLessonsData";

interface CaseQuestion {
  caseTitle: string;
  caseDetails: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const mockFreeCases: Record<string, CaseQuestion[]> = {
  Cardiologie: [
    {
      caseTitle: "Présentation clinique : douleur thoracique aiguë",
      caseDetails: "Un homme de 58 ans se présente aux urgences avec une oppression rétrosternale irradiant vers le bras gauche. La douleur a débuté il y a 45 minutes lors d'un effort modéré. Il est diaphorétique, avec une pression artérielle de 145/90 mmHg et une fréquence cardiaque de 92 bpm. L'ECG 12 dérivations révèle un sus-décalage du ST de 2,5 mm en V2, V3 et V4.",
      question: "D'après l'ECG, quel territoire artériel est le plus probablement occlus ?",
      options: [
        "Artère circonflexe (Cx)",
        "Artère coronaire droite (ACD)",
        "Artère interventriculaire antérieure (IVA)",
        "Artère interventriculaire postérieure (AIP)"
      ],
      correctIndex: 2,
      explanation: "Le sus-décalage du ST en V2 à V4 correspond à la paroi antérieure du ventricule gauche. Ce territoire est irrigué par l'artère interventriculaire antérieure (IVA). Une reperfusion précoce est essentielle."
    }
  ],
  Neurologie: [
    {
      caseTitle: "Présentation clinique : déficit moteur brutal",
      caseDetails: "Une femme de 72 ans est amenée aux urgences pour l'apparition brutale d'une faiblesse de l'hémicorps droit et d'une aphasie d'expression. Les symptômes ont débuté il y a 2 heures. Sa tension est à 160/95 mmHg, rythme cardiaque régulier à 80 bpm.",
      question: "Quel examen d'imagerie devez-vous réaliser en première intention en urgence ?",
      options: [
        "IRM cérébrale fonctionnelle avec tenseur de diffusion",
        "Scanner cérébral sans injection de produit de contraste",
        "Échographie-doppler des vaisseaux du cou",
        "Angiographie cérébrale conventionnelle"
      ],
      correctIndex: 1,
      explanation: "Le scanner cérébral sans injection est l'examen de choix en urgence pour éliminer rapidement une hémorragie cérébrale avant d'envisager une thrombolyse."
    }
  ],
  Default: [
    {
      caseTitle: "Évaluation clinique générale",
      caseDetails: "Un patient est admis pour surveillance clinique de routine. L'examen des constantes physiologiques révèle des paramètres normaux mais une fatigue rapportée importante lors des efforts intellectuels.",
      question: "Quel mécanisme d'action physiopathologique doit être suspecté en priorité ?",
      options: [
        "Déficit énergétique cellulaire par hypoxie relative",
        "Surmenage métabolique avec accumulation de métabolites",
        "Dysfonctionnement endocrinien transitoire",
        "Dérèglement du cycle veille-sommeil"
      ],
      correctIndex: 1,
      explanation: "L'accumulation de métabolites toxiques liée à l'absence de récupération physiologiquement adéquate explique la fatigue rapportée."
    }
  ]
};

interface UserAnswer {
  caseQuestion: CaseQuestion;
  selectedOption: number;
  isCorrect: boolean;
  questionIndex: number;
}

function FreePracticeGame() {
  const searchParams = useSearchParams();

  // Read config settings
  const level = searchParams.get("level") || "Moyen";
  const subjectId = searchParams.get("subject") || "cardiologie";
  const lessonId = searchParams.get("lesson") || "all";
  const questionCount = parseInt(searchParams.get("count") || "10", 10);
  const questionType = searchParams.get("type") || "QCM";

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedSummaryIndex, setExpandedSummaryIndex] = useState<number | null>(null);

  // Load active subject details
  const subject = useMemo(() => {
    return getSubjectById(subjectId);
  }, [subjectId]);

  // Load lesson if selected
  const lessonName = useMemo(() => {
    if (lessonId === "all") return "Toutes les leçons";
    for (const unit of subject.units) {
      const match = unit.lessons.find((l) => l.id === lessonId);
      if (match) return match.title;
    }
    return "Toutes les leçons";
  }, [subject, lessonId]);

  // Load questions for the selected subject
  const currentCase = useMemo(() => {
    const list = mockFreeCases[subject.name] || mockFreeCases["Default"];
    return list[currentIdx % list.length];
  }, [subject, currentIdx]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleVerify = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentCase.correctIndex;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Save answer
    setAnswers((prev) => [
      ...prev,
      {
        caseQuestion: currentCase,
        selectedOption: selectedOption,
        isCorrect: correct,
        questionIndex: currentIdx + 1,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questionCount) {
      setShowSummary(true);
      return;
    }
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentIdx((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setAnswers([]);
    setShowSummary(false);
    setExpandedSummaryIndex(null);
  };

  const scorePercent = useMemo(() => {
    if (answers.length === 0) return 0;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    return Math.round((correctCount / answers.length) * 100);
  }, [answers]);

  if (showSummary) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const incorrectCount = answers.length - correctCount;

    return (
      <>
        <ECGBackground />
        <main className="relative z-10 flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full space-y-8">
          
          {/* Header Summary */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal/10 text-teal border border-teal/20 mb-2">
              <Award className="h-8 w-8" />
            </div>
            <h1 className="font-display text-3xl font-black text-text-dark">
              Session d'entraînement terminée !
            </h1>
            <p className="text-sm text-text-light max-w-md mx-auto">
              Félicitations pour avoir complété les {questionCount} diagnostics dans le module <span className="text-teal font-semibold">{subject.name}</span>.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-teal/10 p-5 text-center space-y-1 shadow-sm">
              <span className="text-xs font-bold text-text-light uppercase tracking-wider">Score Global</span>
              <p className="font-mono text-3xl font-black text-teal-dark">{scorePercent}%</p>
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mt-2">
                <div className="h-full bg-teal" style={{ width: `${scorePercent}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-teal/10 p-5 text-center space-y-1 shadow-sm">
              <span className="text-xs font-bold text-text-light uppercase tracking-wider">Bonnes réponses</span>
              <p className="font-mono text-3xl font-black text-success">{correctCount} / {answers.length}</p>
              <span className="text-[10px] font-semibold text-text-light">Diagnostics corrects</span>
            </div>

            <div className="bg-white rounded-2xl border border-teal/10 p-5 text-center space-y-1 shadow-sm">
              <span className="text-xs font-bold text-text-light uppercase tracking-wider">Erreurs commises</span>
              <p className="font-mono text-3xl font-black text-error">{incorrectCount} / {answers.length}</p>
              <span className="text-[10px] font-semibold text-text-light">À revoir en priorité</span>
            </div>
          </div>

          {/* Detailed breakdown of answers */}
          <div className="bg-white rounded-2xl border border-teal/10 p-6 shadow-md space-y-4">
            <h2 className="font-display text-lg font-bold text-text-dark pb-3 border-b border-teal/10">
              Rapport détaillé des diagnostics
            </h2>
            
            <div className="space-y-3">
              {answers.map((ans, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-teal/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSummaryIndex(expandedSummaryIndex === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold hover:bg-surface/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-error shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] font-mono uppercase text-text-light">Diagnostic #{ans.questionIndex}</span>
                        <p className="text-text-dark font-bold line-clamp-1">{ans.caseQuestion.caseTitle}</p>
                      </div>
                    </div>
                    {expandedSummaryIndex === idx ? <ChevronUp className="h-4.5 w-4.5 text-text-light" /> : <ChevronDown className="h-4.5 w-4.5 text-text-light" />}
                  </button>

                  <AnimatePresence>
                    {expandedSummaryIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-surface/5 border-t border-teal/5 p-4 space-y-3 text-xs"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-light tracking-wider">Détails du cas :</span>
                          <p className="text-text-dark leading-relaxed mt-1">{ans.caseQuestion.caseDetails}</p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-light tracking-wider">Question :</span>
                          <p className="text-text-dark font-semibold mt-0.5">{ans.caseQuestion.question}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {ans.caseQuestion.options.map((opt, oIdx) => {
                            const isSelected = ans.selectedOption === oIdx;
                            const isCorrectAnswer = ans.caseQuestion.correctIndex === oIdx;

                            let optStyle = "border-teal/8 bg-white text-text-dark";
                            if (isSelected) {
                              optStyle = ans.isCorrect 
                                ? "border-success bg-success/5 text-success font-semibold"
                                : "border-error bg-error/5 text-error font-semibold";
                            } else if (isCorrectAnswer) {
                              optStyle = "border-success bg-success/5 text-success font-semibold";
                            }

                            return (
                              <div 
                                key={oIdx}
                                className={`p-2.5 rounded-lg border flex items-center justify-between ${optStyle}`}
                              >
                                <span>{opt}</span>
                                {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-success" />}
                                {isSelected && !isCorrectAnswer && <XCircle className="h-4 w-4 text-error" />}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-teal/5 rounded-lg border border-teal/10 text-[#214646]">
                          <span className="font-bold block mb-1">Explication médicale :</span>
                          {ans.caseQuestion.explanation}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal text-white text-xs font-bold hover:bg-teal-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="h-4 w-4" /> Recommencer l'entraînement
            </button>
            <Link
              href="/medquest"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-teal/15 bg-white text-teal text-xs font-bold hover:bg-surface/20 transition-all text-center"
            >
              Retour aux arènes
            </Link>
          </div>

        </main>
      </>
    );
  }

  return (
    <>
      <ECGBackground />

      <main className="relative z-10 flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/medquest"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-light hover:text-teal transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux arènes
          </Link>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 border border-teal/10 text-[10px] font-bold text-teal-dark">
              <Compass className="h-4 w-4 text-teal" />
              Mode libre : {questionType}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 border border-teal/10 text-[10px] font-bold text-teal-dark">
              Niveau : {level}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/80 border border-teal/10 text-[10px] font-bold text-teal-dark">
              {subject.name}
            </span>
          </div>
        </div>

        {/* Current Config Details Panel */}
        <div className="mb-6 rounded-2xl bg-teal/5 p-4 border border-teal/10 flex flex-wrap justify-between items-center text-xs gap-3">
          <div>
            <p className="font-semibold text-teal-dark">Configuration de l'arène :</p>
            <p className="text-text-light mt-0.5">
              Sujet: <strong className="text-text-dark">{subject.name}</strong> • Leçon: <strong className="text-text-dark">{lessonName}</strong>
            </p>
          </div>
          <div className="font-mono font-bold text-teal-dark bg-white border border-teal/15 px-3 py-1 rounded-lg">
            Question {currentIdx + 1} / {questionCount}
          </div>
        </div>

        {/* Case Card */}
        <div className="p-8 rounded-2xl border border-teal/10 bg-white-custom shadow-md space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-text-light uppercase font-bold">
              {questionType} • Cas N° {currentIdx + 1}
            </span>
            <h2 className="font-display text-xl font-bold text-text-dark">
              {currentCase.caseTitle}
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-surface/30 border border-teal/5 text-xs text-text leading-relaxed">
            {currentCase.caseDetails}
          </div>

          {/* Question */}
          <div className="space-y-4 pt-4 border-t border-teal/10">
            <p className="text-sm font-semibold text-text-dark">
              {currentCase.question}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {currentCase.options.map((opt, idx) => {
                const selected = selectedOption === idx;
                const correct = currentCase.correctIndex === idx;

                let btnStyle = "border-teal/12 bg-white-custom hover:bg-surface/10 text-text-dark";
                if (selected) {
                  btnStyle = "border-teal bg-teal/5 text-teal font-semibold";
                }
                if (isAnswered) {
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
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && correct && (
                      <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                    )}
                    {isAnswered && selected && !correct && (
                      <AlertCircle className="h-4.5 w-4.5 text-error" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Feedback */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-4 rounded-xl text-xs leading-relaxed border ${
                isCorrect
                  ? "bg-success/5 border-success/15 text-success"
                  : "bg-error/5 border-error/15 text-error"
              }`}
            >
              <div className="font-bold mb-1 uppercase tracking-wide">
                {isCorrect ? "Bon diagnostic" : "Diagnostic incorrect"}
              </div>
              <p>{currentCase.explanation}</p>
            </motion.div>
          )}

          {/* Action Row */}
          <div className="flex justify-end pt-4 border-t border-teal/10">
            {!isAnswered ? (
              <button
                onClick={handleVerify}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-full bg-teal text-white-custom text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer"
              >
                Vérifier le diagnostic
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-teal text-white-custom text-xs font-semibold flex items-center gap-2 hover:bg-teal-dark transition-all cursor-pointer"
              >
                {currentIdx + 1 >= questionCount ? "Terminer la session" : "Cas suivant"} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function FreeMedQuestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fbfb] to-[#f5f7f4]">
        <div className="text-sm font-semibold text-teal-dark animate-pulse">Chargement de la session...</div>
      </div>
    }>
      <FreePracticeGame />
    </Suspense>
  );
}
