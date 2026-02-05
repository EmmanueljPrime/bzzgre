import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
