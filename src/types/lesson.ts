export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  level: number;                // 1, 2, 3... shown as "Niveau 1"
  description: string;
  imageUrl: string;             // anatomical illustration — uploaded by admin
  lessonCount: number;
  questionCount: number;
  estimatedMinutes: number;
  completedLessons: number;
  isNew: boolean;               // shows "NOUVEAU" badge
  isLocked: boolean;
  flashcardCount?: number;      // shown as "🃏 X flashcards" chip
}

export interface LessonListItem {
  id: string;
  chapterId: string;
  title: string;
  estimatedMinutes: number;
  sectionCount: number;
  tags: string[];               // ["Anatomie", "Physiologie"]
  hasAnatomy: boolean;          // shows 🫀 icon
  flashcardCount: number;       // shows 🃏 chip
  questionCount: number;        // shows ❓ QCM chip
  completionPercent: number;
  isCompleted: boolean;
  isLocked: boolean;
}
