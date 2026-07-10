"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chapter } from "@/types/lesson";
import ChapterCard from "./ChapterCard";

interface ChapterScrollRowProps {
  moduleName: string;
  chapters: Chapter[];
  levelLabel?: string;
}

export default function ChapterScrollRow({
  moduleName,
  chapters,
  levelLabel = "TOUS NIVEAUX",
}: ChapterScrollRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      // Run once on load
      checkScroll();
      // Handle resize
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [chapters]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // scroll by 2 cards width (each is 220px + gap of 16px) -> roughly 472px
      const scrollAmount = direction === "left" ? -472 : 472;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative rounded-2xl bg-surface/30 p-6 border border-teal/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg font-bold text-text-dark">
            {moduleName}
          </h3>
          <span className="rounded-full bg-teal/10 px-3 py-1 text-[10px] font-bold text-teal tracking-wider uppercase">
            {levelLabel}
          </span>
        </div>
      </div>

      {/* Row container with relative wrapper for arrows */}
      <div className="relative group">
        {/* Navigation Buttons (Desktop only on hover) */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-[-16px] top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white border border-teal/10 p-2 shadow-md hover:bg-surface text-teal transition-all md:flex"
            aria-label="Défiler à gauche"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-[-16px] top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white border border-teal/10 p-2 shadow-md hover:bg-surface text-teal transition-all md:flex"
            aria-label="Défiler à droite"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Scrollable container */}
        {/* Shows 5.5 cards: container width divided so 5.5 fits nicely, cards are flex-shrink-0 w-[220px] */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {chapters.map((chapter) => (
            <div key={chapter.id} className="w-[220px] flex-shrink-0 snap-start">
              <ChapterCard chapter={chapter} />
            </div>
          ))}
          {/* Right spacer to allow alignment spacing */}
          <div className="w-10 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
