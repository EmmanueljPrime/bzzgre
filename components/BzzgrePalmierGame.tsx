'use client';

import { useEffect, useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import { X, RotateCcw, Sparkles, Users, Flame } from 'lucide-react';

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
  label: string;
}

interface PalmierGameState {
  deck: PlayingCard[];
  currentCard: PlayingCard | null;
  currentAction: string | null;
  drawnCount: number;
}

const SUITS: Suit[] = ['C', 'D', 'H', 'S'];
const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

const buildDeck = (): PlayingCard[] => {
  const cards: PlayingCard[] = [];

  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      cards.push({
        rank,
        suit,
        label: `${rank}-${suit}`,
      });
    });
  });

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export default function BzzgrePalmierGame({
  participants,
  gameId,
  onClose,
}: BzzgrePalmierGameProps) {
  const storageKey = `bzzgre_palmier_game_${gameId}`;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const [gameState, setGameState] = useState<PalmierGameState>(() => {
    if (typeof window === 'undefined') {
      return {
        deck: buildDeck(),
        currentCard: null,
        currentAction: null,
        drawnCount: 0,
      };
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse Palmier game state:', e);
      }
    }

    return {
      deck: buildDeck(),
      currentCard: null,
      currentAction: null,
      drawnCount: 0,
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const getRandomPlayer = (excludeId?: number): Participant | null => {
    const pool = participants.filter((p) => p.id !== excludeId);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getTwoDistinctPlayers = (): [Participant | null, Participant | null] => {
    if (participants.length === 0) return [null, null];
    if (participants.length === 1) return [participants[0], participants[0]];

    const first = getRandomPlayer();
    const second = first ? getRandomPlayer(first.id) : getRandomPlayer();
    return [first, second];
  };

  const generateAction = (card: PlayingCard): string => {
    const [playerA, playerB] = getTwoDistinctPlayers();
    const nameA = playerA?.name || 'Un joueur';
    const nameB = playerB?.name || 'Un joueur';

    switch (card.rank) {
      case 'A':
        return `PALMIER: tous la main en l'air. Le dernier a lever la main boit 4 gorgees.`;
      case 'K':
        return `${nameA} devient le Roi/Reine: distribue 4 gorgees comme tu veux.`;
      case 'Q':
        return `${nameA} pose une question a ${nameB}. Si la reponse est refusee: 3 gorgees.`;
      case 'J':
        return `Reflexe palmier: main sur la table. Le dernier boit 2 gorgees.`;
      case '10':
        return `${nameA} et ${nameB}: pierre-feuille-ciseaux en 3 manches. Le perdant boit 3 gorgees.`;
      case '9':
        return `${nameA} choisit une categorie. Tour de table: celui qui bloque boit 3 gorgees.`;
      case '8':
        return `${nameA} et ${nameB}: trinquez et buvez 2 gorgees ensemble.`;
      case '7':
        return `${nameA}: invente une regle pour le reste de la manche. Ceux qui la cassent boivent 2 gorgees.`;
      case '6':
        return `${nameA}: donne 2 gorgees.`;
      case '5':
        return `${nameA}: prends 2 gorgees.`;
      case '4':
        return `Tout le monde boit 1 gorgee.`;
      case '3':
        return `${nameA} et ${nameB}: echangez vos verres pour 1 gorgee.`;
      case '2':
        return `${nameA}: choisis un binome. Les deux boivent 2 gorgees.`;
      default:
        return 'Tout le monde boit 1 gorgee.';
    }
  };

  const drawCard = () => {
    if (gameState.deck.length === 0) return;

    const [nextCard, ...remainingDeck] = gameState.deck;
    const action = generateAction(nextCard);

    setGameState({
      deck: remainingDeck,
      currentCard: nextCard,
      currentAction: action,
      drawnCount: gameState.drawnCount + 1,
    });
  };

  const handleReset = () => {
    const resetState: PalmierGameState = {
      deck: buildDeck(),
      currentCard: null,
      currentAction: null,
      drawnCount: 0,
    };

    setGameState(resetState);

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(resetState));
    }
  };

  const cardsLeft = gameState.deck.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2 p-3 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Palmier
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Pioche une carte et applique la regle.
                </p>
              </div>
              <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-3 md:p-6 md:pt-0">
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
            </div>

            <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-5 md:p-7 space-y-4 text-center">
                <div className="text-xs md:text-sm text-muted-foreground">Carte actuelle</div>
                <div className="text-4xl md:text-6xl font-black text-primary tracking-wider">
                  {gameState.currentCard ? gameState.currentCard.label : '--'}
                </div>
                <p className="text-sm md:text-base leading-relaxed min-h-[56px] md:min-h-[64px] flex items-center justify-center">
                  {gameState.currentAction || 'Pioche une carte pour lancer la manche.'}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button onClick={drawCard} size="lg" disabled={cardsLeft === 0}>
                {cardsLeft === 0 ? 'Plus de cartes' : 'Piocher une carte'}
              </Button>
              <Button onClick={() => setIsResetConfirmOpen(true)} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4" />
                Reinitialiser Palmier
              </Button>
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
    </div>
  );
}
