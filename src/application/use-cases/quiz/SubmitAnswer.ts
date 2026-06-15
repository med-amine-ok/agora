import { QuizSession } from "../../../domain/entities/QuizSession";

export class SubmitAnswer {
  public execute(session: QuizSession, optionIndex: number): QuizSession {
    if (session.isCompleted) {
      throw new Error("Impossible de soumettre une réponse pour une session terminée.");
    }

    const currentQuestion = session.questions[session.currentIndex];
    const isCorrect = currentQuestion.correctIndex === optionIndex;

    const newAnswers = {
      ...session.answers,
      [currentQuestion.id]: optionIndex
    };

    let newScore = session.score;
    let newStreak = session.streak;
    let newTimeRemaining = session.timeRemaining;

    if (isCorrect) {
      newScore += 1;
      newStreak += 1;
      if (session.mode === 'blitz') {
        newTimeRemaining += 5; // Blitz bonus time
      }
    } else {
      newStreak = 0; // Reset streak
      if (session.mode === 'blitz') {
        newTimeRemaining = Math.max(0, newTimeRemaining - 5); // Blitz penalty
      }
    }

    return {
      ...session,
      answers: newAnswers,
      score: newScore,
      streak: newStreak,
      timeRemaining: newTimeRemaining
    };
  }
}
