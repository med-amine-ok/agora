"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  BarChart4,
  Flame,
  CheckCircle,
  Play,
  Heart,
  ChevronDown,
  Sparkles,
  Zap,
  Users
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Mouse tilt variables for the 3D dashboard preview card
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const features = [
    {
      title: "Leçons Structurées",
      description: "Parcours d'apprentissage interactifs conçus étape par étape. Finis les PDF de cours ennuyeux.",
      icon: <BookOpen className="h-5 w-5 text-teal" />,
    },
    {
      title: "Arène MedQuest",
      description: "Participez à des quiz en direct ou lancez-vous dans des modes Blitz intenses contre la montre.",
      icon: <Trophy className="h-5 w-5 text-teal" />,
    },
    {
      title: "Analyses Détaillées",
      description: "Diagnostiquez vos points faibles, suivez vos séries et anticipez vos performances aux examens.",
      icon: <BarChart4 className="h-5 w-5 text-teal" />,
    },
    {
      title: "Étudier Entre Amis",
      description: "Créez des salons multijoueurs privés et défiez vos camarades de classe en temps réel.",
      icon: <Users className="h-5 w-5 text-teal" />,
    },
  ];

  const pricingTiers = [
    {
      name: "Mode Gratuit",
      desc: "Idéal pour l'apprentissage quotidien.",
      features: ["Toutes les leçons structurées", "Questions d'entraînement quotidiennes", "Statistiques de base"],
      cta: "Commencer",
      isPopular: false,
    },
    {
      name: "MedQuest Blitz",
      desc: "Précision chirurgicale, compétition intense.",
      features: ["Compte à rebours interactif", "Effets sonores synchronisés", "Diagnostics avancés et détaillés", "Classements quotidiens"],
      cta: "Lancer Blitz",
      isPopular: true,
    },
    {
      name: "Salon MedQuest",
      desc: "Salons multijoueurs en temps réel.",
      features: ["Jusqu'à 10 joueurs", "Chat textuel et émoticônes", "Animations de score en direct", "Sujets personnalisés du programme"],
      cta: "Créer un Salon",
      isPopular: false,
    },
  ];

  const faqs = [
    {
      q: "Agora couvre-t-il le programme de médecine algérien ?",
      a: "Oui, Agora est spécifiquement structuré autour des modules enseignés dans les facultés de médecine algériennes, en se concentrant fortement sur les cycles cliniques (Cardiologie, Pneumologie, Gastro-entérologie) et les examens clés comme le concours national du Résidanat.",
    },
    {
      q: "Comment fonctionne le mode Blitz ?",
      a: "Le mode Blitz est un format de quiz chronométré où les questions s'enchaînent de plus en plus vite. L'interface affiche une ligne de rythme cardiaque orange qui s'accélère au fil du compte à rebours, récompensant la vitesse et la précision.",
    },
    {
      q: "Puis-je utiliser Agora sur mon téléphone portable ?",
      a: "Absolument. Agora est entièrement responsive et propose des menus de navigation adaptés à tous les navigateurs mobiles sur iOS et Android.",
    },
  ];

  return (
    <>
      <ECGBackground />

      <main className="relative z-10 flex-grow pt-24 overflow-hidden">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-[90vh] flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Column */}
            <div className="space-y-8 text-left">

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-dark leading-tight tracking-tight">
                Étudiez Mieux.<br />
                Répondez Plus Vite.<br />
                <span className="text-teal underline decoration-accent/40 decoration-4 underline-offset-8">
                  Maîtrisez la Médecine.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-text-light max-w-lg leading-relaxed font-normal">
                Leçons structurées, quiz compétitifs, analyses détaillées et multijoueur en temps réel créés exclusivement pour les étudiants en médecine algériens préparant leurs modules cliniques et le Résidanat.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-teal text-white-custom font-semibold text-xs shadow-lg shadow-teal/15 hover:bg-teal-dark hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  Commencer à Apprendre
                </Link>
                <Link
                  href="/lessons"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-teal/15 bg-white-custom/50 text-teal hover:bg-white-custom/80 font-semibold text-xs transition-all"
                >
                  <Play className="h-3 w-3 fill-teal text-teal" />
                  Voir la Démo
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-teal/10">
                <p className="text-[10px] font-mono tracking-widest text-text-light uppercase mb-3">
                  Recommandé par des étudiants de
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-text-dark/80">
                  <span>Faculté d'Alger</span>
                  <span>Faculté d'Oran</span>
                  <span>Faculté de Constantine</span>
                </div>
              </div>
            </div>

            {/* Right Column - 3D Dashboard Mockup */}
            <div className="flex items-center justify-center lg:justify-end">
              <div
                className="perspective-1000 cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  animate={{ rotateX, rotateY }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative w-[340px] sm:w-[450px] aspect-[4/3] rounded-2xl border border-white-custom/40 bg-white-custom/30 backdrop-blur-xl p-6 shadow-2xl transition-all"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Glowing highlights */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-light/5 to-accent/5 rounded-2xl pointer-events-none" />

                  {/* Header mock */}
                  <div className="flex items-center justify-between border-b border-teal/10 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-error" />
                      <div className="h-3 w-3 rounded-full bg-accent" />
                      <div className="h-3 w-3 rounded-full bg-teal-light" />
                    </div>
                    <span className="text-[10px] font-mono text-text-light/65 uppercase tracking-widest">
                      Aperçu du Tableau de Bord
                    </span>
                  </div>

                  {/* Body widgets */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Active Streak Widget */}
                    <div className="p-4 rounded-xl bg-white-custom/60 border border-teal/10 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium text-text-light leading-none mb-1">
                          SÉRIE ACTUELLE
                        </p>
                        <p className="text-xl font-bold font-mono text-text-dark leading-none">
                          12 Jours
                        </p>
                      </div>
                      <Flame className="h-8 w-8 text-accent fill-accent" />
                    </div>

                    {/* Weekly points */}
                    <div className="p-4 rounded-xl bg-white-custom/60 border border-teal/10 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium text-text-light leading-none mb-1">
                          POINTS OBTENUS
                        </p>
                        <p className="text-xl font-bold font-mono text-teal-dark leading-none">
                          840 XP
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-teal fill-teal/10" />
                    </div>

                    {/* MedQuest Card preview */}
                    <div className="col-span-2 p-4 rounded-xl bg-teal-dark text-white-custom shadow-md flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-teal-light font-bold">
                          Prochain Match dans l'Arène
                        </span>
                        <h4 className="text-sm font-display font-semibold">
                          Cardiologie (Diagnostic ECG)
                        </h4>
                        <p className="text-[10px] text-white-custom/75">
                          Débute dans 2 minutes
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white-custom border border-white-custom/10">
                        <Zap className="h-5 w-5 text-accent animate-pulse" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="relative py-20 bg-surface/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-display font-bold text-text-dark">
                Conçu pour une Précision d'Apprentissage
              </h2>
              <p className="text-sm text-text-light">
                Chaque détail d'Agora est pensé pour maximiser la mémorisation et l'exactitude du diagnostic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-xl border border-teal/10 bg-white-custom hover:border-teal/30 hover:-translate-y-1 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                >
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-surface/50 border border-teal/5">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-text-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MedQuest Tiers Section */}
        <section id="medquest" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-display font-bold text-text-dark animate-fade-in">
              Terrains d'Entraînement MedQuest
            </h2>
            <p className="text-sm text-text-light">
              Choisissez votre arène. Entraînez-vous en solo, sous haute pression, ou défiez vos confrères.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border text-left flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  tier.isPopular
                    ? "border-accent bg-white-custom shadow-xl scale-[1.03]"
                    : "border-teal/10 bg-white-custom/50 hover:bg-white-custom hover:border-teal/20"
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-accent text-white-custom text-[9px] font-bold uppercase tracking-wider rounded-bl-xl flex items-center gap-1">
                    <Zap className="h-3 w-3 fill-white-custom" /> Populaire
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-text-dark mb-1">{tier.name}</h3>
                  <p className="text-xs text-text-light mb-6">{tier.desc}</p>

                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-text-dark">
                        <CheckCircle className="h-4.5 w-4.5 text-teal shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/auth/register"
                  className={`w-full py-3 rounded-full text-center text-xs font-semibold transition-all ${
                    tier.isPopular
                      ? "bg-accent hover:bg-accent/90 text-white-custom shadow-lg shadow-accent/15"
                      : "bg-teal hover:bg-teal-dark text-white-custom"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-surface/20 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold text-text-dark text-center mb-12">
              Questions Fréquemment Posées
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-teal/10 bg-white-custom overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-text-dark hover:bg-surface/10 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-teal transition-transform duration-300 ${
                        activeFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="p-5 pt-0 border-t border-teal/5 text-xs text-text-light leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="relative p-12 md:p-20 rounded-3xl bg-teal-dark text-white-custom shadow-xl overflow-hidden">
            {/* Ambient gradients */}
            <div className="absolute inset-0 bg-radial-gradient from-teal/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-6">
              <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
                Prêt à Rejoindre le Cœur de la Médecine Algérienne ?
              </h2>
              <p className="text-xs md:text-sm text-teal-light max-w-lg mx-auto leading-relaxed">
                Dynamisez votre apprentissage, évaluez votre vitesse de diagnostic face à d'autres étudiants et préparez-vous sereinement pour le Résidanat avec Agora.
              </p>
              <div className="pt-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent hover:bg-accent/90 text-white-custom font-semibold text-xs transition-all shadow-lg shadow-accent/25 hover:scale-[1.01]"
                >
                  Commencer Gratuitement
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
