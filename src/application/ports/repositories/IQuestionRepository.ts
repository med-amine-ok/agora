import { Question } from "../../../domain/entities/Question";
import { Difficulty } from "../../../domain/value-objects/Difficulty";

export interface IQuestionRepository {
  getQuestionsForLesson(lessonId: string, limit: number, difficulty?: Difficulty): Promise<Question[]>;
  getQuestionsForSubject(subjectId: string, limit: number, difficulty?: Difficulty): Promise<Question[]>;
  getAllQuestionsPaginated(page: number, limit: number, filters?: { subjectId?: string; difficulty?: string; search?: string }): Promise<{ questions: Question[]; totalCount: number }>;
  saveQuestion(question: Question): Promise<void>;
  saveQuestionsBulk(questions: Question[]): Promise<{ successCount: number; errors: { row: number; reason: string }[] }>;
  deleteQuestion(questionId: string): Promise<void>;
}
