import { ISessionRepository } from "../../../application/ports/repositories/ISessionRepository";
import { QuizSession } from "../../../domain/entities/QuizSession";
import { supabase } from "../client";

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
    try {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          mode: data.mode,
          questions: data.questions || [],
          currentIndex: data.current_index ?? data.currentIndex ?? 0,
          answers: data.answers || {},
          score: data.score,
          streak: data.streak,
          timeRemaining: data.time_remaining ?? data.timeRemaining ?? 0,
          isCompleted: data.is_completed ?? data.isCompleted ?? false,
          startedAt: data.started_at ?? data.startedAt ?? "",
          completedAt: data.completed_at ?? data.completedAt ?? "",
        };
      }
    } catch (err) {
      console.warn("Supabase getSessionById failed, falling back to mock: ", err);
    }
    return SupabaseSessionRepository.sessions.find(s => s.id === sessionId) || null;
  }

  public async saveSession(session: QuizSession): Promise<void> {
    const idx = SupabaseSessionRepository.sessions.findIndex(s => s.id === session.id);
    if (idx > -1) {
      SupabaseSessionRepository.sessions[idx] = session;
    } else {
      SupabaseSessionRepository.sessions.push(session);
    }
    try {
      const { error } = await supabase.from("quiz_sessions").upsert({
        id: session.id,
        mode: session.mode,
        questions: session.questions,
        current_index: session.currentIndex,
        answers: session.answers,
        score: session.score,
        streak: session.streak,
        time_remaining: session.timeRemaining,
        is_completed: session.isCompleted,
        started_at: session.startedAt,
        completed_at: session.completedAt,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase saveSession failed, using mock storage: ", err);
    }
  }

  public async getUserSessions(userId: string, limit: number): Promise<QuizSession[]> {
    try {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          mode: d.mode,
          questions: d.questions || [],
          currentIndex: d.current_index ?? d.currentIndex ?? 0,
          answers: d.answers || {},
          score: d.score,
          streak: d.streak,
          timeRemaining: d.time_remaining ?? d.timeRemaining ?? 0,
          isCompleted: d.is_completed ?? d.isCompleted ?? false,
          startedAt: d.started_at ?? d.startedAt ?? "",
          completedAt: d.completed_at ?? d.completedAt ?? "",
        }));
      }
    } catch (err) {
      console.warn("Supabase getUserSessions failed, falling back to mock: ", err);
    }
    return SupabaseSessionRepository.sessions.slice(0, limit);
  }

  public async getUserWeeklyStats(userId: string): Promise<{ day: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .rpc("get_user_weekly_stats", { p_user_id: userId });
      if (error) throw error;
      if (data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase getUserWeeklyStats failed or RPC missing, falling back to mock: ", err);
    }
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
