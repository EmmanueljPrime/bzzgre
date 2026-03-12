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
      secondary: '22 75% 58%', // Cuivré voyant
      accent: '45 100% 65%', // Jaune clair
      background: '0 0% 8%', // Noir profond
      cardBg: '30 15% 15%', // Marron foncé
    },
    drinks: [], // Gardé vide pour compatibilité
    categorizedDrinks: {
      "Softs": {
        "Les Classiques": [
          { nom: "Coca - Cola", descriptif: "", prix: "3.80€" },
          { nom: "Coca - Cola Zero", descriptif: "", prix: "3.80€" },
          { nom: "London Essence", descriptif: "Tonic", prix: "3.20€" },
          { nom: "London Essence", descriptif: "Ginger Beer", prix: "3.20€" }
        ],
        "Les Coq Toqué": [
          { nom: "Pomme - Vanille", descriptif: "Made in France", prix: "5€" },
          { nom: "Pomme - Fraise", descriptif: "Made in France", prix: "5€" },
          { nom: "Abricot du Roussillon", descriptif: "", prix: "5€" },
          { nom: "Poire Williams", descriptif: "", prix: "5€" },
          { nom: "Ananas - Pain d'épice", descriptif: "", prix: "5€" },
          { nom: "Tomate - Romarin", descriptif: "", prix: "5€" }
        ],
        "Les SHROLE": [
          { nom: "Menthe - Citron", descriptif: "", prix: "4.50€" },
          { nom: "Pomme - Cassis", descriptif: "", prix: "4.50€" }
        ]
      },
      "Vins": {
        "Rouges": [
          { nom: "Château Castel Viaud, Lalande-De-Pomérols", descriptif: "2018 (13.5°)", prix: "8€ / 45€" },
          { nom: "Bouchard, Pinot Noir", descriptif: "2023 (13°)", prix: "6€ / 34€" },
          { nom: "Cuvée des galets (bio), Côte du Rhône", descriptif: "2023 (14.5°)", prix: "5€ / 28€" },
          { nom: "Les Pipelettes, AOC Corbières", descriptif: "2023 (13.5°)", prix: "8€ / 47.5€" }
        ],
        "Rosés": [
          { nom: "Ma Bohème, Gris de Gris", descriptif: "(12.5°)", prix: "6.5€ / 38€" },
          { nom: "Cuvée Marine, Côte de Provence", descriptif: "(12.5°)", prix: "5.5€ / 32€" },
          { nom: "Mino, Corse", descriptif: "(12.5°)", prix: "6€ / 35€" }
        ],
        "Oranges": [
          { nom: "Selon arrivage du moment", descriptif: "", prix: "6€ / 35€" }
        ],
        "Blancs": [
          { nom: "Bouchard, Chardonnay", descriptif: "2023 (13°)", prix: "5€ / 28€" },
          { nom: "Le Petit Maurice, Cévennes", descriptif: "2023 (13°)", prix: "6€ / 34€" },
          { nom: "Uby N°4, Côte de Gascogne", descriptif: "", prix: "5€ / 28€" },
          { nom: "La Traversata, Vermentino Toscana", descriptif: "", prix: "6€ / 34€" }
        ],
        "Champagnes": [
          { nom: "Charles Mignon, Premier Cru Brut", descriptif: "(12.5)°", prix: "9€ / 65€" },
          { nom: "Billecart-Salmon, Brut", descriptif: "(12)°", prix: "12€ / 85€" },
          { nom: "Lallier, Rosé", descriptif: "(12.5)°", prix: "28€" }
        ]
      },
      "Digestifs": [
        { nom: "Sassy XO", descriptif: "(40°)", prix: "8€" },
        { nom: "Calvados 10y", descriptif: "(40°)", prix: "8€" },
        { nom: "Bas Armaniac Tariquet", descriptif: "(40°)", prix: "8€" },
        { nom: "Hennessy", descriptif: "(40°)", prix: "9€" },
        { nom: "Cognac Rémy Martin VSOP", descriptif: "(40°)", prix: "10€" },
        { nom: "Cognac Ragnaud XO", descriptif: "(40°)", prix: "15€" },
        { nom: "Bas Armaniac Tariquet XO", descriptif: "(40°)", prix: "15€" },
        { nom: "Calvados Domfrontais 1", descriptif: "", prix: "18€" }
      ],
      "Whiskys": [
        { nom: "Bellevoye Bleu", descriptif: "France (40°)", prix: "8€" },
        { nom: "Bellevoye Blanc", descriptif: "France (40°)", prix: "9€" },
        { nom: "Bellevoye Vert", descriptif: "France (43°)", prix: "15€" },
        { nom: "Clan Campbell", descriptif: "Écosse (43°)", prix: "8€" },
        { nom: "Glenfiddich 15", descriptif: "Écosse (40°)", prix: "10€" },
        { nom: "Caol Ila 12y", descriptif: "Écosse (43°)", prix: "11€" },
        { nom: "Yellow Spot", descriptif: "Écosse (46°)", prix: "12€" },
        { nom: "Ailsa Bay", descriptif: "Écosse (48.9°)", prix: "12€" },
        { nom: "Glenmorangie Nectar d'Or", descriptif: "Écosse (46°)", prix: "16€" },
        { nom: "The Balvenie", descriptif: "Écosse (43°)", prix: "20€" },
        { nom: "Chivas Regale Ultis", descriptif: "Écosse (40°)", prix: "35€" },
        { nom: "Bulleit Rye Vert", descriptif: "Kentucky (45°)", prix: "8€" },
        { nom: "Buffalo Trace", descriptif: "Kentucky (45°)", prix: "8€" },
        { nom: "Maker's Mark", descriptif: "Kentucky (45°)", prix: "10€" },
        { nom: "Kavalan", descriptif: "Taiwan (40°)", prix: "13€" }
      ],
      "Aperitifs": [
        { nom: "Ricard", descriptif: "(45°) 2cl", prix: "3.5€" },
        { nom: "Pedro Ximenez", descriptif: "(15°) 4cl", prix: "5€" },
        { nom: "Lillet Blanc", descriptif: "(17°) 6cl", prix: "5€" },
        { nom: "Lillet Rosé", descriptif: "(17°) 6cl", prix: "5€" },
        { nom: "Dolin Blanc", descriptif: "(16°) 6cl", prix: "5€" },
        { nom: "Dolin Rouge", descriptif: "(16°) 6cl", prix: "5€" },
        { nom: "Noilly Prat", descriptif: "(18°) 6cl", prix: "5€" },
        { nom: "Henri Bardouin", descriptif: "(45°) 2cl", prix: "5€" },
        { nom: "Cynar", descriptif: "(16.5°) 6cl", prix: "6€" },
        { nom: "Campari", descriptif: "(25°) 6cl", prix: "6€" },
        { nom: "Antica Formula", descriptif: "(16.5°) 6cl", prix: "8€" },
        { nom: "Double Jus 30 & 40", descriptif: "(23°) 6cl", prix: "9€" }
      ],
      "Bieres": [
        { nom: "Sparta Blonde", descriptif: "5° (pression)", prix: "3.20€ / 6€" },
        { nom: "Innovation IPA", descriptif: "6.7° (pression)", prix: "4.20€ / 8€" },
        { nom: "Delen Blanche", descriptif: "5° (pression)", prix: "4.20€ / 8€" },
        { nom: "Adnams Cidre", descriptif: "5° (pression)", prix: "4.20€ / 8€" },
        { nom: "Kasteel Rouge", descriptif: "8° (bouteille)", prix: "6€" },
        { nom: "Bière du moment", descriptif: "(bouteille)", prix: "6€" }
      ],
      "Cocktails": [
        { nom: "Cranberry Cinnamon Sour", descriptif: "Vodka, cranberry, sirop brun de cannelle, blanc d'oeuf, citron jaune", prix: "11€" },
        { nom: "Pear Gimlet", descriptif: "Gin, poire, sirop de sucre, citron vert, teinture de sauge", prix: "10€" },
        { nom: "Le Pomme", descriptif: "Eau de vie de cidre, cidre, sirop de sucre, citron vert", prix: "10€" },
        { nom: "Pornstar Martini", descriptif: "Vodka infusée à la vanille, sirop simple, citron vert, fruit de la passion, pétillant", prix: "12€" },
        { nom: "Le Grinch", descriptif: "Chartreuse verte/jaune, Angostura, sirop de sucre, citron vert, blanc d'oeuf", prix: "12€" },
        { nom: "White Negroni", descriptif: "Gin, suze, lillet blanc, teinture de camomille", prix: "11€" }
      ],
      "Gins": [
        { nom: "Beefeater", descriptif: "Angleterre (40°)", prix: "6€" },
        { nom: "C'est Nous", descriptif: "France (40°)", prix: "7€" },
        { nom: "Citadelle", descriptif: "France (44°)", prix: "7€" },
        { nom: "Bombay Saphir", descriptif: "Angleterre (40°)", prix: "7€" },
        { nom: "Malty Rosa", descriptif: "Italie (41°)", prix: "7€" },
        { nom: "Hendrick's", descriptif: "Écosse (41.4°)", prix: "7.5€" },
        { nom: "Monkey 47", descriptif: "Allemagne (47°)", prix: "8€" },
        { nom: "Christian Drouin", descriptif: "France (42°)", prix: "8€" },
        { nom: "G Vine Pêche", descriptif: "France (37.5°)", prix: "8€" },
        { nom: "Botanist", descriptif: "Écosse (46°)", prix: "9€" },
        { nom: "Etsu Japon", descriptif: "Japon (43°)", prix: "9€" },
        { nom: "Tanqueray Ten", descriptif: "Angleterre (47.3°)", prix: "10€" },
        { nom: "Aviation", descriptif: "États-Unis (42°)", prix: "10€" }
      ],
      "Rhums": [
        { nom: "Sailor Jerry", descriptif: "Caraïbes (40°)", prix: "6€" },
        { nom: "Plantation 3", descriptif: "Caraïbes (41.2°)", prix: "7€" },
        { nom: "Plantation Pineapple", descriptif: "Barbade (40°)", prix: "8€" },
        { nom: "Plantation Dark", descriptif: "Caraïbes (40°)", prix: "8€" },
        { nom: "Botran 15", descriptif: "Guatemala (40°)", prix: "8€" },
        { nom: "Bally 3", descriptif: "Martinique (45°)", prix: "9€" },
        { nom: "Clarin Vaval", descriptif: "Haïti (53.3°)", prix: "9€" },
        { nom: "Clarin Sajou", descriptif: "Haïti (54.2°)", prix: "9€" },
        { nom: "Diplomatico", descriptif: "Venezuela (40°)", prix: "10€" },
        { nom: "Santa Teresa", descriptif: "Venezuela (40°)", prix: "11€" },
        { nom: "Hampden 8", descriptif: "Jamaïque (46°)", prix: "13€" },
        { nom: "Centenario 20", descriptif: "Costa Rica (40°)", prix: "13€" },
        { nom: "Angostura 1824", descriptif: "Trinidad & Tobago (40°)", prix: "13.5€" },
        { nom: "El Dorado", descriptif: "Guyane Britannique (40°)", prix: "13.5€" },
        { nom: "Isautier", descriptif: "Réunion (40°)", prix: "14€" },
        { nom:"Millonario XO", descriptif: "Pérou (40°)", prix: "20"},
        { nom: "Père Labat 8", descriptif: "Marie-Galante (42°)", prix: "25€" }
      ],
      "Autres": {
        "Divers": [
          { nom: "Cachaça Leblon", descriptif: "(40°)", prix: "8€" },
          { nom: "Pisco Demonio", descriptif: "(40°)", prix: "10€" },
          { nom: "Mezcal", descriptif: "(42°)", prix: "10€" },
          { nom: "Tequila Fula Reposado", descriptif: "(40°)", prix: "12€" }
        ],
        "Liqueurs": [
          { nom: "Amaretto Disaronno", descriptif: "(28°)", prix: "6€" },
          { nom: "Luxardo Maraschino", descriptif: "(32°)", prix: "6€" },
          { nom: "Cointreau", descriptif: "(40°)", prix: "6€" },
          { nom: "Fernet Branca", descriptif: "(39°)", prix: "8€" },
          { nom: "Chambord", descriptif: "(16.5°)", prix: "8€" },
          { nom: "Bénédictine", descriptif: "(40°)", prix: "8€" }
        ]
      }
    }
  },
  {
    id: 'les-planches',
    name: 'Les Planches',
    description: 'Bar convivial ambiance bord de mer',
    logo: '/bar_brand/lesplancheslogo.png',
    theme: {
      primary: '30 40% 35%', // Bois très foncé / marron sombre
      secondary: '22 75% 58%', // Cuivré voyant
      accent: '35 60% 55%', // Cuivre vintage
      background: '25 30% 8%', // Bois extrêmement foncé
      cardBg: '28 35% 12%', // Bois très foncé
    },
    drinks: [], // Gardé vide pour compatibilité
    categorizedDrinks: {
      "Boissons Fraîches": [
        { nom: "Coca-Cola", descriptif: "", prix: "4€" },
        { nom: "Coca-Cola ro", descriptif: "", prix: "4€" },
        { nom: "Orangina", descriptif: "", prix: "3€" },
        { nom: "Perrier", descriptif: "", prix: "3€" },
        { nom: "Schweppes", descriptif: "", prix: "4€" },
        { nom: "Fuze Tea", descriptif: "", prix: "4€" },
        { nom: "Vittel", descriptif: "", prix: "3€" },
        { nom: "Sirop à l'eau", descriptif: "", prix: "2.70€" },
        { nom: "Limonade, Diabolo", descriptif: "", prix: "3.50€" },
        { nom: "Jus de fruits Pago", descriptif: "", prix: "4€" },
        { nom: "Orange ou Citron pressé", descriptif: "", prix: "6€" },
        { nom: "Cidre Brut Fermier (Bio)", descriptif: "", prix: "4.50€" },
        { nom: "Thé glacé à l'hibiscus maison", descriptif: "", prix: "5€" },
      ],
      "Aperitifs": [
        { nom: "Ricard", descriptif: "2cl", prix: "3.50€" },
        { nom: "Kir (Cassis, Mûrs, Pêches, Framboises)", descriptif: "12.5cl", prix: "4.50€" },
        { nom: "Porto Rouge / Blanc / Campari", descriptif: "5cl", prix: "5.50€" },
        { nom: "Martini Blanc / Rouge", descriptif: "5cl", prix: "5€" },
        { nom: "Americano Maison (Martini, Campari, Noilly Prat, Gin)", descriptif: "12cl", prix: "8.50€" },
        { nom: "Champagne 1er Cru J.Rat-Winkler", descriptif: "12.5cl", prix: "9€" },
        { nom: "Crémant de Loire AOP domaine Cady bio", descriptif: "12.5cl", prix: "7€" }
      ],
      "Bieres": {
        "Pression": [
          { nom: "Campus Premium", descriptif: "(5°)", prix: "3.5€ / 5.50€" },
          { nom: "Tripel Karmeliet", descriptif: "(8°)", prix: "4.20€ / 7.50€" },
          { nom: "Kasteel Rouge", descriptif: "(8°)", prix: "4.20€ / 7.50€" },
          { nom: "Bière du moment", descriptif: "", prix: "4.20€ / 7.50€" },
          { nom: "Panaché, Bière Sirop", descriptif: "", prix: "3.5€ / 5.50€" },
          { nom: "Picon Bière", descriptif: "(5°)", prix: "4.20€ / 7.50€" },
        ],
        "Bouteille": [
          { nom: "Desperados", descriptif: "33cl", prix: "6.50€" },
          { nom: "Délirium Tremens", descriptif: "33cl", prix: "6.50€" },
          { nom: "Bon Secours brune", descriptif: "33cl", prix: "6.50€" },
          { nom: "Brooklyn sans alcool", descriptif: "33cl (0.4°)", prix: "5€" },
          { nom: "1664", descriptif: "33cl (0.0°)", prix: "5€" }
        ]
      },
      // "Vins": {
      //   "Blancs": [
      //     { nom: "Domaine de la Croix", descriptif: "", prix: "8€" },
      //     { nom: "Château La Grolet", descriptif: "", prix: "9€" },
      //     { nom: "Les Belles Grives", descriptif: "", prix: "9€" },
      //     { nom: "Château Lamothe", descriptif: "", prix: "8€" },
      //     { nom: "Domaine de l'Herre", descriptif: "", prix: "9€" }
      //   ],
      //   "Rouges": [
      //     { nom: "La Cave du Tue-Bœuf", descriptif: "", prix: "8€" },
      //     { nom: "Les Rocailles", descriptif: "", prix: "9€" },
      //     { nom: "Château Laulerie", descriptif: "", prix: "9€" },
      //     { nom: "Mas des Aumérants", descriptif: "", prix: "10€" },
      //     { nom: "Château Moulin Caresse", descriptif: "", prix: "9€" }
      //   ]
      // },
      "Rhums": [
        { nom: "Diplomatico Reserva Exclusiva", descriptif: "Venezuela (40°)", prix: "11€" },
        { nom: "Zacapa 23 Solera", descriptif: "Guatemala (40°)", prix: "17€" },
        { nom: "Doorly's XO", descriptif: "Barbades (43°)", prix: "12€" },
        { nom: "Don Papa Baroko", descriptif: "Philipines (40°)", prix: "10€" },
        { nom: "JM XO", descriptif: "Philipines (40°)", prix: "18€" },
        { nom: "Savanna le must 9 ans", descriptif: "Réunion (45°)", prix: "14€" },
      ],
      "Whisky": [
        { nom: "Kilchoman sanaig", descriptif: "Islay (46°)", prix: "14€" },
        { nom: "Talisker Port Ruighe", descriptif: "Skye (45.8°)", prix: "12€" },
        { nom: "Arran 10 ans", descriptif: "Arran (46°)", prix: "11€" },
        { nom: "Red Breast 12 ans", descriptif: "Cork (40°)", prix: "14€" },
        { nom: "Ed Gwen", descriptif: "France (45°)", prix: "16€" },
        { nom: "Nikka from the barrel", descriptif: "Japon (51.4°)", prix: "13€" },
        { nom: "Woodford Reserve", descriptif: "Kentucky (45.2°)", prix: "11€" },
        { nom: "Gentleman Jack", descriptif: "Tennesse (40°)", prix: "11€" }
      ],
      "Gins": [
        { nom: "Tanqueray Ten", descriptif: "Ecosse (47.3°)", prix: "11€" },
        { nom: "Drumshanbo", descriptif: "Irlande (43°)", prix: "11€" },
        { nom: "Hendrick's", descriptif: "Ecosse (41.4°)", prix: "11€" },
        { nom: "Citadelle", descriptif: "Poitou-Charentes (44°)", prix: "10€" },
      ],
      "Cognac": [
        { nom: "Raymond Ragnaud Grande Champagne 1er cru très vieille réserve", descriptif: "", prix: "16€" },
        { nom: "Raymond Ragnaud Grande Champagne 1er cru Réserve rare", descriptif: "(41°)", prix: "23€" },
      ],
      "Armagnac": [
        { nom: "Domaine Tariquet Bas Armagnac XO Chance", descriptif: "(40°)", prix: "18€" },
      ],
      "Calvados": [
        { nom: "Sassy XO", descriptif: "Calvados (40°)", prix: "13€" },
        { nom: "Roger Groult 3ans", descriptif: "Pays d'Auge (40°)", prix: "11€" },
        { nom: "Roger Groult 8ans", descriptif: "Pays d'Auge (41°)", prix: "15€" },
        { nom: "Roger Groult 12ans", descriptif: "Pays d'Auge (41°)", prix: "18€" },
      ],
      "Cocktails": [
        { nom: "Red Flower", descriptif: "Cognac, Sirop d'hibiscus, Crème de pêche, tonic", prix: "12€" },
        { nom: "Mojito", descriptif: "Rhum Havana Club, citron vert, menthe, sucre de canne, eau gazeuse", prix: "10€" },
        { nom: "Cosmopolitan", descriptif: "vodk, sirop de cranberry, triple sec, citron vert", prix: "10€" },
        { nom: "Long Island Ice Tea", descriptif: "vodka, gin, rhum blanc, tequila, triple sec, citron vert, cola", prix: "12€" },
        { nom: "Caipirinha", descriptif: "Cachaça, citron vert, sucre de canne", prix: "10€" },
        { nom: "Margarita", descriptif: "tequila, triple sec, citron vert, sirop de sucre de canne", prix: "10€" },
        { nom: "Pina Colada", descriptif: "rhum blanc, purée de coco, jus d'ananas", prix: "10€" },
        { nom: "Tequila Sunrise", descriptif: "tequila, jus d'orange, grenadine", prix: "10€" },
        { nom: "Spritz", descriptif: "Aperol, crémant,  eau gazeuse", prix: "9€" },
        { nom: "Irish Coffee", descriptif: "whisky, café, crème fouettée", prix: "9€" },
        { nom: "Espresso Martini", descriptif: "vodka, liqueur de café, espresso", prix: "10€" },
        { nom: "Cocktail sans alcool", descriptif: "", prix: "7€" },
        { nom: "Cocktail sur demande", descriptif: "", prix: "12€" }
      ]
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
