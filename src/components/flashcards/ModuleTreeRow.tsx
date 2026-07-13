"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface ModuleTreeRowProps {
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  totalCards: number;
  masteredCards: number;
  dueToday: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ModuleTreeRow({
  moduleId,
  moduleName,
  moduleIcon,
  totalCards,
  masteredCards,
  dueToday,
  isOpen,
  onToggle,
}: ModuleTreeRowProps) {
  
  // Custom colors for light module layout
  const getModuleStyles = () => {
    switch (moduleId) {
      case "s1":
      case "cardiologie":
        return {
          borderLeft: "border-l-[5px] border-l-rose-500",
          iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
        };
      case "s2":
      case "neurologie":
        return {
          borderLeft: "border-l-[5px] border-l-purple-500",
          iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
        };
      default:
        return {
          borderLeft: "border-l-[5px] border-l-teal",
          iconBg: "bg-teal/10 text-teal border border-teal/20",
        };
    }
  };

  const styles = getModuleStyles();
  const progressPercent = Math.round((masteredCards / totalCards) * 100) || 0;

  return (
    <div
      onClick={onToggle}
      className={`w-full rounded-2xl bg-white border border-teal/10 ${styles.borderLeft} p-5 flex items-center justify-between shadow-sm cursor-pointer select-none transition-all duration-300 hover:bg-[#F9FCFC] hover:shadow-md`}
    >
      <div className="flex items-center gap-3.5">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${styles.iconBg}`}>
          {moduleIcon || "📚"}
        </div>
        <div>
          <h3 className="font-display text-base sm:text-lg font-black text-text-dark leading-tight">
            {moduleName}
          </h3>
          {dueToday > 0 && (
            <span className="inline-flex items-center mt-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 animate-pulse shadow-sm">
              ● {dueToday} à réviser
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-text-dark">
        {/* Progress statistics and bar */}
        <div className="hidden sm:flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-text-light">
            {masteredCards} / {totalCards} Maîtrisées ({progressPercent}%)
          </span>
          <div className="h-2.5 w-28 bg-[#F5FAFA] rounded-full overflow-hidden border border-teal/5 p-[1px]">
            <div 
              className="h-full bg-teal rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Chevron icon rotation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-light h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </div>
    </div>
  );
}
