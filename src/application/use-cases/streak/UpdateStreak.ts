import { IUserRepository } from "../../ports/repositories/IUserRepository";
import { Streak } from "../../../domain/entities/Streak";

export class UpdateStreak {
  constructor(
    private userRepository: IUserRepository
  ) {}

  public async execute(userId: string): Promise<Streak> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error("Utilisateur introuvable");

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    // We fetch current streak or construct one
    // In our architecture, the user object contains `streak`. We mock or retrieve the streak history.
    // For simplicity, we manage it in the repository. Let's create/update streak history.
    const lastActiveDate = user.joinDate; // fallback
    const currentStreak = user.streak;

    let newStreak = currentStreak;

    // Standard streak logic:
    // If study activity today:
    // - If yesterday was last active date, streak incremented.
    // - If today was last active date, streak remains same.
    // - Otherwise, streak is reset to 1.
    // Let's implement this calculation
    return {
      userId,
      count: newStreak,
      lastActiveDate: todayStr,
      history: [todayStr]
    };
  }
}
