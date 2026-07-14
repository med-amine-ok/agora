import { Chapter, LessonListItem, AnatomyData } from "@/types/lesson";

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
  imageUrl?: string;
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
  imageUrl?: string;
}

const SUBJECT_SEEDS: SubjectSeed[] = [
  {
    id: "cardiologie",
    name: "Cardiologie",
    lessonCount: 12,
    unitCount: 3,
    progress: 67,
    color: "#1f8476",
    difficulty: "Moyen",
    focus: "ECG, douleur thoracique et insuffisance cardiaque",
    imageUrl: "https://www.svgrepo.com/show/404696/a-button-blood-type.svg",
  },
  {
    id: "neurologie",
    name: "Neurologie",
    lessonCount: 9,
    unitCount: 2,
    progress: 30,
    color: "#8E44AD",
    difficulty: "Difficile",
    focus: "sémiologie neurologique et urgence vasculaire",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "biochimie",
    name: "Biochimie",
    lessonCount: 15,
    unitCount: 4,
    progress: 40,
    color: "#2980B9",
    difficulty: "Difficile",
    focus: "métabolisme, enzymes et interprétation biologique",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "anatomie",
    name: "Anatomie",
    lessonCount: 20,
    unitCount: 5,
    progress: 25,
    color: "#E67E22",
    difficulty: "Difficile",
    focus: "repères anatomiques et coupes de référence",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "physiologie",
    name: "Physiologie",
    lessonCount: 14,
    unitCount: 3,
    progress: 50,
    color: "#27AE60",
    difficulty: "Moyen",
    focus: "régulation des grandes fonctions et homéostasie",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "hematologie",
    name: "Hématologie",
    lessonCount: 8,
    unitCount: 2,
    progress: 0,
    color: "#C0392B",
    difficulty: "Moyen",
    focus: "anémie, coagulation et lecture de NFS",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "nephrologie",
    name: "Néphrologie",
    lessonCount: 10,
    unitCount: 2,
    progress: 15,
    color: "#1ABC9C",
    difficulty: "Difficile",
    focus: "filtration glomérulaire et troubles hydro-électrolytiques",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "pharmacologie",
    name: "Pharmacologie",
    lessonCount: 18,
    unitCount: 4,
    progress: 0,
    color: "#F39C12",
    difficulty: "Moyen",
    focus: "mécanismes d'action et effets indésirables",
    imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
  },
  {
    id: "microbiologie",
    name: "Microbiologie",
    lessonCount: 11,
    unitCount: 3,
    progress: 85,
    color: "#16A085",
    difficulty: "Facile",
    focus: "bactériologie, virologie et antibiothérapie",
    imageUrl: "https://www.svgrepo.com/show/418519/bacteria.svg",
  },
  {
    id: "pathologie",
    name: "Pathologie",
    lessonCount: 7,
    unitCount: 2,
    progress: 10,
    color: "#7F8C8D",
    difficulty: "Difficile",
    focus: "lésions cellulaires, inflammation et nécrose",
    imageUrl: "https://www.svgrepo.com/show/339739/cell.svg",
  },
];

const lessonFormats: LessonFormat[] = ["Lecture", "Cas clinique", "QCM"];

