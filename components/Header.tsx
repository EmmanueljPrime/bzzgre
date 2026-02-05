'use client';

import { useState } from 'react';
import { RotateCcw, Beer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    setShowConfirm(false);
    onReset();
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Beer className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">BzzGre</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetClick}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full border">
            <h3 className="text-xl font-semibold mb-2">Nouvelle partie ?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Êtes-vous sûr de vouloir recommencer ? Toutes les données actuelles seront perdues.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancelReset} className="flex-1">
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleConfirmReset} className="flex-1">
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
