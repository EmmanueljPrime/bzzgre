import Link from 'next/link';

export default function LegalFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-zinc-300 flex flex-wrap items-center justify-center gap-3">
        <span>BzzGre</span>
        <span>•</span>
        <Link href="/mentions-legales" className="hover:text-white underline-offset-4 hover:underline">
          Mentions legales
        </Link>
        <span>•</span>
        <Link href="/confidentialite" className="hover:text-white underline-offset-4 hover:underline">
          Confidentialite
        </Link>
        <span>•</span>
        <Link href="/cgu" className="hover:text-white underline-offset-4 hover:underline">
          CGU
        </Link>
      </div>
    </footer>
  );
}
