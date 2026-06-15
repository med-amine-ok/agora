import { QuizSession } from "../../../domain/entities/QuizSession";

export class ValidateBlitzScore {
  public execute(session: QuizSession): { isValid: boolean; reason?: string } {
    if (session.mode !== 'blitz') {
      return { isValid: true };
    }

    // A basic check: Blitz sessions start with 30s. If answers are submitted faster than 500ms, it's highly suspicious.
    const durationMs = new Date(session.completedAt || new Date().toISOString()).getTime() - new Date(session.startedAt).getTime();
    const totalAnswers = Object.keys(session.answers).length;

    if (totalAnswers > 0) {
      const averageTimePerAnswer = durationMs / totalAnswers;
      if (averageTimePerAnswer < 400) {
        return { isValid: false, reason: "Vitesse de réponse inhumaine détectée (possible bot/triche)." };
      }
    }

    // If score is perfect but there are 100+ questions in a very short session, flag it
    if (session.score > 80 && durationMs < 60000) {
      return { isValid: false, reason: "Vitesse globale suspecte pour un score élevé." };
    }

    return { isValid: true };
  }
}
