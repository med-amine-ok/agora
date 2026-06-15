import { ISessionRepository } from "../../ports/repositories/ISessionRepository";
import { QuizSession } from "../../../domain/entities/QuizSession";

export class CompleteSession {
  constructor(
    private sessionRepository: ISessionRepository
  ) {}

  public async execute(session: QuizSession): Promise<QuizSession> {
    const completedSession: QuizSession = {
      ...session,
      isCompleted: true,
      completedAt: new Date().toISOString()
    };

    await this.sessionRepository.saveSession(completedSession);
    return completedSession;
  }
}