const createLesson = (
  seed: SubjectSeed,
  unitIndex: number,
  lessonIndex: number,
): LessonItem => {
  const format =
    lessonFormats[(unitIndex + lessonIndex) % lessonFormats.length];
  const completedThreshold =
    unitIndex === 0
      ? lessonIndex === 0
        ? 18
        : 55
      : lessonIndex === 0
        ? 38
        : 72;

  return {
    id: `${seed.id}-u${unitIndex + 1}-l${lessonIndex + 1}`,
    title: `${format} ${lessonIndex + 1} : ${unitIndex === 0 ? "Fondamentaux" : "Mise en pratique"}`,
    format,
    duration: unitIndex === 0 ? "12 min" : "15 min",
    summary: `Aperçu guidé de ${seed.focus.toLowerCase()} avec une progression claire et des repères cliniques utiles.`,
    objectives: [
      `Identifier les notions-clés de ${seed.name.toLowerCase()}.`,
      `Relier la théorie à la pratique clinique.`,
      `Préparer la révision ou le QCM associé.`,
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

export const getLessonMatch = (
  subjectId: string,
  lessonId: string,
): LessonMatch | undefined => {
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

export const getLessonRoute = (subjectId: string, lessonId: string) =>
  `/lessons/${subjectId}/${lessonId}`;

// Seed details for each subject to make names realistic
interface ChapterSeed {
  title: string;
  desc: string;
  icon?: string;
  imageUrl?: string;
}

const CHAPTER_SEEDS: Record<string, ChapterSeed[]> = {
  cardiologie: [
    {
      title: "Le Cœur",
      desc: "Anatomie et physiologie du cœur",
      imageUrl: "https://www.svgrepo.com/show/404718/anatomical-heart.svg",
    },
    {
      title: "La Circulation",
      desc: "Systèmes vasculaires pulmonaire et systémique",
      imageUrl: "https://www.svgrepo.com/show/194858/blood-donation.svg",
    },
    {
      title: "L'ECG",
      desc: "Lecture et interprétation de l'électrocardiogramme",
      icon: "Zap",
      imageUrl:
        "https://www.svgrepo.com/show/284232/cardiogram-electrocardiogram.svg",
    },
    {
      title: "Pathologies Cardiaques",
      desc: "Les principales maladies cardiovasculaires",
      icon: "ShieldAlert",
      imageUrl:
        "https://www.svgrepo.com/show/483383/heartbeat-medical-heartbeat-line.svg",
    },
  ],
  neurologie: [
    {
      title: "Sémiologie neurologique",
      desc: "Examen clinique et repères anatomiques",
      icon: "Brain",
      imageUrl: "/images/chapters/neurologie-c1.png",
    },
    {
      title: "Urgences vasculaires",
      desc: "AVC ischémique, hémorragique et AIT",
      icon: "Activity",
      imageUrl: "/images/chapters/neurologie-c2.png",
    },
    {
      title: "Pathologies neurodégénératives",
      desc: "Maladies d'Alzheimer et de Parkinson",
      icon: "Users",
      imageUrl: "/images/chapters/neurologie-c3.png",
    },
  ],
  biochimie: [
    {
      title: "Métabolisme des glucides",
      desc: "Glycolyse, cycle de Krebs et néoglucogenèse",
      icon: "Layers",
      imageUrl: "/images/chapters/biochimie-c1.png",
    },
    {
      title: "Enzymologie clinique",
      desc: "Cinétique enzymatique et biomarqueurs",
      icon: "Percent",
      imageUrl: "/images/chapters/biochimie-c2.png",
    },
    {
      title: "Lipides et lipoprotéines",
      desc: "Structure, transport et dyslipidémies",
      icon: "Circle",
      imageUrl: "/images/chapters/biochimie-c3.png",
    },
  ],
  anatomie: [
    {
      title: "Repères osseux",
      desc: "Ostéologie générale et squelette axial",
      icon: "Bone",
      imageUrl: "/images/chapters/anatomie-c1.png",
    },
    {
      title: "Système musculaire",
      desc: "Myologie des membres et du tronc",
      icon: "Activity",
      imageUrl: "/images/chapters/anatomie-c2.png",
    },
    {
      title: "Anatomie topographique",
      desc: "Coupes anatomiques de référence",
      icon: "Map",
      imageUrl: "/images/chapters/anatomie-c3.png",
    },
  ],
  physiologie: [
    {
      title: "Homéostasie",
      desc: "Mécanismes de régulation et milieux intérieurs",
      icon: "Cpu",
      imageUrl: "/images/chapters/physiologie-c1.png",
    },
    {
      title: "Physiologie rénale",
      desc: "Filtration glomérulaire et équilibre hydrique",
      icon: "Droplets",
      imageUrl: "/images/chapters/physiologie-c2.png",
    },
    {
      title: "Physiologie respiratoire",
      desc: "Échanges gazeux et contrôle ventilatoire",
      icon: "Wind",
      imageUrl: "/images/chapters/physiologie-c3.png",
    },
  ],
  hematologie: [
    {
      title: "Hémogramme",
      desc: "Lecture et interprétation de la NFS",
      icon: "FileText",
      imageUrl: "/images/chapters/hematologie-c1.png",
    },
    {
      title: "Anémies",
      desc: "Physiopathologie et démarche diagnostique",
      icon: "Shield",
      imageUrl: "/images/chapters/hematologie-c2.png",
    },
    {
      title: "Hémostase",
      desc: "Coagulation et troubles thromboemboliques",
      icon: "Loader",
      imageUrl: "/images/chapters/hematologie-c3.png",
    },
  ],
  nephrologie: [
    {
      title: "Filtration rénale",
      desc: "Glomérule, tubules et clairance",
      icon: "Filter",
      imageUrl: "/images/chapters/nephrologie-c1.png",
    },
    {
      title: "Insuffisance rénale",
      desc: "Formes aiguës et chroniques",
      icon: "TrendingDown",
      imageUrl: "/images/chapters/nephrologie-c2.png",
    },
    {
      title: "Troubles ioniques",
      desc: "Dysnatrémies et dyskaliémies",
      icon: "Activity",
      imageUrl: "/images/chapters/nephrologie-c3.png",
    },
  ],
  pharmacologie: [
    {
      title: "Pharmacocinétique",
      desc: "Absorption, distribution, métabolisme, élimination",
      icon: "FastForward",
      imageUrl: "/images/chapters/pharmacologie-c1.png",
    },
    {
      title: "Pharmacodynamie",
      desc: "Récepteurs, agonistes et antagonistes",
      icon: "Sliders",
      imageUrl: "/images/chapters/pharmacologie-c2.png",
    },
    {
      title: "Classes thérapeutiques",
      desc: "Antibiotiques, antihypertenseurs et antalgiques",
      icon: "FolderPlus",
      imageUrl: "/images/chapters/pharmacologie-c3.png",
    },
  ],
  microbiologie: [
    {
      title: "Bactériologie",
      desc: "Structure bactérienne et coloration de Gram",
      icon: "Grid",
      imageUrl: "/images/chapters/microbiologie-c1.png",
    },
    {
      title: "Virologie médicale",
      desc: "Cycles viraux et principales infections",
      icon: "GitBranch",
      imageUrl: "/images/chapters/microbiologie-c2.png",
    },
    {
      title: "Agents infectieux",
      desc: "Parasites, champignons et diagnostic",
      icon: "EyeOff",
      imageUrl: "/images/chapters/microbiologie-c3.png",
    },
  ],
  pathologie: [
    {
      title: "Lésions cellulaires",
      desc: "Apoptose, nécrose et adaptations",
      icon: "XCircle",
      imageUrl: "/images/chapters/pathologie-c1.png",
    },
    {
      title: "Inflammation",
      desc: "Phases aiguë et chronique, réparation",
      icon: "Flame",
      imageUrl: "/images/chapters/pathologie-c2.png",
    },
    {
      title: "Processus tumoraux",
      desc: "Néoplasies bénignes et malignes",
      icon: "TrendingUp",
      imageUrl: "/images/chapters/pathologie-c3.png",
    },
  ],
};

interface LessonSeed {
  title: string;
  icon?: string;
  imageUrl?: string;
}

const LESSON_SEEDS: Record<string, LessonSeed[]> = {
  "Le Cœur": [
    { title: "Introduction au cœur", icon: "BookOpen" },
    { title: "Anatomie externe du cœur", icon: "Eye" },
    { title: "Les cavités cardiaques", icon: "Layers" },
    { title: "Le cycle cardiaque", icon: "RefreshCw" },
    { title: "Les valves cardiaques", icon: "Sliders" },
  ],
  "La Circulation": [
    { title: "Vaisseaux sanguins", icon: "GitCommit" },
    { title: "Pression artérielle", icon: "Gauge" },
    { title: "Régulation du débit", icon: "Activity" },
    { title: "Microcirculation", icon: "ZoomIn" },
  ],
  "L'ECG": [
    { title: "Bases de l'ECG", icon: "Book" },
    { title: "Interprétation du tracé", icon: "TrendingUp" },
    { title: "Troubles du rythme", icon: "Flame" },
    { title: "Troubles de la conduction", icon: "AlertTriangle" },
  ],
  "Pathologies Cardiaques": [
    { title: "Insuffisance cardiaque", icon: "Heart" },
    { title: "Infarctus du myocarde", icon: "Activity" },
    { title: "Péricardites et myocardites", icon: "Shield" },
  ],

  "Sémiologie neurologique": [
    { title: "Réflexes ostéotendineux", icon: "Hammer" },
    { title: "Voies motrices et sensitives", icon: "GitPullRequest" },
    { title: "Paires crâniennes", icon: "HelpCircle" },
  ],
  "Urgences vasculaires": [
    { title: "Prise en charge de l'AVC", icon: "Clock" },
    { title: "Hémorragie méningée", icon: "Droplets" },
    { title: "AIT", icon: "ShieldAlert" },
  ],
  "Pathologies neurodégénératives": [
    { title: "Démence sénile", icon: "Brain" },
    { title: "Syndrome parkinsonien", icon: "Activity" },
  ],

  "Métabolisme des glucides": [
    { title: "Glycolyse", icon: "Sun" },
    { title: "Cycle de Krebs", icon: "Loader" },
    { title: "Chaîne respiratoire", icon: "GitCommit" },
  ],
  "Enzymologie clinique": [
    { title: "Constante de Michaelis", icon: "Compass" },
    { title: "Régulation allostérique", icon: "Sliders" },
  ],
  "Lipides et lipoprotéines": [
    { title: "Cholestérol et Triglycérides", icon: "Circle" },
    { title: "Athérogénèse", icon: "Lock" },
  ],

  "Repères osseux": [
    { title: "Crâne et face", icon: "Smile" },
    { title: "Colonne vertébrale", icon: "Layers" },
    { title: "Bassin", icon: "Box" },
  ],
  "Système musculaire": [
    { title: "Muscles striés squelettiques", icon: "Activity" },
    { title: "Contraction musculaire", icon: "BatteryCharging" },
  ],
  "Anatomie topographique": [
    { title: "Coupe transversale du thorax", icon: "Columns" },
    { title: "Coupe abdominale", icon: "Map" },
  ],

  Homéostasie: [
    { title: "Boucles de rétroaction", icon: "RefreshCcw" },
    { title: "Thermorégulation", icon: "Thermometer" },
  ],
  "Physiologie rénale": [
    { title: "Néphron et filtration", icon: "Filter" },
    { title: "Système RAA", icon: "Activity" },
  ],
  "Physiologie respiratoire": [
    { title: "Spirométrie", icon: "Wind" },
    { title: "Rapport ventilation-perfusion", icon: "PieChart" },
  ],

  Hémogramme: [
    { title: "Lignée rouge", icon: "Droplet" },
    { title: "Lignée blanche", icon: "Shield" },
    { title: "Plaquettes", icon: "Layers" },
  ],
  Anémies: [
    { title: "Anémie ferriprive", icon: "ShoppingBag" },
    { title: "Anémie inflammatoire", icon: "Flame" },
    { title: "Anémies hémolytiques", icon: "AlertOctagon" },
  ],
  Hémostase: [
    { title: "Hémostase primaire", icon: "Zap" },
    { title: "Coagulation plasmatique", icon: "Play" },
  ],

  "Filtration rénale": [
    { title: "Clairance de la créatinine", icon: "Gauge" },
    { title: "Barrière glomérulaire", icon: "Filter" },
  ],
  "Insuffisance rénale": [
    { title: "IRA obstructive", icon: "Lock" },
    { title: "Nécrose tubulaire aiguë", icon: "XCircle" },
  ],
  "Troubles ioniques": [
    { title: "Hyponatrémies", icon: "ChevronDown" },
    { title: "Hyperkaliémie", icon: "ChevronUp" },
  ],

  Pharmacocinétique: [
    { title: "Biodisponibilité", icon: "Activity" },
    { title: "Volume de distribution", icon: "Box" },
    { title: "Clairance", icon: "Gauge" },
  ],
  Pharmacodynamie: [
    { title: "Affinité et efficacité", icon: "Heart" },
    { title: "Index thérapeutique", icon: "Info" },
  ],
  "Classes thérapeutiques": [
    { title: "Bêta-bloquants", icon: "Shield" },
    { title: "AINS", icon: "Flame" },
    { title: "Macrolides", icon: "Target" },
  ],

  Bactériologie: [
    { title: "Paroi bactérienne", icon: "Grid" },
    { title: "Cultures et antibiogramme", icon: "Map" },
  ],
  "Virologie médicale": [
    { title: "Virus à ADN vs ARN", icon: "GitMerge" },
    { title: "VIH et hépatites", icon: "Activity" },
  ],
  "Agents infectieux": [
    { title: "Candida et Aspergillus", icon: "Cloud" },
    { title: "Paludisme", icon: "Wind" },
  ],

  "Lésions cellulaires": [
    { title: "Stéatose hépatique", icon: "Cloud" },
    { title: "Infarctus tissulaire", icon: "XCircle" },
  ],
  Inflammation: [
    { title: "Médiateurs chimiques", icon: "Flame" },
    { title: "Granulome inflammatoire", icon: "Activity" },
  ],
  "Processus tumoraux": [
    { title: "Dysplasie vs néoplasie", icon: "Eye" },
    { title: "Stadification TNM", icon: "Grid" },
  ],
};

// Dynamic generation of Chapters and Lesson lists to match the layout requirements
export const MOCK_CHAPTERS: Chapter[] = [];
export const MOCK_LESSON_LIST: LessonListItem[] = [];

// Helper functions for content generation
function getAnatomyData(moduleId: string): AnatomyData | undefined {
  if (moduleId === "cardiologie" || moduleId === "anatomie") {
    return {
      type: "heart",
      regions: [
        {
          id: "aorte",
          name: "Aorte",
          desc: "Distribue le sang oxygéné provenant du ventricule gauche vers tout l'organisme.",
          color: "#E74C3C",
        },
        {
          id: "od",
          name: "Oreillette Droite",
          desc: "Reçoit le sang désoxygéné renvoyé par les veines caves supérieure et inférieure.",
          color: "#3498DB",
        },
        {
          id: "vg",
          name: "Ventricule Gauche",
          desc: "Propulse le sang oxygéné à haute pression dans la circulation systémique.",
          color: "#C0392B",
        },
        {
          id: "vd",
          name: "Ventricule Droit",
          desc: "Pompe le sang désoxygéné vers la circulation pulmonaire pour le réoxygéner.",
          color: "#2980B9",
        },
      ],
    };
  }
  if (moduleId === "neurologie") {
    return {
      type: "brain",
      regions: [
        {
          id: "cortex",
          name: "Cortex cérébral",
          desc: "Siège des fonctions cognitives supérieures, de la motricité volontaire et de la perception sensorielle.",
          color: "#8E44AD",
        },
        {
          id: "cervelet",
          name: "Cervelet",
          desc: "Centre de coordination des mouvements, de l'équilibre et de la posture.",
          color: "#9B59B6",
        },
        {
          id: "tronc",
          name: "Tronc cérébral",
          desc: "Régule les fonctions végétatives vitales comme le rythme cardiaque et la respiration.",
          color: "#D2B4DE",
        },
        {
          id: "thalamus",
          name: "Thalamus",
          desc: "Structure de relais majeure pour les voies sensorielles se projetant vers le cortex.",
          color: "#E8DAEF",
        },
      ],
    };
  }
  if (moduleId === "nephrologie") {
    return {
      type: "kidney",
      regions: [
        {
          id: "glome",
          name: "Glomérule",
          desc: "Structure de filtration initiale du plasma pour former l'urine primitive.",
          color: "#1ABC9C",
        },
        {
          id: "tubule",
          name: "Tubules",
          desc: "Assurent la réabsorption sélective de l'eau, du glucose et des électrolytes.",
          color: "#16A085",
        },
        {
          id: "calice",
          name: "Calices",
          desc: "Collectent l'urine des pyramides rénales pour la déverser dans le bassinet.",
          color: "#76D7C4",
        },
        {
          id: "bassinet",
          name: "Bassinet",
          desc: "Cavité collectrice en forme d'entonnoir qui s'abouche dans l'uretère.",
          color: "#A2D9CE",
        },
      ],
    };
  }
  if (
    moduleId === "biochimie" ||
    moduleId === "physiologie" ||
    moduleId === "microbiologie" ||
    moduleId === "pathologie"
  ) {
    return {
      type: "cell",
      regions: [
        {
          id: "noyau",
          name: "Noyau",
          desc: "Contient le génome et orchestre la transcription et la division cellulaire.",
          color: "#2980B9",
        },
        {
          id: "mito",
          name: "Mitochondrie",
          desc: "Organite responsable de la production d'ATP via la chaîne respiratoire.",
          color: "#3498DB",
        },
        {
          id: "cyto",
          name: "Cytoplasme",
          desc: "Milieu intracellulaire abritant les organites et de nombreuses voies métaboliques.",
          color: "#AED6F1",
        },
        {
          id: "membrane",
          name: "Membrane",
          desc: "Double couche lipidique régulant les échanges de nutriments et de signaux.",
          color: "#5DADE2",
        },
      ],
    };
  }
  // Default fallback
  return {
    type: "cell",
    regions: [
      {
        id: "cell1",
        name: "Structure A",
        desc: "Description générale de la structure A.",
        color: "#34495E",
      },
      {
        id: "cell2",
        name: "Structure B",
        desc: "Description générale de la structure B.",
        color: "#5D6D7E",
      },
    ],
  };
}

function generateLessonContent(
  moduleId: string,
  chapterTitle: string,
  lessonTitle: string,
) {
  // Preserve first cardiologie lesson exact data to prevent regressions
  if (
    moduleId === "cardiologie" &&
    chapterTitle === "Le Cœur" &&
    lessonTitle === "Introduction au cœur"
  ) {
    return {
      sections: [
        {
          title: "1. Introduction et anatomie globale",
          content: `Dans cette section, nous abordons les repères anatomiques cardinaux et les rapports anatomiques. Le cœur est un muscle creux situé dans le médiastin moyen, enveloppé par le péricarde. Il est composé de quatre cavités principales fonctionnant en série pour assurer l'oxygénation pulmonaire et la perfusion systémique.`,
        },
        {
          title: "2. Physiopathologie et hémodynamique",
          content: `La physiopathologie cardiaque se caractérise par l'analyse des pressions intracavitaires et vasculaires. Tout obstacle mécanique, tel qu'une sténose valvulaire ou une perte de compliance ventriculaire, va modifier la précharge et la postcharge, entraînant à terme des mécanismes de compensation hypertrophiques.`,
        },
        {
          title: "3. Sémiologie et examens cliniques",
          content: `L'auscultation cardiaque permet d'identifier les bruits physiologiques (B1 et B2) ainsi que d'éventuels souffles ou bruits surajoutés (B3, B4). Ces anomalies acoustiques guident le choix des examens complémentaires, notamment l'échocardiographie transthoracique (ETT) et l'électrocardiogramme (ECG) de repos.`,
        },
        {
          title: "4. Cas clinique d'application",
          content: `Patient de 64 ans se présentant aux urgences pour une dyspnée d'installation progressive associée à des œdèmes des membres inférieurs. L'auscultation révèle un râle crépitant bilatéral aux bases pulmonaires et un galop gauche (B3). Le bilan initial s'oriente vers une insuffisance cardiaque aiguë congestive.`,
        },
      ],
      checkpoints: [
        {
          sectionIndex: 0,
          question:
            "Quelle cavité cardiaque reçoit en premier le sang désoxygéné de l'organisme ?",
          options: [
            { text: "Ventricule gauche", isCorrect: false },
            { text: "Oreillette droite", isCorrect: true },
            { text: "Ventricule droit", isCorrect: false },
            { text: "Oreillette gauche", isCorrect: false },
          ],
          explanation:
            "L'oreillette droite (OD) reçoit le sang pauvre en oxygène provenant des veines caves supérieure et inférieure avant de le propulser vers le ventricule droit.",
        },
        {
          sectionIndex: 1,
          question:
            "Quelle modification hémodynamique immédiate engendre une sténose aortique serrée ?",
          options: [
            { text: "Baisse de la précharge ventriculaire", isCorrect: false },
            {
              text: "Augmentation de la postcharge du ventricule gauche",
              isCorrect: true,
            },
            {
              text: "Diminution immédiate du volume résiduel",
              isCorrect: false,
            },
            {
              text: "Chute de la pression artérielle pulmonaire",
              isCorrect: false,
            },
          ],
          explanation:
            "Une sténose de la valve aortique crée un obstacle à l'éjection du sang du ventricule gauche, ce qui augmente directement la postcharge ventriculaire.",
        },
        {
          sectionIndex: 2,
          question:
            "Quel bruit cardiaque correspond physiologiquement à la fermeture des valves auriculo-ventriculaires ?",
          options: [
            { text: "Le premier bruit (B1)", isCorrect: true },
            { text: "Le second bruit (B2)", isCorrect: false },
            { text: "Le troisième bruit (B3)", isCorrect: false },
            { text: "Le quatrième bruit (B4)", isCorrect: false },
          ],
          explanation:
            "Le premier bruit (B1) est produit par la fermeture des valves mitrale et tricuspide au début de la systole ventriculaire.",
        },
      ],
    };
  }

  // Realistic generation for all other lessons
  const sections = [
    {
      title: `1. Introduction aux notions de : ${lessonTitle}`,
      content: `Dans cette première section, nous jetons les bases fondamentales concernant "${lessonTitle}" dans le cadre du chapitre "${chapterTitle}". Nous analyserons les définitions clés et le contexte général de cette thématique.`,
    },
    {
      title: `2. Principes physiologiques et mécanismes clés`,
      content: `Les mécanismes de "${lessonTitle}" impliquent des régulations complexes et des interactions fines à l'échelle moléculaire ou anatomique.\nL'équilibre homéostasique repose sur la coordination de ces processus, dont les variations mènent aux états pathologiques.`,
    },
    {
      title: `3. Manifestations cliniques et orientation diagnostique`,
      content: `L'exploration sémiologique ou biologique de "${lessonTitle}" constitue un pilier majeur de la pratique.\nL'analyse des signes cliniques précoces et l'interprétation des données paracliniques permettent d'orienter le diagnostic et d'éviter les complications graves.`,
    },
    {
      title: `4. Conclusion et intégration pratique`,
      content: `En conclusion, la maîtrise de "${lessonTitle}" est indispensable pour tout clinicien.\nLa résolution de cas cliniques pratiques et l'analyse critique des données d'examens permettent de consolider cette compétence.`,
    },
  ];

  const checkpoints = [
    {
      sectionIndex: 0,
      question: `Quel est le concept clé initial de la leçon "${lessonTitle}" ?`,
      options: [
        {
          text: "C'est un phénomène secondaire sans importance clinique",
          isCorrect: false,
        },
        {
          text: "Il repose sur des structures et des bases physiologiques spécifiques",
          isCorrect: true,
        },
        {
          text: "Il s'agit d'une réaction uniquement pathologique",
          isCorrect: false,
        },
        {
          text: "Il n'influence pas le métabolisme ou le fonctionnement global",
          isCorrect: false,
        },
      ],
      explanation: `L'explication met en évidence que "${lessonTitle}" s'inscrit dans un cadre physiologique structuré essentiel à maîtriser.`,
    },
    {
      sectionIndex: 1,
      question:
        "Quel mécanisme régit principalement ces variations ou régulations ?",
      options: [
        {
          text: "Des boucles de rétroaction et des interactions ciblées",
          isCorrect: true,
        },
        {
          text: "Une diffusion passive totalement incontrôlée",
          isCorrect: false,
        },
        {
          text: "Une régulation d'origine externe uniquement",
          isCorrect: false,
        },
        { text: "Une absence complète de régulation active", isCorrect: false },
      ],
      explanation:
        "L'homéostasie et le bon fonctionnement reposent sur des contrôles précis et des rétroactions adaptatives.",
    },
    {
      sectionIndex: 2,
      question:
        "Quelle attitude diagnostique ou d'exploration est recommandée face à ces troubles ?",
      options: [
        { text: "Ignorer les symptômes légers", isCorrect: false },
        {
          text: "Réaliser des examens complémentaires adaptés aux hypothèses diagnostiques",
          isCorrect: true,
        },
        {
          text: "Proposer un traitement chirurgical immédiat et systématique",
          isCorrect: false,
        },
        {
          text: "Prescrire uniquement une période de repos prolongée",
          isCorrect: false,
        },
      ],
      explanation:
        "L'orientation se fait à l'aide de bilans ciblés (biologie, imagerie) adaptés à la présentation clinique.",
    },
  ];

  return { sections, checkpoints };
}

// Populate the mock arrays dynamically
Object.entries(CHAPTER_SEEDS).forEach(([moduleId, chs]) => {
  chs.forEach((ch, chIdx) => {
    const chapterId = `${moduleId}-c${chIdx + 1}`;
    const lessonSeeds = LESSON_SEEDS[ch.title] || [
      { title: "Théorie de base", icon: "BookOpen" },
    ];
    const lessonCount = lessonSeeds.length;

    // Add Chapter
    MOCK_CHAPTERS.push({
      id: chapterId,
      moduleId,
      title: ch.title,
      level: chIdx + 1,
      description: ch.desc,
      imageUrl: ch.imageUrl || `/images/chapters/${moduleId}.png`,
      lessonCount,
      questionCount: lessonCount * 3,
      estimatedMinutes: lessonCount * 12,
      completedLessons: chIdx === 0 ? 1 : 0,
      isNew: chIdx === 2,
      isLocked: chIdx > 1,
      flashcardCount: lessonCount * 4,
      icon: ch.icon || "BookOpen",
    });

    // Add Lessons
    lessonSeeds.forEach((seed, lIdx) => {
      const isCardiologie = moduleId === "cardiologie";
      const isFirstChapter = chIdx === 0;

      // Preserve first few IDs for static compatibility
      let lessonId = "";
      if (isCardiologie && isFirstChapter && lIdx === 0) lessonId = "l1";
      else if (isCardiologie && isFirstChapter && lIdx === 1) lessonId = "l2";
      else if (isCardiologie && isFirstChapter && lIdx === 2) lessonId = "l3";
      else if (isCardiologie && isFirstChapter && lIdx === 3) lessonId = "l4";
      else if (isCardiologie && isFirstChapter && lIdx === 4) lessonId = "l5";
      else lessonId = `${moduleId}-c${chIdx + 1}-l${lIdx + 1}`;

      const { sections, checkpoints } = generateLessonContent(
        moduleId,
        ch.title,
        seed.title,
      );
      const anatomyData = lIdx % 2 === 0 ? getAnatomyData(moduleId) : undefined;

      MOCK_LESSON_LIST.push({
        id: lessonId,
        chapterId,
        title: seed.title,
        estimatedMinutes: 10 + lIdx * 2,
        sectionCount: sections.length,
        tags: [
          moduleId.toUpperCase().slice(0, 5),
          lIdx % 2 === 0 ? "Théorie" : "Pratique",
        ],
        hasAnatomy: lIdx % 2 === 0,
        flashcardCount: 4,
        questionCount: checkpoints.length,
        completionPercent: chIdx === 0 && lIdx === 0 ? 100 : 0,
        isCompleted: chIdx === 0 && lIdx === 0,
        isLocked: chIdx > 1,
        icon: seed.icon || "BookOpen",
        sections,
        checkpoints,
        anatomyData,
      });
    });
  });
});
