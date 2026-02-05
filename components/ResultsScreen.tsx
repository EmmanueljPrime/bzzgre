'use client';

import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, UserPlus, Edit, Wine } from 'lucide-react';

interface ResultsScreenProps {
  participants: Participant[];
  onDrawDrinks: () => void;
  onEditParticipant: (participantId: number) => void;
  onAddParticipant: () => void;
  isDrawn: boolean;
}

export default function ResultsScreen({
  participants,
  onDrawDrinks,
  onEditParticipant,
  onAddParticipant,
  isDrawn,
}: ResultsScreenProps) {
  const canDraw = participants.every((p) => p.drinks.length > 0);

  return (
    <div className="min-h-screen p-4 pt-20 pb-8 bg-gradient-to-br from-background to-muted">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            {isDrawn ? 'Relancez pour un nouveau tirage' : 'Prêt pour le tirage'}
          </p>
        </div>

        {/* Boutons principaux */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button
            onClick={onDrawDrinks}
            disabled={!canDraw}
            className="flex-1"
            size="lg"
          >
            <Shuffle className="h-5 w-5" />
            {isDrawn ? 'Relancer le tirage' : 'Tirer les boissons'}
          </Button>

          <Button
            onClick={onAddParticipant}
            variant="secondary"
            className="flex-1 md:flex-none"
            size="lg"
          >
            <UserPlus className="h-5 w-5" />
            Ajouter un participant
          </Button>
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
                <div className="bg-accent rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                  {participant.assignedDrink ? (
                    <p className="text-lg font-semibold text-center text-foreground">
                      {participant.assignedDrink}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center">
                      Pas encore tirée
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => onEditParticipant(participant.id)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                  Modifier mes boissons
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
    </div>
  );
}
