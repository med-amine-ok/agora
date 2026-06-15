import { ISessionRepository } from "../../../application/ports/repositories/ISessionRepository";
import { QuizSession } from "../../../domain/entities/QuizSession";

export class SupabaseSessionRepository implements ISessionRepository {
  private static sessions: QuizSession[] = [
    // Pre-seeded sessions for Dr. Amine (u1)
    {
      id: "s1",
      mode: "free",
      questions: [],
      currentIndex: 10,
      answers: {},
      score: 8,
      streak: 8,
      timeRemaining: 0,
      isCompleted: true,
      startedAt: "2026-05-24T10:00:00Z",
      completedAt: "2026-05-24T10:15:00Z"
    },
    {
      id: "s2",
      mode: "blitz",
      questions: [],
      currentIndex: 25,
      answers: {},
      score: 22,
      streak: 15,
      timeRemaining: 0,
      isCompleted: true,
      startedAt: "2026-05-25T14:30:00Z",
      completedAt: "2026-05-25T14:35:00Z"
    },
    {
      id: "s3",
      mode: "room",
      questions: [],
      currentIndex: 15,
      answers: {},
      score: 12,
      streak: 5,
      timeRemaining: 0,
      isCompleted: true,
      startedAt: "2026-05-26T21:00:00Z",
      completedAt: "2026-05-26T21:20:00Z"
    }
  ];

  public async getSessionById(sessionId: string): Promise<QuizSession | null> {
    return SupabaseSessionRepository.sessions.find(s => s.id === sessionId) || null;
  }

  public async saveSession(session: QuizSession): Promise<void> {
    const idx = SupabaseSessionRepository.sessions.findIndex(s => s.id === session.id);
    if (idx > -1) {
      SupabaseSessionRepository.sessions[idx] = session;
    } else {
      SupabaseSessionRepository.sessions.push(session);
    }
  }

  public async getUserSessions(userId: string, limit: number): Promise<QuizSession[]> {
    return SupabaseSessionRepository.sessions.slice(0, limit);
  }

  public async getUserWeeklyStats(userId: string): Promise<{ day: string; count: number }[]> {
    return [
      { day: "Lun", count: 12 },
      { day: "Mar", count: 25 },
      { day: "Mer", count: 18 },
      { day: "Jeu", count: 35 },
      { day: "Ven", count: 15 },
      { day: "Sam", count: 40 },
      { day: "Dim", count: 22 }
    ];
  }
}
