'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export default function ConfirmResetModal({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Confirmer la reinitialisation',
  description = 'Cette action va relancer la partie et effacer la progression en cours.',
  confirmLabel = 'Oui, reinitialiser',
}: ConfirmResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex gap-2 justify-end">
            <Button onClick={onCancel} variant="outline">
              Annuler
            </Button>
            <Button onClick={onConfirm} variant="destructive">
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
