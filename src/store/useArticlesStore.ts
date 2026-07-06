import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  likes: number;
  coverImage: string;
  tags: string[];
  summaryPoints: string[];
  medicalNotes: string[];
}

interface ArticlesState {
  articles: Article[];
  addArticle: (article: Omit<Article, "id" | "likes" | "date">) => void;
  updateArticle: (id: string, updatedFields: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
}

const initialArticles: Article[] = [
  {
    id: "1",
    title: "Approche diagnostique moderne des tachycardies supraventriculaires",
    excerpt: "Un guide clinique complet sur la lecture rapide de l'ECG, l'identification des ondes P rétrogrades et le choix des manœuvres vagales.",
    category: "Cardiologie",
    readTime: "6 min",
    date: "02 Juillet 2026",
    author: "Dr. L. Belkacem",
    likes: 24,
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tags: ["ECG", "Tachyardie", "Urgences"],
    summaryPoints: [
      "Identifier l'absence ou la présence d'ondes P' rétrogrades.",
      "Réaliser correctement les manœuvres vagales (massage sino-carotidien ou Valsalva modifié).",
      "Connaître les indications et contre-indications de l'adénosine."
    ],
    medicalNotes: [
      "Note Clinique : Une TSV à complexes fins chez un patient instable (hypotension, angor) impose une cardioversion électrique immédiate sans attendre les manœuvres médicamenteuses."
    ],
    content: `Les tachycardies supraventriculaires (TSV) représentent un motif fréquent de consultation aux urgences. L'approche diagnostique doit être systématique pour différencier une tachycardie par réentrée nodale (TRN) d'une tachycardie orthodromique sur voie accessoire.

### 1. Analyse initiale de l'ECG
Recherchez d'abord la régularité de la tachycardie et la largeur des complexes QRS. En présence de complexes fins réguliers, la question clé est la recherche de l'activité auriculaire (ondes P).

- **Ondes P invisibles** : Très en faveur d'une TRN commune où l'activation auriculaire et ventriculaire est quasi-simultanée.
- **Ondes P rétrogrades (déformation de la fin du QRS en pseudo-s' ou pseudo-r')** : Signe classique de réentrée nodale.
- **Intervalle RP' > P'R** : Pensez à une tachycardie auriculaire ou à une TRN atypique.

### 2. Algorithme de prise en charge
En l'absence de critères d'instabilité hémodynamique, la première ligne thérapeutique repose sur les manœuvres vagales. La technique de Valsalva modifiée (avec élévation passive des jambes après la phase d'expiration forcée) augmente le taux de succès de conversion à plus de 40%.

En cas d'échec des manœuvres, l'adénosine en bolus intraveineux rapide sous monitoring ECG permanent est le traitement pharmacologique de choix, permettant à la fois le diagnostic (par démasquage de l'activité auriculaire sous-jacente) et le traitement.`
  },
  {
    id: "2",
    title: "Interprétation des gaz du sang : Pièges cliniques et formules utiles",
    excerpt: "Comment interpréter correctement les désordres acido-basiques mixtes au niveau des urgences médicales et réanimations.",
    category: "Pneumologie",
    readTime: "8 min",
    date: "28 Juin 2026",
    author: "Dr. A. Mezouar",
    likes: 18,
    coverImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80",
    tags: ["Gaz du sang", "Acidose", "Réanimation"],
    summaryPoints: [
      "Toujours évaluer la cohérence de l'équation de Henderson-Hasselbalch.",
      "Calculer systématiquement le trou anionique plasmatique dans les acidoses métaboliques.",
      "Rechercher un désordre mixte associé via le calcul de la réponse compensatrice attendue."
    ],
    medicalNotes: [
      "Règle d'or : Un trou anionique élevé traduit toujours la présence d'une acidose métabolique, quel que soit le niveau du pH ou des bicarbonates."
    ],
    content: `L'interprétation des gaz du sang artériel (GDS) est une compétence fondamentale en médecine aiguë. Trop souvent, l'analyse s'arrête à la lecture du pH et de la pCO2, manquant ainsi des désordres mixtes complexes.

### 1. La règle des trois étapes
Une analyse rigoureuse nécessite d'évaluer successivement :
1. Le pH pour déterminer le désordre primaire (acidémie vs alcalémie).
2. La pCO2 et les HCO3- pour identifier l'origine métabolique ou respiratoire.
3. Le calcul systématique du trou anionique (TA = Na+ - [Cl- + HCO3-]), avec une valeur normale attendue autour de 12 ± 2 mEq/L.

### 2. Évaluation des compensations
Pour chaque désordre primaire, l'organisme répond par une compensation prévisible. Si la compensation mesurée s'écarte de la valeur attendue par les formules classiques (comme la formule de Winters pour l'acidose métabolique), un second désordre acido-basique est présent.`
  },
  {
    id: "3",
    title: "Guide complet de préparation au concours de résidanat",
    excerpt: "Découvrez le calendrier optimal de révision, les sources de questions recommandées et les pièges classiques à éviter durant votre préparation externe.",
    category: "Méthodologie",
    readTime: "10 min",
    date: "04 Juillet 2026",
    author: "Dr. Belkacem",
    likes: 42,
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    tags: ["Résidanat", "Méthodologie", "Concours"],
    summaryPoints: [
      "Faire primer la régularité quotidienne sur le volume horaire brut.",
      "Pratiquer le rappel actif par les QCM dès le début de la révision.",
      "Planifier un minimum de trois tours complets de révisions."
    ],
    medicalNotes: [
      "Conseil de major : Ne passez pas des heures à réécrire des fiches de cours entières. Privilégiez les fiches d'erreurs focalisées uniquement sur vos lacunes récurrentes."
    ],
    content: `Le concours de résidanat est un marathon intellectuel qui demande rigueur et endurance. Réussir ne dépend pas uniquement de la quantité de travail, mais de l'efficacité de vos méthodes d'apprentissage.

### 1. Organisation du planning annuel
Il est fortement recommandé de diviser l'année en trois phases distinctes :
- **Le premier tour (6 mois)** : Assimilation de fond, compréhension des mécanismes physiopathologiques et premiers QCM d'entraînement.
- **Le deuxième tour (4 mois)** : Consolidation, mémorisation active des détails fins et augmentation du rythme de traitement des dossiers cliniques.
- **Le tour rapide (2 mois)** : Fiches de synthèse, révision des questions tombées les années précédentes et entraînement intensif en conditions réelles.

### 2. Le rappel actif et la répétition espacée
La simple lecture passive est l'ennemi numéro un de la mémorisation à long terme. Testez-vous constamment avec des QCM, discutez de cas cliniques en petits groupes et utilisez des flashcards pour fixer les critères diagnostiques et les posologies clés.`
  },
  {
    id: "4",
    title: "L'essentiel sur la pédiatrie d'urgence au cabinet",
    excerpt: "Reconnaître les signes de gravité chez le nourrisson fébrile, gérer la bronchiolite aiguë et savoir quand orienter vers l'hôpital.",
    category: "Pédiatrie",
    readTime: "7 min",
    date: "30 Juin 2026",
    author: "Dr. S. Bouhired",
    likes: 31,
    coverImage: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    tags: ["Pédiatrie", "Urgences", "Nourrisson"],
    summaryPoints: [
      "Toute fièvre chez un nourrisson de moins de 3 mois impose un bilan hospitalier systématique.",
      "Le score de Wang reste une aide précieuse pour l'évaluation de la détresse respiratoire.",
      "Savoir rassurer les parents tout en donnant des consignes de surveillance écrites."
    ],
    medicalNotes: [
      "Alerte de sécurité : Une modification du comportement, une léthargie, des gémissements ou un refus d'alimentation sont des signes d'alerte majeurs chez le nourrisson fébrile, même en l'absence de signes focaux."
    ],
    content: `Accueillir un enfant en urgence au cabinet médical génère souvent du stress. Une évaluation méthodique basée sur le Triangle d'Évaluation Pédiatrique (TEP) permet de sécuriser immédiatement la prise en charge.

### 1. Le Triangle d'Évaluation Pédiatrique (TEP)
Cet outil rapide permet d'évaluer en moins de 30 secondes sans toucher l'enfant :
1. **L'apparence** : Tonus, réactivité, consolabilité, regard.
2. **Le travail respiratoire** : Tirage, geignement, tachypnée, balancement thoraco-abdominal.
3. **La circulation cutanée** : Pâleur, marbrures, cyanose.

Si l'un des côtés du triangle est altéré, une attention immédiate est requise. Si deux ou trois côtés sont atteints, l'enfant est en détresse vitale.`
  }
];

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set) => ({
      articles: initialArticles,
      addArticle: (newArticle) =>
        set((state) => {
          const created: Article = {
            ...newArticle,
            id: Math.floor(Math.random() * 100000).toString(),
            likes: 0,
            date: new Date().toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
          };
          return { articles: [created, ...state.articles] };
        }),
      updateArticle: (id, updatedFields) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...updatedFields } : a
          ),
        })),
      deleteArticle: (id) =>
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        })),
      likeArticle: (id) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, likes: a.likes + 1 } : a
          ),
        })),
    }),
    {
      name: "agora-articles-storage",
    }
  )
);
