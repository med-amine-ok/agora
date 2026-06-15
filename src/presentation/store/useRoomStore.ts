import { create } from "zustand";
import { Player, ChatMessage } from "../../domain/entities/Room";
import { Question } from "../../domain/entities/Question";
import { container } from "../../infrastructure/di/container";

type GameState = 'lobby' | 'countdown' | 'playing' | 'results';

interface RoomStore {
  roomId: string | null;
  inviteCode: string | null;
  players: Player[];
  messages: ChatMessage[];
  gameState: GameState;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  scores: Record<string, number>;
  timeRemaining: number;
  
  // Actions
  createRoom: (subjectId: string, count: number, maxPlayers: number, hostUser: any) => Promise<string>;
  joinRoom: (inviteCode: string, user: any) => Promise<string>;
  leaveRoom: () => void;
  sendReadyStatus: (isReady: boolean) => void;
  submitAnswer: (optionIndex: number, timeSpentMs: number) => void;
  sendChatMessage: (text: string) => void;
  addMessage: (msg: ChatMessage) => void;
  updateScore: (userId: string, score: number) => void;
  setGameState: (state: GameState) => void;
  setupSocketListeners: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  roomId: null,
  inviteCode: null,
  players: [],
  messages: [],
  gameState: 'lobby',
  currentQuestion: null,
  currentQuestionIndex: 0,
  scores: {},
  timeRemaining: 20,

  createRoom: async (subjectId, count, maxPlayers, hostUser) => {
    const room = await container.createRoom.execute({
      host: hostUser,
      subjectId,
      questionCount: count,
      maxPlayers
    });

    set({
      roomId: room.id,
      inviteCode: room.inviteCode,
      players: room.players,
      messages: room.messages,
      gameState: 'lobby',
      currentQuestion: room.questions[0],
      currentQuestionIndex: 0,
      scores: { [hostUser.id]: 0 }
    });

    container.realtimeService.connect(hostUser.id);
    container.realtimeService.joinRoom(room.id, hostUser.name, hostUser.avatar);
    get().setupSocketListeners();

    return room.id;
  },

  joinRoom: async (inviteCode, user) => {
    const room = await container.joinRoom.execute(inviteCode, user);
    
    set({
      roomId: room.id,
      inviteCode: room.inviteCode,
      players: room.players,
      messages: room.messages,
      gameState: room.gameState,
      currentQuestion: room.questions[0],
      currentQuestionIndex: 0,
      scores: room.players.reduce((acc, p) => ({ ...acc, [p.user.id]: p.score }), {})
    });

    container.realtimeService.connect(user.id);
    container.realtimeService.joinRoom(room.id, user.name, user.avatar);
    get().setupSocketListeners();

    return room.id;
  },

  leaveRoom: () => {
    const { roomId } = get();
    if (roomId) {
      container.realtimeService.leaveRoom(roomId);
      container.realtimeService.disconnect();
    }
    set({
      roomId: null,
      inviteCode: null,
      players: [],
      messages: [],
      gameState: 'lobby',
      currentQuestion: null,
      currentQuestionIndex: 0,
      scores: {},
      timeRemaining: 20
    });
  },

  sendReadyStatus: (isReady) => {
    const { roomId } = get();
    if (roomId) {
      container.realtimeService.sendReadyStatus(roomId, isReady);
    }
  },

  submitAnswer: (optionIndex, timeSpentMs) => {
    const { roomId, currentQuestionIndex } = get();
    if (roomId) {
      container.realtimeService.submitAnswer(roomId, currentQuestionIndex, optionIndex, timeSpentMs);
    }
  },

  sendChatMessage: (text) => {
    const { roomId } = get();
    if (roomId) {
      container.realtimeService.sendChatMessage(roomId, text);
    }
  },

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  updateScore: (userId, score) => set((state) => ({
    scores: { ...state.scores, [userId]: score }
  })),

  setGameState: (state) => set({ gameState: state }),

  setupSocketListeners: () => {
    const service = container.realtimeService;

    service.onPlayerJoined((players) => {
      set({
        players,
        scores: players.reduce((acc, p) => ({ ...acc, [p.user.id]: p.score }), {})
      });
    });

    service.onPlayerLeft((players) => {
      set({ players });
    });

    service.onGameStateChanged((state, data) => {
      const { roomId } = get();
      if (!roomId) return;
      
      const typedState = state as GameState;
      set({ gameState: typedState });
      
      if (data && data.questionIndex !== undefined) {
        // Find questions for the active subject
        container.questionRepository.getQuestionsForSubject(get().inviteCode || "Cardiologie", 5).then((questions) => {
          set({
            currentQuestionIndex: data.questionIndex,
            currentQuestion: questions[data.questionIndex] || null,
            timeRemaining: 20
          });
        });
      }
    });

    service.onChatMessageReceived((msg) => {
      get().addMessage(msg);
    });

    service.onTimerTick((timeRemaining) => {
      set({ timeRemaining });
    });
  }
}));
