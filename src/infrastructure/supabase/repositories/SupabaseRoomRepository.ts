import { IRoomRepository } from "../../../application/ports/repositories/IRoomRepository";
import { Room } from "../../../domain/entities/Room";

export class SupabaseRoomRepository implements IRoomRepository {
  private static rooms: Record<string, Room> = {};

  public async getRoomById(roomId: string): Promise<Room | null> {
    return SupabaseRoomRepository.rooms[roomId] || null;
  }

  public async getRoomByInviteCode(inviteCode: string): Promise<Room | null> {
    return Object.values(SupabaseRoomRepository.rooms).find(r => r.inviteCode === inviteCode) || null;
  }

  public async saveRoom(room: Room): Promise<void> {
    SupabaseRoomRepository.rooms[room.id] = room;
  }

  public async getActiveRooms(): Promise<Room[]> {
    return Object.values(SupabaseRoomRepository.rooms).filter(r => r.gameState !== 'results');
  }

  public async deleteRoom(roomId: string): Promise<void> {
    delete SupabaseRoomRepository.rooms[roomId];
  }
}
