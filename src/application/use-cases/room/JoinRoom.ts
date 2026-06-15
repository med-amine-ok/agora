import { IRoomRepository } from "../../ports/repositories/IRoomRepository";
import { Room } from "../../../domain/entities/Room";
import { User } from "../../../domain/entities/User";

export class JoinRoom {
  constructor(
    private roomRepository: IRoomRepository
  ) {}

  public async execute(inviteCode: string, user: User): Promise<Room> {
    const room = await this.roomRepository.getRoomByInviteCode(inviteCode.toUpperCase());
    if (!room) {
      throw new Error("Salon introuvable avec ce code.");
    }

    if (room.gameState !== 'lobby') {
      throw new Error("La partie a déjà commencé dans ce salon.");
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error("Ce salon est déjà complet.");
    }

    // Check if player already in room
    const exists = room.players.some(p => p.user.id === user.id);
    if (!exists) {
      room.players.push({
        user,
        score: 0,
        isReady: false,
        lastAnswerCorrect: null
      });
      await this.roomRepository.saveRoom(room);
    }

    return room;
  }
}
