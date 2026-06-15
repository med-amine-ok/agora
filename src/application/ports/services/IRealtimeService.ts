export interface IRealtimeService {
  connect(userId: string): void;
  disconnect(): void;
  joinRoom(roomId: string, username: string, avatar: string): void;
  leaveRoom(roomId: string): void;
  sendReadyStatus(roomId: string, isReady: boolean): void;
  submitAnswer(roomId: string, questionIndex: number, optionIndex: number, timeSpentMs: number): void;
  sendChatMessage(roomId: string, text: string): void;
  
  // Event listeners
  onPlayerJoined(callback: (players: any[]) => void): void;
  onPlayerLeft(callback: (players: any[]) => void): void;
  onGameStateChanged(callback: (state: string, data?: any) => void): void;
  onChatMessageReceived(callback: (msg: any) => void): void;
  onTimerTick(callback: (timeRemaining: number) => void): void;
  onError(callback: (errorMsg: string) => void): void;
}
