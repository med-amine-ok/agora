"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import { container } from "@/infrastructure/di/container";
import { ChevronLeft, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

export default function BlitzModeSetup() {
  const router = useRouter();
  const { startSession } = useQuizStore();

  const [subject, setSubject] = useState("Cardiologie");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["Cardiologie", "Anatomie", "Biochimie", "Neurologie"];

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      // In Blitz mode, we load up to 30 random questions for the chosen subject
      const questions = await container.questionRepository.getQuestionsForSubject(subject, 30);
      
      if (questions.length === 0) {
        setError("Aucune question disponible pour ce module.");
        setLoading(false);
        return;
      }

      startSession(questions, 'blitz');
      router.push("/medquest/blitz/quiz");
    } catch (err) {
      setError("Erreur lors de la récupération des questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-[680px] mx-auto space-y-8 pb-16 select-none">
        <div className="space-y-2">
          <Link
            href="/medquest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light hover:text-green-mid"
          >
            <ChevronLeft className="w-4 h-4" /> Retour au hub
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-green-dark">
            Mode Blitz
          </h1>
          <p className="text-text-mid text-sm">
            Mesurez vos réflexes cliniques face au chronomètre dans ce défi survie.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-error-brand p-4 rounded-sm border border-red-200 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-8 border-border-brand/40 bg-gradient-to-b from-beige-light to-gold-brand/5 space-y-6">
          
          {/* Rules Panel */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-sm space-y-2.5">
            <h3 className="font-bold text-green-dark text-sm flex items-center gap-2 font-sans">
              <Zap className="w-4.5 h-4.5 text-gold-brand" /> Règles du Défi
            </h3>
            <ul className="text-xs text-text-mid list-disc pl-5 space-y-1.5">
              <li>Vous démarrez avec un crédit de <strong className="text-green-dark">30 secondes</strong>.</li>
              <li>Chaque bonne réponse ajoute <strong className="text-green-mid">+5s</strong> à votre horloge.</li>
              <li>Chaque mauvaise réponse vous pénalise de <strong className="text-error-brand">−5s</strong>.</li>
              <li>Les explications détaillées sont désactivées durant la partie.</li>
              <li>La session prend fin dès que l'horloge affiche 0.</li>
            </ul>
          </div>

          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-dark">Sélectionner la matière</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-border-brand rounded-sm bg-white text-text-dark text-sm focus:outline-none focus:border-green-mid"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Link href="/medquest" className="flex-1">
              <Button variant="outline" className="w-full py-3.5">
                Annuler
              </Button>
            </Link>
            <Button 
              variant="accent"
              onClick={handleStart} 
              disabled={loading} 
              className="flex-1 py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Préparation..."
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" /> Lancer le Blitz
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </SidebarLayout>
  );
}
