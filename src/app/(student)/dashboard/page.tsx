"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import { useAgoraStore } from "@/store/useAgoraStore";
import {
  Flame,
  Award,
  BookOpen,
  Trophy,
  Compass,
  CheckCircle2,
  ChevronRight,
  Zap,
  Activity,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  ChevronDown,
  User as UserIcon,
  Sparkles,
  ArrowUpRight,
  Layers,
  MapPin,
  Heart,
  Brain,
  Shield,
  Search,
  AlertCircle,
  HelpCircle,
  Play
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

import CourseIllustration, {
  CardiologyIllustration,
  NeurologyIllustration,
  PulmonologyIllustration,
  NephrologyIllustration,
  AnatomyIllustration,
  BiochemistryIllustration,
  PharmacologyIllustration,
  GastroenterologyIllustration
} from "@/components/illustrations/CourseIllustrations";

// Recharts theme colors matching Agora palette
const TEAL_COLORS = ["#0E7C7B", "#FF6B35", "#5DC8C6", "#0A3D3D", "#E0F2F2"];

// Data definitions
const performanceData = [
  { module: "Cardiologie", score: 85, avg: 72 },
  { module: "Pneumologie", score: 64, avg: 68 },
  { module: "Gastro", score: 92, avg: 75 },
  { module: "Endocrino", score: 78, avg: 70 },
  { module: "Infectiologie", score: 70, avg: 71 },
];

const weeklyActivity = [
  { day: "Lun", sessions: 2, questions: 12, hours: 0.8 },
  { day: "Mar", sessions: 3, questions: 18, hours: 1.2 },
  { day: "Mer", sessions: 1, questions: 8, hours: 0.5 },
  { day: "Jeu", sessions: 4, questions: 25, hours: 2.1 },
  { day: "Ven", sessions: 2, questions: 15, hours: 1.0 },
  { day: "Sam", sessions: 5, questions: 30, hours: 2.8 },
  { day: "Dim", sessions: 3, questions: 22, hours: 1.5 },
];

const subjectMasteryData = [
  {
    id: "cardiologie",
    name: "Cardiologie",
    icon: "❤️",
    progress: 92,
    accuracy: 88,
    confidence: "Élevé",
    questions: 145,
    time: "4h 12m",
    color: "#E8593C",
    accent: "#F5B4A8",
  },
  {
    id: "neurologie",
    name: "Neurologie",
    icon: "🧠",
    progress: 78,
    accuracy: 75,
    confidence: "Modéré",
    questions: 98,
    time: "2h 45m",
    color: "#7C5CBF",
    accent: "#C4B2E8",
  },
  {
    id: "pneumologie",
    name: "Pneumologie",
    icon: "🫁",
    progress: 64,
    accuracy: 62,
    confidence: "À renforcer",
    questions: 120,
    time: "3h 15m",
    color: "#0E7C7B",
    accent: "#5DC8C6",
  },
];

const timelineSteps = [
  { type: "Course", label: "Tronc Commun DCEM1", completed: true },
  { type: "Module", label: "Système Cardiovasculaire", completed: true },
  { type: "Chapter", label: "ECG Pathologiques", active: true },
  { type: "Lesson", label: "Syndrome Coronaire Aigu", completed: false },
  { type: "Exam", label: "Évaluation Finale Nationale", completed: false },
];

const achievements = [
  { id: "1", title: "Premier Pouls", desc: "A complété sa première leçon médicale", unlocked: true, date: "12 Juin 2026", icon: "❤️" },
  { id: "2", title: "Maître de l'ECG", desc: "A obtenu 100% au quiz d'infarctus", unlocked: true, date: "24 Juin 2026", icon: "⚡" },
  { id: "3", title: "Champion du Blitz", desc: "A remporté 5 victoires d'arène d'affilée", unlocked: true, date: "Hier", icon: "🏆" },
  { id: "4", title: "Interne d'Élite", desc: "Atteindre le top 5% de la faculté d'Alger", unlocked: false, requirement: "Top 5% Classement", icon: "🎓" },
  { id: "5", title: "Diagnostic Parfait", desc: "10 cas cliniques résolus sans erreur", unlocked: false, requirement: "10 victoires parfaites", icon: "🩺" },
];

const leaderboard = [
  { rank: 1, name: "Amine K.", points: 1240, avatar: "A", self: false },
  { rank: 2, name: "Sarah B.", points: 1100, avatar: "S", self: false },
  { rank: 42, name: "Yanis Meziani (Vous)", points: 840, avatar: "Y", self: true },
  { rank: 43, name: "Ryad M.", points: 820, avatar: "R", self: false },
];

const recentActivity = [
  { type: "Completed Lesson", text: "A terminé 'ECG diagnostique : signes d'infarctus'", time: "Il y a 2h", category: "lesson" },
  { type: "Reached Streak", text: "A atteint une série de 12 jours consécutifs !", time: "Ce matin", category: "streak" },
  { type: "Arena Victory", text: "Victoire dans l'Arène Blitz contre Ryad M. (+15 XP)", time: "Hier", category: "arena" },
  { type: "Completed Quiz", text: "A réussi le mini-test 'Chocs Cardiogéniques' à 90%", time: "Il y a 2 jours", category: "quiz" },
  { type: "Earned Badge", text: "A débloqué le badge 'Maître de l'ECG'", time: "Il y a 3 jours", category: "badge" },
];

const recommendations = [
  { title: "Sémiologie Neurologique", reason: "Basé sur votre intérêt pour la spécialité", duration: "25 min", type: "Cours interactif", tag: "Nouveau" },
  { title: "Insuffisance Cardiaque", reason: "Recommandé suite à vos erreurs récentes", duration: "12 min", type: "Fiches cliniques", tag: "Prioritaire" },
  { title: "Pharmacologie des Bêtabloquants", reason: "Inclus dans l'examen national de pharmacie", duration: "18 min", type: "Entraînement quiz", tag: "Populaire" },
];

export default function DashboardPage() {
  const { user } = useAgoraStore();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSpec, setSelectedSpec] = useState("cardiologie");
  const [hoveredMission, setHoveredMission] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <ECGBackground />

      {/* Floating animation keyframe style injection */}
      <style jsx global>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        .animate-subtle-float {
          animation: subtleFloat 8s ease-in-out infinite;
        }
        @keyframes softGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(14, 124, 123, 0.2)); }
          50% { filter: drop-shadow(0 0 10px rgba(14, 124, 123, 0.5)); }
        }
        .animate-soft-glow {
          animation: softGlow 3s ease-in-out infinite;
        }
      `}</style>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full text-left">
        {/* red-green-refactor architecture layout */}
        <div className="flex flex-col gap-8">
          
          {/* TOP SECTION: Hero Medical Journey & Today's Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Section 1 — Hero Medical Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 relative overflow-hidden p-8 rounded-3xl border border-teal/10 bg-gradient-to-br from-white-custom via-white-custom to-surface/40 shadow-xl shadow-teal/5 flex flex-col md:flex-row justify-between gap-6"
            >
              {/* Decorative subtle light rays */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-teal/10 border border-teal/20 text-teal flex items-center justify-center font-bold text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-text-light">
                        Commandement Agora
                      </h4>
                      <h1 className="font-display text-2xl font-bold text-text-dark">
                        Marhaban, {user?.name || "Candidat"}
                      </h1>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-[10px] uppercase font-mono tracking-wider font-semibold">
                      Spécialité Active : Cardiologie
                    </span>
                    <h2 className="text-lg font-bold text-text-dark font-display mt-2">
                      Chapitre 4 : Syndrome Coronaire Aigu
                    </h2>
                    <p className="text-xs text-text-light">
                      Prochaine étape : Signes d'infarctus sous-endocardique
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/lessons"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal text-white-custom text-xs font-semibold shadow-lg shadow-teal/20 hover:bg-teal-dark active:scale-[0.98] transition-all"
                  >
                    <Play className="h-3 w-3 fill-white-custom" />
                    Reprendre la cardiologie
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-text-light font-mono">
                    <Clock className="h-4 w-4 text-teal" />
                    <span>~ 3h 42m restants</span>
                  </div>
                </div>
              </div>

              {/* Progress Ring and Illustration */}
              <div className="flex flex-col items-center justify-center gap-4 md:w-56 text-center border-l border-teal/5 pl-0 md:pl-6">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  {/* Background Track */}
                  <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      className="stroke-teal/5"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      className="stroke-teal"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={314}
                      strokeDashoffset={314 - (314 * 63) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Floating Medical Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 animate-subtle-float">
                    <CardiologyIllustration className="w-16 h-16" />
                  </div>
                  
                  {/* Percentage label */}
                  <div className="absolute bottom-2 bg-teal-dark text-white-custom font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-teal-light/20 shadow">
                    63%
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-text-light uppercase tracking-wider">
                    Objectif National
                  </p>
                  <p className="text-xs font-bold text-text-dark">
                    Jalon : Externe Élite
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 3 — Today's Medical Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-teal/5 pb-3 mb-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-accent fill-accent" /> Mission Médicale
                  </h3>
                  <span className="text-[10px] font-mono text-text-light">
                    Durée estimée : ~ 45m
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { type: "Flashcards", text: "15 Cartes quotidiennes", completed: true },
                    { type: "Leçon", text: "Infarctus sous-endocardique", completed: false },
                    { type: "Quiz", text: "Pathologies coronaires (5 QCM)", completed: false },
                    { type: "Arène Blitz", text: "Match en direct", completed: false },
                    { type: "Révision", text: "Protocoles Pneumothorax", completed: false },
                  ].map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-surface/30 transition-all cursor-pointer group"
                      onMouseEnter={() => setHoveredMission(idx)}
                      onMouseLeave={() => setHoveredMission(null)}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`h-4.5 w-4.5 transition-all ${
                            task.completed ? "text-teal fill-teal/10" : "text-text-light/20 group-hover:text-teal/40"
                          }`}
                        />
                        <div>
                          <p className={`text-xs font-semibold ${task.completed ? "text-text-light line-through" : "text-text-dark"}`}>
                            {task.text}
                          </p>
                          <p className="text-[9px] font-mono text-text-light/70 uppercase">
                            {task.type}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`h-3 w-3 text-text-light/40 group-hover:text-teal transition-transform ${hoveredMission === idx ? "translate-x-1" : ""}`} />
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/lessons"
                className="mt-6 w-full py-3 px-4 rounded-xl bg-accent text-white-custom font-semibold text-xs text-center shadow-lg shadow-accent/15 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Démarrer la Session du Jour
              </Link>
            </motion.div>
          </div>

          {/* Section 2 — Quick Performance Chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-2xl border border-teal/10 bg-white-custom/40 backdrop-blur-md"
          >
            {[
              { label: "Série Active", value: `${user?.streak || 0} jours`, icon: "🔥", color: "text-accent" },
              { label: "Points cumulés", value: `${user?.points || 0} XP`, icon: "⭐", color: "text-teal" },
              { label: "Rang Faculté", value: "#42 / 1,280", icon: "🏆", color: "text-amber-500" },
              { label: "Heures d'Étude", value: "14,8 h", icon: "⏱", color: "text-teal-light" },
              { label: "Séries consécutives", value: "3 semaines", icon: "📅", color: "text-teal" },
              { label: "Objectif Hebdo", value: "85%", icon: "🎯", color: "text-accent" },
            ].map((chip, idx) => (
              <div key={idx} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white-custom border border-teal/5 shadow-sm hover:border-teal/10 transition-all flex-1 min-w-[150px]">
                <span className="text-lg">{chip.icon}</span>
                <div>
                  <p className="text-[9px] font-mono text-text-light uppercase tracking-wider">
                    {chip.label}
                  </p>
                  <p className="text-xs font-bold text-text-dark">
                    {chip.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* MIDDLE ROW: Roadmap, Continue Watching & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Roadmaps & Timeline (Section 4 & Section 5) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section 4 — Continue Learning (Netflix style) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-teal/5 pb-2">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark">
                    Reprendre l'apprentissage
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      course: "Cardiologie",
                      module: "Pathologie Coronaire",
                      chapter: "Infarctus aigu du myocarde",
                      lesson: "Signes d'ischémie ECG",
                      progress: 75,
                      illustration: "cardiologie",
                      bgColor: "from-[#E8593C]/10 to-[#E8593C]/5",
                      borderColor: "border-[#E8593C]/10",
                      textColor: "text-[#E8593C]"
                    },
                    {
                      course: "Pneumologie",
                      module: "Pleurésie & Drains",
                      chapter: "Urgences pleurales",
                      lesson: "Drainage thoracique",
                      progress: 40,
                      illustration: "pneumologie",
                      bgColor: "from-teal/10 to-teal/5",
                      borderColor: "border-teal/10",
                      textColor: "text-teal"
                    }
                  ].map((c, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border ${c.borderColor} bg-gradient-to-br ${c.bgColor} hover:shadow-md transition-all flex justify-between gap-4 relative overflow-hidden`}
                    >
                      <div className="flex-1 flex flex-col justify-between z-10">
                        <div>
                          <span className={`text-[9px] font-mono uppercase font-bold tracking-wider ${c.textColor}`}>
                            {c.course}
                          </span>
                          <h4 className="text-sm font-bold text-text-dark font-display mt-1">
                            {c.lesson}
                          </h4>
                          <p className="text-[10px] text-text-light mt-0.5">
                            {c.module} • {c.chapter}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[9px] font-mono text-text-light mb-1">
                            <span>Progression</span>
                            <span>{c.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                            <div className="h-full bg-teal transition-all duration-500" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-16 h-16 shrink-0 opacity-80 animate-subtle-float">
                        <CourseIllustration subjectId={c.illustration} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5 — Medical Journey Timeline */}
              <div className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5">
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-3 mb-6">
                  Feuille de Route Médicale
                </h3>
                
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
                  {/* Connecting line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-teal/10 -translate-y-1/2 hidden md:block" />
                  
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full md:w-auto">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                          step.completed
                            ? "bg-teal border-teal text-white-custom shadow-md animate-soft-glow"
                            : step.active
                            ? "bg-white-custom border-accent text-accent ring-4 ring-accent/15"
                            : "bg-surface border-teal/10 text-text-light opacity-50"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="text-left md:text-center">
                        <p className="text-[9px] font-mono text-text-light uppercase tracking-wider">
                          {step.type}
                        </p>
                        <p className={`text-xs font-bold ${step.active ? "text-accent" : "text-text-dark"}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Section 7 — AI Clinical Insights & Mentor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-3xl border border-teal/15 bg-gradient-to-b from-teal/5 to-surface/30 shadow-xl shadow-teal/5 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-teal/10 pb-3">
                  <div className="h-8 w-8 rounded-full bg-teal/10 text-teal flex items-center justify-center">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark">
                      Mentor Agora IA
                    </h4>
                    <p className="text-[9px] text-text-light">Cliniquement entraîné</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white-custom border border-teal/5 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8593C]">
                      <TrendingUp className="h-4 w-4" /> Diagnostic ECG en hausse
                    </div>
                    <p className="text-xs text-text-light leading-relaxed">
                      Votre précision sur l'infarctus a progressé de <strong className="text-text-dark font-mono">12%</strong> cette semaine suite à votre série de quiz parfaits.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white-custom border border-error/15 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-error">
                      <AlertTriangle className="h-4 w-4" /> Point faible identifié
                    </div>
                    <p className="text-xs text-text-light leading-relaxed">
                      Les protocoles de traitement du Pneumothorax restent en deçà de votre moyenne clinique générale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-teal/5 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-light">Recommandation</span>
                  <span className="font-bold text-teal font-mono">+6% Précision</span>
                </div>
                <div className="p-3 rounded-xl bg-teal-dark text-white-custom text-xs font-medium flex items-center justify-between">
                  <span>15 minutes de révision ciblée</span>
                  <Link href="/lessons" className="text-accent hover:underline flex items-center gap-0.5">
                    Lancer <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ANALYTICS BLOCK: Section 6 — Learning Analytics & Section 9 — Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5 space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-teal/5 pb-4 gap-4">
              <div>
                <h3 className="text-sm uppercase font-mono tracking-wider font-bold text-teal-dark flex items-center gap-1.5">
                  <BarChart3 className="h-4.5 w-4.5" /> Analyses Diagnostiques Intégrées
                </h3>
                <p className="text-xs text-text-light mt-1">
                  Suivi en temps réel de votre progression cognitive et de votre cadence de travail.
                </p>
              </div>
              
              <div className="flex bg-surface/50 border border-teal/10 p-1 rounded-full text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeTab === "all" ? "bg-teal text-white-custom" : "text-text-light hover:text-teal"
                  }`}
                >
                  Tous les modules
                </button>
                <button
                  onClick={() => setActiveTab("weekly")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeTab === "weekly" ? "bg-teal text-white-custom" : "text-text-light hover:text-teal"
                  }`}
                >
                  Activité Hebdo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left & Middle: Charts */}
              <div className="lg:col-span-2 space-y-8">
                {activeTab === "all" ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-text-light">
                      Performance par module vs Moyenne Nationale
                    </h4>
                    <div className="h-72 w-full">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="module" tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                            <YAxis tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                            <Bar dataKey="score" fill="#0E7C7B" radius={[4, 4, 0, 0]} name="Votre précision" />
                            <Bar dataKey="avg" fill="rgba(14, 124, 123, 0.15)" radius={[4, 4, 0, 0]} name="Précision moyenne" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-text-light">
                      Volume d'entraînement & Heures d'étude
                    </h4>
                    <div className="h-72 w-full">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                            <YAxis tick={{ fontSize: 10, fill: "var(--text-light)" }} />
                            <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid var(--border)" }} />
                            <Area type="monotone" dataKey="questions" stroke="var(--accent)" fillOpacity={1} fill="url(#colorQuestions)" name="Questions résolues" />
                            <Line type="monotone" dataKey="hours" stroke="var(--teal)" strokeWidth={2} name="Heures" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Metrics & Heatmap Calendar */}
              <div className="space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-text-light">
                  Statistiques Vitales
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-teal/5 bg-surface/20">
                    <span className="text-[10px] font-mono text-text-light">PRÉCISION MOYENNE</span>
                    <p className="text-xl font-bold text-teal-dark mt-1">79.8%</p>
                  </div>
                  <div className="p-4 rounded-xl border border-teal/5 bg-surface/20">
                    <span className="text-[10px] font-mono text-text-light">TEMPS DE RÉPONSE</span>
                    <p className="text-xl font-bold text-accent mt-1">11.2s</p>
                  </div>
                  <div className="p-4 rounded-xl border border-teal/5 bg-surface/20">
                    <span className="text-[10px] font-mono text-text-light">RANG DE VITESSE</span>
                    <p className="text-xl font-bold text-text-dark mt-1">Top 3%</p>
                  </div>
                  <div className="p-4 rounded-xl border border-teal/5 bg-surface/20">
                    <span className="text-[10px] font-mono text-text-light">RETENTION CLÉ</span>
                    <p className="text-xl font-bold text-text-dark mt-1">94%</p>
                  </div>
                </div>

                {/* Heatmap-like weekly overview */}
                <div className="border-t border-teal/5 pt-4">
                  <p className="text-[10px] font-mono text-text-light uppercase tracking-wider mb-2">
                    Heatmap d'activité mensuelle
                  </p>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, idx) => {
                      const intensities = ["bg-surface", "bg-teal/20", "bg-teal/50", "bg-teal", "bg-teal-dark"];
                      const bg = intensities[Math.floor(Math.sin(idx) * 2.5 + 2.5)] || "bg-surface";
                      return (
                        <div
                          key={idx}
                          className={`h-3.5 w-3.5 rounded-sm ${bg} hover:ring-2 hover:ring-teal/30 transition-all cursor-pointer`}
                          title={`Intensité d'étude: niveau ${idx % 5}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SUBJECT MASTERY SECTION: Section 8 — Subject Mastery */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-2">
              Maîtrise des matières
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjectMasteryData.map((sub, idx) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSpec(sub.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    selectedSpec === sub.id
                      ? "border-teal bg-white-custom shadow-lg ring-2 ring-teal/5"
                      : "border-teal/10 bg-white-custom/60 hover:bg-white-custom"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sub.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-text-dark">{sub.name}</h4>
                        <span className="text-[9px] font-mono text-text-light">Confiance: {sub.confidence}</span>
                      </div>
                    </div>
                    
                    {/* Mastery Circle */}
                    <div className="relative h-10 w-10 flex items-center justify-center font-mono text-[9px] font-bold text-teal">
                      <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                        <circle cx="20" cy="20" r="16" className="stroke-teal/10" strokeWidth="3.5" fill="transparent" />
                        <circle cx="20" cy="20" r="16" className="stroke-teal" strokeWidth="3.5" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - sub.progress} strokeLinecap="round" />
                      </svg>
                      {sub.progress}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-text-light font-mono border-t border-teal/5 pt-3">
                    <div>
                      <span>Précision :</span>
                      <p className="font-bold text-text-dark">{sub.accuracy}%</p>
                    </div>
                    <div>
                      <span>Questions :</span>
                      <p className="font-bold text-text-dark">{sub.questions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOWER ROW: Achievements, Leaderboard, Timeline feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Section 10 — Achievements */}
            <div className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-3 mb-4 flex items-center justify-between">
                  <span>Galerie des Badges</span>
                  <Trophy className="h-4 w-4 text-teal" />
                </h3>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                        ach.unlocked
                          ? "bg-teal/10 border-teal text-teal shadow-sm"
                          : "bg-surface/30 border-teal/5 text-text-light/30 filter grayscale"
                      }`}
                      title={ach.title}
                    >
                      {ach.icon}
                    </div>
                  ))}
                </div>
                
                <div className="p-4 rounded-xl border border-teal/5 bg-surface/25 space-y-1">
                  <span className="text-[9px] font-mono text-text-light uppercase tracking-wider">Prochain défi</span>
                  <p className="text-xs font-bold text-text-dark">Interne d'Élite</p>
                  <p className="text-[10px] text-text-light">
                    Atteignez le top 5% des scores de la promotion.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 11 — Leaderboard Preview */}
            <div className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-3 mb-4">
                  Classement Faculté
                </h3>
                
                <div className="space-y-3">
                  {leaderboard.map((student, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-xl ${
                        student.self ? "bg-teal/10 border border-teal/10 font-bold" : "hover:bg-surface/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-text-light w-5">#{student.rank}</span>
                        <div className="h-6 w-6 rounded-full bg-teal/20 text-teal-dark flex items-center justify-center text-[10px] font-bold">
                          {student.avatar}
                        </div>
                        <span className="text-xs text-text-dark">{student.name}</span>
                      </div>
                      <span className="text-xs font-mono text-text-light">{student.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link href="/friends" className="mt-4 text-xs text-teal hover:underline flex items-center gap-1">
                Voir tous les camarades <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Section 12 — Recent Activity Timeline */}
            <div className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-3 mb-4">
                  Activité Récente
                </h3>
                
                <div className="space-y-4">
                  {recentActivity.map((act, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-teal mt-1.5" />
                        {idx < recentActivity.length - 1 && <div className="w-0.5 bg-teal/10 flex-grow" />}
                      </div>
                      <div>
                        <p className="text-xs text-text-dark leading-normal">{act.text}</p>
                        <span className="text-[9px] text-text-light font-mono">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 13 — Continue Exploring */}
          <div className="p-6 rounded-3xl border border-teal/10 bg-white-custom shadow-xl shadow-teal/5">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-teal-dark border-b border-teal/5 pb-3 mb-4">
              Explorer de nouveaux sujets
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-teal/5 bg-white-custom hover:border-teal/20 hover:shadow-md transition-all flex flex-col justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-surface/50 text-teal-dark text-[8px] uppercase font-mono tracking-wider font-semibold">
                      {rec.tag}
                    </span>
                    <h4 className="text-sm font-bold text-text-dark font-display mt-2">{rec.title}</h4>
                    <p className="text-xs text-text-light mt-1">{rec.reason}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-text-light border-t border-teal/5 pt-3">
                    <span>{rec.type}</span>
                    <span className="font-mono">{rec.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
