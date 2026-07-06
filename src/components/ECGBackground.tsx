"use client";

import React, { useEffect, useRef } from "react";

export default function ECGBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const points: { x: number; y: number }[] = [];
    const maxPoints = 500;
    let t = 0;

    // Heartbeat simulation pattern
    const getHeartbeatY = (x: number): { y: number; isPeak: boolean } => {
      const centerY = height / 2;
      const period = 300; // distance between heartbeats
      const localX = x % period;
      
      let offset = 0;
      let isPeak = false;

      if (localX > 40 && localX < 50) {
        // P wave
        offset = -8 * Math.sin(((localX - 40) / 10) * Math.PI);
      } else if (localX >= 60 && localX < 65) {
        // Q wave
        offset = 6 * Math.sin(((localX - 60) / 5) * Math.PI);
      } else if (localX >= 65 && localX < 75) {
        // R wave (Main spike)
        offset = -80 * Math.sin(((localX - 65) / 10) * Math.PI);
        if (offset < -40) isPeak = true; // Orange accent trigger
      } else if (localX >= 75 && localX < 82) {
        // S wave
        offset = 20 * Math.sin(((localX - 75) / 7) * Math.PI);
      } else if (localX >= 100 && localX < 125) {
        // T wave
        offset = -15 * Math.sin(((localX - 100) / 25) * Math.PI);
      }

      return { y: centerY + offset, isPeak };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = "rgba(10, 61, 61, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Draw the ECG line
      ctx.lineWidth = 1.5;
      
      // Let's draw segments to support dynamic coloring
      for (let i = 1; i < width; i += 2) {
        const { y: y1, isPeak: isPeak1 } = getHeartbeatY(i - 2 - t);
        const { y: y2, isPeak: isPeak2 } = getHeartbeatY(i - t);

        ctx.beginPath();
        ctx.moveTo(i - 2, y1);
        ctx.lineTo(i, y2);

        if (isPeak1 || isPeak2) {
          ctx.strokeStyle = "rgba(255, 107, 53, 0.6)"; // Orange peak
          ctx.shadowColor = "rgba(255, 107, 53, 0.4)";
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = "rgba(14, 124, 123, 0.12)"; // Faded Teal baseline
          ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
      }

      t = (t - 0.5) % 300; // Scroll speed
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
