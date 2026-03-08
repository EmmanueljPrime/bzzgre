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

// Type pour une boisson individuelle avec détails
export type DrinkItem = {
  nom: string;
  descriptif?: string;
  prix?: string;
};

// Type pour une sous-catégorie (ex: "Classiques" dans Softs)
export type DrinkSubCategory = {
  [subCategoryName: string]: DrinkItem[];
};

// Type pour les catégories principales (ex: "Softs", "Vins")
export type DrinkCategories = {
  [categoryName: string]: DrinkItem[] | DrinkSubCategory;
};

export type Bar = {
  id: string;
  name: string;
  description: string;
  logo?: string; // Chemin optionnel vers le logo
  theme: BarTheme;
  drinks: string[]; // Array simple pour compatibilité (mode classique)
  categorizedDrinks?: DrinkCategories; // Nouvelle structure catégorisée
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
    drinks: [], // Gardé vide pour compatibilité
    categorizedDrinks: {
      "Softs": {
        "Classiques": [
          { nom: "Coca-Cola Zero", descriptif: "", prix: "3.80€" },
          { nom: "London Cola Zero", descriptif: "Tonic Beer Essence", prix: "3.80€" },
          { nom: "London Essence", descriptif: "Ginger Beer", prix: "3.20€" }
        ],
        "Coq Touque": [
          { nom: "Pomme-Vanille", descriptif: "Made in France", prix: "5€" },
          { nom: "Abricot-Framboise", descriptif: "", prix: "5€" },
          { nom: "Poire Williams", descriptif: "", prix: "5€" },
          { nom: "Ananas-Pain d'épice", descriptif: "", prix: "5€" }
        ],
        "Shore": [
          { nom: "Mélange subtil et gourmand", descriptif: "fruits et eau légèrement pétillante", prix: "4.50€" },
          { nom: "Menthe-Citron", descriptif: "", prix: "4.50€" },
          { nom: "Pomme-Cassis", descriptif: "", prix: "4.50€" }
        ]
      },
      "Vins": {
        "Blancs": [
          { nom: "Bouchard Chardonnay", descriptif: "2023 13°", prix: "5€ / 28€" },
          { nom: "Le Petit Maurice Cévennes", descriptif: "2023 13°", prix: "6€ / 34€" },
          { nom: "Uby N°4 Côté de Gascogne", descriptif: "", prix: "5€ / 28€" },
          { nom: "La Traversata Vermentino Toscane", descriptif: "", prix: "6€ / 34€" }
        ],
        "Champagnes": [
          { nom: "Charles Mignon Premier Cru Brut", descriptif: "12.5°", prix: "9€ / 65€" },
          { nom: "Billecart-Salmon Brut", descriptif: "12°", prix: "12€ / 85€" },
          { nom: "Gailly Rosé", descriptif: "12.5°", prix: "28€" }
        ]
      },
      "Digestifs": [
        { nom: "Sassy XO", descriptif: "40°", prix: "8€" },
        { nom: "Calvados 10°", descriptif: "40°", prix: "8€" },
        { nom: "Hennessy VSOP", descriptif: "40°", prix: "9€" },
        { nom: "Cognac Rémy Martin VSOP", descriptif: "40°", prix: "10€" },
        { nom: "Cognac Ragnaud XO", descriptif: "40°", prix: "15€" },
        { nom: "Bas Armagnac Tariquet XO", descriptif: "40°", prix: "15€" },
        { nom: "Calvados Domfrontais", descriptif: "", prix: "18€" }
      ],
      "Whiskys": [
        { nom: "Bellevue Bleu", descriptif: "France 40°", prix: "9€" },
        { nom: "Bellevue Blanc", descriptif: "France 40°", prix: "9€" },
        { nom: "Bellevue Vert", descriptif: "France 43°", prix: "15€" },
        { nom: "Glenfiddich 15", descriptif: "Écosse 40°", prix: "8€" },
        { nom: "Caol Ila 12", descriptif: "Écosse 43°", prix: "11€" },
        { nom: "Islay Spot", descriptif: "Écosse 46°", prix: "12€" },
        { nom: "Glenmorangie Nectar d'Or", descriptif: "Écosse 46°", prix: "12€" },
        { nom: "The Balvenie", descriptif: "Écosse 43°", prix: "20€" },
        { nom: "Bulleit Rye Vert", descriptif: "Kentucky 45°", prix: "35€" },
        { nom: "Buffalo Trace", descriptif: "Kentucky 45°", prix: "8€" },
        { nom: "Maker's Mark", descriptif: "Kentucky 45°", prix: "10€" },
        { nom: "Kavalan", descriptif: "Taiwan 40°", prix: "12€" }
      ],
      "Aperitifs": [
        { nom: "Ricard", descriptif: "45° 2cl", prix: "3.5€" },
        { nom: "Pedro Ximenez", descriptif: "15° 4cl", prix: "5€" },
        { nom: "Lillet Blanc", descriptif: "17° 5cl", prix: "5€" },
        { nom: "Lillet Rosé", descriptif: "17° 6cl", prix: "5€" },
        { nom: "Dolin Blanc", descriptif: "16° 6cl", prix: "5€" },
        { nom: "Dolin Rouge", descriptif: "16° 6cl", prix: "5€" },
        { nom: "Noilly Prat", descriptif: "18° 5cl", prix: "5€" },
        { nom: "Henri Bardouin", descriptif: "45° 2cl", prix: "6€" },
        { nom: "Campari", descriptif: "25° 5cl", prix: "6€" },
        { nom: "Antica Formula", descriptif: "16.5° 6cl", prix: "8€" },
        { nom: "Double Jus 30 & 40", descriptif: "25° 6cl", prix: "9€" }
      ],
      "Bieres": [
        { nom: "Sparta Blonde", descriptif: "5° (pression)", prix: "3.20€ / 6€" },
        { nom: "Innovation IPA", descriptif: "6.7° (pression)", prix: "4.20€ / 8€" },
        { nom: "Delen Blanche", descriptif: "5° (pression)", prix: "4.20€ / 8€" },
        { nom: "Adnams Cider", descriptif: "5° (pression)", prix: "4.20€ / 8€" },
        { nom: "Kasteel Rouge", descriptif: "8° (bouteille)", prix: "6€" },
        { nom: "Bière du moment", descriptif: "(bouteille)", prix: "6€" }
      ],
      "Cocktails": [
        { nom: "Cranberry Cinnamon Sour", descriptif: "Vodka, cranberry cannelle, sirop brun de cannelle, blanc d'oeuf", prix: "11€" },
        { nom: "Pear Gimlet", descriptif: "Gin, sirop de sucre, citron vert, teinture verte sauce", prix: "10€" },
        { nom: "Le Pomme", descriptif: "Eau de vie de cidre, sirop de sucre, citron vert", prix: "10€" },
        { nom: "Pornstar Martini", descriptif: "Vodka infusée à la vanille, sirop simple, citron vert, fruit de la passion", prix: "12€" },
        { nom: "Le Grinch", descriptif: "Chartreuse verte/jus d'ananas, sirop de sucre, citron vert, blanc d'oeuf", prix: "12€" },
        { nom: "White Negroni", descriptif: "Gin, suze blanc, lillet blanc, teinture de camomille", prix: "11€" }
      ],
      "Gins": [
        { nom: "Beefeater", descriptif: "Angleterre 40°", prix: "6€" },
        { nom: "Citadelle", descriptif: "France 44°", prix: "7€" },
        { nom: "Bombay Sapphire", descriptif: "Angleterre 40°", prix: "7€" },
        { nom: "Malty Rosa", descriptif: "Italie 41°", prix: "7€" },
        { nom: "Hendrick's", descriptif: "Écosse 41°", prix: "7.5€" },
        { nom: "Christian Droin", descriptif: "France 42°", prix: "8€" },
        { nom: "G Vine Pêche", descriptif: "France 37.5°", prix: "8€" },
        { nom: "Botanist", descriptif: "Écosse 46°", prix: "9€" },
        { nom: "Etsu Japon", descriptif: "43° Angleterre 47.5°", prix: "9€" },
        { nom: "Supplément Tonic", descriptif: "États-Unis 42°", prix: "10€" },
        { nom: "Supplément London Essence", descriptif: "", prix: "2€" }
      ],
      "Rhums": [
        { nom: "Sailor Jerry", descriptif: "Caraïbes 40°", prix: "6€" },
        { nom: "Plantation 3", descriptif: "Caraïbes 41.2°", prix: "7€" },
        { nom: "Plantation Pineapple", descriptif: "Barbade 40°", prix: "8€" },
        { nom: "Botran 15", descriptif: "Guatemala 40°", prix: "8€" },
        { nom: "Bally Yam", descriptif: "Martinique 35.3°", prix: "9€" },
        { nom: "Clarin Sajo", descriptif: "Haïti 53.2°", prix: "9€" },
        { nom: "Diplomatico", descriptif: "Venezuela 40°", prix: "10€" },
        { nom: "Hampden 8", descriptif: "Jamaïque 46°", prix: "11€" },
        { nom: "Centenario 20", descriptif: "Costa Rica 40°", prix: "13€" },
        { nom: "Angostura 1824", descriptif: "Trinité-et-Tobago 40°", prix: "13.5€" },
        { nom: "Clément", descriptif: "Réunion 40°", prix: "14€" },
        { nom: "Père Labat 6", descriptif: "Marie-Galante 42°", prix: "25€" }
      ],
      "Autres": {
        "Divers": [
          { nom: "Cachaça Leblan", descriptif: "40°", prix: "8€" },
          { nom: "Mezcal", descriptif: "42°", prix: "10€" },
          { nom: "Tequila Fula Reposado", descriptif: "40°", prix: "12€" }
        ],
        "Liqueurs": [
          { nom: "Amaretto Disaronno", descriptif: "28°", prix: "6€" },
          { nom: "Luxardo Maraschino", descriptif: "32°", prix: "6€" },
          { nom: "Cointreau", descriptif: "40°", prix: "6€" },
          { nom: "Fernet Branca", descriptif: "39°", prix: "8€" },
          { nom: "Chambord", descriptif: "16.5°", prix: "8€" },
          { nom: "Bénédictine", descriptif: "40°", prix: "8€" }
        ]
      }
    }
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
