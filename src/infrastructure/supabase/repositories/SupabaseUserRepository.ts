import { IUserRepository } from "../../../application/ports/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class SupabaseUserRepository implements IUserRepository {
  private static users: Record<string, User> = {
    "u1": {
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
    "u2": {
      id: "u2",
      name: "Youcef Khelifi",
      email: "youcef@agora.dz",
      username: "youcef_kh",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Youcef",
      streak: 5,
      yearOfStudy: 5,
      university: "Université de Constantine",
      role: "student",
      points: 1180,
      isPremium: false,
      joinDate: "2026-02-10"
    },
    "u3": {
      id: "u3",
      name: "Yanis Algiers",
      email: "yanis@agora.dz",
      username: "yanis_alg",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yanis",
      streak: 8,
      yearOfStudy: 4,
      university: "Université d'Oran",
      role: "student",
      points: 980,
      isPremium: false,
      joinDate: "2026-03-01"
    },
    "u4": {
      id: "u4",
      name: "Lina Chaoui",
      email: "lina@agora.dz",
      username: "lina_ch",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina",
      streak: 21,
      yearOfStudy: 6,
      university: "Université de Batna",
      role: "student",
      points: 890,
      isPremium: true,
      joinDate: "2026-01-20"
    },
    "u5": {
      id: "u5",
      name: "Ali Larbi",
      email: "ali@agora.dz",
      username: "ali_l",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali",
      streak: 3,
      yearOfStudy: 5,
      university: "Université d'Alger",
      role: "student",
      points: 750,
      isPremium: false,
      joinDate: "2026-02-25"
    }
  };

  private static friendsList: Record<string, string[]> = {
    "u1": ["u2", "u3", "u4", "u5"]
  };

  public async getUserById(userId: string): Promise<User | null> {
    return SupabaseUserRepository.users[userId] || SupabaseUserRepository.users["u1"];
  }

  public async saveUser(user: User): Promise<void> {
    SupabaseUserRepository.users[user.id] = user;
  }

  public async searchUsers(query: string): Promise<User[]> {
    const q = query.toLowerCase();
    return Object.values(SupabaseUserRepository.users).filter(
      u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }

  public async getFriends(userId: string): Promise<User[]> {
    const friendIds = SupabaseUserRepository.friendsList[userId] || [];
    return friendIds.map(id => SupabaseUserRepository.users[id]).filter(Boolean);
  }

  public async addFriend(userId: string, friendId: string): Promise<void> {
    if (!SupabaseUserRepository.friendsList[userId]) {
      SupabaseUserRepository.friendsList[userId] = [];
    }
    if (!SupabaseUserRepository.friendsList[userId].includes(friendId)) {
      SupabaseUserRepository.friendsList[userId].push(friendId);
    }
  }

  public async getPendingFriendRequests(userId: string): Promise<User[]> {
    return [
      SupabaseUserRepository.users["u2"] // Mock a pending request from Youcef
    ];
  }

  public async respondToFriendRequest(userId: string, friendId: string, accept: boolean): Promise<void> {
    if (accept) {
      await this.addFriend(userId, friendId);
    }
  }
}
