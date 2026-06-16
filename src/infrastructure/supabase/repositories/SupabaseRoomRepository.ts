import { IRoomRepository } from "../../../application/ports/repositories/IRoomRepository";
import { Room } from "../../../domain/entities/Room";
import { supabase } from "../client";

export class SupabaseRoomRepository implements IRoomRepository {
  private static rooms: Record<string, Room> = {};

  public async getRoomById(roomId: string): Promise<Room | null> {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          inviteCode: data.invite_code ?? data.inviteCode ?? "",
          subject: data.subject ?? "",
          lessonId: data.lesson_id ?? data.lessonId ?? "",
          questionCount: data.question_count ?? data.questionCount ?? 0,
          maxPlayers: data.max_players ?? data.maxPlayers ?? 0,
          players: data.players || [],
          messages: data.messages || [],
          gameState: data.game_state ?? data.gameState ?? "lobby",
          questions: data.questions || [],
          currentQuestionIndex: data.current_question_index ?? data.currentQuestionIndex ?? 0,
          timer: data.timer ?? 0,
        };
      }
    } catch (err) {
      console.warn("Supabase getRoomById failed, falling back to mock: ", err);
    }
    return SupabaseRoomRepository.rooms[roomId] || null;
  }

  public async getRoomByInviteCode(inviteCode: string): Promise<Room | null> {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("invite_code", inviteCode)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          inviteCode: data.invite_code ?? data.inviteCode ?? "",
          subject: data.subject ?? "",
          lessonId: data.lesson_id ?? data.lessonId ?? "",
          questionCount: data.question_count ?? data.questionCount ?? 0,
          maxPlayers: data.max_players ?? data.maxPlayers ?? 0,
          players: data.players || [],
          messages: data.messages || [],
          gameState: data.game_state ?? data.gameState ?? "lobby",
          questions: data.questions || [],
          currentQuestionIndex: data.current_question_index ?? data.currentQuestionIndex ?? 0,
          timer: data.timer ?? 0,
        };
      }
    } catch (err) {
      console.warn("Supabase getRoomByInviteCode failed, falling back to mock: ", err);
    }
    return Object.values(SupabaseRoomRepository.rooms).find(r => r.inviteCode === inviteCode) || null;
  }

  public async saveRoom(room: Room): Promise<void> {
    SupabaseRoomRepository.rooms[room.id] = room;
    try {
      const { error } = await supabase.from("rooms").upsert({
        id: room.id,
        invite_code: room.inviteCode,
        subject: room.subject,
        lesson_id: room.lessonId,
        question_count: room.questionCount,
        max_players: room.maxPlayers,
        players: room.players,
        messages: room.messages,
        game_state: room.gameState,
        questions: room.questions,
        current_question_index: room.currentQuestionIndex,
        timer: room.timer,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase saveRoom failed, using mock storage: ", err);
    }
  }

  public async getActiveRooms(): Promise<Room[]> {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .neq("game_state", "results");
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          inviteCode: d.invite_code ?? d.inviteCode ?? "",
          subject: d.subject ?? "",
          lessonId: d.lesson_id ?? d.lessonId ?? "",
          questionCount: d.question_count ?? d.questionCount ?? 0,
          maxPlayers: d.max_players ?? d.maxPlayers ?? 0,
          players: d.players || [],
          messages: d.messages || [],
          gameState: d.game_state ?? d.gameState ?? "lobby",
          questions: d.questions || [],
          currentQuestionIndex: d.current_question_index ?? d.currentQuestionIndex ?? 0,
          timer: d.timer ?? 0,
        }));
      }
    } catch (err) {
      console.warn("Supabase getActiveRooms failed, falling back to mock: ", err);
    }
    return Object.values(SupabaseRoomRepository.rooms).filter(r => r.gameState !== 'results');
  }

  public async deleteRoom(roomId: string): Promise<void> {
    delete SupabaseRoomRepository.rooms[roomId];
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", roomId);
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase deleteRoom failed, using mock storage: ", err);
    }
  }
}
