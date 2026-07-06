export type LessonDifficulty = "Facile" | "Moyen" | "Difficile";
export type LessonFormat = "Lecture" | "Cas clinique" | "QCM";

export interface LessonItem {
  id: string;
  title: string;
  format: LessonFormat;
  duration: string;
  summary: string;
  objectives: string[];
  completed: boolean;
}

export interface UnitItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export interface SubjectItem {
  id: string;
  name: string;
  lessonCount: number;
  unitCount: number;
  progress: number;
  color: string;
  difficulty: LessonDifficulty;
  focus: string;
  overview: string;
  units: UnitItem[];
}

export interface LessonMatch {
  subject: SubjectItem;
  unit: UnitItem;
  lesson: LessonItem;
}

interface SubjectSeed {
  id: string;
  name: string;
  lessonCount: number;
  unitCount: number;
  progress: number;
  color: string;
  difficulty: LessonDifficulty;
  focus: string;
}

const SUBJECT_SEEDS: SubjectSeed[] = [
  { id: "cardiologie", name: "Cardiologie", lessonCount: 12, unitCount: 3, progress: 67, color: "#C0392B", difficulty: "Moyen", focus: "ECG, douleur thoracique et insuffisance cardiaque" },
  { id: "neurologie", name: "Neurologie", lessonCount: 9, unitCount: 2, progress: 30, color: "#8E44AD", difficulty: "Difficile", focus: "sémiologie neurologique et urgence vasculaire" },
  { id: "biochimie", name: "Biochimie", lessonCount: 15, unitCount: 4, progress: 40, color: "#2980B9", difficulty: "Difficile", focus: "métabolisme, enzymes et interprétation biologique" },
  { id: "anatomie", name: "Anatomie", lessonCount: 20, unitCount: 5, progress: 25, color: "#E67E22", difficulty: "Difficile", focus: "repères anatomiques et coupes de référence" },
  { id: "physiologie", name: "Physiologie", lessonCount: 14, unitCount: 3, progress: 50, color: "#27AE60", difficulty: "Moyen", focus: "régulation des grandes fonctions et homéostasie" },
  { id: "hematologie", name: "Hématologie", lessonCount: 8, unitCount: 2, progress: 0, color: "#C0392B", difficulty: "Moyen", focus: "anémie, coagulation et lecture de NFS" },
  { id: "nephrologie", name: "Néphrologie", lessonCount: 10, unitCount: 2, progress: 15, color: "#1ABC9C", difficulty: "Difficile", focus: "filtration glomérulaire et troubles hydro-électrolytiques" },
  { id: "pharmacologie", name: "Pharmacologie", lessonCount: 18, unitCount: 4, progress: 0, color: "#F39C12", difficulty: "Moyen", focus: "mécanismes d'action et effets indésirables" },
  { id: "microbiologie", name: "Microbiologie", lessonCount: 11, unitCount: 3, progress: 85, color: "#16A085", difficulty: "Facile", focus: "bactériologie, virologie et antibiothérapie" },
  { id: "pathologie", name: "Pathologie", lessonCount: 7, unitCount: 2, progress: 10, color: "#7F8C8D", difficulty: "Difficile", focus: "lésions cellulaires, inflammation et nécrose" }
];

const lessonFormats: LessonFormat[] = ["Lecture", "Cas clinique", "QCM"];

const createLesson = (seed: SubjectSeed, unitIndex: number, lessonIndex: number): LessonItem => {
  const format = lessonFormats[(unitIndex + lessonIndex) % lessonFormats.length];
  const completedThreshold = unitIndex === 0 ? (lessonIndex === 0 ? 18 : 55) : (lessonIndex === 0 ? 38 : 72);

  return {
    id: `${seed.id}-u${unitIndex + 1}-l${lessonIndex + 1}`,
    title: `${format} ${lessonIndex + 1} : ${unitIndex === 0 ? "Fondamentaux" : "Mise en pratique"}`,
    format,
    duration: unitIndex === 0 ? "12 min" : "15 min",
    summary: `Aperçu guidé de ${seed.focus.toLowerCase()} avec une progression claire et des repères cliniques utiles.`,
    objectives: [
      `Identifier les notions-clés de ${seed.name.toLowerCase()}.`,
      `Relier la théorie à la pratique clinique.`,
      `Préparer la révision ou le QCM associé.`
    ],
    completed: seed.progress >= completedThreshold,
  };
};

const createUnits = (seed: SubjectSeed): UnitItem[] => [
  {
    id: `${seed.id}-u1`,
    title: `Unité 1 : Bases de ${seed.name}`,
    lessons: [createLesson(seed, 0, 0), createLesson(seed, 0, 1)],
  },
  {
    id: `${seed.id}-u2`,
    title: `Unité 2 : Cas pratiques en ${seed.name}`,
    lessons: [createLesson(seed, 1, 0), createLesson(seed, 1, 1)],
  },
];

export const LESSONS_DATA: SubjectItem[] = SUBJECT_SEEDS.map((seed) => ({
  ...seed,
  overview: `Aperçu condensé de ${seed.focus.toLowerCase()}.`,
  units: createUnits(seed),
}));

export const getSubjectById = (subjectId: string) =>
  LESSONS_DATA.find((subject) => subject.id === subjectId) ?? LESSONS_DATA[0];

export const getLessonMatch = (subjectId: string, lessonId: string): LessonMatch | undefined => {
  const subject = getSubjectById(subjectId);

  for (const unit of subject.units) {
    const lesson = unit.lessons.find((item) => item.id === lessonId);

    if (lesson) {
      return { subject, unit, lesson };
    }
  }

  return undefined;
};

export const getSubjectRoute = (subjectId: string) => `/lessons/${subjectId}`;

export const getLessonRoute = (subjectId: string, lessonId: string) => `/lessons/${subjectId}/${lessonId}`;
