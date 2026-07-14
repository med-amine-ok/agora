"use client";

import React from "react";

interface IllustrationProps {
  className?: string;
  color?: string;
  accent?: string;
}

// Cardiology: 3D Heart with soft red/gold gradients and sinus waves
export function CardiologyIllustration({
  className = "w-full h-full",
  color = "#E8593C",
  accent = "#F5B4A8",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="heartGrad"
          x1="20"
          y1="20"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#A82B15" />
        </linearGradient>
        <linearGradient
          id="waveGrad"
          x1="10"
          y1="90"
          x2="110"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={accent} stopOpacity="0.1" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 3D Isometric shadow */}
      <ellipse cx="60" cy="100" rx="30" ry="8" fill="rgba(14,124,123,0.12)" />

      {/* Heart Shape (Semi-Isometric style) */}
      <g transform="translate(0, -5)">
        <path
          d="M60 90 C60 90 20 62 20 38 C20 22 32 10 48 10 C56 10 60 18 60 18 C60 18 64 10 72 10 C88 10 100 22 100 38 C100 62 60 90 60 90 Z"
          fill="url(#heartGrad)"
        />
        {/* Shiny highlights */}
        <path
          d="M30 38 C30 28 38 20 48 20"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* ECG pulse crossing heart */}
        <path
          d="M10 55 H45 L50 40 L55 70 L60 48 L65 58 L70 55 H110"
          stroke="url(#waveGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Neurology: Glowing 3D brain with synaptic networks
