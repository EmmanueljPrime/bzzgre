import Link from 'next/link';

export const metadata = {
  title: 'Confidentialite - BzzGre',
  description: 'Politique de confidentialite de BzzGre',
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-black">Politique de confidentialite</h1>
        <p className="text-sm text-zinc-300">Derniere mise a jour: 03/04/2026.</p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Donnees traitees</h2>
          <p className="text-zinc-300">
            BzzGre ne collecte pas de donnees personnelles cote serveur a ce stade. Les informations saisies
            (participants, boissons, progression de jeu) sont enregistrees localement dans votre navigateur.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Cookies et traceurs</h2>
          <p className="text-zinc-300">
            Aucun cookie de suivi, publicitaire ou d analyse n est depose par l application a ce jour.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Base legale</h2>
          <p className="text-zinc-300">
            Le fonctionnement repose sur votre action explicite dans l interface (utilisation volontaire de
            l application). Les donnees restent sur votre appareil.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Duree de conservation</h2>
          <p className="text-zinc-300">
            Les donnees locales sont conservees jusqu a suppression manuelle de votre stockage navigateur ou
            reinitialisation de la partie.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Contact</h2>
          <p className="text-zinc-300">Pour toute question: contact@bzzgre.app</p>
        </section>

        <div className="pt-4">
          <Link href="/" className="text-sm underline underline-offset-4 hover:text-white">
            Retour a l application
          </Link>
        </div>
      </div>
    </main>
  );
}
