import { SupabaseUserRepository } from "../supabase/repositories/SupabaseUserRepository";
import { SupabaseQuestionRepository } from "../supabase/repositories/SupabaseQuestionRepository";
import { SupabaseSessionRepository } from "../supabase/repositories/SupabaseSessionRepository";
import { SupabaseRoomRepository } from "../supabase/repositories/SupabaseRoomRepository";
import { SocketRealtimeService } from "../socket/SocketRealtimeService";

// Use cases
import { StartFreeModeSession } from "../../application/use-cases/quiz/StartFreeModeSession";
import { SubmitAnswer } from "../../application/use-cases/quiz/SubmitAnswer";
import { CompleteSession } from "../../application/use-cases/quiz/CompleteSession";
import { ValidateBlitzScore } from "../../application/use-cases/quiz/ValidateBlitzScore";
import { UpdateStreak } from "../../application/use-cases/streak/UpdateStreak";
import { CalculateStreakStatus } from "../../application/use-cases/streak/CalculateStreakStatus";
import { CreateRoom } from "../../application/use-cases/room/CreateRoom";
import { JoinRoom } from "../../application/use-cases/room/JoinRoom";
import { SubmitRoomAnswer } from "../../application/use-cases/room/SubmitRoomAnswer";
import { GetBlitzLeaderboard } from "../../application/use-cases/leaderboard/GetBlitzLeaderboard";

class DIContainer {
  // Repositories
  public readonly userRepository = new SupabaseUserRepository();
  public readonly questionRepository = new SupabaseQuestionRepository();
  public readonly sessionRepository = new SupabaseSessionRepository();
  public readonly roomRepository = new SupabaseRoomRepository();

  // Services
  public readonly realtimeService = new SocketRealtimeService();

  // Use Cases
  public readonly startFreeModeSession = new StartFreeModeSession(this.questionRepository);
  public readonly submitAnswer = new SubmitAnswer();
  public readonly completeSession = new CompleteSession(this.sessionRepository);
  public readonly validateBlitzScore = new ValidateBlitzScore();
  public readonly updateStreak = new UpdateStreak(this.userRepository);
  public readonly calculateStreakStatus = new CalculateStreakStatus();
  public readonly createRoom = new CreateRoom(this.roomRepository, this.questionRepository);
  public readonly joinRoom = new JoinRoom(this.roomRepository);
  public readonly submitRoomAnswer = new SubmitRoomAnswer(this.roomRepository);
  public readonly getBlitzLeaderboard = new GetBlitzLeaderboard();
}

export const container = new DIContainer();
export type Container = DIContainer;
export default container;
