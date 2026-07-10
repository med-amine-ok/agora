"use client";

import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import Link from "next/link";

interface ModuleCardProps {
  id: string;
  name: string;
  focus: string;
  progress: number;
}

export default function ModuleCard({ id, name, focus, progress }: ModuleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  // SVG circular progress parameters
  const radius = 32;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-[20px] border border-teal/10 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left & Center */}
        <Link href={`/lessons/${id}`} className="flex flex-1 items-center gap-5 cursor-pointer group">
          {/* Anatomical Illustration Container */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal/5 border border-teal/10 group-hover:scale-105 transition-transform duration-300">
            <Heart className="h-10 w-10 text-teal fill-teal/10 animate-pulse" style={{ animationDuration: "3s" }} />
          </div>

          <div className="space-y-1">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-teal">
              FONDAMENTAL
            </span>
            <h2 className="font-display text-2xl font-bold text-text-dark group-hover:text-teal transition-colors">
              {name}
            </h2>
            <p className="font-sans text-sm text-text-light leading-relaxed">
              {focus}
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-6 border-t border-teal/5 pt-4 sm:border-t-0 sm:pt-0 shrink-0">
          
          {/* Circular Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative h-[72px] w-[72px]">
              <svg className="h-full w-full -rotate-90">
                {/* Track */}
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-[#E6F0EE]"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Fill */}
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-teal transition-all duration-500"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-sm font-bold text-text-dark">{progress}%</span>
              </div>
            </div>
            <span className="font-sans text-[13px] font-semibold text-text-light">
              complété
            </span>
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => setIsFavorited(!isFavorited)}
            className="rounded-full p-2.5 hover:bg-surface border border-transparent hover:border-teal/10 transition-all text-text-light hover:text-teal"
            aria-label="Ajouter aux favoris"
          >
            <Star className={`h-5 w-5 ${isFavorited ? "fill-teal text-teal" : ""}`} />
          </button>

        </div>

      </div>
    </div>
  );
}
