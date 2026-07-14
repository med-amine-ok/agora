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
  icon?: string;                // e.g. Lucide icon name or emoji
}

export interface AnatomyRegion {
  id: string;
  name: string;
  desc: string;
  color: string;
}

export interface AnatomyData {
  type: string;
  regions: AnatomyRegion[];
}

export interface LessonSection {
  title: string;
  content: string;
}

export interface CheckpointOption {
  text: string;
  isCorrect: boolean;
}

export interface Checkpoint {
  sectionIndex: number;
  question: string;
  options: CheckpointOption[];
  explanation: string;
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
  icon?: string;                // e.g. Lucide icon name or emoji
  sections?: LessonSection[];
  checkpoints?: Checkpoint[];
  anatomyData?: AnatomyData;
  summaryPoints?: string[];
}

