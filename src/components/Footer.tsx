"use client";

import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-white-custom/80 backdrop-blur-md py-12 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dark text-white-custom">
                <Activity className="h-4.5 w-4.5 text-accent animate-pulse" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-teal-dark">
                Agora
              </span>
            </Link>
            <p className="text-xs text-text-light max-w-sm leading-relaxed">
              Agora est une plateforme d'éducation médicale premium conçue exclusivement pour les étudiants en médecine algériens préparant leurs examens de modules, cycles cliniques et le concours national du Résidanat.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-teal-dark mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/lessons" className="text-text-light hover:text-teal transition-colors">
                  Leçons Interactives
                </Link>
              </li>
              <li>
                <Link href="/medquest" className="text-text-light hover:text-teal transition-colors">
                  Arène MedQuest
                </Link>
              </li>
              <li>
                <Link href="/statistics" className="text-text-light hover:text-teal transition-colors">
                  Analyses Détaillées
                </Link>
              </li>
            </ul>
          </div>

          {/* Curriculum Focus */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-teal-dark mb-4">
              Programme
            </h4>
            <ul className="space-y-2 text-xs text-text-light">
              <li>Cardiologie / Pneumologie</li>
              <li>Gastro-entérologie</li>
              <li>Endocrinologie</li>
              <li>Préparation au Résidanat</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-teal/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-text-light">
            © {new Date().getFullYear()} Plateforme Agora. Tous droits réservés. Conçu pour les candidats au Résidanat algérien.
          </p>
          <div className="flex gap-6 text-[10px] text-text-light">
            <span>Avertissement : Plateforme éducative. Veuillez consulter les recommandations officielles pour la prise en charge des patients.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
