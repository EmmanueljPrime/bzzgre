'use client';

import { useState, useEffect } from 'react';

export default function Bubbles() {
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    delay: number;
    duration: number;
    opacity: number;
    hue: number;
    lightness: number;
  }>>([]);

  useEffect(() => {
    // Génère 15 bulles avec des propriétés aléatoires uniquement côté client
    setBubbles(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 20, // 20px à 80px
        left: Math.random() * 100, // position horizontale en %
        delay: Math.random() * 5, // délai d'animation 0-5s
        duration: Math.random() * 5 + 8, // durée 8-13s
        opacity: Math.random() * 0.4 + 0.4, // opacité 0.4-0.8
        hue: Math.random() * 100 + 260, // teinte violet/rose/cyan (260-360)
        lightness: Math.random() * 20 + 60, // luminosité aléatoire
      }))
    );
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble absolute rounded-full"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: '-100px',
            background: `radial-gradient(circle at 30% 30%, 
              hsl(${bubble.hue}, 100%, ${bubble.lightness + 10}%), 
              hsl(${bubble.hue}, 85%, ${bubble.lightness}%))`,
            opacity: bubble.opacity,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
