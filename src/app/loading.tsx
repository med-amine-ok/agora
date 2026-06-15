"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-beige-base flex items-center justify-center select-none">
      <div className="flex flex-col items-center gap-4">
        {/* Breathing spinner */}
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="absolute w-full h-full border-4 border-green-mid/10 rounded-full" />
          <div className="absolute w-full h-full border-4 border-green-mid border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-[10px] text-text-light font-mono font-bold uppercase tracking-widest animate-pulse">
          Chargement clinique...
        </span>
      </div>
    </div>
  );
}
