'use client';

import { useEffect, useMemo, useState } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Ghost, ShieldAlert, UserRoundCheck, X } from 'lucide-react';

type Role = 'civil' | 'imposteur' | 'mrwhite';

interface BzzgreImposteurGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

interface Assignment {
  role: Role;
  word: string | null;
}

interface GameState {
  includeMrWhite: boolean;
  phase: 'setup' | 'distribution' | 'voting' | 'reveal';
  baseWord: string | null;
  impostorWord: string | null;
  impostorId: number | null;
  mrWhiteId: number | null;
  assignments: Record<number, Assignment>;
  viewedPlayerIds: number[];
  alivePlayerIds: number[];
  eliminatedPlayerIds: number[];
  voteRound: number;
  winner: 'civils' | 'imposteur' | null;
  currentViewerId: number | null;
  selectedSuspectId: number | null;
}

const WORD_PAIRS: Array<{ base: string; impostor: string }> = [
  { base: 'Pizza', impostor: 'Lasagnes' },
  { base: 'Chien', impostor: 'Loup' },
  { base: 'Coca', impostor: 'Pepsi' },
  { base: 'Plage', impostor: 'Piscine' },
  { base: 'Montagne', impostor: 'Colline' },
  { base: 'Rhum', impostor: 'Vodka' },
  { base: 'Pastis', impostor: 'Ricard' },
  { base: 'Burger', impostor: 'Tacos' },
  { base: 'WhatsApp', impostor: 'Telegram' },
  { base: 'Netflix', impostor: 'Prime Video' },
  { base: 'Ferrari', impostor: 'Lamborghini' },
  { base: 'Lion', impostor: 'Tigre' },
  { base: 'Rouge', impostor: 'Bordeaux' },
  { base: 'Café', impostor: 'Espresso' },
  { base: 'Soleil', impostor: 'Lune' },
  { base: 'Neige', impostor: 'Glace' },
  { base: 'Paris', impostor: 'Lyon' },
  { base: 'Pasta', impostor: 'Ravioli' },
  { base: 'Mojito', impostor: 'Caipirinha' },
  { base: 'Xbox', impostor: 'PlayStation' },
  { base: 'Apple', impostor: 'Poire' },
  { base: 'Tennis', impostor: 'Padel' },
  { base: 'Sushi', impostor: 'Maki' },
  { base: 'Hip-hop', impostor: 'Rap' },
  { base: 'Avion', impostor: 'Helicoptere' },
  { base: 'Serie', impostor: 'Film' },
  { base: 'TikTok', impostor: 'Instagram' },
  { base: 'Piano', impostor: 'Clavier' },
  { base: 'Camping', impostor: 'Randonnee' },
  { base: 'Velo', impostor: 'Moto' },
];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function BzzgreImposteurGame({
  participants,
  gameId,
  onClose,
}: BzzgreImposteurGameProps) {
  const storageKey = `bzzgre_imposteur_${gameId}`;

  const [gameState, setGameState] = useState<GameState>(() => {
    const initial: GameState = {
      includeMrWhite: false,
      phase: 'setup',
      baseWord: null,
      impostorWord: null,
      impostorId: null,
      mrWhiteId: null,
      assignments: {},
      viewedPlayerIds: [],
      alivePlayerIds: [],
      eliminatedPlayerIds: [],
      voteRound: 1,
      winner: null,
      currentViewerId: null,
      selectedSuspectId: null,
    };

    if (typeof window === 'undefined') return initial;

    const saved = localStorage.getItem(storageKey);
    if (!saved) return initial;

    try {
      return { ...initial, ...JSON.parse(saved) };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const participantsById = useMemo(() => {
    const map = new Map<number, Participant>();
    participants.forEach((participant) => map.set(participant.id, participant));
    return map;
  }, [participants]);

  const lancerPartie = () => {
    if (participants.length < 3) {
      alert('Il faut au moins 3 joueurs pour jouer a Imposteur.');
      return;
    }

    const pair = randomItem(WORD_PAIRS);
    const allIds = participants.map((p) => p.id);
    const impostorId = randomItem(allIds);

    let mrWhiteId: number | null = null;
    if (gameState.includeMrWhite && participants.length >= 4) {
      const eligible = allIds.filter((id) => id !== impostorId);
      mrWhiteId = randomItem(eligible);
    }

    const assignments: Record<number, Assignment> = {};
    participants.forEach((participant) => {
      if (participant.id === impostorId) {
        assignments[participant.id] = {
          role: 'imposteur',
          word: pair.impostor,
        };
      } else if (participant.id === mrWhiteId) {
        assignments[participant.id] = {
          role: 'mrwhite',
          word: null,
        };
      } else {
        assignments[participant.id] = {
          role: 'civil',
          word: pair.base,
        };
      }
    });

    setGameState((prev) => ({
      ...prev,
      phase: 'distribution',
      baseWord: pair.base,
      impostorWord: pair.impostor,
      impostorId,
      mrWhiteId,
      assignments,
      viewedPlayerIds: [],
      alivePlayerIds: allIds,
      eliminatedPlayerIds: [],
      voteRound: 1,
      winner: null,
      currentViewerId: null,
      selectedSuspectId: null,
    }));
  };

  const ouvrirMotJoueur = (playerId: number) => {
    setGameState((prev) => ({
      ...prev,
      currentViewerId: playerId,
      viewedPlayerIds: prev.viewedPlayerIds.includes(playerId)
        ? prev.viewedPlayerIds
        : [...prev.viewedPlayerIds, playerId],
    }));
  };

  const fermerVisionJoueur = () => {
    setGameState((prev) => ({ ...prev, currentViewerId: null }));
  };

  const revelerResultat = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'reveal',
      currentViewerId: null,
    }));
  };

  const demarrerVotes = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'voting',
      currentViewerId: null,
      selectedSuspectId: null,
      voteRound: 1,
    }));
  };

  const eliminerJoueur = () => {
    setGameState((prev) => {
      if (prev.selectedSuspectId === null || !prev.alivePlayerIds.includes(prev.selectedSuspectId)) {
        return prev;
      }

      const eliminatedId = prev.selectedSuspectId;
      const nextAlive = prev.alivePlayerIds.filter((id) => id !== eliminatedId);
      const nextEliminated = [...prev.eliminatedPlayerIds, eliminatedId];
      const impostorElimine = eliminatedId === prev.impostorId;

      if (impostorElimine) {
        return {
          ...prev,
          phase: 'reveal',
          alivePlayerIds: nextAlive,
          eliminatedPlayerIds: nextEliminated,
          winner: 'civils',
          currentViewerId: null,
        };
      }

      if (nextAlive.length <= 2) {
        return {
          ...prev,
          phase: 'reveal',
          alivePlayerIds: nextAlive,
          eliminatedPlayerIds: nextEliminated,
          winner: 'imposteur',
          currentViewerId: null,
        };
      }

      return {
        ...prev,
        alivePlayerIds: nextAlive,
        eliminatedPlayerIds: nextEliminated,
        voteRound: prev.voteRound + 1,
        selectedSuspectId: null,
      };
    });
  };

  const nouvelleManche = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'setup',
      baseWord: null,
      impostorWord: null,
      impostorId: null,
      mrWhiteId: null,
      assignments: {},
      viewedPlayerIds: [],
      alivePlayerIds: [],
      eliminatedPlayerIds: [],
      voteRound: 1,
      winner: null,
      currentViewerId: null,
      selectedSuspectId: null,
    }));
  };

  const playerBeingViewed = gameState.currentViewerId
    ? participantsById.get(gameState.currentViewerId) || null
    : null;

  const viewedCount = gameState.viewedPlayerIds.length;
  const allViewed = viewedCount === participants.length;

  const getRoleBadge = (role: Role) => {
    if (role === 'imposteur') {
      return {
        label: 'IMPOSTEUR',
        className: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/40',
      };
    }

    if (role === 'mrwhite') {
      return {
        label: 'MR WHITE',
        className: 'bg-slate-500/15 text-slate-700 dark:text-slate-200 border border-slate-500/40',
      };
    }

    return {
      label: 'CIVIL',
      className: 'bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/40',
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <CardHeader className="border-b border-border/50 sticky top-0 bg-card z-10">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-xl md:text-3xl font-bold flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-orange-500" />
                Imposteur
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground">
                Un mot principal, un mot proche pour l'imposteur, et option Mr White.
              </p>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
          {gameState.phase === 'setup' && (
            <div className="space-y-4">
              <Card className="border-2 border-primary/40 bg-primary/5">
                <CardContent className="p-4 md:p-6 space-y-4">
                  <h3 className="font-semibold text-base md:text-lg">Configuration de la manche</h3>
                  <label className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/70 bg-card/50">
                    <div>
                      <p className="text-sm md:text-base font-medium">Activer Mr White</p>
                      <p className="text-xs text-muted-foreground">
                        Un joueur n'a aucun mot. Recommande a partir de 4 joueurs.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={gameState.includeMrWhite}
                      onChange={(e) =>
                        setGameState((prev) => ({
                          ...prev,
                          includeMrWhite: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 accent-primary"
                    />
                  </label>

                  {gameState.includeMrWhite && participants.length < 4 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Mr White sera ignore car il faut au moins 4 joueurs.
                    </p>
                  )}

                  <Button onClick={lancerPartie} className="w-full" size="lg">
                    Lancer la manche
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Conseil: passez le telephone a chaque joueur, il clique sur son nom pour voir son role,
                    puis masque l'ecran avant de passer au suivant.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState.phase === 'distribution' && (
            <div className="space-y-4 md:space-y-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm md:text-base font-medium">
                  Joueurs ayant vu leur mot: {viewedCount}/{participants.length}
                </p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${allViewed ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'}`}>
                  {allViewed ? 'Tout le monde a vu' : 'Distribution en cours'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {participants.map((participant) => {
                  const viewed = gameState.viewedPlayerIds.includes(participant.id);
                  return (
                    <Button
                      key={participant.id}
                      onClick={() => ouvrirMotJoueur(participant.id)}
                      variant={viewed ? 'secondary' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <span className="font-semibold">{participant.name}</span>
                      <span className="text-[10px] md:text-xs opacity-80">
                        {viewed ? 'Revoir mon mot' : 'Voir mon mot'}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <Button onClick={demarrerVotes} className="flex-1" size="lg">
                  Commencer les tours de table
                </Button>
                <Button onClick={nouvelleManche} variant="outline" className="flex-1" size="lg">
                  Reinitialiser la manche
                </Button>
              </div>
            </div>
          )}

          {gameState.phase === 'voting' && (
            <div className="space-y-4 md:space-y-5">
              <Card className="border-2 border-primary/40 bg-primary/5">
                <CardContent className="p-4 md:p-6 space-y-2">
                  <h3 className="text-lg md:text-2xl font-bold">Tour de table {gameState.voteRound}</h3>
                  <p className="text-sm text-muted-foreground">
                    Discutez, puis eliminez 1 joueur. Si ce n est pas l imposteur, nouveau tour.
                  </p>
                  <p className="text-sm font-medium">
                    Joueurs encore en jeu: {gameState.alivePlayerIds.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4 space-y-3">
                  <p className="text-sm font-medium">Choisir le joueur a eliminer</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {participants
                      .filter((participant) => gameState.alivePlayerIds.includes(participant.id))
                      .map((participant) => (
                        <Button
                          key={participant.id}
                          onClick={() =>
                            setGameState((prev) => ({
                              ...prev,
                              selectedSuspectId: participant.id,
                            }))
                          }
                          variant={gameState.selectedSuspectId === participant.id ? 'default' : 'outline'}
                          size="sm"
                          className="justify-start"
                        >
                          {participant.name}
                        </Button>
                      ))}
                  </div>

                  <Button
                    onClick={eliminerJoueur}
                    disabled={gameState.selectedSuspectId === null}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    Eliminer ce joueur
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4 space-y-2">
                  <p className="text-sm font-medium">Revoir son mot (si besoin)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {participants.map((participant) => {
                      const isAlive = gameState.alivePlayerIds.includes(participant.id);
                      return (
                        <Button
                          key={participant.id}
                          onClick={() => ouvrirMotJoueur(participant.id)}
                          variant="outline"
                          size="sm"
                          className="justify-between"
                        >
                          <span>{participant.name}</span>
                          {!isAlive && <span className="text-[10px] opacity-70">OUT</span>}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {gameState.eliminatedPlayerIds.length > 0 && (
                <Card>
                  <CardContent className="p-3 md:p-4 space-y-2">
                    <p className="text-sm font-medium">Joueurs elimines</p>
                    <div className="flex flex-wrap gap-2">
                      {gameState.eliminatedPlayerIds.map((id) => (
                        <span key={id} className="text-xs px-2 py-1 rounded-full border border-border/70 bg-muted/50">
                          {participantsById.get(id)?.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <Button onClick={revelerResultat} variant="secondary" className="flex-1" size="lg">
                  Abandonner et reveler
                </Button>
                <Button onClick={nouvelleManche} variant="outline" className="flex-1" size="lg">
                  Reinitialiser la manche
                </Button>
              </div>
            </div>
          )}

          {gameState.phase === 'reveal' && (
            <div className="space-y-4 md:space-y-5">
              <Card className="border-2 border-primary/40 bg-primary/5">
                <CardContent className="p-4 md:p-6 space-y-3">
                  <h3 className="text-lg md:text-2xl font-bold">Resultat de la manche</h3>
                  {gameState.winner && (
                    <p className="text-base md:text-lg font-semibold">
                      {gameState.winner === 'civils' ? 'Victoire des civils' : 'Victoire de l imposteur'}
                    </p>
                  )}
                  <p className="text-sm md:text-base text-muted-foreground">
                    Mot civil: <span className="font-semibold text-foreground">{gameState.baseWord}</span>
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Mot imposteur: <span className="font-semibold text-foreground">{gameState.impostorWord}</span>
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {participants.map((participant) => {
                  const assignment = gameState.assignments[participant.id];
                  if (!assignment) return null;

                  const badge = getRoleBadge(assignment.role);
                  return (
                    <Card key={participant.id}>
                      <CardContent className="p-3 md:p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{participant.name}</p>
                          <span className={`text-[10px] md:text-xs px-2 py-1 rounded-full ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {assignment.role === 'mrwhite' ? 'Aucun mot' : `Mot: ${assignment.word}`}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {gameState.selectedSuspectId !== null && gameState.phase === 'reveal' && (
                <Card className="border-2 border-dashed border-border/60">
                  <CardContent className="p-4 flex items-center gap-2">
                    <UserRoundCheck className="h-5 w-5 text-primary" />
                    <p className="text-sm md:text-base">
                      Suspect choisi: <span className="font-semibold">{participantsById.get(gameState.selectedSuspectId)?.name}</span>{' '}
                      {gameState.selectedSuspectId === gameState.impostorId
                        ? '(bien vu, c etait l imposteur)'
                        : '(pas le bon imposteur cette fois)'}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col md:flex-row gap-2">
                <Button onClick={lancerPartie} className="flex-1" size="lg">
                  Rejouer
                </Button>
                <Button onClick={nouvelleManche} variant="outline" className="flex-1" size="lg">
                  Retour configuration
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {gameState.currentViewerId !== null && playerBeingViewed && (gameState.phase === 'distribution' || gameState.phase === 'voting') && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-2 border-primary/50">
            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 text-center">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Ecran prive</p>
                <h3 className="text-xl md:text-2xl font-bold">{playerBeingViewed.name}</h3>
              </div>

              {(() => {
                const assignment = gameState.assignments[playerBeingViewed.id];
                if (!assignment) {
                  return <p className="text-sm text-muted-foreground">Impossible de charger ton mot.</p>;
                }

                if (assignment.role === 'mrwhite') {
                  return (
                    <div className="space-y-2">
                      <Ghost className="h-10 w-10 mx-auto text-slate-500" />
                      <p className="text-2xl font-bold">Tu es Mr White</p>
                      <p className="text-sm text-muted-foreground">Tu n as aucun mot. Bluffe et survit.</p>
                    </div>
                  );
                }

                const badge = getRoleBadge(assignment.role);
                return (
                  <div className="space-y-3">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                    <p className="text-3xl md:text-4xl font-extrabold">{assignment.word}</p>
                  </div>
                );
              })()}

              <p className="text-xs text-muted-foreground">
                Memorise puis cache cet ecran avant de passer le telephone.
              </p>

              <Button onClick={fermerVisionJoueur} className="w-full" size="lg">
                <Eye className="mr-2 h-5 w-5" />
                Cacher mon mot
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
