import { IQuestionRepository } from "../../ports/repositories/IQuestionRepository";
import { QuizSession } from "../../../domain/entities/QuizSession";

export class StartFreeModeSession {
  constructor(
    private questionRepository: IQuestionRepository
  ) {}

  public async execute(params: {
    subjectId: string;
    lessonId?: string;
    questionCount: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }): Promise<QuizSession> {
    const limit = params.questionCount;
    let questions = [];

    if (params.lessonId && params.lessonId !== "Tous") {
      questions = await this.questionRepository.getQuestionsForLesson(params.lessonId, limit, params.difficulty);
    } else {
      questions = await this.questionRepository.getQuestionsForSubject(params.subjectId, limit, params.difficulty);
    }

    return {
      id: Math.random().toString(36).substring(2, 11),
      mode: 'free',
      questions,
      currentIndex: 0,
      answers: {},
      score: 0,
      streak: 0,
      timeRemaining: 0,
      isCompleted: false,
      startedAt: new Date().toISOString()
    };
  }
}
