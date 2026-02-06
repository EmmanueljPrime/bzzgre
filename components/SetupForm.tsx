'use client';

import { useState } from 'react';
import { Config } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wine } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (config: Config) => void;
  initialConfig?: Config;
}

export default function SetupForm({ onSubmit, initialConfig }: SetupFormProps) {
  const [numberOfPeople, setNumberOfPeople] = useState<string>(
    initialConfig?.numberOfPeople?.toString() || '5'
  );
  const [drinksPerPerson, setDrinksPerPerson] = useState<string>(
    initialConfig?.drinksPerPerson?.toString() || '5'
  );
  const [errors, setErrors] = useState<{ people?: string; drinks?: string }>({});

  const validate = () => {
    const newErrors: { people?: string; drinks?: string } = {};
    const numPeople = parseInt(numberOfPeople);
    const numDrinks = parseInt(drinksPerPerson);

    if (isNaN(numPeople) || numPeople < 1 || numPeople > 20) {
      newErrors.people = 'Le nombre de personnes doit être entre 1 et 20';
    }

    if (isNaN(numDrinks) || numDrinks < 1 || numDrinks > 20) {
      newErrors.drinks = 'Le nombre de boissons doit être entre 1 et 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        numberOfPeople: parseInt(numberOfPeople),
        drinksPerPerson: parseInt(drinksPerPerson)
      });
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
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="numberOfPeople"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value.replace(/[^0-9]/g, ''))}
                className={`flex h-11 w-full rounded-lg border-2 bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.people ? 'border-destructive' : 'border-input'
                }`}
                placeholder="5"
              />
              {errors.people && <p className="text-sm text-destructive">{errors.people}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="drinksPerPerson" className="text-sm font-medium flex items-center gap-2">
                <Wine className="h-4 w-4" />
                Nombre de boissons par personne
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="drinksPerPerson"
                value={drinksPerPerson}
                onChange={(e) => setDrinksPerPerson(e.target.value.replace(/[^0-9]/g, ''))}
                className={`flex h-11 w-full rounded-lg border-2 bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.drinks ? 'border-destructive' : 'border-input'
                }`}
                placeholder="5"
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
