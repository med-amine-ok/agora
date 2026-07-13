"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, Plus, Flame, CheckCircle, Clock } from "lucide-react";

interface FlashcardPageHeaderProps {
  totalMastered: number;
  totalDue: number;
  onOpenAiModal: () => void;
  onOpenManualModal: () => void;
}

function CountUp({ end, duration = 1000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return <>{count}</>;
}

export default function FlashcardPageHeader({
  totalMastered,
  totalDue,
  onOpenAiModal,
  onOpenManualModal,
}: FlashcardPageHeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 320;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;

    const getHeartbeatY = (x: number): { y: number; isPeak: boolean } => {
      const centerY = height / 2;
      const period = 240; 
      const localX = x % period;
      
      let offset = 0;
      let isPeak = false;

      if (localX > 40 && localX < 50) {
        offset = -6 * Math.sin(((localX - 40) / 10) * Math.PI);
      } else if (localX >= 55 && localX < 60) {
        offset = 4 * Math.sin(((localX - 55) / 5) * Math.PI);
      } else if (localX >= 60 && localX < 68) {
        offset = -60 * Math.sin(((localX - 60) / 8) * Math.PI);
        if (offset < -30) isPeak = true;
      } else if (localX >= 68 && localX < 73) {
        offset = 15 * Math.sin(((localX - 68) / 5) * Math.PI);
      } else if (localX >= 90 && localX < 110) {
        offset = -10 * Math.sin(((localX - 90) / 20) * Math.PI);
      }

      return { y: centerY + offset, isPeak };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid pattern
      ctx.strokeStyle = "rgba(14, 124, 123, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG Line
      ctx.lineWidth = 2;
      for (let i = 1; i < width; i += 2) {
        const { y: y1, isPeak: isPeak1 } = getHeartbeatY(i - 2 - t);
        const { y: y2, isPeak: isPeak2 } = getHeartbeatY(i - t);

        ctx.beginPath();
        ctx.moveTo(i - 2, y1);
        ctx.lineTo(i, y2);

        if (isPeak1 || isPeak2) {
          ctx.strokeStyle = "rgba(255, 107, 53, 0.7)";
          ctx.shadowColor = "rgba(255, 107, 53, 0.5)";
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = "rgba(14, 124, 123, 0.2)";
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }

      t = (t - 0.7) % 240;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2C2C] to-[#051A1A] pt-20 pb-24 md:pt-24 md:pb-28 text-white border-b border-[#0A3D3D]/30">
      {/* Dynamic ECG backdrop canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#051A1A] via-transparent to-transparent pointer-events-none z-0 opacity-80" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Info & Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 border border-teal/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-light">
              <Sparkles className="h-3.5 w-3.5 text-teal-light animate-pulse" /> Répétition Espacée Intelligente
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Agora <span className="text-teal-light">Flashcards</span>
            </h1>
            
            <p className="text-sm sm:text-base text-teal-light/70 max-w-xl leading-relaxed">
              Apprenez et retenez vos cours de médecine deux fois plus vite grâce à notre moteur de répétition espacée (algorithme SM-2). Générez des jeux de cartes instantanés grâce à l'IA ou créez-les manuellement.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onOpenAiModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C7B] px-5 py-3 text-xs font-bold text-white hover:bg-[#0A3D3D] hover:shadow-lg hover:shadow-teal/20 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Générer avec l'IA
              </button>
              <button
                onClick={onOpenManualModal}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Créer une carte
              </button>
            </div>
          </div>

          {/* Right Column: 3 Stat Orbs */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="flex items-center gap-5 md:gap-7">
              {/* Orb 1: Mastered */}
              <div className="group relative flex flex-col items-center">
                <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#0D2E2E]/80 border border-teal/30 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-teal/60">
                  <div className="absolute inset-0 rounded-full bg-teal/5 blur-sm group-hover:bg-teal/10 transition-all" />
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-teal-light mb-0.5" />
                  <span className="font-mono text-lg md:text-xl font-black text-white leading-none">
                    <CountUp end={totalMastered} />
                  </span>
                </div>
                <span className="mt-2 text-[10px] md:text-xs font-bold tracking-wider uppercase text-teal-light/50">Maîtrisées</span>
              </div>

              {/* Orb 2: Due Today */}
              <div className="group relative flex flex-col items-center">
                <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#0D2E2E]/80 border border-accent/30 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-accent/60">
                  <div className="absolute inset-0 rounded-full bg-accent/5 blur-sm group-hover:bg-accent/10 transition-all" />
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent mb-0.5" />
                  <span className="font-mono text-lg md:text-xl font-black text-accent leading-none">
                    <CountUp end={totalDue} />
                  </span>
                </div>
                <span className="mt-2 text-[10px] md:text-xs font-bold tracking-wider uppercase text-teal-light/50">À Réviser</span>
              </div>

              {/* Orb 3: Streak */}
              <div className="group relative flex flex-col items-center">
                <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-[#0D2E2E]/80 border border-orange-500/30 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-orange-500/60">
                  <div className="absolute inset-0 rounded-full bg-orange-500/5 blur-sm group-hover:bg-orange-500/10 transition-all" />
                  <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-400 fill-orange-400 animate-pulse mb-0.5" />
                  <span className="font-mono text-lg md:text-xl font-black text-orange-400 leading-none">
                    14
                  </span>
                </div>
                <span className="mt-2 text-[10px] md:text-xs font-bold tracking-wider uppercase text-teal-light/50">Série</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
