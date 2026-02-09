'use client';

import { useState, useEffect } from 'react';
import { Participant, Bar } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Wine, ChevronRight, Check, Plus, Trash2 } from 'lucide-react';

interface ParticipantEntryProps {
  totalPeople: number;
  drinksPerPerson: number;
  participants: Participant[];
  selectedBar: Bar | null;
  onSaveParticipant: (participant: Participant, isLastParticipant: boolean) => void;
  onComplete: () => void;
}

export default function ParticipantEntry({
  totalPeople,
  drinksPerPerson,
  participants,
  selectedBar,
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
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

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
    
    if (drinks.length < drinksPerPerson) {
      newErrors.push(`Il faut au moins ${drinksPerPerson} boissons`);
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

  const removeDrink = (index: number) => {
    // Ne permettre la suppression que si on a plus que le nombre requis
    if (drinks.length > drinksPerPerson) {
      const newDrinks = drinks.filter((_, i) => i !== index);
      setDrinks(newDrinks);
    }
  };

  const addDrink = () => {
    if (drinks.length < 20) {
      setDrinks([...drinks, '']);
    }
  };

  const addDrinkFromBar = (drinkName: string) => {
    // Trouver le premier champ vide
    const emptyIndex = drinks.findIndex((d) => !d.trim());
    
    if (emptyIndex !== -1) {
      // Remplir le premier champ vide
      updateDrink(emptyIndex, drinkName);
      setHighlightedIndex(emptyIndex);
      setTimeout(() => setHighlightedIndex(null), 800);
      
      // Scroll vers le champ rempli sur mobile
      setTimeout(() => {
        const element = document.getElementById(`drink-input-${emptyIndex}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } else {
      // Si tous les champs sont pleins, ajouter une nouvelle boisson
      if (drinks.length < 20) {
        const newDrinks = [...drinks, drinkName];
        setDrinks(newDrinks);
        const newIndex = drinks.length;
        setHighlightedIndex(newIndex);
        setTimeout(() => setHighlightedIndex(null), 800);
        
        // Scroll vers le nouveau champ
        setTimeout(() => {
          const element = document.getElementById(`drink-input-${newIndex}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  };

  const isLastParticipant = currentIndex + 1 >= totalPeople;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <Card className="lg:col-span-2">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Wine className="h-4 w-4" />
                    Tes boissons ({drinks.length})
                  </label>
                  <Button
                    type="button"
                    onClick={addDrink}
                    disabled={drinks.length >= 20}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {drinks.map((drink, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        id={`drink-input-${index}`}
                        type="text"
                        value={drink}
                        onChange={(e) => updateDrink(index, e.target.value)}
                        placeholder={`Boisson ${index + 1}`}
                        className={`flex-1 ${highlightedIndex === index ? 'ring-2 ring-primary transition-all duration-300' : ''}`}
                      />
                      {drinks.length > drinksPerPerson && (
                        <Button
                          type="button"
                          onClick={() => removeDrink(index)}
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

        {/* Carte des boissons du bar */}
        {selectedBar && selectedBar.drinks.length > 0 && (
          <Card className="lg:col-span-1 h-fit max-h-[600px] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Carte {selectedBar.name}</CardTitle>
              <CardDescription>Cliquez pour ajouter rapidement</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                {selectedBar.drinks.map((drink, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addDrinkFromBar(drink)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-input hover:border-primary hover:bg-primary/10 transition-all text-left group active:scale-95 active:bg-primary/20 touch-manipulation"
                  >
                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    <span className="text-sm">{drink}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
