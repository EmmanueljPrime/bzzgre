# 🍺 Bzzgre Mission Game - Documentation d'intégration

## ✅ Installation complète

Tous les composants ont été créés et intégrés dans votre jeu d'alcool existant !

### Fichiers créés

1. **`/components/BzzgreMissionGame.tsx`** - Composant principal du jeu Mission Game
2. **`/components/BzzgreGamesModal.tsx`** - Modal de sélection des jeux Bzzgre
3. **`/components/ResultsScreen.tsx`** - Mis à jour avec le bouton "Jeux Bzzgre"

---

## 🎮 Comment ça marche

### 1. Accès au jeu

Sur l'écran des résultats (après avoir créé les participants), vous verrez maintenant un nouveau bouton coloré :

```
🎮 Jeux Bzzgre
```

### 2. Sélection du jeu

Cliquer sur ce bouton ouvre une modal avec :
- ✅ **Mission Game** (disponible)
- 🔒 Beer Pong Challenge (bientôt disponible)
- 🔒 Roi des Menteurs (bientôt disponible)

### 3. Mission Game

**Caractéristiques :**
- 55 questions uniques par joueur
- Questions de type vérité ou action
- Système de persistance (sauvegarde automatique)
- Remplace automatiquement `<PLAYER>` par des noms aléatoires

**Fonctionnement :**
1. Sélectionnez un joueur dans la liste
2. Une question aléatoire est tirée de son deck personnel
3. Cette question est supprimée de son deck (ne peut être tirée qu'une fois)
4. Chaque joueur a accès aux 55 questions indépendamment

**Exemple :**
- 4 joueurs × 55 questions = 220 tirages possibles avant épuisement complet

---

## 📊 Système de questions

### Partie 1 : Avertissement (toujours affiché)

Un disclaimer humoristique qui dégage la responsabilité de Bzzgre Corporation.

### Partie 2 : 55 Questions

Les questions couvrent plusieurs catégories :
- 🔥 Actions osées
- 💬 Vérités croustillantes
- 🎲 Défis de groupe
- 💋 Questions intimes
- 🍺 Gages d'alcool
- 🎭 Scénarios hypothétiques

**Remplacement automatique de `<PLAYER>` :**
```typescript
// Avant
"C'est le moment d'être honnête avec <PLAYER> : dis-lui un défaut..."

// Après (exemple)
"C'est le moment d'être honnête avec Marie : dis-lui un défaut..."
```

---

## 💾 Persistance des données

### LocalStorage

Chaque session de jeu est sauvegardée automatiquement :

```typescript
Clé : `bzzgre_mission_game_${gameId}`
```

**Structure :**
```typescript
{
  currentPlayerId: number | null,
  currentQuestion: string | null,
  playerQuestionsLeft: {
    [playerId]: [questionIndexes] // Questions restantes
  }
}
```

**Avantages :**
- Fermer la modal ne perd pas la progression
- Retour au jeu principal préserve l'état
- Chaque partie a son propre état isolé

---

## 🎨 Interface utilisateur

### Header (fixe)
- ⚠️ **Avertissement Bzzgre** (rouge, bien visible)
- 🎯 **Joueur actuel** : [NOM]
- 📊 **Questions restantes** : X/55
- Boutons : `Reset` | `← Retour jeu principal`

### Body
- Question actuelle (grande typo, animée)
- Affichage conditionnel :
  - Pas de question → "Sélectionne un joueur"
  - Question active → Affichage de la question
  - Joueur terminé → "GG ! T'as fait toutes les questions sale cochon !"

### Footer
- Grille de boutons joueurs (responsive)
- Barre de progression pour chaque joueur
- Badge ✅ quand un joueur a fini

---

## 🔧 API du composant

### BzzgreMissionGame

```typescript
interface BzzgreMissionGameProps {
  participants: Participant[];  // Liste des joueurs
  gameId: string;               // ID unique de la partie
  onClose: () => void;          // Callback de fermeture
}
```

### BzzgreGamesModal

```typescript
interface BzzgreGamesModalProps {
  participants: Participant[];  // Liste des joueurs
  gameId: string;               // ID unique de la partie
  onClose: () => void;          // Callback de fermeture
}
```

---

## 🚀 Utilisation avancée

### Réinitialiser une partie

Le bouton "Reset jeu" remet toutes les questions à zéro pour tous les joueurs.

### Ajouter un nouveau jeu

Pour ajouter un nouveau jeu à la modal de sélection :

1. Créez votre composant de jeu (ex: `BeerPongGame.tsx`)
2. Ajoutez un nouveau mode dans `BzzgreGamesModal` :

```typescript
type GameMode = 'selection' | 'mission' | 'beerPong';
```

3. Ajoutez un bouton dans la modal de sélection
4. Ajoutez le rendu conditionnel du composant

---

## ⚙️ Configuration technique

### Technologies utilisées
- ✅ Next.js 14+ (App Router)
- ✅ TypeScript strict
- ✅ Tailwind CSS
- ✅ React Hooks (useState, useEffect)
- ✅ LocalStorage API
- ✅ Lucide Icons

### Dépendances
- Aucune dépendance externe supplémentaire !
- Utilise uniquement les UI components existants (shadcn/ui)

### Responsive
- Mobile-first design
- Adaptation automatique tablette/desktop
- Grilles adaptatives (1/2/3 colonnes)

### Accessibilité
- Navigation au clavier
- ARIA labels
- Contraste suffisant
- Messages d'état clairs

---

## 🐛 Résolution de problèmes

### La modal ne s'ouvre pas
Vérifiez que :
- Les participants existent
- Le gameId est bien généré
- Le state `isBzzgreModalOpen` est géré

### Les questions se répètent
Impossible ! Le système supprime chaque question après tirage.

### La progression n'est pas sauvegardée
Vérifiez :
- LocalStorage est activé dans le navigateur
- Le gameId ne change pas entre les sessions
- Pas d'erreur dans la console

### Les noms de joueurs ne se remplacent pas
Le remplacement est automatique. Si `<PLAYER>` apparaît :
- Vérifiez que la liste des participants est bien passée
- Console.log le résultat de `getRandomPlayerName()`

---

## 📈 Statistiques

Pour 4 joueurs :
- **220 questions** possibles au total
- **55 questions** uniques par joueur
- **Temps de jeu estimé** : 2-3 heures (avec les gages !)

---

## 🎉 C'est tout !

Le jeu est **100% fonctionnel** et prêt à être utilisé. 

**Pour tester :**
1. Créez des participants dans votre jeu
2. Ajoutez leurs boissons
3. Allez sur l'écran des résultats
4. Cliquez sur "🎮 Jeux Bzzgre"
5. Sélectionnez "Mission Game"
6. Choisissez un joueur et commencez à tirer des questions !

**Bon jeu ! 🍻**

---

## 📝 Notes importantes

- ⚠️ Ce jeu contient du contenu mature
- 🔞 Réservé aux adultes
- 🍺 À jouer avec modération
- 🤝 Respect du consentement de tous les joueurs

---

*Développé pour BzzGre - La direction de bzzgre ne peut être tenue responsable des conséquences de vos actions* 😈
