export interface Streak {
  userId: string;
  count: number;
  lastActiveDate: string;
  history: string[]; // ISO Date strings representing active days
}
