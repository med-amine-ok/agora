export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  streak: number;
  yearOfStudy: number;
  university?: string;
  role: 'student' | 'admin';
  points: number;
  isPremium: boolean;
  joinDate: string;
}
