import { create } from "zustand";

export interface User {
  name: string;
  role: "student" | "admin";
  streak: number;
  points: number;
  badges: string[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  avatarUrl?: string;
}

export interface AgoraState {
  user: User | null;
  selectedRole: "student" | "admin" | null;
  lessonProgress: Record<string, boolean>; // lessonId_checkpointIndex -> completed
  activeQuestScore: number;
  activeQuestTimeLeft: number;
  // Multiplayer MedQuest Room state
  roomCode: string | null;
  players: Player[];
  activeRoomQuestionIndex: number;
  chatMessages: Array<{ sender: string; text: string; timestamp: string }>;
  
  // Actions
  setRole: (role: "student" | "admin" | null) => void;
  login: (name: string, role: "student" | "admin") => void;
  logout: () => void;
  completeCheckpoint: (lessonId: string, checkpointIndex: number) => void;
  resetLessonProgress: () => void;
  updateQuestScore: (pointsToAdd: number) => void;
  setQuestTime: (time: number) => void;
  
  // Room Actions
  createRoom: () => void;
  joinRoom: (code: string) => void;
  addChatMessage: (sender: string, text: string) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
}

const mockStudents = [
  { id: "1", name: "Amine K.", score: 180, isReady: true },
  { id: "2", name: "Sarah B.", score: 240, isReady: true },
  { id: "3", name: "Ryad M.", score: 150, isReady: false },
];

export const useAgoraStore = create<AgoraState>((set) => ({
  user: {
    name: "Yanis Meziani",
    role: "student",
    streak: 12,
    points: 840,
    badges: ["Premier Pouls", "Maître de l'ECG", "Champion du Blitz"],
  },
  selectedRole: "student",
  lessonProgress: {
    "cardio-1_0": true,
    "cardio-1_1": true,
  },
  activeQuestScore: 0,
  activeQuestTimeLeft: 60,
  roomCode: null,
  players: [],
  activeRoomQuestionIndex: 0,
  chatMessages: [],

  setRole: (role) => set({ selectedRole: role }),
  login: (name, role) => set({
    user: {
      name,
      role,
      streak: role === "student" ? 1 : 0,
      points: 0,
      badges: [],
    },
    selectedRole: role,
  }),
  logout: () => set({ user: null, selectedRole: null }),
  completeCheckpoint: (lessonId, checkpointIndex) =>
    set((state) => ({
      lessonProgress: {
        ...state.lessonProgress,
        [`${lessonId}_${checkpointIndex}`]: true,
      },
    })),
  resetLessonProgress: () => set({ lessonProgress: {} }),
  updateQuestScore: (pointsToAdd) =>
    set((state) => ({ activeQuestScore: state.activeQuestScore + pointsToAdd })),
  setQuestTime: (time) => set({ activeQuestTimeLeft: time }),

  createRoom: () => {
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    set({
      roomCode: randomCode,
      players: [
        { id: "self", name: "Yanis Meziani (Vous)", score: 0, isReady: true },
        ...mockStudents,
      ],
      activeRoomQuestionIndex: 0,
      chatMessages: [
        { sender: "Système", text: `Session ${randomCode} créée. Partagez le code avec vos camarades !`, timestamp: new Date().toLocaleTimeString() },
      ],
    });
  },
  joinRoom: (code) => {
    set({
      roomCode: code.toUpperCase(),
      players: [
        { id: "self", name: "Yanis Meziani (Vous)", score: 0, isReady: true },
        ...mockStudents,
      ],
      activeRoomQuestionIndex: 0,
      chatMessages: [
        { sender: "Système", text: `Session rejointe ${code.toUpperCase()}. En attente du début.`, timestamp: new Date().toLocaleTimeString() },
      ],
    });
  },
  addChatMessage: (sender, text) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { sender, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ],
    })),
  updatePlayerScore: (playerId, score) =>
    set((state) => ({
      players: state.players.map((p) =>
          p.id === playerId ? { ...p, score } : p
      ),
    })),
}));
