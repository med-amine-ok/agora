import { Chapter, LessonListItem } from "@/types/lesson";

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
  { id: "cardiologie", name: "Cardiologie", lessonCount: 12, unitCount: 3, progress: 67, color: "#1f8476", difficulty: "Moyen", focus: "ECG, douleur thoracique et insuffisance cardiaque" },
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

// Dynamic generation of Chapters and Lesson lists to match the layout requirements
export const MOCK_CHAPTERS: Chapter[] = [];
export const MOCK_LESSON_LIST: LessonListItem[] = [];

// Seed details for each subject to make names realistic
const CHAPTER_SEEDS: Record<string, { title: string; desc: string }[]> = {
  cardiologie: [
    { title: "Le Cœur", desc: "Anatomie et physiologie du cœur" },
    { title: "La Circulation", desc: "Systèmes vasculaires pulmonaire et systémique" },
    { title: "L'ECG", desc: "Lecture et interprétation de l'électrocardiogramme" },
    { title: "Pathologies Cardiaques", desc: "Les principales maladies cardiovasculaires" }
  ],
  neurologie: [
    { title: "Sémiologie neurologique", desc: "Examen clinique et repères anatomiques" },
    { title: "Urgences vasculaires", desc: "AVC ischémique, hémorragique et AIT" },
    { title: "Pathologies neurodégénératives", desc: "Maladies d'Alzheimer et de Parkinson" }
  ],
  biochimie: [
    { title: "Métabolisme des glucides", desc: "Glycolyse, cycle de Krebs et néoglucogenèse" },
    { title: "Enzymologie clinique", desc: "Cinétique enzymatique et biomarqueurs" },
    { title: "Lipides et lipoprotéines", desc: "Structure, transport et dyslipidémies" }
  ],
  anatomie: [
    { title: "Repères osseux", desc: "Ostéologie générale et squelette axial" },
    { title: "Système musculaire", desc: "Myologie des membres et du tronc" },
    { title: "Anatomie topographique", desc: "Coupes anatomiques de référence" }
  ],
  physiologie: [
    { title: "Homéostasie", desc: "Mécanismes de régulation et milieux intérieurs" },
    { title: "Physiologie rénale", desc: "Filtration glomérulaire et équilibre hydrique" },
    { title: "Physiologie respiratoire", desc: "Échanges gazeux et contrôle ventilatoire" }
  ],
  hematologie: [
    { title: "Hémogramme", desc: "Lecture et interprétation de la NFS" },
    { title: "Anémies", desc: "Physiopathologie et démarche diagnostique" },
    { title: "Hémostase", desc: "Coagulation et troubles thromboemboliques" }
  ],
  nephrologie: [
    { title: "Filtration rénale", desc: "Glomérule, tubules et clairance" },
    { title: "Insuffisance rénale", desc: "Formes aiguës et chroniques" },
    { title: "Troubles ioniques", desc: "Dysnatrémies et dyskaliémies" }
  ],
  pharmacologie: [
    { title: "Pharmacocinétique", desc: "Absorption, distribution, métabolisme, élimination" },
    { title: "Pharmacodynamie", desc: "Récepteurs, agonistes et antagonistes" },
    { title: "Classes thérapeutiques", desc: "Antibiotiques, antihypertenseurs et antalgiques" }
  ],
  microbiologie: [
    { title: "Bactériologie", desc: "Structure bactérienne et coloration de Gram" },
    { title: "Virologie médicale", desc: "Cycles viraux et principales infections" },
    { title: "Agents infectieux", desc: "Parasites, champignons et diagnostic" }
  ],
  pathologie: [
    { title: "Lésions cellulaires", desc: "Apoptose, nécrose et adaptations" },
    { title: "Inflammation", desc: "Phases aiguë et chronique, réparation" },
    { title: "Processus tumoraux", desc: "Néoplasies bénignes et malignes" }
  ]
};

