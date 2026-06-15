import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'scheduled' | 'easy' | 'medium' | 'hard' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = status.toLowerCase();

  const config: Record<string, { label: string; style: string }> = {
    published: { label: "Publié", style: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    draft: { label: "Brouillon", style: "bg-gray-100 text-gray-800 border-gray-200" },
    scheduled: { label: "Planifié", style: "bg-blue-100 text-blue-800 border-blue-200" },
    easy: { label: "Facile", style: "bg-green-100 text-green-800 border-green-200" },
    medium: { label: "Moyen", style: "bg-amber-100 text-amber-800 border-amber-200" },
    hard: { label: "Difficile", style: "bg-red-100 text-red-800 border-red-200" }
  };

  const current = config[normalized] || { label: status, style: "bg-gray-100 text-gray-800 border-gray-200" };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
          current.style,
          className
        )
      )}
    >
      {current.label}
    </span>
  );
};

export default StatusBadge;
