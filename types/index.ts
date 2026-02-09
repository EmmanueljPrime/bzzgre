export type Participant = {
  id: number;
  name: string;
  drinks: string[];
  assignedDrink: string | null;
};

export type BarTheme = {
  primary: string; // Couleur principale
  secondary: string; // Couleur secondaire
  accent: string; // Couleur d'accent
  background: string; // Couleur de fond
  cardBg: string; // Couleur de fond des cartes
};

export type Bar = {
  id: string;
  name: string;
  description: string;
  logo?: string; // Chemin optionnel vers le logo
  theme: BarTheme;
  drinks: string[]; // Liste des boissons disponibles
};

export type Config = {
  numberOfPeople: number;
  drinksPerPerson: number;
  selectedBar: Bar | null;
};

export type AppState = {
  config: Config;
  participants: Participant[];
  isSetupComplete: boolean;
  isDrawingComplete: boolean;
};

export const initialAppState: AppState = {
  config: {
    numberOfPeople: 0,
    drinksPerPerson: 0,
    selectedBar: null,
  },
  participants: [],
  isSetupComplete: false,
  isDrawingComplete: false,
};

// Bars disponibles
export const AVAILABLE_BARS: Bar[] = [
  {
    id: 'fusion',
    name: 'Fusion',
    description: 'Bar tendance avec ambiance chaleureuse',
    logo: '/bar_brand/fusion_logo.webp',
    theme: {
      primary: '45 90% 55%', // Jaune gold
      secondary: '30 20% 20%', // Marron
      accent: '45 100% 65%', // Jaune clair
      background: '0 0% 8%', // Noir profond
      cardBg: '30 15% 15%', // Marron foncé
    },
    drinks: [
      'Pornstar Martini',
      'Cinnamon cramberry',
      'Le Confiance',
      'Le Grinch',
      'Gin Tonic',
      'Gin Pêche',
      'Cidre',
      'Mazout',
      'Perroquet',
      'Mojito',
    ],
  },
  {
    id: 'classic',
    name: 'Mode Classique',
    description: 'Sans thème spécifique de bar',
    theme: {
      primary: '280 90% 65%', // Violet
      secondary: '320 80% 60%', // Rose
      accent: '180 80% 50%', // Cyan
      background: '250 60% 10%', // Violet foncé
      cardBg: '250 40% 15%', // Violet moyen
    },
    drinks: [],
  },
];
