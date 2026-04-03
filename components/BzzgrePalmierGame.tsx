'use client';

import { useEffect, useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import { X, RotateCcw, Sparkles, Users, Flame, Crown, History } from 'lucide-react';

interface BzzgrePalmierGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

type Suit = 'C' | 'D' | 'H' | 'S';
type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

interface PlayingCard {
  rank: Rank;
  suit: Suit;
}

interface ActionResult {
  text: string;
  palmierDelta: number;
  consumePalmier: boolean;
}

interface PalmierHistoryItem {
  id: string;
  actorName: string;
  cardLabel: string;
  text: string;
  palmierAfter: number;
}

interface PalmierGameState {
  deck: PlayingCard[];
  currentCard: PlayingCard | null;
  currentAction: string | null;
  drawnCount: number;
  currentPlayerIndex: number;
  palmierPot: number;
  history: PalmierHistoryItem[];
}

const SUITS: Suit[] = ['C', 'D', 'H', 'S'];
const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

const SUIT_SYMBOLS: Record<Suit, string> = {
  C: '♣',
  D: '♦',
  H: '♥',
  S: '♠',
};

const buildDeck = (): PlayingCard[] => {
  const cards: PlayingCard[] = [];

  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      cards.push({ rank, suit });
    });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function BzzgrePalmierGame({
  participants,
  gameId,
  onClose,
}: BzzgrePalmierGameProps) {
  const storageKey = `bzzgre_palmier_game_${gameId}`;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const initialState: PalmierGameState = {
    deck: buildDeck(),
    currentCard: null,
    currentAction: null,
    drawnCount: 0,
    currentPlayerIndex: 0,
    palmierPot: 0,
    history: [],
  };

  const [gameState, setGameState] = useState<PalmierGameState>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          history: parsed.history || [],
        };
      } catch (e) {
        console.error('Failed to parse Palmier game state:', e);
      }
    }

    return initialState;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const getRandomPlayer = (excludeId?: number): Participant | null => {
    const pool = participants.filter((p) => p.id !== excludeId);
    if (pool.length === 0) return null;
    return randomItem(pool);
  };

  const getTwoDistinctPlayers = (): [Participant | null, Participant | null] => {
    if (participants.length === 0) return [null, null];
    if (participants.length === 1) return [participants[0], participants[0]];

    const first = getRandomPlayer();
    const second = first ? getRandomPlayer(first.id) : getRandomPlayer();
    return [first, second];
  };

  const getPlayerNameByOffset = (baseIndex: number, offset: number): string => {
    if (participants.length === 0) return 'Un joueur';
    const normalized = (baseIndex + offset + participants.length) % participants.length;
    return participants[normalized]?.name || 'Un joueur';
  };

  const generateAction = (
    card: PlayingCard,
    currentPlayerName: string,
    currentPalmier: number,
    currentIndex: number
  ): ActionResult => {
    const [playerA, playerB] = getTwoDistinctPlayers();
    const nameA = playerA?.name || 'Un joueur';
    const nameB = playerB?.name || 'Un joueur';
    const leftPlayer = getPlayerNameByOffset(currentIndex, -1);
    const rightPlayer = getPlayerNameByOffset(currentIndex, 1);

    switch (card.rank) {
      case 'A':
        return {
          text: `PALMIER: mains en l air ! Le dernier boit le Palmier central (${Math.max(currentPalmier, 2)} gorgees).`,
          palmierDelta: 0,
          consumePalmier: true,
        };
      case 'K':
        return {
          text: `${currentPlayerName} devient le Roi/Reine: distribue 4 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case 'Q':
        return {
          text: `${currentPlayerName} pose une question a ${nameA}. Pas de reponse = 3 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case 'J':
        return {
          text: `Reflexe table: le dernier a poser la main boit 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '10':
        return {
          text: `${currentPlayerName} choisit une categorie. Celui qui bloque boit 3 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '9':
        return {
          text: `${currentPlayerName} donne un mot, les autres doivent rimer. Celui qui bloque boit 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '8':
        return {
          text: `${currentPlayerName} et ${nameA} trinquent et boivent 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '7':
        return {
          text: `${currentPlayerName} cree une regle. Si quelqu un la casse: 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '6':
        return {
          text: `${currentPlayerName} donne 2 gorgees a ${nameA}.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '5':
        return {
          text: `${currentPlayerName} boit 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '4':
        return {
          text: `${currentPlayerName}, ${leftPlayer} et ${rightPlayer} boivent 1 gorgee.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      case '3':
        return {
          text: `Carte PALMIER: ajoutez 3 gorgees au Palmier central.`,
          palmierDelta: 3,
          consumePalmier: false,
        };
      case '2':
        return {
          text: `${currentPlayerName} choisit 2 joueurs (${nameA} et ${nameB}) qui boivent 2 gorgees.`,
          palmierDelta: 0,
          consumePalmier: false,
        };
      default:
        return {
          text: 'Tout le monde boit 1 gorgee.',
          palmierDelta: 0,
          consumePalmier: false,
        };
    }
  };

  const drawCard = () => {
    setGameState((prev) => {
      if (prev.deck.length === 0) return prev;

      const [nextCard, ...remainingDeck] = prev.deck;
      const currentPlayerName = participants.length > 0
        ? participants[prev.currentPlayerIndex % participants.length]?.name || 'Un joueur'
        : 'Un joueur';

      const generated = generateAction(nextCard, currentPlayerName, prev.palmierPot, prev.currentPlayerIndex);

      let nextPalmier = prev.palmierPot + generated.palmierDelta;
      if (generated.consumePalmier) {
        nextPalmier = 0;
      }

      const nextHistoryEntry: PalmierHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        actorName: currentPlayerName,
        cardLabel: `${nextCard.rank}${SUIT_SYMBOLS[nextCard.suit]}`,
        text: generated.text,
        palmierAfter: nextPalmier,
      };

      return {
        ...prev,
        deck: remainingDeck,
        currentCard: nextCard,
        currentAction: generated.text,
        drawnCount: prev.drawnCount + 1,
        currentPlayerIndex: participants.length > 0
          ? (prev.currentPlayerIndex + 1) % participants.length
          : 0,
        palmierPot: nextPalmier,
        history: [nextHistoryEntry, ...prev.history].slice(0, 10),
      };
    });
  };

  const handleReset = () => {
    const resetState: PalmierGameState = {
      deck: buildDeck(),
      currentCard: null,
      currentAction: null,
      drawnCount: 0,
      currentPlayerIndex: 0,
      palmierPot: 0,
      history: [],
    };

    setGameState(resetState);

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(resetState));
    }
  };

  const cardsLeft = gameState.deck.length;
  const currentPlayerName = participants.length > 0
    ? participants[gameState.currentPlayerIndex % participants.length]?.name || 'Un joueur'
    : 'Un joueur';

  const currentCardDisplay = gameState.currentCard
    ? `${gameState.currentCard.rank}${SUIT_SYMBOLS[gameState.currentCard.suit]}`
    : '--';

  const isRedSuit = gameState.currentCard?.suit === 'H' || gameState.currentCard?.suit === 'D';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-4">
        <Card className="shadow-2xl max-h-[96vh] overflow-y-auto">
          <CardHeader className="space-y-2 p-3 md:p-6 sticky top-0 bg-card z-10 border-b border-border/40">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Palmier
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Version interactive: tour par joueur, palmier central et historique des cartes.
                </p>
              </div>
              <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-3 md:p-6 md:pt-0">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowRules((prev) => !prev)}
                className="h-8 w-8 rounded-full border border-primary/50 bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
                aria-label="Afficher les regles Palmier"
              >
                ?
              </button>
            </div>

            {showRules && (
              <Card className="border-2 border-primary/40 bg-primary/5">
                <CardContent className="p-3 md:p-4 space-y-2">
                  <p className="text-sm font-semibold">Regles rapides Palmier</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Chacun pioche a son tour. Appliquez l action de la carte, puis passez au joueur suivant.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                    <p><span className="font-semibold">A :</span> Palmier (dernier boit le pot)</p>
                    <p><span className="font-semibold">K :</span> Roi/Reine distribue 4</p>
                    <p><span className="font-semibold">Q :</span> Question piege</p>
                    <p><span className="font-semibold">J :</span> Reflexe table</p>
                    <p><span className="font-semibold">10 :</span> Categorie</p>
                    <p><span className="font-semibold">9 :</span> Rime</p>
                    <p><span className="font-semibold">8 :</span> Trinquez a deux</p>
                    <p><span className="font-semibold">7 :</span> Nouvelle regle</p>
                    <p><span className="font-semibold">6 :</span> Donne 2 gorgees</p>
                    <p><span className="font-semibold">5 :</span> Bois 2 gorgees</p>
                    <p><span className="font-semibold">4 :</span> Toi + voisins boivent</p>
                    <p><span className="font-semibold">3 :</span> +3 au Palmier</p>
                    <p><span className="font-semibold">2 :</span> Choisis 2 joueurs</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-sm text-muted-foreground bg-muted/30 p-2 md:p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{participants.length} joueurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>{cardsLeft} cartes restantes</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{gameState.drawnCount} cartes tirees</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Crown className="h-4 w-4 text-primary" />
                <span>Palmier: {gameState.palmierPot} gorgees</span>
              </div>
            </div>

            <Card className="border border-border/60">
              <CardContent className="p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Tour actuel</p>
                  <p className="font-semibold text-sm md:text-base">{currentPlayerName} pioche maintenant</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setGameState((prev) => ({ ...prev, palmierPot: Math.max(0, prev.palmierPot - 1) }))}
                    variant="outline"
                    size="sm"
                  >
                    -1 Palmier
                  </Button>
                  <Button
                    onClick={() => setGameState((prev) => ({ ...prev, palmierPot: prev.palmierPot + 1 }))}
                    variant="outline"
                    size="sm"
                  >
                    +1 Palmier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-5 md:p-7 space-y-4 text-center">
                <div className="text-xs md:text-sm text-muted-foreground">Carte actuelle</div>
                <div className={`text-5xl md:text-7xl font-black tracking-wider ${isRedSuit ? 'text-red-500' : 'text-primary'}`}>
                  {currentCardDisplay}
                </div>
                <p className="text-sm md:text-base leading-relaxed min-h-[56px] md:min-h-[64px] flex items-center justify-center">
                  {gameState.currentAction || 'Pioche une carte pour lancer la manche.'}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button onClick={drawCard} size="lg" disabled={cardsLeft === 0}>
                {cardsLeft === 0 ? 'Plus de cartes' : `Piocher (${currentPlayerName})`}
              </Button>
              <Button onClick={() => setIsResetConfirmOpen(true)} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4" />
                Reinitialiser Palmier
              </Button>
            </div>

            {gameState.history.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Dernieres actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {gameState.history.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-lg border border-border/50 p-2 md:p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs md:text-sm font-semibold">{item.actorName} a pioche {item.cardLabel}</p>
                        <span className="text-[10px] md:text-xs text-muted-foreground">Palmier: {item.palmierAfter}</span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
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
    </div>
  );
}
