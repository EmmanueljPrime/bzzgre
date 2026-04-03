'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AVAILABLE_BARS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QR_SIZE = 280;

export default function QrCodesBzzgrePrivatePage() {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const links = useMemo(() => {
    return AVAILABLE_BARS.map((bar) => {
      const url = origin ? `${origin}/?bar=${encodeURIComponent(bar.id)}` : `/?bar=${encodeURIComponent(bar.id)}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(url)}`;
      return { bar, url, qrUrl };
    });
  }, [origin]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">QR Codes Bars</h1>
          <p className="text-sm md:text-base text-zinc-300 mt-2">
            Page privee pour partager un QR code par bar. Chaque code ouvre l'app avec le bar preselectionne.
          </p>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 break-all">
            Base URL detectee: {origin || 'Detection en cours...'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {links.map(({ bar, url, qrUrl }) => (
            <Card key={bar.id} className="border-white/15 bg-zinc-900/70 text-zinc-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  {bar.logo ? (
                    <span className="relative block h-10 w-24">
                      <Image src={bar.logo} alt={bar.name} fill className="object-contain" />
                    </span>
                  ) : (
                    <span>{bar.name}</span>
                  )}
                  <span className="text-sm font-mono text-zinc-400">{bar.id}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-white p-3 w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt={`QR code ${bar.name}`} width={QR_SIZE} height={QR_SIZE} className="h-56 w-56 md:h-64 md:w-64" />
                </div>

                <p className="text-xs text-zinc-400 break-all">{url}</p>

                <div className="flex gap-2">
                  <a href={url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full" variant="outline">Tester le lien</Button>
                  </a>
                  <a href={qrUrl} download={`qrcode-${bar.id}.png`} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full">Telecharger QR</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
