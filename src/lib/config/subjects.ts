export interface SubjectConfigItem {
  emoji: string;
  surfaceColor: string;
  accent: string;
  accentLight: string;
  level: string;
}

export const SUBJECT_CONFIG: Record<string, SubjectConfigItem> = {
  cardiologie: {
    emoji:        '🫀',
    surfaceColor: '#FDF0EE',   // very light coral
    accent:       '#E8593C',   // coral-red
    accentLight:  '#F5B4A8',
    level:        'FONDAMENTAL',
  },
  neurologie: {
    emoji:        '🧠',
    surfaceColor: '#F3F0FD',   // very light purple
    accent:       '#7C5CBF',   // purple
    accentLight:  '#C4B2E8',
    level:        'INTERMÉDIAIRE',
  },
  anatomie: {
    emoji:        '🦴',
    surfaceColor: '#EEF4FD',   // very light blue
    accent:       '#3B82C4',   // blue
    accentLight:  '#9DC1E8',
    level:        'FONDAMENTAL',
  },
  biochimie: {
    emoji:        '⚗️',
    surfaceColor: '#FDF7EE',   // very light amber
    accent:       '#D4820A',   // amber-gold
    accentLight:  '#F0C060',
    level:        'AVANCÉ',
  },
  nephrologie: {
    emoji:        '🫘',
    surfaceColor: '#EEF6FA',   // very light blue-teal
    accent:       '#2E86AB',   // blue-teal
    accentLight:  '#8ABFD6',
    level:        'INTERMÉDIAIRE',
  },
  pneumologie: {
    emoji:        '🫁',
    surfaceColor: '#E8F8F8',   // very light teal
    accent:       '#0E7C7B',   // teal (our brand)
    accentLight:  '#5DC8C6',
    level:        'FONDAMENTAL',
  },
  pharmacologie: {
    emoji:        '💊',
    surfaceColor: '#FDF0F7',   // very light pink
    accent:       '#C0397A',   // pink
    accentLight:  '#E899C4',
    level:        'AVANCÉ',
  },
  gastroenterologie: {
    emoji:        '🔬',
    surfaceColor: '#F0FAF0',   // very light green
    accent:       '#2D8A40',   // green
    accentLight:  '#88C490',
    level:        'INTERMÉDIAIRE',
  },
};
