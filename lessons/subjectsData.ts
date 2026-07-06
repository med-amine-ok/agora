export interface Subject {
  id: string;
  name: string;
  lessonCount: number;
  unitCount: number;
  progress: number;
  color: string; // theme color
  difficulty: "Facile" | "Moyen" | "Difficile";
  tint: "default" | "teal" | "accent" | "red" | "blue" | "green";
}

export const SUBJECTS_DATA: Subject[] = [
  { id: "cardiologie", name: "Cardiologie", lessonCount: 12, unitCount: 3, progress: 67, color: "#C0392B", difficulty: "Moyen", tint: "red" },
  { id: "neurologie", name: "Neurologie", lessonCount: 9, unitCount: 2, progress: 30, color: "#8E44AD", difficulty: "Difficile", tint: "default" },
  { id: "biochimie", name: "Biochimie", lessonCount: 15, unitCount: 4, progress: 40, color: "#2980B9", difficulty: "Difficile", tint: "blue" },
  { id: "anatomie", name: "Anatomie", lessonCount: 20, unitCount: 5, progress: 25, color: "#E67E22", difficulty: "Difficile", tint: "accent" },
  { id: "physiologie", name: "Physiologie", lessonCount: 14, unitCount: 3, progress: 50, color: "#27AE60", difficulty: "Moyen", tint: "green" },
  { id: "hematologie", name: "Hématologie", lessonCount: 8, unitCount: 2, progress: 0, color: "#C0392B", difficulty: "Moyen", tint: "red" },
  { id: "nephrologie", name: "Néphrologie", lessonCount: 10, unitCount: 2, progress: 15, color: "#1ABC9C", difficulty: "Difficile", tint: "teal" },
  { id: "pharmacologie", name: "Pharmacologie", lessonCount: 18, unitCount: 4, progress: 0, color: "#F39C12", difficulty: "Moyen", tint: "accent" },
  { id: "microbiologie", name: "Microbiologie", lessonCount: 11, unitCount: 3, progress: 85, color: "#16A085", difficulty: "Facile", tint: "teal" },
  { id: "pathologie", name: "Pathologie", lessonCount: 7, unitCount: 2, progress: 10, color: "#7F8C8D", difficulty: "Difficile", tint: "default" }
];
