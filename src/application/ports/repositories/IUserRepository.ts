import { User } from "../../../domain/entities/User";

export interface IUserRepository {
  getUserById(userId: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
  getFriends(userId: string): Promise<User[]>;
  addFriend(userId: string, friendId: string): Promise<void>;
  getPendingFriendRequests(userId: string): Promise<User[]>;
  respondToFriendRequest(userId: string, friendId: string, accept: boolean): Promise<void>;
}
