'use client';

import { useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Wine } from 'lucide-react';

interface EditParticipantModalProps {
  participant: Participant;
  onSave: (updatedParticipant: Participant) => void;
  onCancel: () => void;
}

export default function EditParticipantModal({
  participant,
  onSave,
  onCancel,
}: EditParticipantModalProps) {
  const [drinks, setDrinks] = useState<string[]>([...participant.drinks]);
  const [errors, setErrors] = useState<string[]>([]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                      type="text"
                      value={drink}
                      onChange={(e) => updateDrink(index, e.target.value)}
                      placeholder={`Boisson ${index + 1}`}
                      className="flex-1"
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
    </div>
  );
}
