export type FlashcardType =
  | 'definition'     // Classic: front = term, back = definition
  | 'image_question' // Front = anatomical photo + question, back = answer
  | 'true_false'     // Front = affirmation, back = Vrai/Faux + explanation
  | 'fill_blank'     // Front = sentence with blank, back = complete sentence
  | 'image_label';    // Front = anatomy diagram, back = labeled version

export type FlashcardRating = 'again' | 'hard' | 'ok' | 'easy';

export type FlashcardSource = 'ai_generated' | 'admin' | 'user_submitted';
export type FlashcardStatus = 'approved' | 'pending_review' | 'rejected';

export interface Flashcard {
  id: string;
  deckId: string;
  lessonId: string;
  chapterId: string;
  moduleId: string;
  type: FlashcardType;

  // Content
  front: string;               // text (or question for image_question)
  back: string;                // answer/definition/explanation
  imageUrl?: string;           // for image_question and image_label
  imageBackUrl?: string;       // for image_label (labeled version)
  isAffirmationTrue?: boolean; // for true_false type

  // Meta
  source: FlashcardSource;
  status: FlashcardStatus;
  authorId?: string;           // if user_submitted
  authorName?: string;
  difficulty?: 'easy' | 'medium' | 'hard';

  // Spaced repetition (per user — stored separately)
  nextReviewAt?: string;
  interval?: number;
  easeFactor?: number;

  createdAt: string;
  approvedAt?: string;
}

export interface FlashcardDeck {
  id: string;
  lessonId: string;
  lessonTitle: string;
  chapterId: string;
  moduleId: string;
  moduleName: string;
  cardCount: number;
  aiGeneratedCount: number;
  userSubmittedCount: number;
  masteredCount: number;      // per user
  dueCount: number;           // cards due for review today
  coverImageUrl?: string;
  createdAt: string;
}

export interface UserFlashcardProgress {
  userId: string;
  flashcardId: string;
  rating: FlashcardRating;
  nextReviewAt: string;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  lastReviewedAt: string;
}
