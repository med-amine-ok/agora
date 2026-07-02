"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Zap, BarChart3, ArrowRight, Play, Users } from "lucide-react";
import Button from "@/presentation/components/ui/Button";
import Card from "@/presentation/components/ui/Card";
import {
  StethoscopeIcon,
  MicroscopeIcon,
  DnaIcon,
  BrainIcon,
  AnimatedEcgWaveform
} from "@/presentation/components/icons/MedicalIcons";

export default function Home() {
  const [studentCount, setStudentCount] = useState(9400);
  const [mounted, setMounted] = useState(false);

  // Set mounted state and counter animation
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const handle = setInterval(() => {
      setStudentCount(prev => {
        if (prev >= 10450) {
          clearInterval(handle);
          return 10450;
        }
        return prev + Math.floor(Math.random() * 50) + 10;
      });
    }, 100);
    return () => clearInterval(handle);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Cours Structurés",
      desc: "Des cours synthétisés, clarifiés et organisés méthodiquement par modules d'externat et résidanat.",
      tint: "teal" as const,
    },
    {
      icon: Zap,
      title: "MedQuest Hub",
      desc: "Trois modes de QCM intenses pour tester vos réflexes cliniques : Libre, Blitz et Salons en temps réel.",
      tint: "accent" as const,
    },
    {
      icon: BarChart3,
      title: "Suivi Statistique",
      desc: "Identifiez vos matières faibles grâce à un profil analytique complet et des graphiques de progression.",
      tint: "blue" as const,
    }
  ];

  const testimonials = [
    { name: "Dr. Meriem B.", univ: "Faculté d'Alger", quote: "Grâce au mode Blitz d'Agora, j'ai pu développer des réflexes ultra rapides pour répondre aux QCM du concours de résidanat !" },
    { name: "Dr. Youcef K.", univ: "Faculté de Constantine", quote: "L'interface sombre et sobre est parfaite pour mes longues sessions de révisions nocturnes. Une merveille académique." },
    { name: "Lina C.", univ: "Faculté d'Oran", quote: "Le mode Salon permet de réviser en groupe avec mes collègues à distance, c'est convivial et stimulant." }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-beige-base text-text-dark font-sans flex flex-col relative overflow-hidden">
      
      {/* Floating Medical Parallax Icons (subtle layout decorations) */}
      <div className="absolute top-20 left-10 opacity-10 animate-bounce pointer-events-none" style={{ animationDuration: '6s' }}>
        <StethoscopeIcon size={64} className="text-green-mid" />
      </div>
      <div className="absolute top-40 right-16 opacity-10 animate-pulse pointer-events-none" style={{ animationDuration: '8s' }}>
        <MicroscopeIcon size={56} className="text-blue-accent" />
      </div>
      <div className="absolute bottom-60 left-12 opacity-10 animate-bounce pointer-events-none" style={{ animationDuration: '7s' }}>
        <DnaIcon size={60} className="text-green-mid" />
      </div>
      <div className="absolute bottom-24 right-20 opacity-15 animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}>
        <BrainIcon size={72} className="text-gold-brand" />
      </div>

      {/* Navigation Header */}
      <motion.header 
        initial={mounted ? "hidden" : "visible"}
        animate="visible"
        variants={headerVariants}
        className="w-full max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between border-b border-border-brand/40 relative z-20"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-3xl font-bold tracking-wide text-green-dark">Agora</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-mid">
          <a href="#features" className="hover:text-green-mid transition-colors">Fonctionnalités</a>
          <a href="#demo" className="hover:text-green-mid transition-colors">Démonstration Blitz</a>
          <a href="#testimonials" className="hover:text-green-mid transition-colors">Témoignages</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="hidden sm:inline-flex">S&apos;inscrire</Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div 
          initial={mounted ? "hidden" : "visible"}
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col space-y-6 text-left"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-green-dark/10 text-green-dark font-semibold font-mono text-xs px-3 py-1.5 rounded-full border border-green-mid/20 w-fit">
            🎓 Dédié aux Carabins Algériens
          </motion.div>
          <motion.h1 variants={fadeIn} className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold text-green-dark leading-[1.1] tracking-tight">
            Apprendre.<br />S&apos;évaluer.<br />Exceller.
          </motion.h1>
          <motion.p variants={fadeIn} className="text-text-mid text-lg sm:text-xl max-w-lg leading-relaxed">
            La plateforme d&apos;excellence médicale associant des cours clairs, des défis chronométrés et une communauté d&apos;entraide compétitive.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="flex items-center gap-2 group">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Play className="w-4 h-4 text-green-mid" />
                Voir la démo
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Interactive 3D Perspective Card Mockup */}
        <div className="relative flex items-center justify-center lg:justify-end xl:pr-10">
          <motion.div
            initial={mounted ? "hidden" : "visible"}
            animate="visible"
            variants={scaleUp}
            className="w-full max-w-[460px] bg-green-dark text-white rounded-lg shadow-2xl p-6 border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-green-light font-serif">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/50">Tableau de bord</span>
                  <span className="text-sm font-semibold">Dr. Amine</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-gold-brand px-3 py-1 rounded-full text-xs font-mono font-bold animate-bounce-streak">
                🔥 14 jours
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/5">
                <span className="text-[10px] text-white/40 block">Précision Globale</span>
                <span className="font-mono text-xl font-bold text-green-light">78.4%</span>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/5">
                <span className="text-[10px] text-white/40 block">Total QCM</span>
                <span className="font-mono text-xl font-bold text-green-light">1,420</span>
              </div>
            </div>
            {/* Action */}
            <div className="bg-white/5 p-3 rounded-md border border-white/5 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-light animate-pulse" />
                <span className="text-white/80">Prochain défi disponible</span>
              </div>
              <span className="font-mono text-gold-brand font-bold">Lancer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full-width animated ECG wave decoration */}
      <div className="w-full text-green-mid/10 py-6">
        <AnimatedEcgWaveform className="w-full h-20" />
      </div>

      {/* Feature Cards Grid Section */}
      <section id="features" className="w-full bg-beige-light border-y border-border-brand/40 py-20">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-xl mx-auto mb-16 space-y-3"
          >
            <span className="text-sm font-bold text-green-mid font-mono tracking-widest uppercase">Espace Carabins</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-green-dark">
              Conçu pour le quotidien exigeant de l&apos;externat
            </h2>
            <p className="text-text-mid text-sm">
              Des heures d&apos;études quotidiennes demandent un outil rapide, fiable et esthétique qui favorise une mémorisation active à long terme.
            </p>
          </motion.div>

          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div key={idx} variants={fadeIn} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <Card hoverEffect borderTint={feat.tint} className="flex flex-col space-y-4 h-full">
                    <div className="w-12 h-12 rounded-sm bg-beige-base flex items-center justify-center border border-green-light/20">
                      <Icon className="w-6 h-6 text-green-mid" />
                    </div>
                    <h3 className="text-lg font-bold text-green-dark">{feat.title}</h3>
                    <p className="text-text-mid text-sm leading-relaxed flex-1">{feat.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Demo Blitz Mode Simulator */}
      <section id="demo" className="w-full max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.span variants={fadeIn} className="text-sm font-bold text-green-mid font-mono uppercase tracking-widest">
              Simulateur Blitz
            </motion.span>
            <motion.h2 variants={fadeIn} className="font-serif text-4xl sm:text-5xl font-bold text-green-dark">
              Tenez le coup sous la pression du temps
            </motion.h2>
            <motion.p variants={fadeIn} className="text-text-mid">
              Le mode Blitz teste vos réflexes cliniques : vous gagnez <strong className="text-green-mid font-semibold">+5s</strong> par bonne réponse et perdez <strong className="text-error-brand font-semibold">-5s</strong> par erreur. Le chrono s&apos;emballe !
            </motion.p>

            {/* Social Proof Stats */}
            <motion.div variants={fadeIn} className="pt-4 flex items-center gap-3">
              <Users className="w-10 h-10 text-green-mid shrink-0" />
              <div>
                <span className="font-mono text-2xl font-bold text-green-dark">{studentCount.toLocaleString()}</span>
                <p className="text-xs text-text-light font-semibold uppercase">Étudiants algériens déjà inscrits</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Animated Mock Card Simulator */}
          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
            className="bg-beige-light border border-border-brand p-8 rounded-lg flex flex-col space-y-6 shadow-inner relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono font-bold text-text-mid border-b border-border-brand/40 pb-2">
              <span>Mode Blitz (Démo)</span>
              <span className="text-gold-brand animate-pulse">⚡ Chrono actif : 23s</span>
            </div>

            <div className="p-4 bg-white rounded-sm border border-border-brand text-sm font-serif font-bold text-green-dark leading-snug">
              Quelle complication majeure suspecte-t-on devant l&apos;apparition d&apos;une céphalée orthostatique après une ponction lombaire ?
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-border-brand text-xs rounded-sm opacity-60">
                A. Une paralysie fémorale définitive
              </div>
              <div className="p-3 bg-emerald-50 border-2 border-green-mid text-xs rounded-sm text-green-dark font-semibold flex items-center justify-between">
                <span>B. Un syndrome post-ponction lombaire</span>
                <span className="text-[10px] bg-green-mid text-white px-2 py-0.5 rounded-full font-mono">Correct ! +5s</span>
              </div>
              <div className="p-3 bg-white border border-border-brand text-xs rounded-sm opacity-60">
                C. Une méningite foudroyante
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-beige-light border-t border-border-brand/40 py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center space-y-12">
          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-xl mx-auto space-y-2"
          >
            <span className="text-sm font-bold text-green-mid font-mono uppercase tracking-widest">Témoignages</span>
            <h2 className="font-serif text-3xl font-bold text-green-dark">Recommandé par vos collègues de promotion</h2>
          </motion.div>

          <motion.div 
            initial={mounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-beige-base p-6 rounded-md border border-border-brand/40 text-left space-y-4 shadow-sm flex flex-col justify-between"
              >
                <p className="text-text-mid text-sm italic leading-relaxed">&ldquo;{test.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-border-brand/40 pt-4">
                  <div className="w-9 h-9 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-sm">
                    {test.name.charAt(4)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-dark block">{test.name}</span>
                    <span className="text-[10px] text-text-light font-mono font-semibold uppercase">{test.univ}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-green-dark text-white py-20 px-6 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-light/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-accent/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={mounted ? "hidden" : "visible"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto space-y-6 relative z-10"
        >
          <motion.h2 variants={fadeIn} className="font-serif text-3xl sm:text-5xl font-bold">
            Prêt à surclasser vos résultats ?
          </motion.h2>
          <motion.p variants={fadeIn} className="text-green-light/85 text-base sm:text-lg max-w-lg mx-auto">
            Rejoignez dès aujourd&apos;hui les étudiants des facultés d&apos;Alger, Oran, Constantine et de tout le pays sur la plateforme d&apos;excellence.
          </motion.p>
          <motion.div variants={fadeIn} className="pt-4">
            <Link href="/register">
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                Créer mon compte maintenant
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-beige-base border-t border-border-brand/40 py-12 px-6 mt-auto z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-text-light">
          <span className="font-serif text-xl font-bold text-green-dark">Agora</span>
          <span>© 2026 Agora. Tous droits réservés. Destiné exclusivement à la formation médicale des étudiants.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-mid transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-text-mid transition-colors">Sécurité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
