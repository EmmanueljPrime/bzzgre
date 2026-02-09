'use client';

import Image from 'next/image';
import { Bar, AVAILABLE_BARS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, X } from 'lucide-react';

interface BarSelectionModalProps {
  currentBar: Bar | null;
  onSelectBar: (bar: Bar | null) => void;
  onClose: () => void;
}

export default function BarSelectionModal({
  currentBar,
  onSelectBar,
  onClose,
}: BarSelectionModalProps) {
  const handleSelectBar = (bar: Bar) => {
    onSelectBar(bar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Changer de bar
              </CardTitle>
              <CardDescription>Sélectionnez un nouveau bar</CardDescription>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {AVAILABLE_BARS.map((bar) => (
              <button
                key={bar.id}
                type="button"
                onClick={() => handleSelectBar(bar)}
                className={`relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                  currentBar?.id === bar.id
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
                  {currentBar?.id === bar.id && (
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
        </CardContent>
      </Card>
    </div>
  );
}
