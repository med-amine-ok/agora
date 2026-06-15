"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SidebarLayout from "@/presentation/components/layout/SidebarLayout";
import Card from "@/presentation/components/ui/Card";
import Button from "@/presentation/components/ui/Button";
import { SUBJECTS_DATA } from "../page";
import { ChevronRight, ArrowLeft, ChevronDown, CheckCircle, Circle, BookOpen } from "lucide-react";
import { MedicalIconMap } from "@/presentation/components/icons/MedicalIcons";

interface Module {
  id: string;
  title: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  completed: boolean;
}

interface Unit {
  id: string;
  title: string;
  modules: Module[];
}

const SYLLABUS: Record<string, Unit[]> = {
  cardiologie: [
    {
      id: "u1",
      title: "Unité 1 : Insuffisances & Myocardiopathies",
      modules: [
        { id: "insuffisance-cardiaque", title: "Insuffisance Cardiaque à fraction d'éjection altérée", difficulty: "Moyen", completed: true },
        { id: "cardiomyopathie-dilatee", title: "Cardiomyopathie Dilatée primitive", difficulty: "Difficile", completed: false },
        { id: "insuffisance-mitrale", title: "Insuffisance Mitrale chronique", difficulty: "Moyen", completed: false }
      ]
    },
    {
      id: "u2",
      title: "Unité 2 : Coronaropathies & Syndromes Coronariens",
      modules: [
        { id: "infarctus-myocarde", title: "Infarctus du Myocarde - SCA ST+ (Phase aiguë)", difficulty: "Facile", completed: true },
        { id: "angor-stable", title: "Angine de poitrine (Angor stable)", difficulty: "Moyen", completed: false }
      ]
    }
  ],
  anatomie: [
    {
      id: "u1",
      title: "Unité 1 : Anatomie Inguinale & Abdominale",
      modules: [
        { id: "canal-inguinal", title: "Le Canal Inguinal et hernies de l'aine", difficulty: "Moyen", completed: true },
        { id: "peritoine", title: "Le Péritoine et cavités péritonéales", difficulty: "Difficile", completed: false }
      ]
    }
  ],
  biochimie: [
    {
      id: "u1",
      title: "Unité 1 : Métabolisme des Glucides",
      modules: [
        { id: "glycolyse", title: "La Glycolyse et régulation enzymatique", difficulty: "Moyen", completed: true },
        { id: "cycle-krebs", title: "Le Cycle de Krebs (Cycle de l'acide citrique)", difficulty: "Difficile", completed: false }
      ]
    }
  ],
  neurologie: [
    {
      id: "u1",
      title: "Unité 1 : Gestes Pratiques en Neurologie",
      modules: [
        { id: "ponction-lombaire", title: "Technique de la Ponction Lombaire et interprétation", difficulty: "Facile", completed: true }
      ]
    }
  ]
};

export default function SubjectLessons() {
  const params = useParams();
  const subjectId = (params?.subjectId as string) || "cardiologie";

  // Find subject details
  const subject = SUBJECTS_DATA.find((s) => s.id === subjectId) || {
    id: subjectId,
    name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
    progress: 0,
    color: "#1A3550",
    difficulty: "Moyen" as const,
    tint: "default" as const
  };

  // Get syllabus for this subject, fall back to basic structure if empty
  const units = SYLLABUS[subjectId] || [
    {
      id: "u-fallback",
      title: "Unité 1 : Modules d'Apprentissage Cliniques",
      modules: [
        { id: "cours-introductif", title: `Cours Fondamental de ${subject.name}`, difficulty: "Facile" as const, completed: false },
        { id: "cas-clinique", title: "Étude de cas cliniques et diagnostics", difficulty: "Moyen" as const, completed: false }
      ]
    }
  ];

  // Accordion active state (default open first one)
  const [openUnits, setOpenUnits] = useState<Record<string, boolean>>({
    [units[0]?.id || ""]: true
  });

  const toggleUnit = (id: string) => {
    setOpenUnits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const IconComponent = MedicalIconMap[subject.name] || BookOpen;

  return (
    <SidebarLayout>
      <div className="space-y-8 pb-16">
        {/* Breadcrumb & Back */}
        <div className="space-y-3">
          <Link href="/lessons" className="inline-flex items-center gap-2 text-text-light hover:text-green-mid transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Retour aux modules
          </Link>
          <div className="text-xs text-text-light font-mono flex items-center gap-1.5 pt-1">
            <span>Leçons</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-green-mid font-semibold">{subject.name}</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex items-center justify-between gap-4 border-b border-border-brand/40 pb-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-2.5 bg-green-dark/5 rounded-sm border border-green-light/10 select-none inline-flex" style={{ color: subject.color }}>
              <IconComponent size={32} />
            </span>
            <div>
              <h1 className="font-serif text-3xl font-bold text-green-dark">{subject.name}</h1>
              <p className="text-text-mid text-sm mt-0.5">
                Progression du module : <span className="font-semibold text-green-mid font-mono">{subject.progress}% complet</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar inside Subject Header */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
          />
        </div>

        {/* Unit Accordion List */}
        <div className="space-y-4">
          {units.map((unit) => {
            const isOpen = !!openUnits[unit.id];
            return (
              <Card key={unit.id} className="p-0 overflow-hidden border-border-brand/40">
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleUnit(unit.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-beige-base/40 hover:bg-beige-base/90 transition-colors cursor-pointer select-none border-b border-border-brand/35"
                >
                  <h3 className="font-bold text-green-dark font-sans text-base sm:text-lg">
                    {unit.title}
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-green-mid transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="divide-y divide-border-brand/30">
                    {unit.modules.map((mod) => (
                      <div
                        key={mod.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-beige-base/20 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-4">
                          {mod.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-light shrink-0 fill-green-dark/5" />
                          ) : (
                            <Circle className="w-5 h-5 text-text-light shrink-0" />
                          )}
                          <Link
                            href={`/lessons/${subjectId}/${mod.id}`}
                            className="text-sm font-semibold hover:text-green-mid hover:underline text-text-dark truncate block"
                          >
                            {mod.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            mod.difficulty === "Difficile"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : mod.difficulty === "Moyen"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            {mod.difficulty}
                          </span>
                          <Link href={`/lessons/${subjectId}/${mod.id}`}>
                            <Button variant="outline" size="sm" className="hidden sm:inline-flex py-1 px-3 text-xs">
                              Lire
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
