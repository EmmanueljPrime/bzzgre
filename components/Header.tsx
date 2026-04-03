'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCcw, Beer, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bar } from '@/types';

interface HeaderProps {
  onReset: () => void;
  selectedBar: Bar | null;
  onChangeBar: () => void;
  showBarSwitcher?: boolean;
}

export default function Header({
  onReset,
  selectedBar,
  onChangeBar,
  showBarSwitcher = false,
}: HeaderProps) {
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 backdrop-blur-xl bg-card/80 shadow-lg">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Beer className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <h1 className="text-xl font-bold neon-text">BzzGre</h1>
          </div>
          <div className="flex items-center gap-2">
            {showBarSwitcher && (
              <Button variant="outline" size="sm" onClick={onChangeBar} className="px-2">
                {selectedBar?.logo ? (
                  <div className="h-8 w-20 relative">
                    <Image
                      src={selectedBar.logo}
                      alt={selectedBar.name}
                      fill
                      className="object-contain"
                      style={{ filter: 'brightness(0) saturate(100%) invert(1)' }}
                    />
                  </div>
                ) : (
                  <Store className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleResetClick}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="party-card rounded-2xl shadow-2xl p-6 max-w-md w-full border-2 border-primary/40 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-semibold mb-2 neon-text">Nouvelle partie ?</h3>
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
