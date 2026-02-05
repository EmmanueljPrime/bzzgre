'use client';

import { useState } from 'react';
import { Config } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wine } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (config: Config) => void;
  initialConfig?: Config;
}

export default function SetupForm({ onSubmit, initialConfig }: SetupFormProps) {
  const [numberOfPeople, setNumberOfPeople] = useState(initialConfig?.numberOfPeople || 5);
  const [drinksPerPerson, setDrinksPerPerson] = useState(initialConfig?.drinksPerPerson || 5);
  const [errors, setErrors] = useState<{ people?: string; drinks?: string }>({});

  const validate = () => {
    const newErrors: { people?: string; drinks?: string } = {};

    if (numberOfPeople < 1 || numberOfPeople > 20) {
      newErrors.people = 'Le nombre de personnes doit être entre 1 et 20';
    }

    if (drinksPerPerson < 1 || drinksPerPerson > 20) {
      newErrors.drinks = 'Le nombre de boissons doit être entre 1 et 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ numberOfPeople, drinksPerPerson });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Paramétrez votre partie de tirage aléatoire</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="numberOfPeople" className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nombre de personnes
              </label>
              <Input
                type="number"
                id="numberOfPeople"
                min="1"
                max="20"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 0)}
                className={errors.people ? 'border-destructive' : ''}
              />
              {errors.people && <p className="text-sm text-destructive">{errors.people}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="drinksPerPerson" className="text-sm font-medium flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Nombre de boissons par personne
              </label>
              <Input
                type="number"
                id="drinksPerPerson"
                min="1"
                max="20"
                value={drinksPerPerson}
                onChange={(e) => setDrinksPerPerson(parseInt(e.target.value) || 0)}
                className={errors.drinks ? 'border-destructive' : ''}
              />
              {errors.drinks && <p className="text-sm text-destructive">{errors.drinks}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Commencer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
