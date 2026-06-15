export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  score: number;
  date: string;
  suspicious?: boolean;
}

export interface Leaderboard {
  lessonId: string;
  entries: LeaderboardEntry[];
}
