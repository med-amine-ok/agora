"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { useQuizStore } from "@/presentation/store/useQuizStore";
import { container } from "@/infrastructure/di/container";
import { ChevronLeft, Play, AlertCircle } from "lucide-react";

export default function FreeModeSetup() {
  const router = useRouter();
  const { startSession } = useQuizStore();

  const [subject, setSubject] = useState("Cardiologie");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["Cardiologie", "Anatomie", "Biochimie", "Neurologie"];

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      // Call start free mode use case from DI container
      const session = await container.startFreeModeSession.execute({
        subjectId: subject,
        questionCount,
        difficulty
      });

      if (session.questions.length === 0) {
        setError("Aucune question disponible pour ces filtres. Veuillez élargir vos critères.");
        setLoading(false);
        return;
      }

      // Initialize quiz state in store
      startSession(session.questions, 'free');
      router.push("/medquest/free/quiz");
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
            Mode Libre
          </h1>
          <p className="text-text-mid text-sm">
            Configurez votre séance de révision sur mesure, sans limite de temps.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-error-brand p-4 rounded-sm border border-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-8 border-border-brand/40 space-y-6">
          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-dark">Sélectionner un module</label>
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

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-dark">Difficulté</label>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 border rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    difficulty === diff
                      ? "bg-green-mid/10 border-green-mid text-green-dark shadow-sm font-bold"
                      : "border-border-brand text-text-mid bg-white hover:bg-beige-base/40"
                  }`}
                >
                  {diff === "easy" ? "Facile" : diff === "medium" ? "Moyen" : "Difficile"}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-text-dark">Nombre de QCMs</label>
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 20, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 border rounded-sm text-sm font-mono font-bold transition-all cursor-pointer ${
                    questionCount === num
                      ? "bg-green-mid/10 border-green-mid text-green-dark shadow-sm"
                      : "border-border-brand text-text-mid bg-white hover:bg-beige-base/40"
                  }`}
                >
                  {num} QCM
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleStart} 
            disabled={loading} 
            className="w-full py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Chargement des questions..."
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Commencer la séance
              </>
            )}
          </Button>
        </Card>
      </div>
    </SidebarLayout>
  );
}
