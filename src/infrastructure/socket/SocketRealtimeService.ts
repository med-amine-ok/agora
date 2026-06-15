import { IRealtimeService } from "../../application/ports/services/IRealtimeService";

export class SocketRealtimeService implements IRealtimeService {
  private userId: string = "";
  private roomId: string | null = null;
  private timerInterval: any = null;
  private botInterval: any = null;

  // Callbacks
  private playerJoinedCallback: (players: any[]) => void = () => {};
  private playerLeftCallback: (players: any[]) => void = () => {};
  private gameStateCallback: (state: string, data?: any) => void = () => {};
  private chatMessageCallback: (msg: any) => void = () => {};
  private timerCallback: (timeRemaining: number) => void = () => {};
  private errorCallback: (errorMsg: string) => void = () => {};

  // Mock Players State
  private mockPlayers = [
    {
      user: { id: "u1", name: "Dr. Amine Bensalah", username: "amine_bs", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amine" },
      score: 0,
      isReady: true,
      lastAnswerCorrect: null as boolean | null
    },
    {
      user: { id: "u5", name: "Ali Larbi", username: "ali_l", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali" },
      score: 0,
      isReady: false,
      lastAnswerCorrect: null as boolean | null
    },
    {
      user: { id: "u4", name: "Lina Chaoui", username: "lina_ch", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina" },
      score: 0,
      isReady: false,
      lastAnswerCorrect: null as boolean | null
    }
  ];

  public connect(userId: string): void {
    this.userId = userId;
    console.log("Socket.io: Connecté en tant que", userId);
  }

  public disconnect(): void {
    this.cleanup();
    console.log("Socket.io: Déconnecté");
  }

  public joinRoom(roomId: string, username: string, avatar: string): void {
    this.roomId = roomId;
    console.log("Socket.io: Rejoint le salon", roomId);
    
    // Simulate other players joining
    setTimeout(() => {
      this.playerJoinedCallback(this.mockPlayers);
      
      // Send welcome chat message
      this.chatMessageCallback({
        id: "sys-welcome",
        userId: "sys",
        username: "Système",
        avatar: "",
        text: "Bienvenue dans le salon d'étude ! Invitez vos amis à rejoindre.",
        timestamp: new Date().toLocaleTimeString()
      });
    }, 500);
  }

  public leaveRoom(roomId: string): void {
    this.cleanup();
    this.roomId = null;
  }

  public sendReadyStatus(roomId: string, isReady: boolean): void {
    const p = this.mockPlayers.find(pl => pl.user.id === this.userId || pl.user.id === "u1");
    if (p) p.isReady = isReady;

    this.playerJoinedCallback([...this.mockPlayers]);

    if (isReady) {
      // Simulate other players setting ready after a short delay
      setTimeout(() => {
        this.mockPlayers[1].isReady = true;
        this.chatMessageCallback({
          id: "m-ali-ready",
          userId: "u5",
          username: "Ali Larbi",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali",
          text: "Je suis prêt ! Préparez-vous ⚡",
          timestamp: new Date().toLocaleTimeString()
        });
        this.playerJoinedCallback([...this.mockPlayers]);
      }, 1000);

      setTimeout(() => {
        this.mockPlayers[2].isReady = true;
        this.chatMessageCallback({
          id: "m-lina-ready",
          userId: "u4",
          username: "Lina Chaoui",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lina",
          text: "C'est parti !",
          timestamp: new Date().toLocaleTimeString()
        });
        this.playerJoinedCallback([...this.mockPlayers]);

        // Trigger countdown transition
        this.gameStateCallback("countdown");
        this.startCountdown();
      }, 2500);
    }
  }

  private startCountdown() {
    let count = 3;
    const interval = setInterval(() => {
      if (count > 0) {
        this.chatMessageCallback({
          id: `sys-cd-${count}`,
          userId: "sys",
          username: "Système",
          avatar: "",
          text: `${count}...`,
          timestamp: new Date().toLocaleTimeString()
        });
        count--;
      } else {
        clearInterval(interval);
        this.gameStateCallback("playing");
        this.startPlayLoop();
      }
    }, 1000);
  }

  private startPlayLoop() {
    let questionIndex = 0;
    let timeRemaining = 20;

    this.timerCallback(timeRemaining);

    // Question duration timer
    this.timerInterval = setInterval(() => {
      timeRemaining--;
      this.timerCallback(timeRemaining);

      if (timeRemaining <= 0) {
        // Time expired, move to next question or end game
        timeRemaining = 20;
        questionIndex++;
        if (questionIndex >= 5) {
          this.endGame();
        } else {
          this.chatMessageCallback({
            id: `sys-next-${questionIndex}`,
            userId: "sys",
            username: "Système",
            avatar: "",
            text: `Question ${questionIndex + 1} en cours...`,
            timestamp: new Date().toLocaleTimeString()
          });
          this.mockPlayers.forEach(p => p.lastAnswerCorrect = null);
          this.playerJoinedCallback([...this.mockPlayers]);
          this.gameStateCallback("playing", { questionIndex });
        }
      }
    }, 1000);

    // Simulate bots answering and chatting periodically
    this.botInterval = setInterval(() => {
      // Randomly submit answers for bots
      const bot = this.mockPlayers[Math.floor(Math.random() * 2) + 1]; // pick Ali or Lina
      if (bot && bot.lastAnswerCorrect === null) {
        const isCorrect = Math.random() > 0.4;
        bot.lastAnswerCorrect = isCorrect;
        bot.score += isCorrect ? Math.round(100 + Math.random() * 45) : 0;
        this.playerJoinedCallback([...this.mockPlayers]);

        // Send a message sometimes
        if (Math.random() > 0.7) {
          const comments = [
            "Ah, je pense que c'est la B !",
            "Trop rapide !",
            "Ouf, je stresse avec le chrono ⏰",
            "Celle-ci était plus simple.",
            "Des questions d'externat typiques !"
          ];
          this.chatMessageCallback({
            id: `msg-bot-${Math.random()}`,
            userId: bot.user.id,
            username: bot.user.name,
            avatar: bot.user.avatar,
            text: comments[Math.floor(Math.random() * comments.length)],
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }
    }, 4000);
  }

  private endGame() {
    this.cleanup();
    this.gameStateCallback("results");
    
    // Announce winners
    this.chatMessageCallback({
      id: "sys-ended",
      userId: "sys",
      username: "Système",
      avatar: "",
      text: "La partie est terminée ! Voici le classement final.",
      timestamp: new Date().toLocaleTimeString()
    });
  }

  private cleanup() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.botInterval) clearInterval(this.botInterval);
  }

  public submitAnswer(roomId: string, questionIndex: number, optionIndex: number, timeSpentMs: number): void {
    const p = this.mockPlayers.find(pl => pl.user.id === this.userId || pl.user.id === "u1");
    if (p) {
      // Hardcoded correct index is 0 in the mock repo questions
      const isCorrect = optionIndex === 0 || optionIndex === 1; // simple rule for simulation
      p.lastAnswerCorrect = isCorrect;
      p.score += isCorrect ? Math.round(100 + (20000 - timeSpentMs) / 200) : 0;
    }
    this.playerJoinedCallback([...this.mockPlayers]);
  }

  public sendChatMessage(roomId: string, text: string): void {
    // Echo back the player's message
    this.chatMessageCallback({
      id: Math.random().toString(),
      userId: this.userId || "u1",
      username: "Dr. Amine (Vous)",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amine",
      text,
      timestamp: new Date().toLocaleTimeString()
    });

    // Simulate quick bot response sometimes
    setTimeout(() => {
      const responses = [
        "Bien vu !",
        "D'accord avec toi.",
        "Totalement !",
        "Je ne savais pas du tout 😂"
      ];
      this.chatMessageCallback({
        id: Math.random().toString(),
        userId: "u5",
        username: "Ali Larbi",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1500);
  }

  public onPlayerJoined(callback: (players: any[]) => void): void {
    this.playerJoinedCallback = callback;
  }

  public onPlayerLeft(callback: (players: any[]) => void): void {
    this.playerLeftCallback = callback;
  }

  public onGameStateChanged(callback: (state: string, data?: any) => void): void {
    this.gameStateCallback = callback;
  }

  public onChatMessageReceived(callback: (msg: any) => void): void {
    this.chatMessageCallback = callback;
  }

  public onTimerTick(callback: (timeRemaining: number) => void): void {
    this.timerCallback = callback;
  }

  public onError(callback: (errorMsg: string) => void): void {
    this.errorCallback = callback;
  }
}
