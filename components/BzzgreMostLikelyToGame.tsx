'use client';

import { useEffect, useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, RotateCcw, Sparkles, Users } from 'lucide-react';

interface BzzgreMostLikelyToGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

const MOST_LIKELY_TO_QUESTIONS = [
  '...oublier son propre anniversaire.',
  '...envoyer un message au mauvais groupe.',
  '...se marier en premier.',
  '...partir en voyage sur un coup de tete.',
  '...finir la soiree en karaoke.',
  '...arriver en retard a son propre rendez-vous.',
  '...devenir celebre sur internet.',
  '...faire une declaration d amour bourree.',
  '...perdre ses cles ce week-end.',
  '...prendre le role de DJ sans permission.',
  '...organiser une soiree de derniere minute.',
  '...dormir avant la fin de la fete.',
  '...lancer un business improbable.',
  '...se faire des amis partout en 5 minutes.',
  '...avoir la meilleure anecdote de soiree.',
  '...ecrire a son ex apres deux verres.',
  '...faire rire tout le monde au pire moment.',
  '...se tromper de prenom en parlant.',
  '...gagner un concours de danse improvisee.',
  '...dire oui a un pari absurde.',
  '...oublier son code de telephone.',
  '...se lever pour danser en premier.',
  '...adopter un chien sur un coup de tete.',
  '...faire une sieste en pleine journee de fete.',
  '...tomber amoureux ou amoureuse le plus vite.',
  '...demenager dans un autre pays.',
  '...faire un tatouage spontanee.',
  '...oublier de repondre pendant 3 jours.',
  '...devenir influenceur ou influenceuse food.',
  '...finir sur la table pour raconter une histoire.',
  '...faire un prank a tout le groupe.',
  '...partir le dernier de la soiree.',
  '...boire de l eau entre chaque verre (oui oui).',
  '...mettre l ambiance dans un mariage inconnu.',
  '...faire une playlist parfaite.',
  '...lancer un jeu encore plus chaotique.',
  '...vouloir un after alors que tout le monde est KO.',
  '...perdre au pierre-feuille-ciseaux 5 fois de suite.',
  '...convaincre tout le monde de sortir maintenant.',
  '...garder un secret impossible.',
  '...avoir toujours faim apres minuit.',
  '...etre pret ou prete en 5 minutes.',
  '...faire un discours improvise.',
  '...payer la prochaine tournee.',
  '...se tromper de chemin meme avec GPS.',
  '...vouloir rejouer encore une manche.',
  '...faire une blague que personne ne comprend.',
  '...chanter faux mais avec confiance.',
  '...prendre la meilleure photo de groupe.',
  '...lancer un challenge tiktok ici et maintenant.',
  '...proposer un voyage de groupe impossible.',
  '...oublier son verre quelque part.',
  '...faire un compliment trop mignon a tout le monde.',
  '...raconter une anecdote un peu trop honnete.',
  '...jouer la securite et appeler un taxi.',
  '...finir avec une nouvelle passion demain matin.',
  '...survivre le mieux au lendemain de soiree.',
  '...changer d avis 10 fois en une heure.',
  '...dire "allez juste un dernier verre".',
  '...devenir chef de bande sans le vouloir.',
];

const TOTAL_QUESTIONS = MOST_LIKELY_TO_QUESTIONS.length;

interface GameState {
  currentQuestionIndex: number | null;
  askedQuestions: number[];
}

export default function BzzgreMostLikelyToGame({
  participants,
  gameId,
  onClose,
}: BzzgreMostLikelyToGameProps) {
  const storageKey = `bzzgre_most_likely_to_${gameId}`;

  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') {
      return {
        currentQuestionIndex: null,
        askedQuestions: [],
      };
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse Most Likely To game state:', e);
      }
    }

    return {
      currentQuestionIndex: null,
      askedQuestions: [],
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const drawQuestion = () => {
    const availableQuestions = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i).filter(
      (index) => !gameState.askedQuestions.includes(index)
    );

    if (availableQuestions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionIndex = availableQuestions[randomIndex];

    setGameState({
      currentQuestionIndex: questionIndex,
      askedQuestions: [...gameState.askedQuestions, questionIndex],
    });

    return questionIndex;
  };

  const handleReset = () => {
    const resetState: GameState = {
      currentQuestionIndex: null,
      askedQuestions: [],
    };

    setGameState(resetState);

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(resetState));
    }
  };

  const questionsRemaining = TOTAL_QUESTIONS - gameState.askedQuestions.length;
  const currentQuestion =
    gameState.currentQuestionIndex !== null
      ? MOST_LIKELY_TO_QUESTIONS[gameState.currentQuestionIndex]
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2 p-3 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Most Likely To
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Votez tous: qui correspond le plus a la phrase ?
                </p>
              </div>
              <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-3 md:p-6 md:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-sm text-muted-foreground bg-muted/30 p-2 md:p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{participants.length} joueurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>{questionsRemaining}/{TOTAL_QUESTIONS} restantes</span>
              </div>
            </div>

            {currentQuestion ? (
              <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <div className="text-xs md:text-sm text-muted-foreground text-center">
                    Manche {gameState.askedQuestions.length}
                  </div>
                  <p className="text-base md:text-xl font-semibold text-center leading-relaxed">
                    Qui est le plus susceptible de {currentQuestion}
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] md:text-xs text-muted-foreground italic text-center">
                      Le joueur avec le plus de votes boit 3 gorgees. En cas d egalite, les ex aequo boivent 2 gorgees.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-muted">
                <CardContent className="p-6 md:p-12 text-center space-y-3">
                  <div className="text-4xl md:text-6xl">🗳️</div>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    {questionsRemaining === 0
                      ? 'Toutes les questions ont ete tirees. Vous pouvez recommencer.'
                      : 'Lancez la premiere question Most Likely To.'}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
              <Button
                onClick={() => drawQuestion()}
                disabled={questionsRemaining === 0}
                className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {currentQuestion ? 'Question Suivante' : 'Commencer'}
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="h-10 md:h-12 text-sm md:text-base"
                size="lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            <Button onClick={onClose} variant="ghost" className="w-full text-xs md:text-sm">
              ← Retour a la selection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
