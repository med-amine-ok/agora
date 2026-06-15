import { Question } from "./Question";
import { User } from "./User";

export interface Player {
  user: User;
  score: number;
  isReady: boolean;
  lastAnswerCorrect: boolean | null;
  lastAnswerTime?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Room {
  id: string;
  inviteCode: string;
  subject: string;
  lessonId: string;
  questionCount: number;
  maxPlayers: number;
  players: Player[];
  messages: ChatMessage[];
  gameState: 'lobby' | 'countdown' | 'playing' | 'results';
  questions: Question[];
  currentQuestionIndex: number;
  timer: number;
}
