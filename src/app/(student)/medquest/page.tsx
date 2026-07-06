"use client";

import React, { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import ECGBackground from "@/components/ECGBackground";
import { useAgoraStore } from "@/store/useAgoraStore";
import { useRouter } from "next/navigation";
import { Compass, Zap, Users, ArrowRight, X, Settings, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LESSONS_DATA } from "../lessons/mockLessonsData";

type GameMode = "free" | "blitz" | "room" | null;

export default function MedQuestPage() {
  const router = useRouter();
  const { createRoom, joinRoom } = useAgoraStore();
  const [roomCodeInput, setRoomCodeInput] = useState("");

  // Config Modal State
  const [activeMode, setActiveMode] = useState<GameMode>(null);
  const [level, setLevel] = useState<"Facile" | "Moyen" | "Difficile">("Moyen");
  const [selectedSubjectId, setSelectedSubjectId] = useState(LESSONS_DATA[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState("all");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questionType, setQuestionType] = useState<"QCM" | "QCS" | "Cas clinique">("QCM");

  // Get active subject lessons dynamically
  const activeSubject = useMemo(() => {
    return LESSONS_DATA.find((s) => s.id === selectedSubjectId) || LESSONS_DATA[0];
  }, [selectedSubjectId]);

  const activeLessons = useMemo(() => {
    return activeSubject.units.flatMap((u) => u.lessons);
  }, [activeSubject]);

  const handleCreateRoom = () => {
    createRoom();
    router.push("/medquest/room");
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput) return;
    joinRoom(roomCodeInput);
    router.push("/medquest/room");
  };

  const openSettings = (mode: "free" | "blitz" | "room") => {
    setActiveMode(mode);
  };

  const closeSettings = () => {
    setActiveMode(null);
  };

  const handleStartSession = () => {
    if (!activeMode) return;
    
    // Construct query parameters
    const queryParams = new URLSearchParams({
      level,
      subject: selectedSubjectId,
      lesson: selectedLessonId,
      count: questionCount.toString(),
      type: questionType,
    }).toString();

    if (activeMode === "room") {
      createRoom();
      router.push(`/medquest/room?${queryParams}`);
    } else {
      router.push(`/medquest/${activeMode}?${queryParams}`);
    }
    setActiveMode(null);
  };

  return (
    <>
      <ECGBackground />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="font-display text-4xl font-extrabold text-text-dark leading-tight">
            Arènes MedQuest
          </h1>
          <p className="text-sm text-text-light">
            Entraînez votre intuition diagnostique. Affrontez vos pairs, défiez le chrono ou pratiquez à votre rythme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Free Practice */}
          <div className="p-8 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm flex flex-col justify-between hover:border-teal/20 transition-all">
            <div>
              <div className="mb-4 inline-flex p-3 rounded-lg bg-surface/50">
                <Compass className="h-6 w-6 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">Entraînement libre</h3>
              <p className="text-xs text-text-light leading-relaxed mb-6">
                Des questions ciblées, sans chronomètre, pour renforcer la théorie diagnostique sans stress. Idéal pour consolider les bases.
              </p>
            </div>
            <button
              onClick={() => openSettings("free")}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-teal text-white-custom text-xs font-semibold hover:bg-teal-dark transition-colors cursor-pointer"
            >
              Configurer & Commencer <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2: Blitz Arena */}
          <div className="relative p-8 rounded-2xl border border-accent bg-white-custom shadow-lg flex flex-col justify-between scale-[1.02] overflow-hidden">
            {/* Pulsing indicator */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 animate-pulse" />

            <div>
              <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10">
                <Zap className="h-6 w-6 text-accent fill-accent animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">Arène Blitz</h3>
              <p className="text-xs text-text-light leading-relaxed mb-6">
                Défi extrême de rapidité. Les animations cardiaques s'accélèrent à mesure que le temps diminue. Parfait pour simuler le Résidanat.
              </p>
            </div>
            <button
              onClick={() => openSettings("blitz")}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-accent text-white-custom text-xs font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/10 cursor-pointer"
            >
              Configurer & Entrer <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 3: Multiplayer Room */}
          <div className="p-8 rounded-2xl border border-teal/10 bg-white-custom/60 backdrop-blur-md shadow-sm flex flex-col justify-between hover:border-teal/20 transition-all">
            <div>
              <div className="mb-4 inline-flex p-3 rounded-lg bg-surface/50">
                <Users className="h-6 w-6 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">Salon multijoueur</h3>
              <p className="text-xs text-text-light leading-relaxed mb-6">
                Défiez jusqu'à 10 collègues dans un salon en direct. Partagez les codes de salle, discutez et comparez vos scores diagnostiques en temps réel.
              </p>
            </div>

            <div className="space-y-4">
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input
                  type="text"
                  placeholder="CODE DU SALON"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                  className="w-full px-4 py-2 border border-teal/15 bg-white-custom rounded-lg text-xs font-bold text-text-dark placeholder-text-light/50 outline-none uppercase text-center"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal hover:bg-teal-dark text-white-custom text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Rejoindre
                </button>
              </form>

              <button
                onClick={() => openSettings("room")}
                className="w-full py-3 rounded-full border border-teal/20 hover:border-teal/40 hover:bg-surface/20 text-teal text-xs font-semibold transition-all cursor-pointer"
              >
                Créer un salon configuré
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Configuration Modal */}
      {activeMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-custom/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-teal/10 bg-white-custom p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-teal/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal animate-spin-slow" />
                <h2 className="font-display text-xl font-bold text-text-dark">
                  Configuration de la session
                </h2>
              </div>
              <button 
                onClick={closeSettings}
                className="p-1.5 rounded-full hover:bg-surface text-text-light hover:text-text-dark transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              
              {/* Level Selector */}
              <div className="space-y-2">
                <label className="font-bold text-text-dark uppercase tracking-wider">Niveau de difficulté</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Facile", "Moyen", "Difficile"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        level === l 
                          ? "border-teal bg-teal/5 text-teal-dark" 
                          : "border-teal/10 hover:bg-surface bg-white text-text-light"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Selector */}
              <div className="space-y-2">
                <label className="font-bold text-text-dark uppercase tracking-wider">Matière / Spécialité</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    setSelectedLessonId("all"); // Reset selected lesson
                  }}
                  className="w-full p-3 rounded-xl border border-teal/10 bg-white text-text-dark outline-none focus:border-teal/30 font-semibold"
                >
                  {LESSONS_DATA.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Selector */}
              <div className="space-y-2">
                <label className="font-bold text-text-dark uppercase tracking-wider">Leçon</label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-teal/10 bg-white text-text-dark outline-none focus:border-teal/30 font-semibold"
                >
                  <option value="all">Toutes les leçons</option>
                  {activeLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Count & Question Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Count */}
                <div className="space-y-2">
                  <label className="font-bold text-text-dark uppercase tracking-wider">Nombre de questions</label>
                  <div className="grid grid-cols-5 gap-1">
                    {[5, 10, 15, 20, 30].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuestionCount(count)}
                        className={`py-2 px-1 rounded-lg border text-center font-mono font-bold transition-all cursor-pointer ${
                          questionCount === count
                            ? "border-teal bg-teal/5 text-teal-dark"
                            : "border-teal/10 bg-white hover:bg-surface text-text-light"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="font-bold text-text-dark uppercase tracking-wider">Format des questions</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["QCM", "QCS", "Cas clinique"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQuestionType(type)}
                        className={`py-2 px-1 rounded-lg border text-center font-bold text-[10px] transition-all cursor-pointer ${
                          questionType === type
                            ? "border-teal bg-teal/5 text-teal-dark"
                            : "border-teal/10 bg-white hover:bg-surface text-text-light"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 pt-4 border-t border-teal/10">
              <button
                onClick={closeSettings}
                className="flex-1 py-3 rounded-full border border-teal/15 bg-white-custom hover:bg-surface/50 text-text-light font-semibold text-xs transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleStartSession}
                className="flex-1 py-3 rounded-full bg-teal hover:bg-teal-dark text-white-custom font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="h-4 w-4" /> Lancer la session
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
