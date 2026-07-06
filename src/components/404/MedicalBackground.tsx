"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MedicalBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-white-custom select-none pointer-events-none">
      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(224, 242, 242, 0.5) 0%, rgba(245, 250, 250, 0) 80%)",
        }}
      />

      {/* Medical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--teal-dark) 1px, transparent 1px),
            linear-gradient(to bottom, var(--teal-dark) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--teal-dark) 1px, transparent 1px),
            linear-gradient(to bottom, var(--teal-dark) 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px",
        }}
      />

      {/* Anatomical Blueprint Elements (fades in slowly) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.035 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-between p-12 lg:p-24"
      >
        {/* Left Side: DNA / Molecule Helix Sketch */}
        <svg 
          className="w-72 h-72 text-teal-dark" 
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1"
        >
          <path d="M50,10 C50,10 70,40 100,40 C130,40 150,10 150,10" strokeDasharray="3 3" />
          <path d="M50,50 C50,50 70,20 100,20 C130,20 150,50 150,50" />
          <path d="M50,90 C50,90 70,120 100,120 C130,120 150,90 150,90" strokeDasharray="3 3" />
          <path d="M50,130 C50,130 70,100 100,100 C130,100 150,130 150,130" />
          {/* Vertical connectors */}
          <line x1="60" y1="23" x2="60" y2="37" />
          <line x1="80" y1="21" x2="80" y2="39" />
          <line x1="100" y1="20" x2="100" y2="40" />
          <line x1="120" y1="21" x2="120" y2="39" />
          <line x1="140" y1="23" x2="140" y2="37" />
          
          <line x1="60" y1="123" x2="60" y2="107" />
          <line x1="80" y1="121" x2="80" y2="109" />
          <line x1="100" y1="120" x2="100" y2="100" />
          <line x1="120" y1="121" x2="120" y2="109" />
          <line x1="140" y1="123" x2="140" y2="107" />

          {/* Molecule nodes */}
          <circle cx="100" cy="20" r="3" fill="currentColor" />
          <circle cx="100" cy="40" r="3" fill="currentColor" />
          <circle cx="100" cy="100" r="3" fill="currentColor" />
          <circle cx="100" cy="120" r="3" fill="currentColor" />
        </svg>

        {/* Right Side: Ribcage / Lungs / Heart abstract anatomical lines */}
        <svg 
          className="w-80 h-80 text-teal-dark" 
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.8"
        >
          {/* Heart center */}
          <circle cx="100" cy="100" r="25" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="10" />
          <line x1="100" y1="50" x2="100" y2="150" />
          <line x1="50" y1="100" x2="150" y2="100" />
          
          {/* Rib arcs */}
          <path d="M60,70 Q100,90 140,70" />
          <path d="M50,90 Q100,115 150,90" />
          <path d="M45,110 Q100,140 155,110" />
          <path d="M50,130 Q100,165 150,130" />
          
          {/* Data overlay */}
          <rect x="20" y="20" width="40" height="25" rx="2" strokeDasharray="2 2" />
          <line x1="25" y1="28" x2="45" y2="28" strokeWidth="2" />
          <line x1="25" y1="35" x2="55" y2="35" />
          <text x="25" y="42" className="text-[6.5px] font-mono fill-current">SYS 120 / DIA 80</text>
        </svg>
      </motion.div>

      {/* Floating Blueprint heartbeat dots */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-teal animate-ping [animation-duration:3s]" />
        <div className="absolute top-[75%] right-[25%] w-1.5 h-1.5 rounded-full bg-teal animate-ping [animation-duration:4s]" />
        <div className="absolute bottom-[15%] left-[30%] w-2 h-2 rounded-full bg-accent animate-ping [animation-duration:5s]" />
      </div>
    </div>
  );
}
