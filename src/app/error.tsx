"use client";

import React, { useEffect } from "react";
import Button from "@/presentation/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("ErrorBoundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-beige-base flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md space-y-6">
        <span className="text-5xl">⚠️</span>
        <h1 className="font-serif text-3xl font-bold text-green-dark">Choc Clinique (Erreur)</h1>
        <p className="text-text-mid text-sm leading-relaxed">
          Une anomalie imprévue a provoqué un dysfonctionnement de cette section. L'incident a été enregistré pour notre équipe technique.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Actualiser
          </Button>
          <Button onClick={reset}>
            Réessayer
          </Button>
        </div>
      </div>
    </div>
  );
}
