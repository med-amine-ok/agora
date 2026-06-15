import { create } from "zustand";
import { Question } from "../../domain/entities/Question";
import { QuizSession } from "../../domain/entities/QuizSession";
import { container } from "../../infrastructure/di/container";

interface QuizStore {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: number | null;
  answers: Record<string, number>; // Maps questionId -> selectedOptionIndex
  score: number;
  streak: number;
  timeRemaining: number;
  mode: 'free' | 'blitz' | 'room' | null;
  sessionStarted: boolean;
  sessionComplete: boolean;
  
  // Actions
  startSession: (questions: Question[], mode: 'free' | 'blitz' | 'room') => void;
  selectAnswer: (index: number) => void;
  nextQuestion: () => void;
  completeSession: () => Promise<void>;
  resetSession: () => void;
  tickTimer: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  answers: {},
  score: 0,
  streak: 0,
  timeRemaining: 0,
  mode: null,
  sessionStarted: false,
  sessionComplete: false,

  startSession: (questions, mode) => {
    set({
      questions,
      mode,
      currentIndex: 0,
      selectedAnswer: null,
      answers: {},
      score: 0,
      streak: 0,
      timeRemaining: mode === 'blitz' ? 30 : mode === 'room' ? 20 : 0,
      sessionStarted: true,
      sessionComplete: false
    });
  },

  selectAnswer: (index) => {
    const { questions, currentIndex, answers, score, streak, mode, timeRemaining } = get();
    const currentQuestion = questions[currentIndex];
    
    // Ignore if already answered
    if (answers[currentQuestion.id] !== undefined) return;

    const isCorrect = index === currentQuestion.correctIndex;
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: index
    };

    let nextScore = score;
    let nextStreak = streak;
    let nextTime = timeRemaining;

    if (isCorrect) {
      nextScore += 1;
      nextStreak += 1;
      if (mode === 'blitz') nextTime += 5; // Blitz bonus time
    } else {
      nextStreak = 0;
      if (mode === 'blitz') nextTime = Math.max(0, nextTime - 5); // Blitz penalty
    }

    set({
      selectedAnswer: index,
      answers: nextAnswers,
      score: nextScore,
      streak: nextStreak,
      timeRemaining: nextTime
    });

    // In blitz, auto-advance on selection after a brief delay
    if (mode === 'blitz') {
      setTimeout(() => {
        if (get().currentIndex < get().questions.length - 1) {
          get().nextQuestion();
        } else {
          get().completeSession();
        }
      }, 700);
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        selectedAnswer: null
      });
    }
  },

  completeSession: async () => {
    const { questions, answers, score, streak, timeRemaining, mode, sessionComplete } = get();
    if (sessionComplete) return;

    const quizSession: QuizSession = {
      id: Math.random().toString(36).substring(2, 11),
      mode: mode || 'free',
      questions,
      currentIndex: get().currentIndex,
      answers,
      score,
      streak,
      timeRemaining,
      isCompleted: true,
      startedAt: new Date().toISOString()
    };

    const completed = await container.completeSession.execute(quizSession);
    set({ sessionComplete: true });
  },

  resetSession: () => {
    set({
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      answers: {},
      score: 0,
      streak: 0,
      timeRemaining: 0,
      mode: null,
      sessionStarted: false,
      sessionComplete: false
    });
  },

  tickTimer: () => {
    const { timeRemaining, sessionComplete, sessionStarted, mode } = get();
    if (!sessionStarted || sessionComplete || mode === 'free') return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0 });
      get().completeSession();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  }
}));
