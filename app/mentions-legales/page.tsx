import Link from 'next/link';

export const metadata = {
  title: 'Mentions legales - BzzGre',
  description: 'Mentions legales provisoires de BzzGre',
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-black">Mentions legales (provisoires)</h1>
        <p className="text-sm text-zinc-300">
          Derniere mise a jour: 03/04/2026. Cette page est fournie a titre provisoire pendant la phase de
          pre-lancement du projet.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Editeur</h2>
          <p className="text-zinc-300">
            BzzGre est un projet en cours de creation. La societe n est pas encore immatriculee a la date de
            publication de cette page.
          </p>
          <p className="text-zinc-300">Responsable de publication: porteur du projet BzzGre.</p>
          <p className="text-zinc-300">Contact: contact@bzzgre.app</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Hebergement</h2>
          <p className="text-zinc-300">Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          <p className="text-zinc-300">Site: https://vercel.com</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Propriete intellectuelle</h2>
          <p className="text-zinc-300">
            Le contenu de l application (textes, elements graphiques, structure, code) est protege par le droit
            applicable. Toute reproduction ou reutilisation non autorisee est interdite.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Limitation de responsabilite</h2>
          <p className="text-zinc-300">
            L application est fournie en l etat. L editeur ne garantit pas l absence d erreur ou de coupure et ne
            peut etre tenu responsable des dommages indirects lies a son utilisation.
          </p>
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
