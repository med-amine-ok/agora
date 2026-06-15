import { create } from "zustand";
import { User } from "../../domain/entities/User";
import { container } from "../../infrastructure/di/container";

interface UserStore {
  user: User | null;
  streak: number;
  isAdmin: boolean;
  friends: User[];
  pendingRequests: User[];
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { name: string; email: string; yearOfStudy: number; university?: string }) => Promise<void>;
  logout: () => void;
  incrementStreak: () => Promise<void>;
  loadFriends: () => Promise<void>;
  sendFriendRequest: (username: string) => Promise<boolean>;
  acceptFriendRequest: (friendId: string) => Promise<void>;
  rejectFriendRequest: (friendId: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: {
    id: "u1",
    name: "Dr. Amine Bensalah",
    email: "amine@agora.dz",
    username: "amine_bs",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amine",
    streak: 14,
    yearOfStudy: 5,
    university: "Université d'Alger (Faculté de Médecine)",
    role: "admin",
    points: 1240,
    isPremium: true,
    joinDate: "2026-01-15"
  },
  streak: 14,
  isAdmin: true,
  friends: [],
  pendingRequests: [],
  isAuthenticated: true,

  setUser: (user) => set({ user, streak: user.streak, isAdmin: user.role === 'admin', isAuthenticated: true }),
  clearUser: () => set({ user: null, streak: 0, isAdmin: false, isAuthenticated: false }),

  login: async (email, password) => {
    // In our mock Clean Architecture, we resolve through container repositories
    const mockUser = await container.userRepository.getUserById("u1");
    if (mockUser) {
      // Simulate login
      mockUser.email = email;
      get().setUser(mockUser);
      await get().loadFriends();
      return true;
    }
    return false;
  },

  register: async (data) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: data.name,
      email: data.email,
      username: data.email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.name}`,
      streak: 1,
      yearOfStudy: data.yearOfStudy,
      university: data.university || "Université d'Alger",
      role: 'student',
      points: 0,
      isPremium: false,
      joinDate: new Date().toISOString().split("T")[0]
    };
    await container.userRepository.saveUser(newUser);
    get().setUser(newUser);
  },

  logout: () => {
    get().clearUser();
  },

  incrementStreak: async () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedStreak = await container.updateStreak.execute(currentUser.id);
      const updatedUser = {
        ...currentUser,
        streak: currentUser.streak + 1
      };
      await container.userRepository.saveUser(updatedUser);
      set({ user: updatedUser, streak: updatedUser.streak });
    }
  },

  loadFriends: async () => {
    const currentUser = get().user;
    if (currentUser) {
      const friends = await container.userRepository.getFriends(currentUser.id);
      const pending = await container.userRepository.getPendingFriendRequests(currentUser.id);
      set({ friends, pendingRequests: pending });
    }
  },

  sendFriendRequest: async (username) => {
    const currentUser = get().user;
    if (currentUser) {
      const results = await container.userRepository.searchUsers(username);
      if (results.length > 0) {
        const friend = results[0];
        await container.userRepository.addFriend(currentUser.id, friend.id);
        await get().loadFriends();
        return true;
      }
    }
    return false;
  },

  acceptFriendRequest: async (friendId) => {
    const currentUser = get().user;
    if (currentUser) {
      await container.userRepository.respondToFriendRequest(currentUser.id, friendId, true);
      await get().loadFriends();
    }
  },

  rejectFriendRequest: async (friendId) => {
    const currentUser = get().user;
    if (currentUser) {
      await container.userRepository.respondToFriendRequest(currentUser.id, friendId, false);
      await get().loadFriends();
    }
  }
}));
