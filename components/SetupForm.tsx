'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Config, Bar, AVAILABLE_BARS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wine, Store } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (config: Config) => void;
  onBarChange?: (bar: Bar | null) => void;
  initialConfig?: Config;
}

export default function SetupForm({ onSubmit, onBarChange, initialConfig }: SetupFormProps) {
  const [numberOfPeople, setNumberOfPeople] = useState<string>(
    initialConfig?.numberOfPeople?.toString() || '5'
  );
  const [drinksPerPerson, setDrinksPerPerson] = useState<string>(
    initialConfig?.drinksPerPerson?.toString() || '5'
  );
  const [selectedBar, setSelectedBar] = useState<Bar | null>(
    initialConfig?.selectedBar || AVAILABLE_BARS[0]
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
        drinksPerPerson: parseInt(drinksPerPerson),
        selectedBar,
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

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Store className="h-4 w-4" />
                Sélectionner un bar
              </label>
              <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_BARS.map((bar) => (
                  <button
                    key={bar.id}
                    type="button"
                    onClick={() => {
                      setSelectedBar(bar);
                      onBarChange?.(bar);
                    }}
                    className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                      selectedBar?.id === bar.id
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-input hover:border-primary/50'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, hsl(${bar.theme.background}) 0%, hsl(${bar.theme.cardBg}) 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {bar.logo ? (
                          <div className="mb-2 h-12 relative">
                            <Image 
                              src={bar.logo} 
                              alt={bar.name}
                              width={150}
                              height={48}
                              className="object-contain"
                              style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
                            />
                          </div>
                        ) : (
                          <h3
                            className="font-bold text-lg mb-1"
                            style={{ color: `hsl(${bar.theme.primary})` }}
                          >
                            {bar.name}
                          </h3>
                        )}
                        <p className="text-sm text-muted-foreground">{bar.description}</p>
                        {bar.drinks.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {bar.drinks.length} boissons disponibles
                          </p>
                        )}
                      </div>
                      {selectedBar?.id === bar.id && (
                        <div
                          className="rounded-full p-1"
                          style={{ backgroundColor: `hsl(${bar.theme.primary})` }}
                        >
                          <svg
                            className="h-5 w-5 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
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