export function NeurologyIllustration({
  className = "w-full h-full",
  color = "#7C5CBF",
  accent = "#C4B2E8",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="brainGrad"
          x1="30"
          y1="20"
          x2="90"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#4A3080" />
        </linearGradient>
      </defs>

      {/* 3D Isometric shadow */}
      <ellipse cx="60" cy="100" rx="32" ry="8" fill="rgba(14,124,123,0.12)" />

      {/* Left and Right Brain Hemispheres */}
      <g transform="translate(0, -5)">
        <path
          d="M58 85 C34 85 22 70 22 50 C22 30 38 15 58 15 C58 15 58 85 58 85 Z"
          fill="url(#brainGrad)"
        />
        <path
          d="M62 85 C86 85 98 70 98 50 C98 30 82 15 62 15 C62 15 62 85 62 85 Z"
          fill="url(#brainGrad)"
          opacity="0.9"
        />

        {/* Brain sulci curves */}
        <path
          d="M42 30 C34 35 34 45 42 50 C34 55 34 65 42 70"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M78 30 C86 35 86 45 78 50 C86 55 86 65 78 70"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Synaptic nodes */}
        <circle
          cx="50"
          cy="35"
          r="3.5"
          fill={accent}
          className="animate-ping"
        />
        <circle cx="50" cy="35" r="3.5" fill={accent} />
        <circle cx="70" cy="65" r="3.5" fill={accent} />

        <path
          d="M50 35 L70 65"
          stroke={accent}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

// Anatomy: 3D Bone structure with calipers
export function AnatomyIllustration({
  className = "w-full h-full",
  color = "#3B82C4",
  accent = "#9DC1E8",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="boneGrad"
          x1="20"
          y1="40"
          x2="100"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      {/* 3D Isometric shadow */}
      <ellipse cx="60" cy="100" rx="35" ry="9" fill="rgba(14,124,123,0.12)" />

      {/* Bone shape */}
      <g transform="translate(0, -5) rotate(15 60 60)">
        {/* Left Knobs */}
        <circle cx="28" cy="46" r="14" fill={color} />
        <circle cx="28" cy="64" r="14" fill={color} />

        {/* Right Knobs */}
        <circle cx="92" cy="46" r="14" fill={color} />
        <circle cx="92" cy="64" r="14" fill={color} />

        {/* Center bone shaft */}
        <rect x="28" y="46" width="64" height="18" fill="url(#boneGrad)" />
        <rect
          x="28"
          y="46"
          width="64"
          height="18"
          fill={color}
          opacity="0.15"
        />
      </g>
    </svg>
  );
}

// Biochemistry: Beaker & DNA Helix
export function BiochemistryIllustration({
  className = "w-full h-full",
  color = "#D4820A",
  accent = "#F0C060",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="beakerGrad"
          x1="30"
          y1="40"
          x2="90"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* 3D Isometric shadow */}
      <ellipse cx="60" cy="100" rx="28" ry="7" fill="rgba(14,124,123,0.12)" />

      <g transform="translate(0, -5)">
        {/* Flask shape */}
        <path
          d="M50 25 H70 V45 L90 85 C94 92 88 100 80 100 H40 C32 100 26 92 30 85 L50 45 Z"
          fill="rgba(255,255,255,0.8)"
          stroke="rgba(14,124,123,0.2)"
          strokeWidth="3"
        />
        {/* Chemical liquid inside */}
        <path
          d="M34 88 L46 62 H74 L86 88 C88 93 84 97 78 97 H42 C36 97 32 93 34 88 Z"
          fill="url(#beakerGrad)"
          opacity="0.85"
        />

        {/* Bubbles */}
        <circle cx="50" cy="50" r="3" fill="white" opacity="0.6" />
        <circle cx="68" cy="70" r="4.5" fill="white" opacity="0.5" />
        <circle cx="56" cy="80" r="3.5" fill="white" opacity="0.7" />
      </g>
    </svg>
  );
}

// Nephrology: Kidney filtration
export function NephrologyIllustration({
  className = "w-full h-full",
  color = "#2E86AB",
  accent = "#8ABFD6",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="renalGrad"
          x1="30"
          y1="20"
          x2="90"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="100" rx="28" ry="7" fill="rgba(14,124,123,0.12)" />

      <g transform="translate(0, -5)">
        {/* Nephron/Kidney bean shape */}
        <path
          d="M60 20 C35 20 25 40 25 60 C25 80 35 100 60 100 C75 100 85 92 85 80 C85 68 70 60 70 50 C70 40 85 32 85 20 C85 8 75 20 60 20 Z"
          fill="url(#renalGrad)"
        />
        {/* Glomerulus network lines */}
        <path
          d="M45 40 C35 48 35 72 45 80"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle cx="60" cy="50" r="4" fill="white" opacity="0.4" />
      </g>
    </svg>
  );
}

// Pulmonology: Lungs
export function PulmonologyIllustration({
  className = "w-full h-full",
  color = "#0E7C7B",
  accent = "#5DC8C6",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="lungGrad"
          x1="20"
          y1="20"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="105" rx="34" ry="8" fill="rgba(14,124,123,0.12)" />

      <g transform="translate(0, -5)">
        {/* Left Lung */}
        <path
          d="M54 25 C45 25 25 35 25 65 C25 90 45 95 54 90 Z"
          fill="url(#lungGrad)"
        />
        {/* Right Lung */}
        <path
          d="M66 25 C75 25 95 35 95 65 C95 90 75 95 66 90 Z"
          fill="url(#lungGrad)"
          opacity="0.9"
        />
        {/* Trachea */}
        <path
          d="M60 15 V45"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}

// Pharmacology: Capsule pills
export function PharmacologyIllustration({
  className = "w-full h-full",
  color = "#C0397A",
  accent = "#E899C4",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="100" rx="30" ry="7" fill="rgba(14,124,123,0.12)" />

      <g transform="translate(0, -5) rotate(-30 60 60)">
        {/* Left side capsule */}
        <path
          d="M30 45 H60 V75 H30 C21.5 75 15 68.5 15 60 C15 51.5 21.5 45 30 45 Z"
          fill={color}
        />
        {/* Right side capsule */}
        <path
          d="M60 45 H90 C98.5 45 105 51.5 105 60 C105 68.5 98.5 75 90 75 H60 V45 Z"
          fill={accent}
        />
        {/* Highlight */}
        <path
          d="M30 50 H90"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}

// Gastroenterology: Microscope / Digestion
export function GastroenterologyIllustration({
  className = "w-full h-full",
  color = "#2D8A40",
  accent = "#88C490",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="100" rx="30" ry="7" fill="rgba(14,124,123,0.12)" />

      <g transform="translate(0, -5)">
        {/* Microscope Stand */}
        <path
          d="M40 90 H80 M60 90 V50"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Objective lens */}
        <rect x="52" y="30" width="16" height="25" rx="3" fill={accent} />
        {/* Eyepiece */}
        <rect x="55" y="15" width="10" height="15" fill={color} />
        {/* Slide stage */}
        <rect
          x="42"
          y="65"
          width="36"
          height="5"
          rx="1.5"
          fill="#FFFFFF"
          stroke="rgba(14,124,123,0.2)"
        />
      </g>
    </svg>
  );
}

// Fallback Premium System: Semi-Isometric 3D Geometry
export function GeneralIllustration({
  className = "w-full h-full",
  color = "#0E7C7B",
  accent = "#5DC8C6",
}: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* 3D Isometric shadow */}
      <ellipse cx="60" cy="98" rx="32" ry="8" fill="rgba(14,124,123,0.12)" />

      {/* Premium Isometric Cube */}
      <g transform="translate(0, -8)">
        {/* Left Side */}
        <path d="M28 60 L60 78 V100 L28 82 Z" fill={color} opacity="0.85" />
        {/* Right Side */}
        <path d="M60 78 L92 60 V82 L60 100 Z" fill={color} />
        {/* Top Side */}
        <path d="M60 38 L92 60 L60 78 L28 60 Z" fill="url(#cubeTop)" />

        {/* Glowing floating ring */}
        <ellipse
          cx="60"
          cy="48"
          rx="20"
          ry="6"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

// Illustration registry mapping
const ILLUSTRATION_REGISTRY: Record<
  string,
  React.ComponentType<IllustrationProps>
> = {
  cardiologie: CardiologyIllustration,
  neurologie: NeurologyIllustration,
  anatomie: AnatomyIllustration,
  biochimie: BiochemistryIllustration,
  nephrologie: NephrologyIllustration,
  pneumologie: PulmonologyIllustration,
  pharmacologie: PharmacologyIllustration,
  gastroenterologie: GastroenterologyIllustration,
};

export default function CourseIllustration({
  subjectId,
  className = "w-full h-full",
  color,
  accent,
}: {
  subjectId: string;
  className?: string;
  color?: string;
  accent?: string;
}) {
  const Comp =
    ILLUSTRATION_REGISTRY[subjectId.toLowerCase()] || GeneralIllustration;
  return <Comp className={className} color={color} accent={accent} />;
}
