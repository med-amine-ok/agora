import { QuizSession } from "../../../domain/entities/QuizSession";

export interface ISessionRepository {
  getSessionById(sessionId: string): Promise<QuizSession | null>;
  saveSession(session: QuizSession): Promise<void>;
  getUserSessions(userId: string, limit: number): Promise<QuizSession[]>;
  getUserWeeklyStats(userId: string): Promise<{ day: string; count: number }[]>;
}
