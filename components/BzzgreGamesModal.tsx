'use client';

import { useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Target, Lock } from 'lucide-react';
import BzzgreMissionGame from './BzzgreMissionGame';

interface BzzgreGamesModalProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

type GameMode = 'selection' | 'mission';

export default function BzzgreGamesModal({
  participants,
  gameId,
  onClose,
}: BzzgreGamesModalProps) {
  const [currentMode, setCurrentMode] = useState<GameMode>('selection');

  if (currentMode === 'mission') {
    return (
      <BzzgreMissionGame
        participants={participants}
        gameId={gameId}
        onClose={() => setCurrentMode('selection')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
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
          {/* Mission Game Card */}
          <button
            onClick={() => setCurrentMode('mission')}
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
                  Chaque joueur a son propre deck de 55 questions uniques. Attention, ça va chauffer ! 🔥
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                  <span>👥 {participants.length} joueurs</span>
                  <span>•</span>
                  <span>📝 {participants.length * 55} questions</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Upcoming Games (Locked) */}
          <Card className="border-2 border-dashed opacity-50 cursor-not-allowed">
            <CardHeader className="p-3 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base md:text-xl flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4 md:h-5 md:w-5" />
                    Beer Pong Challenge
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Bientôt disponible...
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-dashed opacity-50 cursor-not-allowed">
            <CardHeader className="p-3 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base md:text-xl flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4 md:h-5 md:w-5" />
                    Roi des Menteurs
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Bientôt disponible...
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

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
