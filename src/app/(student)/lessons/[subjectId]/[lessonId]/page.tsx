"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  Play, 
  FileText, 
  CheckCircle,
  HelpCircle,
  AlertCircle,
  BookOpenCheck
} from "lucide-react";
import { getLessonMatch } from "../../mockLessonsData";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const subjectId = params?.subjectId as string;
  const lessonId = params?.lessonId as string;

  const match = useMemo(() => {
    if (!subjectId || !lessonId) return null;
    return getLessonMatch(subjectId, lessonId);
  }, [subjectId, lessonId]);

  const [isCompleted, setIsCompleted] = useState(match?.lesson.completed ?? false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "resources">("content");

  if (!match) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#f8fbfb] to-[#f5f7f4] px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-text-dark">Leçon non trouvée</h1>
        <p className="mt-2 text-sm text-text-light">
          La leçon ou le module spécifié n'existe pas ou a été déplacé.
        </p>
        <Link
          href="/lessons"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
        >
          Retourner au hub des leçons
        </Link>
      </div>
    );
  }

  const { subject, unit, lesson } = match;

  // Mock content details depending on format
  const mockQuizQuestions = [
    {
      id: 1,
      question: `Quelle est la première intention thérapeutique recommandée pour cette situation clinique en ${subject.name} ?`,
      options: [
        "Surveillance clinique simple et réévaluation sous 48h",
        "Traitement médicamenteux immédiat par inhibiteurs spécifiques",
        "Examens complémentaires invasifs d'urgence",
        "Hospitalisation en soins intensifs avec oxygénothérapie"
      ],
      correctIndex: 1,
      explanation: "Les recommandations actuelles préconisent l'instauration immédiate d'un traitement ciblé pour stabiliser les fonctions vitales et réduire le risque de complications à long terme."
    },
    {
      id: 2,
      question: "Parmi les signes cliniques suivants, lequel présente la plus forte valeur prédictive positive ?",
      options: [
        "La présence d'un souffle systolique intermittent",
        "Une dyspnée d'effort d'apparition brutale",
        "Une élévation persistante des biomarqueurs sériques",
        "L'association de céphalées et de troubles visuels transitoires"
      ],
      correctIndex: 2,
      explanation: "L'élévation des biomarqueurs reste le gold standard diagnostique en raison de sa spécificité élevée supérieure à 95% dans la phase aiguë."
    }
  ];

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleValidateQuiz = () => {
    setShowResults(true);
    setIsCompleted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fbfb] via-white to-[#f5f7f4]">
      {/* Background Decorative Gradient */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.08]" 
        style={{
          backgroundImage: `radial-gradient(circle at top left, ${subject.color}, transparent 35%), radial-gradient(circle at top right, #d6a300, transparent 28%)`
        }}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-light">
            <Link href="/lessons" className="hover:text-teal-dark">
              Hub
            </Link>
            <span>/</span>
            <Link href={`/lessons/${subject.id}`} className="hover:text-teal-dark">
              {subject.name}
            </Link>
            <span>/</span>
            <span className="text-teal-dark truncate max-w-[200px]">{lesson.title}</span>
          </div>

          <div className="flex flex-col gap-3 border-b border-teal/10 pb-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl space-y-3">
              <span 
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm"
                style={{
                  color: subject.color,
                  borderColor: `${subject.color}22`,
                  backgroundColor: `${subject.color}12`,
                  borderWidth: "1px"
                }}
              >
                <BookOpen className="h-3.5 w-3.5" /> {lesson.format}
              </span>
              <h1 className="font-display text-3xl font-bold leading-tight text-text-dark sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="text-sm text-text-light">
                Unité : {unit.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-teal/15 bg-white-custom px-4 py-2 text-xs font-semibold text-teal-dark shadow-sm">
                <Clock className="h-4 w-4 text-teal" /> {lesson.duration}
              </div>
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                  isCompleted 
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                    : "border-teal/15 bg-white-custom text-text-light hover:border-teal/30 hover:text-teal-dark"
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-emerald-600" : "text-text-light"}`} />
                {isCompleted ? "Validée" : "Marquer comme lue"}
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          
          {/* Main Lesson Body */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-teal/10 bg-white-custom/80 rounded-t-3xl overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "content" 
                    ? "border-teal text-teal-dark bg-white" 
                    : "border-transparent text-text-light hover:text-text-dark"
                }`}
              >
                Contenu de cours
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "notes" 
                    ? "border-teal text-teal-dark bg-white" 
                    : "border-transparent text-text-light hover:text-text-dark"
                }`}
              >
                Notes de révision
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "resources" 
                    ? "border-teal text-teal-dark bg-white" 
                    : "border-transparent text-text-light hover:text-text-dark"
                }`}
              >
                Ressources
              </button>
            </div>

            {/* Tab Contents */}
            <div className="rounded-b-3xl border-x border-b border-teal/10 bg-white-custom p-6 shadow-sm md:p-8">
              {activeTab === "content" && (
                <div className="space-y-8">
                  {/* Format-specific mock template rendering */}
                  {lesson.format === "QCM" ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl bg-teal/5 p-5 border border-teal/10">
                        <h3 className="flex items-center gap-2 text-base font-bold text-teal-dark">
                          <HelpCircle className="h-5 w-5 text-teal" /> Évaluation QCM d'entraînement
                        </h3>
                        <p className="mt-2 text-sm text-text-dark leading-relaxed">
                          Testez vos connaissances acquises sur le module de {subject.name}. Répondez aux questions ci-dessous pour valider la leçon.
                        </p>
                      </div>

                      {mockQuizQuestions.map((q, qIdx) => (
                        <div key={q.id} className="space-y-3 rounded-2xl border border-teal/10 p-5 bg-white">
                          <h4 className="text-sm font-bold text-text-dark flex gap-2">
                            <span className="text-teal font-mono">Q{q.id}.</span>
                            {q.question}
                          </h4>
                          <div className="grid gap-2 pt-2">
                            {q.options.map((option, oIdx) => {
                              const isSelected = selectedAnswers[q.id] === oIdx;
                              const isCorrect = q.correctIndex === oIdx;
                              const isWrong = isSelected && !isCorrect;

                              let btnStyle = "border-teal/10 bg-white hover:bg-surface/30 text-text-dark";
                              if (showResults) {
                                if (isCorrect) {
                                  btnStyle = "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium";
                                } else if (isWrong) {
                                  btnStyle = "border-red-300 bg-red-50 text-red-800";
                                } else {
                                  btnStyle = "opacity-60 border-teal/10 bg-white text-text-light";
                                }
                              } else if (isSelected) {
                                btnStyle = "border-teal bg-teal/5 text-teal-dark font-medium";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectAnswer(q.id, oIdx)}
                                  disabled={showResults}
                                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-all ${btnStyle}`}
                                >
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>

                          {showResults && (
                            <div className="mt-3 rounded-xl bg-surface/50 p-4 text-xs text-text-dark border-l-4 border-teal">
                              <p className="font-semibold text-teal-dark">Explication :</p>
                              <p className="mt-1 text-text-light leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="flex gap-4 pt-4">
                        {!showResults ? (
                          <button
                            onClick={handleValidateQuiz}
                            disabled={Object.keys(selectedAnswers).length < mockQuizQuestions.length}
                            className="flex-1 inline-flex justify-center items-center gap-2 rounded-full bg-teal py-3 text-sm font-semibold text-white transition-all hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <BookOpenCheck className="h-4 w-4" /> Valider mes réponses
                          </button>
                        ) : (
                          <button
                            onClick={handleResetQuiz}
                            className="flex-1 inline-flex justify-center items-center gap-2 rounded-full border border-teal/15 bg-white-custom py-3 text-sm font-semibold text-teal-dark transition-all hover:bg-surface/60"
                          >
                            Recommencer le QCM
                          </button>
                        )}
                      </div>
                    </div>
                  ) : lesson.format === "Cas clinique" ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border-l-4 border-accent bg-accent/5 p-5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-accent">Étude de cas réel</span>
                        <h3 className="mt-1 text-base font-bold text-text-dark">Présentation du patient</h3>
                        <p className="mt-2 text-sm text-text-light leading-relaxed">
                          Un patient de 64 ans se présente aux urgences décrivant une symptomatologie clinique aiguë liée à {subject.focus}. Il n'y a pas d'antécédents chirurgicaux récents.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-text-dark border-b border-teal/10 pb-2">Étapes de prise en charge</h4>
                        
                        <div className="relative border-l-2 border-teal/10 pl-6 ml-3 space-y-8">
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-white ring-4 ring-white" />
                            <h5 className="text-xs font-bold text-text-dark">Étape 1 : Examen clinique et anamnèse</h5>
                            <p className="mt-1.5 text-xs leading-relaxed text-text-light">
                              Recherche active des facteurs de risque, évaluation des signes cliniques principaux, et recueil des constantes biologiques critiques.
                            </p>
                          </div>

                          <div className="relative">
                            <span className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-white ring-4 ring-white" />
                            <h5 className="text-xs font-bold text-text-dark">Étape 2 : Examens complémentaires de référence</h5>
                            <p className="mt-1.5 text-xs leading-relaxed text-text-light">
                              Prescription sélective d'une imagerie ou de dosages biologiques précis pour confirmer le diagnostic de travail suspecté lors de l'examen clinique.
                            </p>
                          </div>

                          <div className="relative">
                            <span className="absolute -left-[31px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-white ring-4 ring-white" />
                            <h5 className="text-xs font-bold text-text-dark">Étape 3 : Synthèse thérapeutique et suivi</h5>
                            <p className="mt-1.5 text-xs leading-relaxed text-text-light">
                              Instauration du protocole adapté selon les consensus scientifiques actuels, avec critères d'efficacité à évaluer en service continu.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Default / Lecture Format
                    <div className="space-y-6">
                      <div className="prose prose-teal max-w-none text-sm text-text-dark space-y-4 leading-relaxed">
                        <p className="font-semibold text-base text-text-dark">
                          Introduction aux concepts fondamentaux de la leçon.
                        </p>
                        <p>
                          Dans ce cours sur <strong>{subject.name}</strong>, nous explorons en détail {lesson.summary.toLowerCase()} Ce support de cours offre des points méthodologiques clés pour optimiser votre mémorisation.
                        </p>
                        
                        <h4 className="font-display text-lg font-bold text-text-dark mt-6">1. Mécanismes et sémiologie clinique</h4>
                        <p>
                          L'analyse sémiologique rigoureuse et la compréhension des mécanismes physiopathologiques sous-jacents guident la prise en charge clinique. Les points essentiels incluent :
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Identification précoce des principaux drapeaux rouges diagnostiques.</li>
                          <li>Corrélation étroite entre les plaintes fonctionnelles et l'imagerie.</li>
                          <li>Suivi régulier des marqueurs et indicateurs biologiques clés.</li>
                        </ul>

                        <h4 className="font-display text-lg font-bold text-text-dark mt-6">2. Arbre décisionnel de prise en charge</h4>
                        <p>
                          Chaque étape diagnostique doit être justifiée. Privilégiez les démarches non invasives en première intention conformément aux directives internationales.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-text-dark">Fiches et résumés flash</h3>
                  <p className="text-xs text-text-light">
                    Retrouvez ici le condensé à retenir pour vos examens et les cas cliniques en service.
                  </p>
                  
                  <div className="grid gap-4 mt-4">
                    <div className="rounded-2xl border border-teal/10 p-5 bg-white space-y-2 shadow-sm">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-dark">Retenir à tout prix</h4>
                      <p className="text-xs leading-relaxed text-text-light">
                        Toujours éliminer les diagnostics différentiels vitaux devant une douleur aiguë ou un déficit d'apparition brutale.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-teal/10 p-5 bg-white space-y-2 shadow-sm">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">Conseil de révision</h4>
                      <p className="text-xs leading-relaxed text-text-light">
                        Associez chaque critère sémiologique à sa pertinence physiopathologique. C'est la clé pour les épreuves théoriques et les questions de synthèse.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-text-dark">Documents de référence et liens utiles</h3>
                  <div className="divide-y divide-teal/10">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-teal" />
                        <div>
                          <p className="text-xs font-semibold text-text-dark">Consensus de prise en charge {subject.name}</p>
                          <p className="text-[10px] text-text-light">PDF (1.2 Mo)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-dark hover:underline cursor-pointer">Télécharger</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-teal" />
                        <div>
                          <p className="text-xs font-semibold text-text-dark">Arbre décisionnel de synthèse</p>
                          <p className="text-[10px] text-text-light">Image HD (850 Ko)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-dark hover:underline cursor-pointer">Télécharger</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Overview Panel */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Lesson Info Box */}
            <div className="rounded-3xl border border-teal/10 bg-white-custom p-6 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-text-light">Objectifs d'apprentissage</span>
                <div className="mt-3 space-y-3">
                  {lesson.objectives.map((obj, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-text-dark leading-relaxed">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-teal mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-teal/10 pt-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-text-light">À propos de la matière</span>
                <p className="mt-2 text-xs text-text-light leading-relaxed">
                  Ce cours s'inscrit dans le module global de <strong>{subject.name}</strong> visant à maîtriser les diagnostics et thérapeutiques prioritaires.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-teal/10 bg-white-custom p-6 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-text-light">Raccourcis rapides</span>
              <div className="grid gap-2.5">
                <Link
                  href={`/lessons/${subject.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white-custom py-2.5 text-xs font-semibold text-teal-dark hover:bg-surface/60 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Revenir au module
                </Link>
                <Link
                  href="/lessons"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal/15 bg-white-custom py-2.5 text-xs font-semibold text-teal-dark hover:bg-surface/60 transition-colors"
                >
                  Tous les cours
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
