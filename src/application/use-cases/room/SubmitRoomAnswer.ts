import { IRoomRepository } from "../../ports/repositories/IRoomRepository";
import { Room } from "../../../domain/entities/Room";

export class SubmitRoomAnswer {
  constructor(
    private roomRepository: IRoomRepository
  ) {}

  public async execute(roomId: string, userId: string, optionIndex: number, timeSpentMs: number): Promise<Room> {
    const room = await this.roomRepository.getRoomById(roomId);
    if (!room) throw new Error("Salon introuvable");

    const playerIndex = room.players.findIndex(p => p.user.id === userId);
    if (playerIndex === -1) throw new Error("Joueur introuvable dans ce salon");

    const currentQ = room.questions[room.currentQuestionIndex];
    const isCorrect = currentQ.correctIndex === optionIndex;

    const player = room.players[playerIndex];
    player.lastAnswerCorrect = isCorrect;

    if (isCorrect) {
      // Base score is 100 points, fast answer bonus: up to 50 points based on speed (assuming 20s = 20000ms max)
      const speedBonus = Math.max(0, Math.round((20000 - timeSpentMs) / 400)); 
      player.score += 100 + speedBonus;
      player.lastAnswerTime = timeSpentMs;
    } else {
      player.lastAnswerTime = undefined;
    }

    await this.roomRepository.saveRoom(room);
    return room;
  }
}