const LESSON_SEEDS: Record<string, string[]> = {
  "Le Cœur": ["Introduction au cœur", "Anatomie externe du cœur", "Les cavités cardiaques", "Le cycle cardiaque", "Les valves cardiaques"],
  "La Circulation": ["Vaisseaux sanguins", "Pression artérielle", "Régulation du débit", "Microcirculation"],
  "L'ECG": ["Bases de l'ECG", "Interprétation du tracé", "Troubles du rythme", "Troubles de la conduction"],
  "Pathologies Cardiaques": ["Insuffisance cardiaque", "Infarctus du myocarde", "Péricardites et myocardites"],
  
  "Sémiologie neurologique": ["Réflexes ostéotendineux", "Voies motrices et sensitives", "Paires crâniennes"],
  "Urgences vasculaires": ["Prise en charge de l'AVC", "Hémorragie méningée", "AIT"],
  "Pathologies neurodégénératives": ["Démence sénile", "Syndrome parkinsonien"],

  "Métabolisme des glucides": ["Glycolyse", "Cycle de Krebs", "Chaîne respiratoire"],
  "Enzymologie clinique": ["Constante de Michaelis", "Régulation allostérique"],
  "Lipides et lipoprotéines": ["Cholestérol et Triglycérides", "Athérogénèse"],

  "Repères osseux": ["Crâne et face", "Colonne vertébrale", "Bassin"],
  "Système musculaire": ["Muscles striés squelettiques", "Contraction musculaire"],
  "Anatomie topographique": ["Coupe transversale du thorax", "Coupe abdominale"],

  "Homéostasie": ["Boucles de rétroaction", "Thermorégulation"],
  "Physiologie rénale": ["Néphron et filtration", "Système RAA"],
  "Physiologie respiratoire": ["Spirométrie", "Rapport ventilation-perfusion"],

  "Hémogramme": ["Lignée rouge", "Lignée blanche", "Plaquettes"],
  "Anémies": ["Anémie ferriprive", "Anémie inflammatoire", "Anémies hémolytiques"],
  "Hémostase": ["Hémostase primaire", "Coagulation plasmatique"],

  "Filtration rénale": ["Clairance de la créatinine", "Barrière glomérulaire"],
  "Insuffisance rénale": ["IRA obstructive", "Nécrose tubulaire aiguë"],
  "Troubles ioniques": ["Hyponatrémies", "Hyperkaliémie"],

  "Pharmacocinétique": ["Biodisponibilité", "Volume de distribution", "Clairance"],
  "Pharmacodynamie": ["Affinité et efficacité", "Index thérapeutique"],
  "Classes thérapeutiques": ["Bêta-bloquants", "AINS", "Macrolides"],

  "Bactériologie": ["Paroi bactérienne", "Cultures et antibiogramme"],
  "Virologie médicale": ["Virus à ADN vs ARN", "VIH et hépatites"],
  "Agents infectieux": ["Candida et Aspergillus", "Paludisme"],

  "Lésions cellulaires": ["Stéatose hépatique", "Infarctus tissulaire"],
  "Inflammation": ["Médiateurs chimiques", "Granulome inflammatoire"],
  "Processus tumoraux": ["Dysplasie vs néoplasie", "Stadification TNM"]
};

// Populate the mock arrays dynamically
let chapterCounter = 1;
let lessonCounter = 1;

Object.entries(CHAPTER_SEEDS).forEach(([moduleId, chs]) => {
  chs.forEach((ch, chIdx) => {
    const chapterId = `${moduleId}-c${chIdx + 1}`;
    const lessonTitles = LESSON_SEEDS[ch.title] || ["Leçon 1 : Théorie", "Leçon 2 : Cas pratique", "Leçon 3 : Auto-évaluation"];
    const lessonCount = lessonTitles.length;
    
    // Add Chapter
    MOCK_CHAPTERS.push({
      id: chapterId,
      moduleId,
      title: ch.title,
      level: chIdx + 1,
      description: ch.desc,
      imageUrl: `/images/chapters/${moduleId}.png`,
      lessonCount,
      questionCount: lessonCount * 3,
      estimatedMinutes: lessonCount * 12,
      completedLessons: chIdx === 0 ? 1 : 0,
      isNew: chIdx === 2,
      isLocked: chIdx > 1,
      flashcardCount: lessonCount * 4
    });

    // Add Lessons
    lessonTitles.forEach((title, lIdx) => {
      // Create specific format
      const isCardiologie = moduleId === "cardiologie";
      const isFirstChapter = chIdx === 0;
      
      // Preserve first few IDs for static compatibility if needed, else dynamic
      let lessonId = "";
      if (isCardiologie && isFirstChapter && lIdx === 0) lessonId = "l1";
      else if (isCardiologie && isFirstChapter && lIdx === 1) lessonId = "l2";
      else if (isCardiologie && isFirstChapter && lIdx === 2) lessonId = "l3";
      else if (isCardiologie && isFirstChapter && lIdx === 3) lessonId = "l4";
      else if (isCardiologie && isFirstChapter && lIdx === 4) lessonId = "l5";
      else lessonId = `${moduleId}-c${chIdx + 1}-l${lIdx + 1}`;

      MOCK_LESSON_LIST.push({
        id: lessonId,
        chapterId,
        title,
        estimatedMinutes: 10 + (lIdx * 2),
        sectionCount: 4 + (lIdx % 3),
        tags: [moduleId.toUpperCase().slice(0, 5), lIdx % 2 === 0 ? "Théorie" : "Pratique"],
        hasAnatomy: lIdx % 2 === 0,
        flashcardCount: 4,
        questionCount: 3,
        completionPercent: chIdx === 0 && lIdx === 0 ? 100 : 0,
        isCompleted: chIdx === 0 && lIdx === 0,
        isLocked: chIdx > 1
      });
    });
  });
});
