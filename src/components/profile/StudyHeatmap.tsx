"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function StudyHeatmap() {
  // Generate mock yearly activity calendar (approx 16 weeks for compact visual beauty, scrollable on mobile)
  const totalWeeks = 28;
  const daysPerWeek = 7;
  
  // Create mock levels of intensity (0 to 4)
  const activityData = Array.from({ length: totalWeeks * daysPerWeek }).map((_, i) => {
    // Generate some random patterns for study intensity
    const val = Math.floor(Math.random() * 5);
    const daySeed = i % 7;
    
    // Some mock metadata
    const studyMinutes = val * 25 + (val > 0 ? Math.floor(Math.random() * 20) : 0);
    const lessons = val > 1 ? Math.floor(val / 2) : 0;
    const cards = val * 12 + Math.floor(Math.random() * 8);

    return {
      intensity: val, // 0 to 4
      minutes: studyMinutes,
      lessons,
      cards,
      date: new Date(Date.now() - (totalWeeks * 7 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    };
  });

  const [hoveredDay, setHoveredDay] = useState<typeof activityData[0] | null>(null);

  const getColorClass = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "bg-teal-light/20 border border-teal-light/10";
      case 2:
        return "bg-teal-light/50 border border-teal-light/20";
      case 3:
        return "bg-teal border border-teal/30";
      case 4:
        return "bg-teal-dark border border-teal-dark/50";
      default:
        return "bg-surface border border-teal/5";
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-teal/15 bg-white-custom/60 backdrop-blur-md shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-text-dark">Calendrier d'Étude</h3>
          <p className="text-xs text-text-light">Assiduité journalière et révisions cliniques</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-text-light font-semibold self-start sm:self-center">
          <span>Moins</span>
          <div className="w-2.5 h-2.5 rounded bg-surface" />
          <div className="w-2.5 h-2.5 rounded bg-teal-light/20" />
          <div className="w-2.5 h-2.5 rounded bg-teal-light/50" />
          <div className="w-2.5 h-2.5 rounded bg-teal" />
          <div className="w-2.5 h-2.5 rounded bg-teal-dark" />
          <span>Plus</span>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-1 min-w-[500px]">
            {Array.from({ length: totalWeeks }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                  const itemIdx = weekIdx * daysPerWeek + dayIdx;
                  const dayData = activityData[itemIdx];

                  return (
                    <div
                      key={dayIdx}
                      onMouseEnter={() => setHoveredDay(dayData)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded transition-all cursor-pointer hover:scale-115 ${getColorClass(
                        dayData.intensity
                      )}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hover details box */}
        <div className="h-10 mt-4 flex items-center justify-center bg-surface/30 rounded-xl px-4 text-xs">
          {hoveredDay ? (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-text-main font-semibold"
            >
              🗓️ {hoveredDay.date} : <span className="text-teal font-bold">{hoveredDay.minutes} min</span> d'étude • <span className="text-accent font-bold">{hoveredDay.lessons} leçons</span> • <span className="text-teal-dark font-bold">{hoveredDay.cards} flashcards</span>
            </motion.p>
          ) : (
            <p className="text-text-light italic">Passez le curseur sur un carré pour voir les détails d'activité.</p>
          )}
        </div>
      </div>
    </div>
  );
}
