'use client';

import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import { X, RotateCcw, Sparkles, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface BzzgreMissionGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

// Toutes les 55 questions de la Partie 2
const MISSION_QUESTIONS = [
  "Les trois participants à ta gauche : tu dois en tuer un, coucher avec un et en marier un. Tu n'as pas le choix. Quelle est ta décision ?",
  "Les trois participants à ta droite : tu dois en tuer un, coucher avec un et en marier un. Tu n'as pas le choix. Quelle est ta décision ?",
  "Un souvenir bien honteux ?",
  "C'est le moment d'être honnête avec <PLAYER> : dis-lui un défaut ou quelque chose que tu n'oses pas lui dire. Il devra répondre « mon cœur reste ouvert » ou non, puis faire la même chose dans l'autre sens.",
  "Si tu t'es déjà dit « c'est dommage qu'il/elle soit en couple avec mon ami(e) », c'est le moment de le dire.",
  "Quelle était ta première impression sur <PLAYER> et que penses-tu de lui/d'elle aujourd'hui ?",
  "Une grosse loose sexuelle ? C'est le moment d'assumer.",
  "Ton premier crush ?",
  "Ton pire baiser ?",
  "Ton pire partenaire sexuel, et ton meilleur ?",
  "Le truc que tu as toujours voulu essayer au lit, mais dont tu n'as jamais osé parler ?",
  "Une destination de voyage seul(e), et une avec le groupe avec lequel tu joues en ce moment.",
  "Ton premier date de rêve ?",
  "C'est un/une 10 sur 10, mais il/elle devient très ami(e) avec tes amis, ils se voient sans toi, il/elle les invite, mais pas toi.",
  "C'est un/une 10 sur 10, vous commencez à sortir ensemble, mais tu apprends qu'il/elle avait déjà couché avec un membre de ta famille (frère, sœur, père ou mère).",
  "Tu as couché avec le partenaire de <PLAYER>. Trouve une bonne excuse. <PLAYER> devra valider ton excuse.",
  "Échange ton verre avec <PLAYER>.",
  "Aïe : cul sec, ou propose un date à une personne au hasard dans tes contacts.",
  "Une petite pensée pour nos amis les bêtes : s'il y a un animal de compagnie, c'est le moment de lui donner une friandise ou de le sortir. Si certains joueurs sont considérés comme un chien ou une chienne, ça marche aussi.",
  "Ton fantasme du moment ?",
  "Vous avez plus de 12 ans, on ne va pas jouer au jeu de la bouteille… si ? OK : <PLAYER> et <PLAYER> : un petit smac ou cul sec pour les deux.",
  "Allez, on y retourne : <PLAYER>, tu roules un péckot à <PLAYER>, sinon 3 gorgées chacun.",
  "Allez, maintenant que tout le monde est chaud, raconte-nous ta découverte de la masturbation. Cul sec pour le premier qui rit.",
  "Je suis sûr que quand tu étais petit(e), tu avais un crush sur un personnage de dessin animé. Annonce le tien, puis c'est au tour des autres.",
  "Décidez d'une pièce « rendez-vous », vous comprendrez plus tard.",
  "Tu pars 5 minutes avec <PLAYER> dans la pièce « rendez-vous ». À tout à l'heure.",
  "Si vous avez un stylo, un feutre ou n'importe quoi pour dessiner, tu fais un tatouage à <PLAYER>, mais il/elle choisit l'endroit.",
  "Boire et s'amuser c'est bien, mais s'hydrater c'est important : un verre d'eau pour tout le monde sauf pour <PLAYER>. Le groupe lui confectionne un shooter, essayez au moins de faire un truc bien.",
  "Tu dois aller dans la pièce « rendez-vous » avec <PLAYER>, prendre une photo sexy de lui/d'elle et l'envoyer à <PLAYER>. Bien sûr, le modèle peut esquiver, mais ça fera 5 gorgées s'il vous plaît.",
  "Contrôle de géographie : capitale du Pérou. Tu as gagné ? Distribue trois gorgées. Tu as perdu ? Bois-les.",
  "Chaque participant a 4 bonbons et en donne 3 à son voisin de gauche, mais le méchant Macron prend une taxe de 1 bonbon par déplacement. Combien a chaque joueur et combien a Macron ? Tu as bon : tu distribues 3 gorgées. Tu t'es trompé : tu bois.",
  "Tous ceux qui ont un préservatif sur eux, c'est bien, vous êtes protégés. Les autres : 5 gorgées, faudra pas vous plaindre si vous chopez la chatouille.",
  "Ton petit point faible corporel, ta petite zone érogène ?",
  "Tu dois choisir un costume à ton partenaire pour une nuit. Lequel ? T'inquiète, personne ne juge.",
  "Tour de table : un défaut et une qualité de la personne à votre droite.",
  "Tu n'as pas le choix : soit tu couches avec Éric Zemmour, soit tu l'élis aux prochaines présidentielles.",
  "Ta première expérience qui n'était pas de ton bord habituel ?",
  "Tous ceux qui ont déjà fait un rêve érotique avec un des participants boivent. Si vous êtes pile deux à boire, vous comptez jusqu'à trois et vous dites qui était dans votre rêve.",
  "Désolé, tu dois avouer tes sentiments à <PLAYER>. Si la majorité t'a trouvé convaincant(e), 5 minutes dans la pièce « rendez-vous » avec ton/ta dulciné(e).",
  "On rigole bien, non ? Si tu passes une bonne soirée, une gorgée.",
  "Maintenant, supprime une de ces choses : les MST, la faim dans le monde, les taxes sur l'alcool, la guerre. Si tu as choisi les MST : 5 gorgées, nous savons que tu sais. Si tu as pris les taxes sur l'alcool : cul sec, je ne veux rien savoir.",
  "Allez les problèmes : explique à <PLAYER> pourquoi son dernier couple était voué à l'échec.",
  "Allez, plus de problème : explique à <PLAYER> pourquoi c'est voué à l'échec avec son crush actuel, et on s'en fout que tu le penses ou pas.",
  "La dernière fois que tu t'es fait pipi dessus ?",
  "Ton dernier vomi ?",
  "Tu as déjà eu un trou noir ? Raconte.",
  "Ta dernière panne ?",
  "Ta première expérience « par les grottes de l'Asco » ?",
  "Ton kink le plus bizarre ?",
  "Tu peux faire en sorte que la cyprine et/ou le sperme aient le goût que tu veux : tu choisis quoi ?",
  "Balance ton porc : à ton avis, qui est le/la plus cochon(ne) au lit ? Notre coquin ou coquine boit trois gorgées.",
  "Vote : porte-jarretelles ou body ? La minorité boit.",
  "Vote : sous-vêtements en dentelle sur les hommes ? La minorité boit.",
  "Vote : faire l'amour le premier soir ? La minorité boit.",
  "Tu préfères faire l'amour ou baiser ?",
  "Tu préfères les doigts ou la langue ?",
  "Tu préfères finir où / tu préfères qu'il/elle finisse où ?",
  "Balance un dossier sur <PLAYER>. Si tu n'as rien, tu bois 5 gorgées.",
  "Macron veut réarmer la France, pas le choix : tu dois coucher avec un/une participant(e). Répondez tous. Celui ou celle qui est choisi(e) boit 3 gorgées, sauf vous deux. Tais-toi et bois le nombre de gorgées qui n'ont pas été bues, j'espère que vous n'êtes pas trop nombreux.",
  "Ta position préférée ?",
  "Ton crush actuel ? S'il/elle est dans la pièce, bois et tais-toi, jeune timide.",
  "Graig prend le cadeaux et va te changer dans la pièce « rendez-vous ». Tu dois porter cette tenue pour les 5 prochaine minute.",
];

const TOTAL_QUESTIONS = MISSION_QUESTIONS.length;

// Questions globales (tirables par n'importe qui, puis retirées pour tout le monde)
const GLOBAL_QUESTION_INDEXES = new Set<number>([
  24, // Décidez d'une pièce « rendez-vous »
  31, // Tous ceux qui ont un préservatif...
  34, // Tour de table...
  37, // Tous ceux qui ont déjà fait un rêve érotique...
  51, // Vote : porte-jarretelles ou body ?
  52, // Vote : sous-vêtements en dentelle sur les hommes ?
  53, // Vote : faire l'amour le premier soir ?
  61, // Graig prend le cadeaux et va te changer dans la pièce « rendez-vous ».
]);

interface PlayerQuestionsState {
  [playerId: number]: number[]; // Array of question indexes remaining for this player
}

interface GameState {
  currentPlayerId: number | null;
  currentQuestion: string | null;
  playerQuestionsLeft: PlayerQuestionsState;
}

export default function BzzgreMissionGame({
  participants,
  gameId,
  onClose,
}: BzzgreMissionGameProps) {
  const storageKey = `bzzgre_mission_game_${gameId}`;
  // Fermer l'avertissement par défaut sur mobile
  const [isWarningVisible, setIsWarningVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // Fermé sur mobile (<768px)
    }
    return true;
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Initialize state from localStorage or create fresh state
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return {
      currentPlayerId: null,
      currentQuestion: null,
      playerQuestionsLeft: {},
    };

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
      }
    }

    // Initialize with all questions for each player
    const playerQuestionsLeft: PlayerQuestionsState = {};
    participants.forEach((p) => {
      playerQuestionsLeft[p.id] = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i);
    });

    return {
      currentPlayerId: null,
      currentQuestion: null,
      playerQuestionsLeft,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  // Get random players (excluding current player), keeping picks unique as long as possible.
  const getRandomPlayers = (excludeId: number, count: number): Participant[] => {
    const availablePlayers = participants.filter((p) => p.id !== excludeId);

    if (availablePlayers.length === 0) {
      return [];
    }

    const shuffledPlayers = [...availablePlayers].sort(() => Math.random() - 0.5);
    const selectedPlayers: Participant[] = [];

    for (let i = 0; i < count; i++) {
      if (i < shuffledPlayers.length) {
        selectedPlayers.push(shuffledPlayers[i]);
      } else {
        const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        selectedPlayers.push(randomPlayer);
      }
    }

    return selectedPlayers;
  };

  // Replace <PLAYER> placeholders with actual players.
  const replacePlayerPlaceholder = (question: string, currentPlayerId: number): string => {
    let result = question;
    const matches = question.match(/<PLAYER>/g);
    
    if (matches) {
      const selectedPlayers = getRandomPlayers(currentPlayerId, matches.length);

      matches.forEach((_, index) => {
        const player = selectedPlayers[index];
        const replacement = player ? player.name : 'un joueur';

        result = result.replace('<PLAYER>', replacement);
      });
    }
    
    return result;
  };

  // Draw a random question for a specific player
  const drawQuestionForPlayer = (playerId: number) => {
    const availableQuestions = gameState.playerQuestionsLeft[playerId] || [];
    
    if (availableQuestions.length === 0) {
      return null; // No more questions for this player
    }

    // Pick a random question index from available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionIndex = availableQuestions[randomIndex];
    const rawQuestion = MISSION_QUESTIONS[questionIndex];
    const isGlobalQuestion = GLOBAL_QUESTION_INDEXES.has(questionIndex);
    
    // Replace placeholders
    const processedQuestion = replacePlayerPlaceholder(rawQuestion, playerId);

    // Remove question from pools:
    // - globale: retirée pour tous les joueurs
    // - individuelle: retirée seulement pour le joueur actif
    let updatedPlayerQuestionsLeft: PlayerQuestionsState;

    if (isGlobalQuestion) {
      updatedPlayerQuestionsLeft = { ...gameState.playerQuestionsLeft };
      participants.forEach((participant) => {
        const participantQuestions = updatedPlayerQuestionsLeft[participant.id] || [];
        updatedPlayerQuestionsLeft[participant.id] = participantQuestions.filter(
          (idx) => idx !== questionIndex
        );
      });
    } else {
      const updatedQuestions = availableQuestions.filter((idx) => idx !== questionIndex);
      updatedPlayerQuestionsLeft = {
        ...gameState.playerQuestionsLeft,
        [playerId]: updatedQuestions,
      };
    }

    setGameState({
      currentPlayerId: playerId,
      currentQuestion: processedQuestion,
      playerQuestionsLeft: updatedPlayerQuestionsLeft,
    });

    return processedQuestion;
  };

  // Reset game for all players
  const handleReset = () => {
    const playerQuestionsLeft: PlayerQuestionsState = {};
    participants.forEach((p) => {
      playerQuestionsLeft[p.id] = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i);
    });

    setGameState({
      currentPlayerId: null,
      currentQuestion: null,
      playerQuestionsLeft,
    });
  };

  // Get remaining questions count for a player
  const getRemainingCount = (playerId: number): number => {
    return gameState.playerQuestionsLeft[playerId]?.length || 0;
  };

  // Check if current player has finished all questions
  const isCurrentPlayerDone = gameState.currentPlayerId !== null && 
    getRemainingCount(gameState.currentPlayerId) === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[98vh] md:max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <CardHeader className="space-y-2 md:space-y-4 border-b border-border/50 sticky top-0 bg-card z-10 py-3 md:py-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg md:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                Mission Game
              </CardTitle>
              
              {/* Warning Banner - Collapsible */}
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsWarningVisible(!isWarningVisible)}
                  className="w-full p-2 md:p-3 flex items-center justify-between gap-2 hover:bg-red-500/5 transition-colors"
                >
                  <span className="text-xs md:text-sm font-semibold text-red-600 dark:text-red-400 text-left flex-1">
                    ⚠️ Avertissement
                  </span>
                  {isWarningVisible ? (
                    <ChevronUp className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                </button>
                {isWarningVisible && (
                  <div className="px-2 pb-2 md:px-3 md:pb-3 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Attention, ce jeu contient différents types d'actions et de vérités. 
                      La bzzgre corporation ne peut en aucun cas être tenue responsable des engueulades, 
                      crises de jalousie, bourbiers ou possibles ruptures de contrat amical. 
                      Bien à vous, la direction de bzzgre.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Current Player Info */}
          {gameState.currentPlayerId && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 md:p-3">
              <p className="text-sm md:text-lg font-semibold">
                🎯 {participants.find(p => p.id === gameState.currentPlayerId)?.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {getRemainingCount(gameState.currentPlayerId)}/{TOTAL_QUESTIONS} questions restantes
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsResetConfirmOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline ml-2">Reset jeu</span>
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <span className="hidden md:inline">← </span>Retour
            </Button>
          </div>
        </CardHeader>

        {/* Main Content */}
        <CardContent className="p-3 md:p-6 space-y-3 md:space-y-6">
          {/* Question Display */}
          <div className="min-h-[120px] md:min-h-[200px] flex items-center justify-center">
            {isCurrentPlayerDone ? (
              <div className="text-center space-y-2 md:space-y-4 p-4 md:p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/50 rounded-lg">
                <p className="text-3xl md:text-4xl">🎉</p>
                <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                  GG ! Toutes les questions !
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Sélectionne un autre joueur
                </p>
              </div>
            ) : gameState.currentQuestion ? (
              <div 
                className="text-center space-y-2 md:space-y-4 p-4 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30 rounded-lg animate-in fade-in-50 duration-500"
              >
                <p className="text-base md:text-xl lg:text-2xl font-semibold leading-relaxed">
                  {gameState.currentQuestion}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2 md:space-y-4">
                <Sparkles className="h-12 w-12 md:h-16 md:w-16 mx-auto text-primary opacity-50" />
                <p className="text-sm md:text-xl text-muted-foreground">
                  Sélectionne un joueur
                </p>
              </div>
            )}
          </div>

          {/* Player Selection Grid */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <h3 className="text-sm md:text-lg font-semibold">Joueurs</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {participants.map((participant) => {
                const remaining = getRemainingCount(participant.id);
                const isCurrent = gameState.currentPlayerId === participant.id;
                const isDone = remaining === 0;

                return (
                  <Button
                    key={participant.id}
                    onClick={() => drawQuestionForPlayer(participant.id)}
                    disabled={isDone}
                    variant={isCurrent ? 'default' : 'outline'}
                    className="h-auto py-2 px-2 md:py-4 md:px-4 flex flex-col items-start gap-1 md:gap-2 w-full relative overflow-hidden"
                  >
                    {isDone && (
                      <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                        <span className="text-2xl md:text-4xl">✅</span>
                      </div>
                    )}
                    <span className="font-semibold text-xs md:text-base">{participant.name}</span>
                    <span className="text-[10px] md:text-xs opacity-70">
                      {remaining}/{TOTAL_QUESTIONS}
                    </span>
                    {!isDone && (
                      <div className="w-full bg-secondary/30 rounded-full h-1 md:h-1.5">
                        <div 
                          className="bg-primary h-1 md:h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((TOTAL_QUESTIONS - remaining) / TOTAL_QUESTIONS) * 100}%` }}
                        />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Stats Summary - Hidden on mobile */}
          <div className="hidden md:block bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total de questions possibles : {participants.length} joueurs × {TOTAL_QUESTIONS} questions = {participants.length * TOTAL_QUESTIONS} tirages
            </p>
          </div>
        </CardContent>
      </Card>

      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          handleReset();
          setIsResetConfirmOpen(false);
        }}
      />
    </div>
  );
}
