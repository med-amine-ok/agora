import { IUserRepository } from "../../../application/ports/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { supabase } from "../client";

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
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          avatar: data.avatar,
          streak: data.streak,
          yearOfStudy: data.year_of_study ?? data.yearOfStudy ?? 1,
          university: data.university,
          role: data.role,
          points: data.points,
          isPremium: data.is_premium ?? data.isPremium ?? false,
          joinDate: data.join_date ?? data.joinDate ?? "",
        };
      }
    } catch (err) {
      console.warn("Supabase getUserById failed, falling back to mock: ", err);
    }
    return SupabaseUserRepository.users[userId] || SupabaseUserRepository.users["u1"];
  }

  public async saveUser(user: User): Promise<void> {
    SupabaseUserRepository.users[user.id] = user;
    try {
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        streak: user.streak,
        year_of_study: user.yearOfStudy,
        university: user.university,
        role: user.role,
        points: user.points,
        is_premium: user.isPremium,
        join_date: user.joinDate,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase saveUser failed, using mock storage: ", err);
    }
  }

  public async searchUsers(query: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`name.ilike.%${query}%,username.ilike.%${query}%`);
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          name: d.name,
          email: d.email,
          username: d.username,
          avatar: d.avatar,
          streak: d.streak,
          yearOfStudy: d.year_of_study ?? d.yearOfStudy ?? 1,
          university: d.university,
          role: d.role,
          points: d.points,
          isPremium: d.is_premium ?? d.isPremium ?? false,
          joinDate: d.join_date ?? d.joinDate ?? "",
        }));
      }
    } catch (err) {
      console.warn("Supabase searchUsers failed, falling back to mock: ", err);
    }
    const q = query.toLowerCase();
    return Object.values(SupabaseUserRepository.users).filter(
      u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );
  }

  public async getFriends(userId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("friends")
        .select("friend_id")
        .eq("user_id", userId);
      if (error) throw error;
      if (data && data.length > 0) {
        const friendIds = data.map(d => d.friend_id);
        const friends: User[] = [];
        for (const fId of friendIds) {
          const u = await this.getUserById(fId);
          if (u) friends.push(u);
        }
        return friends;
      }
    } catch (err) {
      console.warn("Supabase getFriends failed, falling back to mock: ", err);
    }
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
    try {
      const { error } = await supabase.from("friends").upsert([
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId } // bidirectional friendship
      ]);
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase addFriend failed, using mock storage: ", err);
    }
  }

  public async getPendingFriendRequests(userId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("friend_requests")
        .select("sender_id")
        .eq("receiver_id", userId)
        .eq("status", "pending");
      if (error) throw error;
      if (data && data.length > 0) {
        const senders: User[] = [];
        for (const req of data) {
          const u = await this.getUserById(req.sender_id);
          if (u) senders.push(u);
        }
        return senders;
      }
    } catch (err) {
      console.warn("Supabase getPendingFriendRequests failed, falling back to mock: ", err);
    }
    return [
      SupabaseUserRepository.users["u2"]
    ];
  }

  public async respondToFriendRequest(userId: string, friendId: string, accept: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({ status: accept ? "accepted" : "rejected" })
        .eq("sender_id", friendId)
        .eq("receiver_id", userId);
      if (error) throw error;
      
      if (accept) {
        await this.addFriend(userId, friendId);
      }
    } catch (err) {
      console.warn("Supabase respondToFriendRequest failed, using mock storage: ", err);
      if (accept) {
        await this.addFriend(userId, friendId);
      }
    }
  }
}
