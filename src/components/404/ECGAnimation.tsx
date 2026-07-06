"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ECGAnimationProps {
  onPhaseChange?: (phase: number) => void;
}

export default function ECGAnimation({ onPhaseChange }: ECGAnimationProps) {
  const [phase, setPhase] = useState<number>(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Manage story sequence phases
  useEffect(() => {
    if (prefersReducedMotion) return;

    const runSequence = async () => {
      // Phase 1: Healthy heartbeat (2s)
      setPhase(1);
      onPhaseChange?.(1);
      await new Promise((r) => setTimeout(r, 2000));

      // Phase 2: Stop/Flatline (1s)
      setPhase(2);
      onPhaseChange?.(2);
      await new Promise((r) => setTimeout(r, 1000));

      // Phase 3: 404 text fades in, still flat (1s)
      setPhase(3);
      onPhaseChange?.(3);
      await new Promise((r) => setTimeout(r, 1000));

      // Phase 4: Single orange heartbeat (1.5s)
      setPhase(4);
      onPhaseChange?.(4);
      await new Promise((r) => setTimeout(r, 1500));

      // Phase 5: Subtitle/buttons appear, stable (3.5s)
      setPhase(5);
      onPhaseChange?.(5);
    };

    runSequence();
  }, [prefersReducedMotion, onPhaseChange]);

  // Static Fallback for Reduced Motion
  if (prefersReducedMotion) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <svg
          className="w-full max-w-[800px] h-24 text-teal"
          viewBox="0 0 1000 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Static healthy ECG illustration */}
          <path
            d="M 0 50 L 250 50 L 270 50 Q 280 45 285 50 Q 290 55 295 50 L 305 50 L 310 15 L 315 85 L 320 50 Q 330 50 335 40 Q 345 40 355 50 L 650 50 L 670 50 Q 680 45 685 50 Q 690 55 695 50 L 705 50 L 710 15 L 715 85 L 720 50 Q 730 50 735 40 Q 745 40 755 50 L 1000 50"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Paths definition
  // Flat baseline
  const flatPath = "M 0 50 L 1000 50";

  // Healthy Heartbeat (Phase 1)
  const activePath = 
    "M 0 50 L 250 50 L 270 50 Q 280 45 285 50 Q 290 55 295 50 L 305 50 L 310 15 L 315 85 L 320 50 Q 330 50 335 40 Q 345 40 355 50 L 650 50 L 670 50 Q 680 45 685 50 Q 690 55 695 50 L 705 50 L 710 15 L 715 85 L 720 50 Q 730 50 735 40 Q 745 40 755 50 L 1000 50";

  // Single active orange peak path definition for Phase 4 & 5
  // Left baseline, peak in center, right baseline
  const tealOverlayPath = "M 0 50 L 450 50 M 550 50 L 1000 50";
  const orangePeakPath = "M 450 50 L 470 50 Q 480 45 485 50 Q 490 55 495 50 L 505 50 L 510 15 L 515 85 L 520 50 Q 530 50 535 40 Q 545 40 555 50";

  return (
    <div className="w-full relative flex items-center justify-center py-6 md:py-12 overflow-hidden select-none">
      <svg
        className="w-full max-w-[900px] h-20 md:h-28"
        viewBox="0 0 1000 100"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Underlay Grid Glow */}
        <defs>
          <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Phase 1: Healthy Teal Heartbeat */}
        {phase === 1 && (
          <motion.path
            key="active-ecg"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: "linear", 
              repeat: Infinity,
              repeatType: "loop"
            }}
            d={activePath}
            stroke="var(--teal)"
            strokeWidth="2.5"
            filter="url(#glow-teal)"
          />
        )}

        {/* Phase 2 & 3: Flatline */}
        {(phase === 2 || phase === 3) && (
          <motion.path
            key="flatline-ecg"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            d={flatPath}
            stroke="var(--teal)"
            strokeWidth="2"
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Phase 4 & 5: Single Orange Heartbeat + Teal Baseline */}
        {(phase === 4 || phase === 5) && (
          <>
            {/* Teal Baselines */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              d={tealOverlayPath}
              stroke="var(--teal)"
              strokeWidth="2"
              transition={{ duration: 0.3 }}
            />

            {/* Orange Peak (Heartbeat) */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              d={orangePeakPath}
              stroke="var(--accent)"
              strokeWidth="3"
              filter="url(#glow-orange)"
              transition={{ 
                pathLength: { duration: 0.8, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
