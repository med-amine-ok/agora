export interface Lesson {
  id: string;
  subjectId: string;
  unitId: string;
  title: string;
  content: string; // Markdown/HTML content
  estimatedReadTime: number; // in minutes
  questionCount: number;
  accuracy?: number; // user accuracy
  isCompleted?: boolean;
}

export interface Unit {
  id: string;
  subjectId: string;
  title: string;
  lessons: Lesson[];
  completionPercentage: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string; // Key of pre-defined SVG icons
  unitCount: number;
  lessonCount: number;
  completionPercentage: number;
  color: string; // Subject hex/Tailwind theme color
}
