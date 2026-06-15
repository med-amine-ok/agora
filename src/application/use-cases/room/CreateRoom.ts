import { IRoomRepository } from "../../ports/repositories/IRoomRepository";
import { IQuestionRepository } from "../../ports/repositories/IQuestionRepository";
import { Room } from "../../../domain/entities/Room";
import { User } from "../../../domain/entities/User";

export class CreateRoom {
  constructor(
    private roomRepository: IRoomRepository,
    private questionRepository: IQuestionRepository
  ) {}

  public async execute(params: {
    host: User;
    subjectId: string;
    lessonId?: string;
    questionCount: number;
    maxPlayers: number;
  }): Promise<Room> {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars code
    const questions = await this.questionRepository.getQuestionsForSubject(params.subjectId, params.questionCount);

    const room: Room = {
      id: Math.random().toString(36).substring(2, 11),
      inviteCode,
      subject: params.subjectId,
      lessonId: params.lessonId || "Tous",
      questionCount: params.questionCount,
      maxPlayers: params.maxPlayers,
      players: [
        {
          user: params.host,
          score: 0,
          isReady: true, // host is ready by default
          lastAnswerCorrect: null
        }
      ],
      messages: [],
      gameState: 'lobby',
      questions,
      currentQuestionIndex: 0,
      timer: 20
    };

    await this.roomRepository.saveRoom(room);
    return room;
  }
}
