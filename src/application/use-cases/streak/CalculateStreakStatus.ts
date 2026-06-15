export class CalculateStreakStatus {
  public execute(lastActiveDateStr: string, currentStreak: number): { isActive: boolean; newStreakValue: number } {
    if (currentStreak === 0 || !lastActiveDateStr) {
      return { isActive: false, newStreakValue: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(lastActiveDateStr);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      // Studied today or yesterday, streak is still active!
      return { isActive: true, newStreakValue: currentStreak };
    } else {
      // Missed more than 1 day, streak is broken!
      return { isActive: false, newStreakValue: 0 };
    }
  }
}
