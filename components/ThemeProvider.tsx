'use client';

import { useEffect } from 'react';
import { Bar } from '@/types';

interface ThemeProviderProps {
  bar: Bar | null;
  children: React.ReactNode;
}

export default function ThemeProvider({ bar, children }: ThemeProviderProps) {
  useEffect(() => {
    if (!bar) return;

    const root = document.documentElement;
    const theme = bar.theme;

    // Appliquer les variables CSS du thème
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--card', theme.cardBg);
    root.style.setProperty('--card-foreground', '0 0% 98%');
    root.style.setProperty('--muted', theme.cardBg);
    root.style.setProperty('--ring', theme.primary);
    
    // Calculer des variations pour border et input
    const [h, s, l] = theme.cardBg.split(' ').map(v => parseFloat(v));
    const borderColor = `${h} ${Math.max(s - 10, 10)}% ${Math.min(l + 10, 40)}%`;
    const inputColor = `${h} ${Math.max(s - 5, 10)}% ${Math.max(l - 5, 10)}%`;
    const mutedFg = `${h} ${Math.max(s - 20, 5)}% ${Math.min(l + 45, 70)}%`;
    
    root.style.setProperty('--border', borderColor);
    root.style.setProperty('--input', inputColor);
    root.style.setProperty('--muted-foreground', mutedFg);
    
    // Appliquer le background dynamique au body
    const [bgH, bgS, bgL] = theme.background.split(' ').map(v => parseFloat(v));
    const gradient = `linear-gradient(135deg, 
      hsl(${bgH}, ${Math.min(bgS + 10, 100)}%, ${bgL}%) 0%, 
      hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.min(l + 5, 25)}%) 25%,
      hsl(${bgH}, ${Math.min(bgS + 10, 100)}%, ${Math.max(bgL - 2, 5)}%) 50%,
      hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.min(l + 7, 28)}%) 75%,
      hsl(${bgH}, ${Math.min(bgS + 5, 100)}%, ${Math.max(bgL - 1, 5)}%) 100%
    )`;
    
    document.body.style.background = gradient;
    document.body.style.backgroundAttachment = 'fixed';
    
    // Ajouter un attribut data-theme pour des styles conditionnels
    root.setAttribute('data-theme', bar.id);

    // Cleanup
    return () => {
      root.removeAttribute('data-theme');
    };
  }, [bar]);

  return <>{children}</>;
}
