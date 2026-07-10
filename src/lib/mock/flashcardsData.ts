import { Flashcard, FlashcardDeck } from "@/types/flashcard";
import { MOCK_LESSON_LIST, MOCK_CHAPTERS, LESSONS_DATA } from "@/app/(student)/lessons/mockLessonsData";

// Statically seed standard questions to make them feel realistic based on modules
const FLASHCARD_QA_TEMPLATES: Record<string, { front: string; back: string; type?: string }[]> = {
  cardiologie: [
    { front: "Quel est le rythme cardiaque sinusal normal au repos ?", back: "Entre 60 et 100 battements par minute.", type: "definition" },
    { front: "Signes cliniques typiques de l'infarctus du myocarde ?", back: "Douleur thoracique rétrosternale constrictive, irradiant vers la mâchoire et le membre supérieur gauche, résistante à la trinitrine.", type: "clinical" },
    { front: "Quelle est la fonction principale du nœud sino-auriculaire ?", back: "Il agit comme le pacemaker naturel du cœur en initiant l'impulsion électrique cardiaque.", type: "definition" },
    { front: "Définition de l'insuffisance cardiaque systolique ?", back: "Incapacité du cœur à éjecter suffisamment de sang en raison d'une baisse de la contractilité myocardique (FEVG diminuée).", type: "definition" }
  ],
  neurologie: [
    { front: "Quel score clinique évalue la profondeur d'un coma ?", back: "Le score de Glasgow (GCS), allant de 3 (coma profond) à 15 (personne consciente).", type: "clinical" },
    { front: "Qu'est-ce que le signe de Babinski indique ?", back: "Une lésion de la voie pyramidale (faisceau cortico-spinal).", type: "definition" },
    { front: "Fenêtre thérapeutique idéale pour la thrombolyse d'un AVC ischémique ?", back: "Dans les 4.5 heures suivant le début des symptômes neurologiques.", type: "clinical" },
    { front: "Triade clinique typique de la maladie de Parkinson ?", back: "Tremblement de repos, akinésie (lenteur des mouvements) et rigidité plastique (en tuyau de plomb).", type: "clinical" }
  ],
  biochimie: [
    { front: "Quel est le bilan énergétique net de la glycolyse pour une molécule de glucose ?", back: "2 ATP et 2 NADH, H+.", type: "definition" },
    { front: "Rôle de l'insuline sur le métabolisme du glucose ?", back: "Hormone hypoglycémiante favorisant l'entrée du glucose dans les cellules et la synthèse de glycogène.", type: "definition" },
    { front: "Quelle enzyme catalyse la réaction limitante du cycle de Krebs ?", back: "L'isocitrate déshydrogénase.", type: "definition" },
    { front: "Indice biologique majeur d'une cholestase ?", back: "Élévation des phosphatases alcalines (PAL) et de la Gamma-GT.", type: "clinical" }
  ],
  anatomie: [
    { front: "Combien de vertèbres composent la colonne vertébrale humaine ?", back: "33 vertèbres au total (7 cervicales, 12 thoraciques, 5 lombaires, 5 sacrées soudées et 4 coccygiennes).", type: "definition" },
    { front: "Quel muscle est le principal inspirateur ?", back: "Le diaphragme, innervé par le nerf phrénique (racines C3, C4, C5).", type: "definition" },
    { front: "Quelle artère vascularise principalement la paroi antérieure du cœur ?", back: "L'artère interventriculaire antérieure (IVA), branche de l'artère coronaire gauche.", type: "definition" },
    { front: "Nom de l'articulation reliant la ceinture pelvienne au membre inférieur ?", back: "L'articulation coxo-fémorale (hanche).", type: "definition" }
  ],
  physiologie: [
    { front: "Quel organe régule principalement l'osmolarité plasmatique ?", back: "Le rein, sous l'action de l'hormone antidiurétique (ADH / Vasopressine).", type: "definition" },
    { front: "Quel est le pH artériel normal du sang humain ?", back: "Entre 7,35 et 7,45.", type: "definition" },
    { front: "Comment la fièvre modifie-t-elle l'affinité de l'hémoglobine pour l'oxygène ?", back: "Elle diminue l'affinité (déviation de la courbe vers la droite), facilitant la libération de l'oxygène aux tissus.", type: "definition" },
    { front: "Effet d'une stimulation du système parasympathique sur la fréquence cardiaque ?", back: "Effet chronotrope négatif (ralentissement du cœur) via le nerf vague (X) et l'acétylcholine.", type: "definition" }
  ]
};

// Default template generator for other subjects
const generateGenericQA = (subjectName: string, lessonTitle: string, cardIndex: number) => {
  const qas = [
    { front: `Quel est le mécanisme physiopathologique clé abordé dans: ${lessonTitle} ?`, back: `Une dysrégulation ou altération des processus physiologiques normaux du système en lien avec ${subjectName.toLowerCase()}.`, type: "definition" },
    { front: `Citez les examens de première intention indiqués pour évaluer: ${lessonTitle} ?`, back: `Un examen clinique complet associé à des marqueurs biologiques spécifiques et une imagerie ciblée.`, type: "clinical" },
    { front: `Quel est l'objectif thérapeutique principal lié à: ${lessonTitle} ?`, back: `Restaurer l'homéostasie, limiter l'extension des lésions et soulager les symptômes cliniques.`, type: "clinical" },
    { front: `Quelle complication majeure doit être surveillée dans le cadre de: ${lessonTitle} ?`, back: `Une décompensation aiguë de la fonction d'organe ou une évolution vers la chronicité.`, type: "clinical" }
  ];
  return qas[cardIndex];
};

export const MOCK_DECKS: FlashcardDeck[] = [];
export const MOCK_FLASHCARDS: Flashcard[] = [];

// Dynamically build all Decks and Flashcards corresponding to every lesson
MOCK_LESSON_LIST.forEach((lesson, index) => {
  const deckId = `d${index + 1}`;
  
  // Resolve context from chapter and subject
  const chapter = MOCK_CHAPTERS.find((c) => c.id === lesson.chapterId);
  const moduleId = chapter?.moduleId || "cardiologie";
  const subject = LESSONS_DATA.find((s) => s.id === moduleId);
  const moduleName = subject?.name || "Cardiologie";

  // Create Deck
  MOCK_DECKS.push({
    id: deckId,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    chapterId: lesson.chapterId,
    moduleId,
    moduleName,
    cardCount: 4,
    aiGeneratedCount: 3,
    userSubmittedCount: 1,
    masteredCount: index % 3 === 0 ? 1 : 0,
    dueCount: index % 3 === 0 ? 3 : 4,
    createdAt: '2025-01-10'
  });

  // Create 4 Flashcards for this Deck
  for (let i = 0; i < 4; i++) {
    const templates = FLASHCARD_QA_TEMPLATES[moduleId];
    let qa = templates ? templates[i] : null;
    if (!qa) {
      qa = generateGenericQA(moduleName, lesson.title, i);
    }

    MOCK_FLASHCARDS.push({
      id: `fc-${lesson.id}-${i + 1}`,
      type: (qa.type as any) || 'definition',
      deckId,
      front: qa.front,
      back: qa.back,
      source: i === 3 ? 'user_submitted' : 'ai_generated',
      status: 'approved',
      difficulty: i % 2 === 0 ? 'easy' : 'medium',
      lessonId: lesson.id,
      chapterId: lesson.chapterId,
      moduleId,
      createdAt: '2025-01-10'
    });
  }
});
