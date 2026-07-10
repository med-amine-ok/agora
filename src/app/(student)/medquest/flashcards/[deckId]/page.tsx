"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFlashcardStore } from "@/lib/store/flashcardStore";
import SessionHeader from "@/components/flashcards/SessionHeader";
import FlashCard from "@/components/flashcards/FlashCard";
import SessionEndScreen from "@/components/flashcards/SessionEndScreen";
import { FlashcardRating } from "@/types/flashcard";

export default function FlashcardStudySession() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const { decks, flashcards, rateCard } = useFlashcardStore();

  const currentDeck = useMemo(() => {
    return decks.find((d) => d.id === deckId);
  }, [decks, deckId]);

  // Filter approved cards in this deck
  const sessionCards = useMemo(() => {
    return flashcards.filter(
      (card) => card.deckId === deckId && card.status === "approved"
    );
  }, [flashcards, deckId]);

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [history, setHistory] = useState<{ cardId: string; rating: FlashcardRating }[]>([]);

  // Statistics trackers
  const [againCount, setAgainCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [okCount, setOkCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);

  const totalCards = sessionCards.length;
  const currentCard = sessionCards[currentIndex];

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCard) return;

    // Persist card progress to the store
    rateCard(currentCard.id, rating);

    // Track statistics for end screen
    setHistory((prev) => [...prev, { cardId: currentCard.id, rating }]);
    if (rating === "again") setAgainCount((c) => c + 1);
    if (rating === "hard") setHardCount((c) => c + 1);
    if (rating === "ok") setOkCount((c) => c + 1);
    if (rating === "easy") setEasyCount((c) => c + 1);

    // Move to next card
    if (currentIndex + 1 < totalCards) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowEndScreen(true);
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 < totalCards) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowEndScreen(true);
    }
  };

  const handleQuit = () => {
    router.push("/medquest/flashcards");
  };

  if (!currentDeck || totalCards === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-text-dark">Aucune carte disponible</h2>
        <p className="text-sm text-text-light max-w-sm">
          Ce deck n'existe pas ou ne contient pas encore de cartes validées pour l'étude.
        </p>
        <button
          onClick={handleQuit}
          className="rounded-full bg-teal px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-dark transition-all"
        >
          Retour au Hub
        </button>
      </div>
    );
  }

  if (showEndScreen) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12">
        <div className="mx-auto max-w-xl px-4">
          <SessionEndScreen
            totalReviewed={totalCards}
            masteredCount={easyCount + okCount}
            stats={{
              again: againCount,
              hard: hardCount,
              ok: okCount,
              easy: easyCount,
            }}
            onRestartDifficult={() => {
              // Resetting session for difficult/again cards
              setCurrentIndex(0);
              setIsFlipped(false);
              setShowEndScreen(false);
              setHistory([]);
              setAgainCount(0);
              setHardCount(0);
              setOkCount(0);
              setEasyCount(0);
            }}
            onBackToDecks={handleQuit}
          />
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-24 px-4 sm:px-6 lg:px-8">
      {/* Immersive Fixed Session Header */}
      <SessionHeader
        title={currentDeck.lessonTitle}
        currentIndex={currentIndex + 1}
        totalCards={totalCards}
        onQuit={handleQuit}
        onSkip={handleSkip}
        hasRated={isFlipped}
      />

      {/* Active Card Platform */}
      <main className="w-full flex-grow flex items-center justify-center">
        {currentCard && (
          <FlashCard
            card={currentCard}
            onRate={handleRate}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        )}
      </main>
    </div>
  );
}
