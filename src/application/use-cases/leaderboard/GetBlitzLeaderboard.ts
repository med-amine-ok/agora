import { LeaderboardEntry } from "../../../domain/entities/Leaderboard";

export class GetBlitzLeaderboard {
  public execute(lessonId?: string): LeaderboardEntry[] {
    // Return mock static leaderboard entries (this can later be connected to a repository if needed)
    return [
      { rank: 1, userId: "u1", name: "Meriem Bensalah", score: 1540, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meriem", date: "2026-05-27" },
      { rank: 2, userId: "u2", name: "Youcef Khelifi", score: 1180, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Youcef", date: "2026-05-27" },
      { rank: 3, userId: "u3", name: "Yanis Algiers", score: 980, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yanis", date: "2026-05-27" },
      { rank: 4, userId: "u4", name: "Lina Chaoui", score: 890, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina", date: "2026-05-27" },
      { rank: 5, userId: "u5", name: "Sofia Constantine", score: 820, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia", date: "2026-05-27" }
    ];
  }
}
