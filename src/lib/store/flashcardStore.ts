import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flashcard, FlashcardDeck, FlashcardRating, UserFlashcardProgress } from "@/types/flashcard";
import { MOCK_DECKS, MOCK_FLASHCARDS } from "../mock/flashcardsData";
import { calculateNextReview } from "../utils/spacedRepetition";

interface FlashcardState {
  decks: FlashcardDeck[];
  flashcards: Flashcard[];
  progress: Record<string, UserFlashcardProgress>;
  
  // Actions
  rateCard: (cardId: string, rating: FlashcardRating) => void;
  generateAiDeck: (moduleId: string, chapterId: string, lessonId: string, lessonTitle: string, moduleName: string, cardCount: number) => void;
  addManualCard: (card: Omit<Flashcard, "id" | "createdAt" | "status" | "source"> & { proposeToCommunity: boolean }) => void;
  moderateCard: (cardId: string, action: "approve" | "reject", reason?: string) => void;
  deleteDeck: (deckId: string) => void;
  deleteCard: (cardId: string) => void;
  updateCard: (cardId: string, updates: Partial<Flashcard>) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set) => ({
      decks: MOCK_DECKS,
      flashcards: MOCK_FLASHCARDS,
      progress: {},

      rateCard: (cardId, rating) => {
        set((state) => {
          const now = new Date();
          const currentProgress = state.progress[cardId] || {
            userId: "current-user",
            flashcardId: cardId,
            rating: "ok",
            nextReviewAt: now.toISOString(),
            interval: 0,
            easeFactor: 2.5,
            reviewCount: 0,
            lastReviewedAt: now.toISOString(),
          };

          const { nextInterval, newEaseFactor, nextReviewAt } = calculateNextReview(
            rating,
            currentProgress.interval,
            currentProgress.easeFactor
          );

          const updatedProgress: UserFlashcardProgress = {
            ...currentProgress,
            rating,
            nextReviewAt: nextReviewAt.toISOString(),
            interval: nextInterval,
            easeFactor: newEaseFactor,
            reviewCount: currentProgress.reviewCount + 1,
            lastReviewedAt: now.toISOString(),
          };

          const newProgress = { ...state.progress, [cardId]: updatedProgress };

          // Recalculate deck mastered / due counts
          const card = state.flashcards.find((c) => c.id === cardId);
          let updatedDecks = state.decks;
          if (card) {
            updatedDecks = state.decks.map((deck) => {
              if (deck.id === card.deckId) {
                // Count mastered cards (easeFactor high or interval high, e.g. interval >= 4 days)
                const deckCards = state.flashcards.filter((c) => c.deckId === deck.id);
                const masteredCount = deckCards.filter(
                  (c) => newProgress[c.id]?.interval >= 4
                ).length;

                // Count due cards
                const dueCount = deckCards.filter((c) => {
                  const prog = newProgress[c.id];
                  if (!prog) return true; // new card is due
                  return new Date(prog.nextReviewAt) <= now;
                }).length;

                return {
                  ...deck,
                  masteredCount,
                  dueCount,
                };
              }
              return deck;
            });
          }

          return {
            progress: newProgress,
            decks: updatedDecks,
          };
        });
      },

      generateAiDeck: (moduleId, chapterId, lessonId, lessonTitle, moduleName, cardCount) => {
        set((state) => {
          const deckId = `deck-${Date.now()}`;
          const now = new Date().toISOString();

          // Create new deck
          const newDeck: FlashcardDeck = {
            id: deckId,
            lessonId,
            lessonTitle,
            chapterId,
            moduleId,
            moduleName,
            cardCount,
            aiGeneratedCount: cardCount,
            userSubmittedCount: 0,
            masteredCount: 0,
            dueCount: cardCount,
            createdAt: now,
          };

          // Generate cards dynamically
          const newCards: Flashcard[] = Array.from({ length: cardCount }).map((_, idx) => {
            const types: Flashcard["type"][] = ["definition", "true_false", "fill_blank"];
            const selectedType = types[idx % types.length];

            let front = "";
            let back = "";
            let isAffirmationTrue: boolean | undefined;

            if (selectedType === "definition") {
              front = `Concept IA ${idx + 1} (${lessonTitle})`;
              back = `Explication détaillée de la notion clé IA ${idx + 1}. Rôle crucial dans la physiopathologie cible.`;
            } else if (selectedType === "true_false") {
              isAffirmationTrue = idx % 2 === 0;
              front = `Affirmation IA ${idx + 1} : L'activation de ce récepteur cardiaque entraîne une contraction directe.`;
              back = isAffirmationTrue 
                ? "VRAI — L'effet inotrope positif a été validé par les études cliniques récentes." 
                : "FAUX — Cela provoque au contraire une relaxation des parois myocardiques.";
            } else {
              front = `La synthèse des protéines cibles se déroule au niveau du [___] cellulaire.`;
              back = "La synthèse des protéines cibles se déroule au niveau du [réticulum endoplasmique] cellulaire.";
            }

            return {
              id: `fc-ai-${deckId}-${idx}`,
              deckId,
              lessonId,
              chapterId,
              moduleId,
              type: selectedType,
              front,
              back,
              isAffirmationTrue,
              source: "ai_generated",
              status: "approved",
              difficulty: "medium",
              createdAt: now,
            };
          });

          return {
            decks: [newDeck, ...state.decks],
            flashcards: [...newCards, ...state.flashcards],
          };
        });
      },

      addManualCard: (cardData) => {
        set((state) => {
          const cardId = `fc-manual-${Date.now()}`;
          const now = new Date().toISOString();
          const status = cardData.proposeToCommunity ? "pending_review" : "approved";
          const source = cardData.proposeToCommunity ? "user_submitted" : "admin";

          const newCard: Flashcard = {
            id: cardId,
            deckId: cardData.deckId,
            lessonId: cardData.lessonId,
            chapterId: cardData.chapterId,
            moduleId: cardData.moduleId,
            type: cardData.type,
            front: cardData.front,
            back: cardData.back,
            imageUrl: cardData.imageUrl,
            imageBackUrl: cardData.imageBackUrl,
            isAffirmationTrue: cardData.isAffirmationTrue,
            source,
            status,
            authorId: "current-user",
            authorName: "Moi",
            difficulty: cardData.difficulty || "medium",
            createdAt: now,
          };

          // Update related deck cardCount
          const updatedDecks = state.decks.map((deck) => {
            if (deck.id === cardData.deckId) {
              return {
                ...deck,
                cardCount: deck.cardCount + 1,
                userSubmittedCount: cardData.proposeToCommunity ? deck.userSubmittedCount + 1 : deck.userSubmittedCount,
                dueCount: status === "approved" ? deck.dueCount + 1 : deck.dueCount,
              };
            }
            return deck;
          });

          return {
            flashcards: [newCard, ...state.flashcards],
            decks: updatedDecks,
          };
        });
      },

      moderateCard: (cardId, action, reason) => {
        set((state) => {
          const updatedCards = state.flashcards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                status: action === "approve" ? ("approved" as const) : ("rejected" as const),
                approvedAt: action === "approve" ? new Date().toISOString() : undefined,
              };
            }
            return card;
          });

          // Adjust counts if approved
          let updatedDecks = state.decks;
          const card = state.flashcards.find((c) => c.id === cardId);
          if (card && action === "approve") {
            updatedDecks = state.decks.map((deck) => {
              if (deck.id === card.deckId) {
                return {
                  ...deck,
                  dueCount: deck.dueCount + 1,
                };
              }
              return deck;
            });
          }

          return {
            flashcards: updatedCards,
            decks: updatedDecks,
          };
        });
      },

      deleteDeck: (deckId) => {
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== deckId),
          flashcards: state.flashcards.filter((c) => c.deckId !== deckId),
        }));
      },

      deleteCard: (cardId) => {
        set((state) => {
          const cardToDelete = state.flashcards.find((c) => c.id === cardId);
          if (!cardToDelete) return {};

          const updatedCards = state.flashcards.filter((c) => c.id !== cardId);
          const updatedDecks = state.decks.map((deck) => {
            if (deck.id === cardToDelete.deckId) {
              const isAi = cardToDelete.source === "ai_generated";
              const isUser = cardToDelete.source === "user_submitted";
              const isDue = state.progress[cardId]
                ? new Date(state.progress[cardId].nextReviewAt) <= new Date()
                : true;

              return {
                ...deck,
                cardCount: Math.max(0, deck.cardCount - 1),
                aiGeneratedCount: isAi ? Math.max(0, deck.aiGeneratedCount - 1) : deck.aiGeneratedCount,
                userSubmittedCount: isUser ? Math.max(0, deck.userSubmittedCount - 1) : deck.userSubmittedCount,
                dueCount: isDue ? Math.max(0, deck.dueCount - 1) : deck.dueCount,
              };
            }
            return deck;
          });

          return {
            flashcards: updatedCards,
            decks: updatedDecks,
          };
        });
      },

      updateCard: (cardId, updates) => {
        set((state) => {
          const updatedCards = state.flashcards.map((c) => {
            if (c.id === cardId) {
              return { ...c, ...updates };
            }
            return c;
          });
          return { flashcards: updatedCards };
        });
      },
    }),
    {
      name: "agora-flashcards-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Merge missing mock decks
          const existingDeckIds = new Set(state.decks.map((d) => d.id));
          const missingDecks = MOCK_DECKS.filter((d) => !existingDeckIds.has(d.id));
          if (missingDecks.length > 0) {
            state.decks = [...state.decks, ...missingDecks];
          }

          // Merge missing mock flashcards
          const existingCardIds = new Set(state.flashcards.map((c) => c.id));
          const missingCards = MOCK_FLASHCARDS.filter((c) => !existingCardIds.has(c.id));
          if (missingCards.length > 0) {
            state.flashcards = [...state.flashcards, ...missingCards];
          }
        }
      },
    }
  )
);
