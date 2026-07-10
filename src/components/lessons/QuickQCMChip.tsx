"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";

interface QuickQCMChipProps {
  chapterId: string;
  lessonId?: string;
  questionCount: number;
  className?: string;
}

export default function QuickQCMChip({
  chapterId,
  lessonId,
  questionCount,
  className = "",
}: QuickQCMChipProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const query = lessonId 
      ? `chapter=${chapterId}&lesson=${lessonId}`
      : `chapter=${chapterId}`;
    router.push(`/medquest/free?${query}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 rounded-full bg-[#FF6B35]/10 px-2.5 py-1 text-xs font-semibold text-[#FF6B35] border border-[#FF6B35]/20 hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] transition-all duration-200 cursor-pointer ${className}`}
    >
      <HelpCircle className="h-3.5 w-3.5" />
      <span>{questionCount} QCMs</span>
    </button>
  );
}
