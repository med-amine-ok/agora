import React from "react";
import MedicalBackground from "@/components/404/MedicalBackground";
import NotFoundHero from "@/components/404/NotFoundHero";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <MedicalBackground />
      <NotFoundHero />
    </main>
  );
}
