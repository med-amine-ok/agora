import { IQuestionRepository } from "../../../application/ports/repositories/IQuestionRepository";
import { Question } from "../../../domain/entities/Question";
import { Difficulty } from "../../../domain/value-objects/Difficulty";

export class SupabaseQuestionRepository implements IQuestionRepository {
  private static questions: Question[] = [
    {
      id: "q1",
      text: "Quel est le traitement de première intention dans l'insuffisance cardiaque à fraction d'éjection altérée (IC-FEa) ?",
      options: [
        "L'association IEC / bêta-bloquants / antagoniste des récepteurs des minéralocorticoïdes (ARM) / inhibiteur de SGLT2",
        "Les diurétiques de l'anse en monothérapie",
        "L'amiodarone systématique",
        "Les inhibiteurs calciques de type diltiazem"
      ],
      correctIndex: 0,
      explanation: "Les recommandations de l'ESC préconisent la 'quadrithérapie' associant IEC/ARNI, Bêta-bloquants, ARM (spironolactone) et inhibiteurs de SGLT2 (dapagliflozine/empagliflozine) pour réduire la mortalité.",
      difficulty: "medium",
      subject: "Cardiologie",
      lessonId: "insuffisance-cardiaque",
      source: "Recommandations ESC 2021/2023",
      createdDate: "2026-01-01"
    },
    {
      id: "q2",
      text: "Quel examen d'imagerie est le 'gold standard' pour confirmer le diagnostic et classifier l'insuffisance cardiaque ?",
      options: [
        "La radiographie thoracique de face",
        "L'échocardiographie transthoracique (ETT)",
        "L'IRM cardiaque",
        "La coronarographie"
      ],
      correctIndex: 1,
      explanation: "L'échocardiographie transthoracique (ETT) permet de mesurer la Fraction d'Éjection du Ventricule Gauche (FEVG) et de caractériser l'IC (FE altérée, modérément altérée ou préservée).",
      difficulty: "easy",
      subject: "Cardiologie",
      lessonId: "insuffisance-cardiaque",
      source: "Manuel d'Externat - Cardiologie",
      createdDate: "2026-01-02"
    },
    {
      id: "q3",
      text: "Dans le syndrome de sevrage en bêta-bloquants chez un insuffisant cardiaque, quel effet rebond craint-on le plus ?",
      options: [
        "Une bradycardie sinusale sévère",
        "Un accès d'hypertension artérielle avec tachycardie sévère et ischémie myocardique",
        "Une hypokalémie aiguë",
        "Une insuffisance rénale fonctionnelle"
      ],
      correctIndex: 1,
      explanation: "L'arrêt brutal des bêta-bloquants provoque une régulation à la hausse (up-regulation) des récepteurs bêta-adrénergiques, entraînant un risque majeur de tachycardie sinusale, d'angor instable voire d'infarctus.",
      difficulty: "hard",
      subject: "Cardiologie",
      lessonId: "insuffisance-cardiaque",
      source: "Pharmacologie Clinique Médicale",
      createdDate: "2026-01-03"
    },
    {
      id: "q4",
      text: "Quelle structure traverse l'anneau inguinal profond chez l'homme ?",
      options: [
        "Le cordon spermatique",
        "Le ligament rond",
        "Le nerf fémoral",
        "L'artère obturatrice"
      ],
      correctIndex: 0,
      explanation: "Chez l'homme, le cordon spermatique (contenant le canal déférent, les vaisseaux testiculaires, etc.) traverse l'anneau inguinal profond.",
      difficulty: "easy",
      subject: "Anatomie",
      lessonId: "canal-inguinal",
      source: "Anatomie Clinique Kamina",
      createdDate: "2026-01-04"
    },
    {
      id: "q5",
      text: "Quel enzyme catalyse la première étape limitante de la glycolyse ?",
      options: [
        "La pyruvate kinase",
        "La phosphofructokinase-1 (PFK-1)",
        "L'hexokinase / glucokinase",
        "La phosphoglycérate kinase"
      ],
      correctIndex: 1,
      explanation: "La PFK-1 est le principal enzyme régulateur et limitant de la glycolyse. Il est régulé allostériquement par l'ATP, l'AMP et le fructose-2,6-bisphosphate.",
      difficulty: "medium",
      subject: "Biochemistry",
      lessonId: "glycolyse",
      source: "Biochimie de Harper",
      createdDate: "2026-01-05"
    },
    {
      id: "q6",
      text: "Quelle est la principale complication d'une ponction lombaire ?",
      options: [
        "Le syndrome post-ponction lombaire (céphalées orthostatiques)",
        "Une paralysie définitive des membres inférieurs",
        "Une hématurie transitoire",
        "Une méningite bactérienne iatrogène"
      ],
      correctIndex: 0,
      explanation: "Le syndrome post-PL (céphalées s'accentuant en position debout et cédant en décubitus) est la complication la plus fréquente due à une fuite persistante de LCR.",
      difficulty: "easy",
      subject: "Neurologie",
      lessonId: "ponction-lombaire",
      source: "Neurologie ECN",
      createdDate: "2026-01-06"
    }
  ];

  public async getQuestionsForLesson(lessonId: string, limit: number, difficulty?: Difficulty): Promise<Question[]> {
    let list = SupabaseQuestionRepository.questions.filter(q => q.lessonId === lessonId);
    if (difficulty) {
      list = list.filter(q => q.difficulty === difficulty);
    }
    return list.slice(0, limit);
  }

  public async getQuestionsForSubject(subjectId: string, limit: number, difficulty?: Difficulty): Promise<Question[]> {
    // case insensitive match
    const subjName = subjectId.toLowerCase();
    let list = SupabaseQuestionRepository.questions.filter(
      q => q.subject.toLowerCase() === subjName || q.subject.toLowerCase().startsWith(subjName.substring(0, 4))
    );
    if (difficulty) {
      list = list.filter(q => q.difficulty === difficulty);
    }
    // If no specific subject questions, return general mock questions to avoid empty state
    if (list.length === 0) {
      list = SupabaseQuestionRepository.questions;
    }
    return list.slice(0, limit);
  }

  public async getAllQuestionsPaginated(
    page: number, 
    limit: number, 
    filters?: { subjectId?: string; difficulty?: string; search?: string }
  ): Promise<{ questions: Question[]; totalCount: number }> {
    let list = [...SupabaseQuestionRepository.questions];
    if (filters?.subjectId && filters.subjectId !== "Tous") {
      list = list.filter(q => q.subject === filters.subjectId);
    }
    if (filters?.difficulty) {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q => q.text.toLowerCase().includes(s));
    }
    const totalCount = list.length;
    const startIndex = (page - 1) * limit;
    const paginatedQuestions = list.slice(startIndex, startIndex + limit);
    return { questions: paginatedQuestions, totalCount };
  }

  public async saveQuestion(question: Question): Promise<void> {
    const idx = SupabaseQuestionRepository.questions.findIndex(q => q.id === question.id);
    if (idx > -1) {
      SupabaseQuestionRepository.questions[idx] = question;
    } else {
      SupabaseQuestionRepository.questions.push(question);
    }
  }

  public async saveQuestionsBulk(questions: Question[]): Promise<{ successCount: number; errors: { row: number; reason: string }[] }> {
    questions.forEach(q => {
      this.saveQuestion(q);
    });
    return { successCount: questions.length, errors: [] };
  }

  public async deleteQuestion(questionId: string): Promise<void> {
    SupabaseQuestionRepository.questions = SupabaseQuestionRepository.questions.filter(q => q.id !== questionId);
  }
}
