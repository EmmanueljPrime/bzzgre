'use client';

import { useState } from 'react';
import { Participant, Bar } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Target, Beer, Clock, Trees, Users } from 'lucide-react';
import BzzgreMissionGame from './BzzgreMissionGame';
import JeNaiJamaisGame from './JeNaiJamaisGame';
import BzzgreTimeUpGame from './BzzgreTimeUpGame';
import BzzgrePalmierGame from './BzzgrePalmierGame';
import BzzgreMostLikelyToGame from './BzzgreMostLikelyToGame';
import BzzgreImposteurGame from './BzzgreImposteurGame';

interface BzzgreGamesModalProps {
  participants: Participant[];
  gameId: string;
  selectedBar: Bar | null;
  onClose: () => void;
}

type GameMode = 'selection' | 'mission' | 'jamais' | 'timesup' | 'palmier' | 'likely' | 'imposteur';

export default function BzzgreGamesModal({
  participants,
  gameId,
  selectedBar,
  onClose,
}: BzzgreGamesModalProps) {
  const [currentMode, setCurrentMode] = useState<GameMode>('selection');
  const [isMissionWarningOpen, setIsMissionWarningOpen] = useState(false);

  const handleMissionGameClick = () => {
    setIsMissionWarningOpen(true);
  };

  const handleMissionWarningConfirm = () => {
    setIsMissionWarningOpen(false);
    setCurrentMode('mission');
  };

  const handleMissionWarningCancel = () => {
    setIsMissionWarningOpen(false);
  };

  if (isMissionWarningOpen) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-amber-500/40">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <span>⚠️</span>
              Mission Game
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Attention, ce jeu n'est pas adapté aux bars. Il est préférable d'y jouer lors d'une soirée à domicile, entre personnes à l'aise avec ce type de questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Gardez le cadre cool, respectez les limites de chacun, et évitez de le lancer dans un lieu trop public.
            </p>
            <div className="flex gap-2 justify-end">
              <Button onClick={handleMissionWarningCancel} variant="outline">
                Annuler
              </Button>
              <Button onClick={handleMissionWarningConfirm}>
                J'ai compris
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentMode === 'mission') {
    return (
      <BzzgreMissionGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'jamais') {
    return (
      <JeNaiJamaisGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'timesup') {
    return (
      <BzzgreTimeUpGame
        participants={participants}
        gameId={gameId}
        selectedBar={selectedBar}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'palmier') {
    return (
      <BzzgrePalmierGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'likely') {
    return (
      <BzzgreMostLikelyToGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  if (currentMode === 'imposteur') {
    return (
      <BzzgreImposteurGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[96vh] md:max-h-[92vh] overflow-y-auto shadow-2xl my-2 md:my-0">
        <CardHeader className="space-y-2 md:space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
              🍺 Jeux Bzzgre
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-sm md:text-base">
            Choisis ton jeu pour pimenter la soirée !
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 md:space-y-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <p className="text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-300">
              Avec alcool
            </p>
          </div>

          {/* Mission Game Card */}
          <button
            onClick={handleMissionGameClick}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Target className="h-5 w-5 md:h-6 md:w-6" />
                      Mission Game
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Vérités et actions osées • 55 questions par joueur
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    DISPO
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Un jeu de vérités et d'actions qui va révéler les secrets les plus croustillants. 
                  Chaque joueur a son propre deck de 61 questions uniques. Attention, ça va chauffer ! 🔥
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>👥 {participants.length} joueurs</span>
                  <span>•</span>
                  <span>📝 {participants.length * 61} questions</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Je n'ai jamais Card */}
          <button
            onClick={() => setCurrentMode('jamais')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Beer className="h-5 w-5 md:h-6 md:w-6" />
                      Je n'ai jamais...
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Qui a déjà fait ça ? • Grand pool progressif
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    DISPO
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Le classique "Je n'ai jamais" avec un tres grand nombre de questions qui evoluent de soft a tres ose ! 
                  Ceux qui ont déjà fait l'action boivent. Attention, ça monte en intensité ! 🔥
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>👥 Mode groupe</span>
                  <span>•</span>
                  <span>🎲 Pool XXL</span>
                  <span>•</span>
                  <span>📈 Difficulté progressive</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Palmier Card */}
          <button
            onClick={() => setCurrentMode('palmier')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Trees className="h-5 w-5 md:h-6 md:w-6" />
                      Palmier
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Pioche de cartes • Actions rapides • Ambiance instantanee
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    DISPO
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Un mini-jeu type Palmier: chaque carte tiree donne une regle a appliquer.
                  Ideal pour relancer le rythme entre deux tours.
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>🃏 52 cartes</span>
                  <span>•</span>
                  <span>⚡ Manche ultra rapide</span>
                </div>
              </CardContent>
            </Card>
          </button>

          <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2">
            <p className="text-xs md:text-sm font-semibold text-sky-700 dark:text-sky-300">
              Sans alcool
            </p>
          </div>

          {/* Chrono BzzGre Card */}
          <button
            onClick={() => setCurrentMode('timesup')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Clock className="h-5 w-5 md:h-6 md:w-6" />
                      Chrono BzzGre
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Décris, mime et devine • 3 tours • 3 listes
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    DISPO
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Le classique Chrono BzzGre revisité Bzzgre ! 3 listes de 40 mots (Classiques, Séries & Films, Animation). 
                  3 tours : descriptions (30s), un mot (30s), mime (40s). Créez vos équipes par drag & drop ! ⏱️
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>👥 2-6 équipes</span>
                  <span>•</span>
                  <span>⏱️ 30s/30s/40s</span>
                  <span>•</span>
                  <span>🎯 3 listes de 40 mots</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Most Likely To Card */}
          <button
            onClick={() => setCurrentMode('likely')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Users className="h-5 w-5 md:h-6 md:w-6" />
                      Most Likely To
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Vote de groupe • Qui est le plus susceptible de...
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    DISPO
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Tirez une phrase, tout le monde vote, et le joueur designe boit.
                  Rapide, drole et parfait pour chauffer la table.
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>🗳️ Vote instantane</span>
                  <span>•</span>
                  <span>🎯 60 prompts</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Imposteur Card */}
          <button
            onClick={() => setCurrentMode('imposteur')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 md:space-y-2 flex-1">
                    <CardTitle className="text-lg md:text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Users className="h-5 w-5 md:h-6 md:w-6" />
                      Imposteur
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Meme theme, un mot differe, trouvez l imposteur
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                    NEW
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 hidden md:block">
                  Chaque joueur voit son mot en prive. Les civils partagent un mot, l imposteur a un mot proche,
                  et vous pouvez activer Mr White (aucun mot). Debattez et votez.
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>🔒 Vision privee</span>
                  <span>•</span>
                  <span>🕵️ 1 imposteur</span>
                  <span>•</span>
                  <span>👻 Mr White optionnel</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Back Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            size="lg"
          >
            ← Retour au jeu principal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
