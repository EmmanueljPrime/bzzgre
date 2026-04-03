import type { Metadata } from 'next';
import './globals.css';
import Bubbles from '@/components/Bubbles';
import LegalFooter from '@/components/LegalFooter';

export const metadata: Metadata = {
  title: 'BzzGre - Tirage aléatoire de boissons',
  description: 'Application de tirage aléatoire de boissons pour soirées entre amis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased relative">
        <Bubbles />
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <LegalFooter />
        </div>
      </body>
    </html>
  );
}
