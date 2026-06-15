"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Button from "@/presentation/components/ui/Button";
import Card from "@/presentation/components/ui/Card";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import { ArrowLeft, ChevronRight, Bookmark, CheckCircle, Zap, ShieldAlert, Award, Clock, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";

export default function LessonReader() {
  const params = useParams();
  const router = useRouter();
  const { startSession } = useQuizStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("def");
  const [isRead, setIsRead] = useState(false);

  const subjectId = (params?.subjectId as string) || "cardiologie";
  const lessonId = (params?.lessonId as string) || "insuffisance-cardiaque";

  const articleRef = useRef<HTMLDivElement>(null);

  const getLessonTitle = () => {
    if (lessonId === "insuffisance-cardiaque") return "Insuffisance Cardiaque à fraction d'éjection altérée";
    if (lessonId === "infarctus-myocarde") return "Infarctus du Myocarde - SCA ST+ (Phase aiguë)";
    if (lessonId === "canal-inguinal") return "Le Canal Inguinal et hernies de l'aine";
    if (lessonId === "glycolyse") return "La Glycolyse et régulation enzymatique";
    if (lessonId === "ponction-lombaire") return "Technique de la Ponction Lombaire et interprétation";
    return "Introduction aux Modules Cliniques";
  };

  const title = getLessonTitle();

  // Handle Scroll Progress Bar & Intersection Observer for active sections
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const element = articleRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      const relativeScroll = window.scrollY - element.offsetTop;
      if (totalHeight > 0 && relativeScroll > 0) {
        setScrollProgress(Math.min((relativeScroll / totalHeight) * 100, 100));
      } else if (relativeScroll <= 0) {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer to track headings
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    const headings = document.querySelectorAll("article section");
    headings.forEach((h) => observer.observe(h));

    return () => {
      headings.forEach((h) => observer.unobserve(h));
    };
  }, []);

  const handleMarkAsRead = () => {
    setIsRead(true);
    // Celebrate first completion with confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#2D6A4F", "#74C69D", "#D0E8F4", "#B8860B"]
    });
  };

  const handleStartPractice = () => {
    let subjectName = "Cardiologie";
    if (subjectId === "anatomie") subjectName = "Anatomie";
    if (subjectId === "biochimie") subjectName = "Biochemie";
    if (subjectId === "neurologie") subjectName = "Neurologie";

    // Set quiz questions from mock data
    const mockQuestions = [
      {
        id: "q1",
        text: "Quel est le traitement de première intention dans l'insuffisance cardiaque à fraction d'éjection altérée ?",
        options: [
          "L'association IEC / bêta-bloquants / ARM / inhibiteurs de SGLT2",
          "Les diurétiques de l'anse en monothérapie",
          "L'amiodarone systématique",
          "Les inhibiteurs calciques"
        ],
        correctIndex: 0,
        explanation: "La quadrithérapie combinant un bloqueur du SRAA (IEC/ARNI), un bêta-bloquant, un ARM et un iSGLT2 est recommandée chez tout patient atteint d'IC-FEa.",
        difficulty: "medium" as const,
        subject: subjectName,
        lessonId: lessonId,
        createdDate: new Date().toISOString()
      }
    ];

    startSession(mockQuestions, "free");
    router.push("/medquest/free/quiz");
  };

  return (
    <SidebarLayout>
      <div className="pb-24 relative select-none">
        
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-green-mid transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-brand/40 pb-4 mb-8">
          <div className="space-y-2">
            <Link
              href={`/lessons/${subjectId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour au module
            </Link>
            <div className="text-xs text-text-light font-mono flex items-center gap-1.5">
              <span>Leçons</span>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize">{subjectId}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-green-mid font-semibold truncate max-w-[200px]">{title}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-sm border transition-colors cursor-pointer ${
                bookmarked
                  ? "bg-green-mid/10 border-green-mid text-green-mid"
                  : "border-border-brand text-text-light hover:text-text-dark bg-beige-light"
              }`}
              title={bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-green-mid" : ""}`} />
            </button>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar Table of Contents (3 cols), Center Content (6 cols), Right Info Sidebar (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Table of Contents */}
          <aside className="lg:col-span-3 sticky top-10 hidden lg:block space-y-4">
            <span className="text-xs font-bold text-green-dark uppercase tracking-wider block">Table des matières</span>
            <ul className="space-y-2.5 text-xs font-medium text-text-mid">
              <li>
                <a 
                  href="#def" 
                  className={`hover:text-green-mid transition-colors block border-l-2 pl-3 ${activeSection === "def" ? "text-green-mid border-green-mid font-semibold" : "border-transparent"}`}
                >
                  1. Définition & Physiologie
                </a>
              </li>
              <li>
                <a 
                  href="#piliers" 
                  className={`hover:text-green-mid transition-colors block border-l-2 pl-3 ${activeSection === "piliers" ? "text-green-mid border-green-mid font-semibold" : "border-transparent"}`}
                >
                  2. Traitement & Quadrithérapie
                </a>
              </li>
              <li>
                <a 
                  href="#clinique" 
                  className={`hover:text-green-mid transition-colors block border-l-2 pl-3 ${activeSection === "clinique" ? "text-green-mid border-green-mid font-semibold" : "border-transparent"}`}
                >
                  3. Signes Fonctionnels & Diagnostics
                </a>
              </li>
            </ul>
          </aside>

          {/* Center Content Pane */}
          <div ref={articleRef} className="lg:col-span-6 space-y-8 text-text-dark">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-dark leading-tight tracking-tight">
              {title}
            </h1>

            <div className="flex items-center gap-2 text-xs font-mono text-text-light font-semibold">
              <span className="bg-green-dark/10 text-green-dark px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Révisé pour le concours
              </span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 12 mins de lecture</span>
            </div>

            <article className="font-sans text-[17px] leading-[1.8] space-y-6 text-justify">
              
              <section id="def" className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-green-dark mt-8 border-b border-green-mid/10 pb-2">
                  1. Définition & Physiopathologie
                </h2>
                <p>
                  L’insuffisance cardiaque à fraction d’éjection altérée (IC-FEa) se définit par une fraction d’éjection du ventricule gauche (FEVG) inférieure ou égale à 40%. Ce syndrome résulte d'un remodelage ventriculaire gauche limitant le débit cardiaque de façon pathologique.
                </p>
                <p>
                  Pour compenser la baisse du débit systolique, l'organisme active la stimulation sympathique et le système rénine-angiotensine-aldostérone (SRAA). À terme, ces mécanismes physiopathologiques aggravent la fibrose myocardique et entraînent un cercle vicieux de surcharge et de dilatation ventriculaire.
                </p>
              </section>

              <section id="piliers" className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-green-dark mt-10 border-b border-green-mid/10 pb-2">
                  2. Traitement Médicamenteux (Les 4 Piliers)
                </h2>
                <p>
                  Selon les dernières recommandations cliniques de l'ESC, le traitement de fond modifiant l'évolution de la maladie comprend 4 classes d'agents indispensables :
                </p>

                <div className="p-5 bg-blue-light/25 border-l-4 border-blue-accent rounded-r-md text-sm text-text-mid space-y-2">
                  <span className="font-bold text-blue-dark uppercase tracking-wider text-xs flex items-center gap-1.5">
                    💡 Note Clinique
                  </span>
                  <p>
                    L'introduction conjointe de ces quatre molécules réduit drastiquement la mortalité cardiovasculaire globale et le nombre d'hospitalisations urgentes.
                  </p>
                </div>

                <ul className="list-disc list-outside pl-6 space-y-3 text-text-mid">
                  <li>
                    <strong className="text-text-dark">IEC ou ARNI (Sacubitril/Valsartan) :</strong> Bloquent les effets néfastes de l'angiotensine II tout en augmentant le taux de peptides vasodilatateurs bénéfiques.
                  </li>
                  <li>
                    <strong className="text-text-dark">Bêta-bloquants sélectifs :</strong> Réduisent la fréquence cardiaque et la surcharge adrénergique myocardique.
                  </li>
                  <li>
                    <strong className="text-text-dark">Antagonistes des Récepteurs des Minéralocorticoïdes (ARM) :</strong> Évitent la fibrose myocardique et limitent l'hypokalémie.
                  </li>
                  <li>
                    <strong className="text-text-dark">Inhibiteurs de SGLT2 (Gliflozines) :</strong> Offrent une protection cardio-rénale indéniable chez les patients diabétiques ou non.
                  </li>
                </ul>
              </section>

              <section id="clinique" className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-green-dark mt-10 border-b border-green-mid/10 pb-2">
                  3. Signes Fonctionnels & Diagnostics
                </h2>
                <p>
                  La sémiologie cardiaque est dominée par la dyspnée progressive (classification NYHA de I à IV), l'asthénie d'effort et les œdèmes des membres inférieurs prenant le godet lors des épisodes de congestion passive.
                </p>

                <div className="p-5 bg-red-50 border-l-4 border-error-brand rounded-r-md text-sm text-text-mid space-y-2">
                  <span className="font-bold text-error-brand uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-error-brand" /> ⚠️ Piège à QCM
                  </span>
                  <p>
                    Les diurétiques de l'anse (comme le Furosémide) réduisent les œdèmes et améliorent la congestion pulmonaire mais <strong className="text-text-dark font-semibold">n'ont aucun effet démontré sur la survie globale</strong>.
                  </p>
                </div>
              </section>

              <Card className="p-6 bg-green-dark/5 border border-green-mid/20 rounded-md mt-12 space-y-3">
                <h3 className="font-bold text-green-dark font-sans flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-mid" />
                  Points clés du cours
                </h3>
                <ul className="space-y-2 text-sm text-text-mid list-none pl-0">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-mid shrink-0 mt-0.5" />
                    <span>L'ETT est l'examen clé de confirmation clinique (FEVG ≤ 40%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-mid shrink-0 mt-0.5" />
                    <span>Quadrithérapie : IEC/ARNI + Bêta-bloquant + ARM + iSGLT2.</span>
                  </li>
                </ul>
              </Card>

            </article>

            {/* Float Mark as Read Button */}
            <div className="flex justify-center pt-8">
              <Button 
                onClick={handleMarkAsRead}
                variant={isRead ? "secondary" : "primary"}
                className="flex items-center gap-2"
                disabled={isRead}
              >
                <CheckCircle className="w-5 h-5" /> 
                {isRead ? "Cours Validé !" : "Marquer comme lu"}
              </Button>
            </div>
          </div>

          {/* Right Info Sidebar */}
          <aside className="lg:col-span-3 sticky top-10 space-y-6">
            <Card className="border-border-brand/40 space-y-4">
              <span className="text-xs font-bold text-green-dark uppercase tracking-wider block">Stats de leçon</span>
              <div className="space-y-3 text-xs text-text-mid">
                <div className="flex justify-between">
                  <span>Questions associées</span>
                  <span className="font-mono font-bold text-text-dark">15 QCMs</span>
                </div>
                <div className="flex justify-between">
                  <span>Précision moyenne</span>
                  <span className="font-mono font-bold text-green-mid">74.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut</span>
                  <span className={`font-semibold ${isRead ? "text-green-mid" : "text-text-light"}`}>
                    {isRead ? "Terminé" : "Non validé"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-border-brand/40 bg-green-dark/5 space-y-3">
              <h4 className="font-serif text-sm font-bold text-green-dark">S'entraîner sur ce cours</h4>
              <p className="text-text-mid text-xs leading-relaxed">
                Testez vos connaissances immédiatement après lecture pour favoriser l'ancrage mémoriel.
              </p>
              <Button onClick={handleStartPractice} className="w-full py-2 flex items-center justify-center gap-2 text-xs">
                <Zap className="w-4 h-4 text-white fill-white" /> Pratiquer le cours
              </Button>
            </Card>
          </aside>

        </div>
      </div>
    </SidebarLayout>
  );
}
