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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
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
          <CardDescription className="text-base">
            Choisis ton jeu pour pimenter la soirée !
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mission Game Card */}
          <button
            onClick={() => setCurrentMode('mission')}
            className="w-full text-left group"
          >
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Target className="h-6 w-6" />
                      Mission Game
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Vérités et actions osées • 55 questions par joueur
                    </CardDescription>
                  </div>
                  <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    DISPONIBLE
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Un jeu de vérités et d'actions qui va révéler les secrets les plus croustillants. 
                  Chaque joueur a son propre deck de 55 questions uniques. Attention, ça va chauffer ! 🔥
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>👥 {participants.length} joueurs</span>
                  <span>•</span>
                  <span>📝 {participants.length * 55} questions total</span>
                </div>
              </CardContent>
            </Card>
          </button>

          {/* Upcoming Games (Locked) */}
          <Card className="border-2 border-dashed opacity-50 cursor-not-allowed">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xl flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-5 w-5" />
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
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xl flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-5 w-5" />
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
