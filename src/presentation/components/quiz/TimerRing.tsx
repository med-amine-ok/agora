"use client";

import React from "react";

interface TimerRingProps {
  seconds: number;
  maxSeconds: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({ seconds, maxSeconds }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(seconds / maxSeconds, 0), 1);
  const dashOffset = circumference * (1 - progress);

  // Dynamic colors: green-light for > 2/3, gold for 1/3 to 2/3, error for < 1/3
  const ratio = seconds / maxSeconds;
  let color = "#74C69D"; // --green-light
  if (ratio <= 0.33) {
    color = "#C0392B"; // --error
  } else if (ratio <= 0.66) {
    color = "#B8860B"; // --gold
  }

  return (
    <div 
      className="flex flex-col items-center justify-center select-none"
      role="timer"
      aria-live={seconds < 10 ? "assertive" : "off"}
      aria-label={`${seconds} secondes restantes`}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-sm">
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(28, 28, 28, 0.05)"
          strokeWidth="8"
        />
        {/* Animated Countdown Circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
        {/* Time Text */}
        <text
          x="60"
          y="68"
          textAnchor="middle"
          className="font-mono text-3xl font-bold"
          fill={color}
        >
          {seconds}
        </text>
      </svg>
    </div>
  );
};

export default TimerRing;
