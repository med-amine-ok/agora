"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Brain,
  ShieldAlert,
  HeartHandshake,
  Eye,
} from "lucide-react";
import { Chapter } from "@/types/lesson";
import QuickQCMChip from "./QuickQCMChip";

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const progressPercent = Math.round(
    (chapter.completedLessons / chapter.lessonCount) * 100,
  );

  // Return a beautiful SVG icon depending on the chapter title
  const getAnatomicalIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cœur") || t.includes("cardio")) {
      return (
        <Activity
          className="h-10 w-10 text-teal animate-pulse"
          style={{ animationDuration: "2.5s" }}
        />
      );
    }
    if (t.includes("circulation")) {
      return <HeartHandshake className="h-10 w-10 text-teal" />;
    }
    if (t.includes("ecg") || t.includes("lecture")) {
      return <Activity className="h-10 w-10 text-teal" />;
    }
    if (
      t.includes("neurologie") ||
      t.includes("cerveau") ||
      t.includes("ecg") === false
    ) {
      return <Brain className="h-10 w-10 text-teal" />;
    }
    return <Brain className="h-10 w-10 text-teal" />;
  };

  const cardContent = (
    <div
      className={`relative flex flex-col h-full bg-white rounded-xl border border-teal/10 p-5 shadow-sm transition-all duration-300 ${chapter.isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:border-teal/20 cursor-pointer"}`}
    >
      {/* Top Illustration Area */}
      <div className="relative flex h-24 items-center justify-center rounded-lg bg-surface/50 border border-teal/5 mb-4 overflow-hidden">
        {chapter.imageUrl ? (
          <img 
            src={chapter.imageUrl} 
            alt={chapter.title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        <div style={{ display: chapter.imageUrl ? 'none' : 'block' }}>
          {getAnatomicalIcon(chapter.title)}
        </div>

        {chapter.isNew && (
          <span className="absolute top-2 right-2 rounded-full bg-teal px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider z-20">
            NOUVEAU
          </span>
        )}

        {chapter.isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-lg z-20">
            <ShieldAlert className="h-6 w-6 text-text-light" />
          </div>
        )}
      </div>

      {/* Middle Content */}
      <div className="flex-1 space-y-1">
        <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-text-light">
          Niveau {chapter.level}
        </span>
        <h3 className="font-sans text-base font-semibold text-text-dark line-clamp-1">
          {chapter.title}
        </h3>
        <p className="font-sans text-xs text-text-mid line-clamp-2 leading-relaxed">
          {chapter.description}
        </p>
      </div>

      {/* Bottom Progress & QCM */}
      <div className="mt-5 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-teal transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-text-light">
            <span>
              {chapter.completedLessons}/{chapter.lessonCount} leçons
            </span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* QCM Quick Access */}
        <div className="flex items-center justify-end">
          <QuickQCMChip
            chapterId={chapter.id}
            questionCount={chapter.questionCount}
          />
        </div>
      </div>
    </div>
  );

  if (chapter.isLocked) {
    return cardContent;
  }

  return (
    <Link
      href={`/lessons/${chapter.moduleId}/${chapter.id}`}
      className="block h-full"
    >
      {cardContent}
    </Link>
  );
}
