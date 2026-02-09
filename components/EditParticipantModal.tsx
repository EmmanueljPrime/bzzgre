'use client';

import { useState } from 'react';
import { Participant, Bar } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Wine } from 'lucide-react';

interface EditParticipantModalProps {
  participant: Participant;
  selectedBar: Bar | null;
  onSave: (updatedParticipant: Participant) => void;
  onCancel: () => void;
}

export default function EditParticipantModal({
  participant,
  selectedBar,
  onSave,
  onCancel,
}: EditParticipantModalProps) {
  const [drinks, setDrinks] = useState<string[]>([...participant.drinks]);
  const [errors, setErrors] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const validate = () => {
    const newErrors: string[] = [];
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

    const updatedParticipant: Participant = {
      ...participant,
      drinks: drinks.map((d) => d.trim()),
    };

    onSave(updatedParticipant);
  };

  const updateDrink = (index: number, value: string) => {
    const newDrinks = [...drinks];
    newDrinks[index] = value;
    setDrinks(newDrinks);
  };

  const addDrink = () => {
    if (drinks.length < 20) {
      setDrinks([...drinks, '']);
    }
  };

  const removeDrink = (index: number) => {
    if (drinks.length > 1) {
      const newDrinks = drinks.filter((_, i) => i !== index);
      setDrinks(newDrinks);
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
      
      // Scroll vers le champ rempli
      setTimeout(() => {
        const element = document.getElementById(`edit-drink-input-${emptyIndex}`);
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
          const element = document.getElementById(`edit-drink-input-${newIndex}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[90vh]">
        {/* Formulaire principal */}
        <Card className="lg:col-span-2 overflow-y-auto">
          <CardHeader>
            <CardTitle>Modifier les boissons</CardTitle>
            <CardDescription>{participant.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                        id={`edit-drink-input-${index}`}
                        type="text"
                        value={drink}
                        onChange={(e) => updateDrink(index, e.target.value)}
                        placeholder={`Boisson ${index + 1}`}
                        className={`flex-1 ${highlightedIndex === index ? 'ring-2 ring-primary transition-all duration-300' : ''}`}
                      />
                      <Button
                        type="button"
                        onClick={() => removeDrink(index)}
                        disabled={drinks.length <= 1}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

              <div className="flex gap-3">
                <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Carte des boissons du bar */}
        {selectedBar && selectedBar.drinks.length > 0 && (
          <Card className="lg:col-span-1 overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg">Carte {selectedBar.name}</CardTitle>
              <CardDescription>Cliquez pour ajouter</CardDescription>
            </CardHeader>
            <CardContent>
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
