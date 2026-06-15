export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  lessonId: string;
  source?: string;
  createdDate: string;
}
