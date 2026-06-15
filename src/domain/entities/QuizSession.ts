import { Question } from "./Question";

export interface QuizSession {
  id: string;
  mode: 'free' | 'blitz' | 'room';
  questions: Question[];
  currentIndex: number;
  answers: Record<string, number>; // Maps questionId -> selectedOptionIndex
  score: number;
  streak: number;
  timeRemaining: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}
