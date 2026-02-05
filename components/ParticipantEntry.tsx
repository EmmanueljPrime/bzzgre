'use client';

import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Wine, ChevronRight, Check } from 'lucide-react';

interface ParticipantEntryProps {
  totalPeople: number;
  drinksPerPerson: number;
  participants: Participant[];
  onSaveParticipant: (participant: Participant, isLastParticipant: boolean) => void;
  onComplete: () => void;
}

export default function ParticipantEntry({
  totalPeople,
  drinksPerPerson,
  participants,
  onSaveParticipant,
  onComplete,
}: ParticipantEntryProps) {
  const currentIndex = participants.length;
  const currentParticipantData = participants[currentIndex];

  const [name, setName] = useState(currentParticipantData?.name || '');
  const [drinks, setDrinks] = useState<string[]>(
    currentParticipantData?.drinks || Array(drinksPerPerson).fill('')
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const participantData = participants[currentIndex];
    if (participantData) {
      setName(participantData.name);
      setDrinks(participantData.drinks);
    } else {
      setName('');
      setDrinks(Array(drinksPerPerson).fill(''));
    }
  }, [currentIndex, participants, drinksPerPerson]);

  const validate = () => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push('Le nom est obligatoire');
    }

    const emptyDrinks = drinks.filter((d) => !d.trim()).length;
    if (emptyDrinks > 0) {
      newErrors.push(`${emptyDrinks} boisson(s) non renseignée(s)`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const isLastParticipant = currentIndex + 1 >= totalPeople;

    const participant: Participant = {
      id: currentIndex + 1,
      name: name.trim(),
      drinks: drinks.map((d) => d.trim()),
      assignedDrink: null,
    };

    onSaveParticipant(participant, isLastParticipant);

    if (!isLastParticipant) {
      setName('');
      setDrinks(Array(drinksPerPerson).fill(''));
      setErrors([]);
    }
  };

  const updateDrink = (index: number, value: string) => {
    const newDrinks = [...drinks];
    newDrinks[index] = value;
    setDrinks(newDrinks);
  };

  const isLastParticipant = currentIndex + 1 >= totalPeople;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Personne {currentIndex + 1} sur {totalPeople}</CardTitle>
          <CardDescription>
            {participants.length} / {totalPeople} personnes enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Ton nom
              </label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sophie"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Tes boissons ({drinksPerPerson})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {drinks.map((drink, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={drink}
                    onChange={(e) => updateDrink(index, e.target.value)}
                    placeholder={`Boisson ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-destructive">
                    • {error}
                  </p>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isLastParticipant ? (
                <>
                  <Check className="h-5 w-5" />
                  Terminer les entrées
                </>
              ) : (
                <>
                  <ChevronRight className="h-5 w-5" />
                  Valider pour cette personne
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
