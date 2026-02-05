# BzzGre 🍻

Application web de tirage aléatoire de boissons pour soirées entre amis.

## Fonctionnalités

- **Configuration personnalisée** : Définissez le nombre de participants et de boissons par personne (1-20)
- **Saisie séquentielle** : Chaque personne entre son nom et ses boissons
- **Tirage aléatoire** : Distribution aléatoire des boissons entre tous les participants
- **Relance illimitée** : Relancez le tirage autant de fois que vous voulez
- **Modification facile** : Modifiez les participants et leurs boissons sans recréer une partie
- **Persistance locale** : Les données sont sauvegardées dans le navigateur (localStorage)

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Comment jouer

1. **Configuration** : Entrez le nombre de personnes et de boissons par personne
2. **Saisie** : Chaque participant entre son nom et ses boissons (passez le téléphone)
3. **Tirage** : Cliquez sur "Tirer les boissons" pour l'attribution aléatoire
4. **Relance** : Cliquez à nouveau pour relancer avec de nouvelles attributions
5. **Modification** : Utilisez "Modifier les participants" pour éditer les données
6. **Nouvelle partie** : Cliquez sur "Nouvelle partie" pour tout recommencer

## Technologies

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- localStorage pour la persistance

## Structure du projet

```
BzzGre/
├── app/
│   ├── page.tsx          # Composant principal avec logique d'état
│   ├── layout.tsx        # Layout principal
│   └── globals.css       # Styles globaux
├── components/
│   ├── SetupForm.tsx          # Écran de configuration
│   ├── ParticipantEntry.tsx   # Saisie des participants
│   └── ResultsScreen.tsx      # Écran de résultats/tirage
├── hooks/
│   └── useLocalStorage.ts     # Hook de persistance
└── types/
    └── index.ts               # Types TypeScript
```

## Build pour production

```bash
npm run build
npm start
```

## Licence

MIT
# bzzgre
