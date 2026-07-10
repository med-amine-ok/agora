import { FlashcardRating } from "@/types/flashcard";

export function calculateNextReview(
  rating: FlashcardRating,
  currentInterval: number,
  easeFactor: number
): { nextInterval: number; newEaseFactor: number; nextReviewAt: Date } {

  const ratingMap = { again: 0, hard: 1, ok: 2, easy: 3 };
  const q = ratingMap[rating];

  let newInterval: number;
  let newEaseFactor = easeFactor;

  if (q < 2) {
    newInterval = 1; // reset to 1 day
  } else {
    if (currentInterval === 0) newInterval = 1;
    else if (currentInterval === 1) newInterval = 4;
    else newInterval = Math.round(currentInterval * easeFactor);
  }

  // Update ease factor
  newEaseFactor = Math.max(1.3,
    easeFactor + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02))
  );

  // Special cases
  if (rating === 'again') newInterval = 0.017; // 1/60 day ≈ 24 minutes
  if (rating === 'hard') newInterval = 0.007;  // ~10 minutes

  const nextReviewAt = new Date();
  nextReviewAt.setMinutes(nextReviewAt.getMinutes() + Math.round(newInterval * 24 * 60));

  return { nextInterval: newInterval, newEaseFactor, nextReviewAt };
}
