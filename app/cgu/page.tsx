import Link from 'next/link';

export const metadata = {
  title: 'CGU - BzzGre',
  description: 'Conditions generales d utilisation de BzzGre',
};

export default function CguPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-black">Conditions generales d utilisation (CGU)</h1>
        <p className="text-sm text-zinc-300">Derniere mise a jour: 03/04/2026.</p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Objet</h2>
          <p className="text-zinc-300">
            Les presentes CGU encadrent l utilisation de l application BzzGre, outil ludique de jeux et tirages
            pour groupes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Acces au service</h2>
          <p className="text-zinc-300">
            Le service est accessible gratuitement, sous reserve de disponibilite technique. L editeur peut faire
            evoluer, suspendre ou interrompre tout ou partie du service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Utilisation responsable</h2>
          <p className="text-zinc-300">
            L utilisateur s engage a utiliser l application dans le respect de la loi, des personnes et des lieux.
            L editeur decline toute responsabilite en cas d usage inapproprie des contenus de jeu.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Propriete intellectuelle</h2>
          <p className="text-zinc-300">
            Toute reproduction non autorisee des contenus et du code source est interdite, sauf dispositions
            legales contraires.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold">Droit applicable</h2>
          <p className="text-zinc-300">
            Les CGU sont soumises au droit francais. En cas de litige, une resolution amiable est privilegiee
            avant toute action judiciaire.
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
