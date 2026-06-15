import { Room } from "../../../domain/entities/Room";

export interface IRoomRepository {
  getRoomById(roomId: string): Promise<Room | null>;
  getRoomByInviteCode(inviteCode: string): Promise<Room | null>;
  saveRoom(room: Room): Promise<void>;
  getActiveRooms(): Promise<Room[]>;
  deleteRoom(roomId: string): Promise<void>;
}
