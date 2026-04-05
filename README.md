# BzzGre

BzzGre est une application Next.js de soirée pensée pour gérer une partie complète en local, sans base de données. L'app combine un tirage de boissons, des jeux d'ambiance, et plusieurs modes persistants qui restent disponibles même si on change d'écran ou de jeu pendant la soirée.

## Ce que fait l'app

- Création d'une partie avec nombre de personnes et nombre de boissons par personne.
- Saisie des participants et de leurs boissons.
- Tirage aléatoire des boissons, avec possibilité de relance et de modification.
- Catalogue de jeux de soirée accessible depuis un sélecteur central.
- Sauvegarde complète dans `localStorage`.
- Pages légales intégrées: CGU, confidentialité et mentions légales.
- Routes publiques et privées déjà prévues pour les écrans de support.

## Jeux disponibles

- Mission Game
- Missions secrètes
- Je n'ai jamais...
- Chrono BzzGre
- Palmier
- Most Likely To
- Imposteur

## Détail des jeux

- Mission Game: deck de questions par joueur, avec questions globales, questions individuelles et sauvegarde locale.
- Missions secrètes: mission personnelle attribuée à chaque joueur, statut actif / en attente / validé / refusé, validation de groupe et récompense en gorgées.
- Je n'ai jamais...: grand pool progressif de questions, sauvegarde de l'avancement.
- Chrono BzzGre: jeu en équipes avec mots à faire deviner en plusieurs tours.
- Palmier: mini-jeu rapide à base de cartes/règles d'ambiance.
- Most Likely To: vote de groupe, la personne désignée boit.
- Imposteur: jeu de bluff avec mot civil, mot imposteur et variante Mr White.

## Fonctionnalités clés

- Interface mobile-first.
- Gestion locale uniquement, sans backend.
- Reprise automatique des parties grâce au stockage navigateur.
- Réinitialisation ciblée d'un jeu sans toucher au reste de la soirée.
- Interface simple, pensée pour être utilisée rapidement en groupe.

## Stack technique

- Next.js 15 avec App Router
- React 18
- TypeScript
- Tailwind CSS
- lucide-react pour les icônes
- localStorage pour la persistance

## Installation

```bash
npm install
npm run dev
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Structure du projet

```
app/
├── page.tsx
├── layout.tsx
├── globals.css
├── cgu/page.tsx
├── confidentialite/page.tsx
├── mentions-legales/page.tsx
└── qr-codes-bzzgre-private/page.tsx

components/
├── BzzgreGamesModal.tsx
├── BzzgreMissionGame.tsx
├── BzzgreSecretMissionsGame.tsx
├── BzzgreMostLikelyToGame.tsx
├── BzzgreTimeUpGame.tsx
├── BzzgrePalmierGame.tsx
├── BzzgreImposteurGame.tsx
├── JeNaiJamaisGame.tsx
├── SetupForm.tsx
├── ParticipantEntry.tsx
├── ResultsScreen.tsx
├── EditParticipantModal.tsx
├── ConfirmResetModal.tsx
├── Header.tsx
├── LegalFooter.tsx
└── ThemeProvider.tsx

hooks/
└── useLocalStorage.ts

lib/
└── utils.ts

types/
└── index.ts
```

## Stockage local

Les données de la soirée sont enregistrées dans le navigateur via `localStorage`. Chaque jeu persistant utilise sa propre clé, ce qui permet de quitter un jeu, changer de mode, puis revenir plus tard sans perdre la progression.

## Notes de fonctionnement

- L'application reste entièrement locale.
- Les jeux conservent leur état entre les ouvertures de modal.
- Certaines cartes sont marquées comme plus adaptées à une soirée à domicile qu'à un lieu public.

## Licence

MIT
