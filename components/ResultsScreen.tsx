'use client';

import { useState } from 'react';
import { Participant, Bar } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, UserPlus, Edit, Wine, Trash2, Gamepad2 } from 'lucide-react';
import BzzgreGamesModal from './BzzgreGamesModal';

interface ResultsScreenProps {
  participants: Participant[];
  selectedBar: Bar | null;
  onDrawDrinks: () => void;
  onRerollDrink: (participantId: number) => void;
  onEditParticipant: (participantId: number) => void;
  onAddParticipant: () => void;
  onDeleteParticipant: (participantId: number) => void;
  isDrawn: boolean;
}

export default function ResultsScreen({
  participants,
  selectedBar,
  onDrawDrinks,
  onRerollDrink,
  onEditParticipant,
  onAddParticipant,
  onDeleteParticipant,
  isDrawn,
}: ResultsScreenProps) {
  const [isBzzgreModalOpen, setIsBzzgreModalOpen] = useState(false);
  const canDraw = participants.every((p) => p.drinks.length > 0);

  // Generate a unique game ID based on participant names
  const gameId = participants.map(p => p.id).join('-');

  return (
    <div className="min-h-screen p-4 pt-20 pb-8 bg-gradient-to-br from-background to-muted">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            {isDrawn ? 'Relancez pour un nouveau tirage' : 'Prêt pour le tirage'}
          </p>
        </div>

        {/* Boutons principaux */}
        <div className="mb-8 space-y-4">
          <Button
            onClick={onDrawDrinks}
            disabled={!canDraw}
            className="w-full max-w-xl mx-auto h-12 text-base"
            size="default"
          >
            <Shuffle className="h-5 w-5" />
            {isDrawn ? 'Relancer le tirage' : 'Tirer les boissons'}
          </Button>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setIsBzzgreModalOpen(true)}
              variant="secondary"
              className="h-14 w-14 p-0 text-white transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 55%, hsl(var(--accent)) 100%)',
              }}
              size="icon"
              aria-label="Ouvrir les jeux Bzzgre"
            >
              <Gamepad2 className="h-6 w-6" />
            </Button>

            <Button
              onClick={onAddParticipant}
              variant="secondary"
              className="h-14 w-14 p-0"
              size="icon"
              aria-label="Ajouter un participant"
            >
              <UserPlus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Grille de participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((participant) => (
            <Card key={participant.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{participant.name}</span>
                  <Wine className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-primary/40 rounded-lg p-4 min-h-[80px] flex items-center justify-center backdrop-blur-sm shadow-inner transition-all"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--card) / 0.8) 0%, hsl(var(--background) / 0.9) 100%)',
                  }}
                >
                  {participant.assignedDrink ? (
                    <p 
                      className="text-lg font-semibold text-center text-foreground transition-all"
                      style={{
                        filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))',
                      }}
                    >
                      {participant.assignedDrink}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center">
                      Pas encore tirée
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditParticipant(participant.id)}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => onDeleteParticipant(participant.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => onRerollDrink(participant.id)}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  disabled={!isDrawn || !participant.assignedDrink}
                >
                  <Shuffle className="h-4 w-4" />
                  Relancer cette boisson
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!canDraw && (
          <div className="mt-8 bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-sm text-destructive font-medium">
              Certains participants n'ont pas saisi leurs boissons
            </p>
          </div>
        )}
      </div>

      {/* Bzzgre Games Modal */}
      {isBzzgreModalOpen && (
        <BzzgreGamesModal
          participants={participants}
          gameId={gameId}
          selectedBar={selectedBar}
          onClose={() => setIsBzzgreModalOpen(false)}
        />
      )}
    </div>
  );
}
