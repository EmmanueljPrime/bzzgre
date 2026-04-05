'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Participant,
  SecretMissionAssignment,
  SecretMissionHistoryEntry,
  SecretMissionPlayerState,
  SecretMissionStatus,
  SecretMissionTemplate,
  SecretMissionsGameState,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Gift,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
  XCircle,
} from 'lucide-react';

interface BzzgreSecretMissionsGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

const STORAGE_VERSION = 1;
const DEFAULT_REWARD_DRINKS = 3;

const SECRET_MISSION_TEMPLATES: SecretMissionTemplate[] = [
  { id: 'mission-01', text: 'Fais lever un verre a quelqu’un sans le demander directement.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-02', text: 'Fais rire quelqu’un avec une remarque spontanée.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-03', text: 'Obtiens un toast improvisé du groupe.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-04', text: 'Fais te répondre quelqu’un du premier coup.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-05', text: 'Fais apparaître le nom du bar ou du jeu dans une discussion.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-06', text: 'Fais trinquer deux joueurs entre eux.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-07', text: 'Fais que quelqu’un propose de reprendre un verre.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-08', text: 'Fais choisir à quelqu’un la prochaine musique.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-09', text: 'Fais dire un compliment sur la soirée par quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-10', text: 'Fais lancer une photo de groupe par quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-11', text: 'Fais que quelqu’un te donne un mot au hasard.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-12', text: 'Fais dire à quelqu’un "j’avoue" ou "c’est vrai".', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-13', text: 'Fais qu’une personne dise ton prénom naturellement.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-14', text: 'Fais dire à quelqu’un qu’il ou elle passe une bonne soirée.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-15', text: 'Fais lever quelqu’un pour un toast.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-16', text: 'Fais copier ton geste à une personne sans que ça saute aux yeux.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-17', text: 'Fais donner le mot préféré du moment à quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-18', text: 'Fais répondre oui à une question simple.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-19', text: 'Fais dire à quelqu’un qu’il ou elle reste encore un peu.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-20', text: 'Fais qu’une personne te fasse un signe de pouce levé.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-21', text: 'Fais raconter à quelqu’un son meilleur moment de la soirée.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-22', text: 'Fais qu’une personne annonce ce qu’elle boit ensuite.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-23', text: 'Fais dire "allez" ou "c’est parti" à quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-24', text: 'Fais dire "BzzGre" à quelqu’un sans le mettre mal à l’aise.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-25', text: 'Fais accepter une photo un peu ridicule.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-26', text: 'Fais raconter un souvenir de la semaine.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-27', text: 'Fais lever un verre spontanément avec toi.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-28', text: 'Fais dire à quelqu’un qu’il ou elle a faim ou soif.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-29', text: 'Fais qu’une personne te donne un surnom rigolo.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-30', text: 'Fais qu’une personne soit d’accord avec toi sur un sujet léger.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-31', text: 'Fais bouger quelqu’un de place pour mieux t’entendre.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-32', text: 'Fais rejoindre un toast collectif.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-33', text: 'Fais partager la chanson du moment à quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-34', text: 'Fais dire "on y va" à quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-35', text: 'Fais dire une phrase motivante au groupe.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-36', text: 'Fais montrer un geste de victoire discret.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-37', text: 'Fais dire quelque chose de sympa sur la soirée.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-38', text: 'Fais annoncer la prochaine boisson de quelqu’un.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-39', text: 'Fais rire quelqu’un avec une phrase bien placée.', rewardDrinks: DEFAULT_REWARD_DRINKS },
  { id: 'mission-40', text: 'Fais accepter une photo de groupe.', rewardDrinks: DEFAULT_REWARD_DRINKS },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const getParticipantsKey = (participants: Participant[]) =>
  participants
    .map((participant) => participant.id)
    .sort((left, right) => left - right)
    .join('-');

const createMissionAssignment = (
  template: SecretMissionTemplate,
  assignedOrder: number
): SecretMissionAssignment => ({
  id: generateId(),
  templateId: template.id,
  text: template.text,
  status: 'active',
  assignedAt: new Date().toISOString(),
  assignedOrder,
  requestedAt: null,
  resolvedAt: null,
  rewardTargetId: null,
  rewardTargetName: null,
  rewardDrinks: template.rewardDrinks,
});

const createPlayerState = (
  participants: Participant[],
  availableTemplates: SecretMissionTemplate[],
  nextAssignmentOrderStart = 1
): SecretMissionsGameState => {
  if (participants.length === 0) {
    return {
      version: STORAGE_VERSION,
      autoAssignNextMission: false,
      nextAssignmentOrder: nextAssignmentOrderStart,
      players: {},
      history: [],
      totalValidatedMissions: 0,
      totalDistributedDrinks: 0,
    };
  }

  const shuffledTemplates = shuffle(availableTemplates);
  const players: Record<number, SecretMissionPlayerState> = {};
  let nextAssignmentOrder = nextAssignmentOrderStart;

  participants.forEach((participant, index) => {
    const template = shuffledTemplates[index % shuffledTemplates.length] ?? availableTemplates[0];
    players[participant.id] = {
      mission: createMissionAssignment(template, nextAssignmentOrder),
      successCount: 0,
    };
    nextAssignmentOrder += 1;
  });

  return {
    version: STORAGE_VERSION,
    autoAssignNextMission: false,
    nextAssignmentOrder,
    players,
    history: [],
    totalValidatedMissions: 0,
    totalDistributedDrinks: 0,
  };
};

const isSecretMissionStatus = (value: unknown): value is SecretMissionStatus =>
  value === 'active' || value === 'pending' || value === 'validated' || value === 'refused';

const isSecretMissionAssignment = (value: unknown): value is SecretMissionAssignment => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const mission = value as Partial<SecretMissionAssignment>;

  return (
    typeof mission.id === 'string' &&
    typeof mission.templateId === 'string' &&
    typeof mission.text === 'string' &&
    isSecretMissionStatus(mission.status) &&
    typeof mission.assignedAt === 'string' &&
    typeof mission.assignedOrder === 'number' &&
    (typeof mission.requestedAt === 'string' || mission.requestedAt === null || mission.requestedAt === undefined) &&
    (typeof mission.resolvedAt === 'string' || mission.resolvedAt === null || mission.resolvedAt === undefined) &&
    (typeof mission.rewardTargetId === 'number' || mission.rewardTargetId === null || mission.rewardTargetId === undefined) &&
    (typeof mission.rewardTargetName === 'string' || mission.rewardTargetName === null || mission.rewardTargetName === undefined) &&
    typeof mission.rewardDrinks === 'number'
  );
};

const isSecretMissionPlayerState = (value: unknown): value is SecretMissionPlayerState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const playerState = value as Partial<SecretMissionPlayerState>;

  return (
    (playerState.mission === null || isSecretMissionAssignment(playerState.mission)) &&
    typeof playerState.successCount === 'number'
  );
};

const isSecretMissionHistoryEntry = (value: unknown): value is SecretMissionHistoryEntry => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const historyEntry = value as Partial<SecretMissionHistoryEntry>;

  return (
    typeof historyEntry.id === 'string' &&
    typeof historyEntry.playerId === 'number' &&
    typeof historyEntry.playerName === 'string' &&
    typeof historyEntry.missionText === 'string' &&
    (historyEntry.status === 'validated' || historyEntry.status === 'refused') &&
    typeof historyEntry.assignedAt === 'string' &&
    typeof historyEntry.resolvedAt === 'string' &&
    typeof historyEntry.order === 'number' &&
    (typeof historyEntry.rewardTargetId === 'number' || historyEntry.rewardTargetId === null) &&
    (typeof historyEntry.rewardTargetName === 'string' || historyEntry.rewardTargetName === null) &&
    typeof historyEntry.rewardDrinks === 'number'
  );
};

const createFreshState = (participants: Participant[]): SecretMissionsGameState =>
  createPlayerState(participants, SECRET_MISSION_TEMPLATES);

const isCompatibleSavedState = (
  value: unknown,
  participants: Participant[]
): value is SecretMissionsGameState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Partial<SecretMissionsGameState>;

  if (state.version !== STORAGE_VERSION) {
    return false;
  }

  if (typeof state.autoAssignNextMission !== 'boolean') {
    return false;
  }

  if (typeof state.nextAssignmentOrder !== 'number') {
    return false;
  }

  if (!state.players || typeof state.players !== 'object') {
    return false;
  }

  if (!Array.isArray(state.history)) {
    return false;
  }

  if (typeof state.totalValidatedMissions !== 'number' || typeof state.totalDistributedDrinks !== 'number') {
    return false;
  }

  return participants.every((participant) => {
    const playerState = state.players?.[participant.id];
    return isSecretMissionPlayerState(playerState);
  }) && state.history.every((entry) => isSecretMissionHistoryEntry(entry));
};

const getMissionSummary = (mission: SecretMissionAssignment | null) => {
  if (!mission) {
    return 'Aucune mission en cours.';
  }

  if (mission.status === 'active') {
    return 'Mission active.';
  }

  if (mission.status === 'pending') {
    return 'En attente de validation.';
  }

  return 'Mission terminee.';
};

const getAvailableTemplates = (gameState: SecretMissionsGameState) => {
  const activeTemplateIds = new Set(
    Object.values(gameState.players)
      .map((playerState) => playerState.mission?.templateId)
      .filter((templateId): templateId is string => Boolean(templateId))
  );

  const filteredTemplates = SECRET_MISSION_TEMPLATES.filter(
    (template) => !activeTemplateIds.has(template.id)
  );

  return filteredTemplates.length > 0 ? filteredTemplates : SECRET_MISSION_TEMPLATES;
};

const assignNewMission = (
  gameState: SecretMissionsGameState,
  playerId: number
): SecretMissionsGameState => {
  const availableTemplates = getAvailableTemplates(gameState);
  const nextTemplate = shuffle(availableTemplates)[0] ?? SECRET_MISSION_TEMPLATES[0];

  return {
    ...gameState,
    nextAssignmentOrder: gameState.nextAssignmentOrder + 1,
    players: {
      ...gameState.players,
      [playerId]: {
        ...gameState.players[playerId],
        mission: createMissionAssignment(nextTemplate, gameState.nextAssignmentOrder),
      },
    },
  };
};

const concludeMission = (
  gameState: SecretMissionsGameState,
  participants: Participant[],
  playerId: number,
  status: 'validated' | 'refused',
  rewardTargetId: number | null = null
): SecretMissionsGameState => {
  const playerState = gameState.players[playerId];
  const mission = playerState?.mission;

  if (!playerState || !mission || mission.status !== 'pending') {
    return gameState;
  }

  const rewardTarget = rewardTargetId !== null
    ? participants.find((participant) => participant.id === rewardTargetId) ?? null
    : null;

  const resolvedAt = new Date().toISOString();
  const historyEntry: SecretMissionHistoryEntry = {
    id: generateId(),
    playerId,
    playerName: participants.find((participant) => participant.id === playerId)?.name ?? 'Joueur',
    missionText: mission.text,
    status,
    assignedAt: mission.assignedAt,
    resolvedAt,
    order: mission.assignedOrder,
    rewardTargetId: rewardTarget?.id ?? null,
    rewardTargetName: rewardTarget?.name ?? null,
    rewardDrinks: status === 'validated' ? mission.rewardDrinks : 0,
  };

  let nextState: SecretMissionsGameState = {
    ...gameState,
    history: [historyEntry, ...gameState.history].slice(0, 50),
    totalValidatedMissions:
      status === 'validated' ? gameState.totalValidatedMissions + 1 : gameState.totalValidatedMissions,
    totalDistributedDrinks:
      status === 'validated'
        ? gameState.totalDistributedDrinks + mission.rewardDrinks
        : gameState.totalDistributedDrinks,
    players: {
      ...gameState.players,
      [playerId]: {
        ...playerState,
        mission: null,
        successCount:
          status === 'validated' ? playerState.successCount + 1 : playerState.successCount,
      },
    },
  };

  if (gameState.autoAssignNextMission) {
    nextState = assignNewMission(nextState, playerId);
  }

  return nextState;
};

export default function BzzgreSecretMissionsGame({
  participants,
  gameId,
  onClose,
}: BzzgreSecretMissionsGameProps) {
  const storageKey = `bzzgre_secret_missions_v${STORAGE_VERSION}_${gameId}_${getParticipantsKey(participants)}`;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);
  const [rewardSelectionPlayerId, setRewardSelectionPlayerId] = useState<number | null>(null);
  const [selectedRewardTargetId, setSelectedRewardTargetId] = useState<number | null>(null);

  const [gameState, setGameState] = useState<SecretMissionsGameState>(() => {
    if (typeof window === 'undefined') {
      return createFreshState(participants);
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (isCompatibleSavedState(parsed, participants)) {
          return parsed;
        }
      } catch (error) {
        console.error('Failed to parse secret missions game state:', error);
      }
    }

    return createFreshState(participants);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  const participantById = useMemo(() => {
    const map = new Map<number, Participant>();
    participants.forEach((participant) => {
      map.set(participant.id, participant);
    });
    return map;
  }, [participants]);

  const pendingPlayers = useMemo(
    () =>
      participants.filter((participant) => {
        const mission = gameState.players[participant.id]?.mission;
        return mission?.status === 'pending';
      }),
    [gameState.players, participants]
  );

  const activePlayers = useMemo(
    () =>
      participants.filter((participant) => {
        const mission = gameState.players[participant.id]?.mission;
        return mission?.status === 'active';
      }),
    [gameState.players, participants]
  );

  const history = gameState.history;

  const handleReset = () => {
    setGameState(createFreshState(participants));
    setRevealedPlayerId(null);
    setRewardSelectionPlayerId(null);
    setSelectedRewardTargetId(null);
  };

  const handleToggleAutoAssign = () => {
    setGameState((previous) => ({
      ...previous,
      autoAssignNextMission: !previous.autoAssignNextMission,
    }));
  };

  const handleRevealToggle = (playerId: number) => {
    setRevealedPlayerId((current) => (current === playerId ? null : playerId));
  };

  const handleMissionClaim = (playerId: number) => {
    setGameState((previous) => {
      const playerState = previous.players[playerId];
      const mission = playerState?.mission;

      if (!playerState || !mission || mission.status !== 'active') {
        return previous;
      }

      return {
        ...previous,
        players: {
          ...previous.players,
          [playerId]: {
            ...playerState,
            mission: {
              ...mission,
              status: 'pending',
              requestedAt: new Date().toISOString(),
            },
          },
        },
      };
    });
  };

  const handleRefuseMission = (playerId: number) => {
    setGameState((previous) => concludeMission(previous, participants, playerId, 'refused'));
  };

  const handleOpenRewardSelection = (playerId: number) => {
    setRewardSelectionPlayerId(playerId);
    setSelectedRewardTargetId(null);
  };

  const handleConfirmRewardSelection = () => {
    if (rewardSelectionPlayerId === null || selectedRewardTargetId === null) {
      return;
    }

    if (rewardSelectionPlayerId === selectedRewardTargetId) {
      return;
    }

    setGameState((previous) =>
      concludeMission(previous, participants, rewardSelectionPlayerId, 'validated', selectedRewardTargetId)
    );

    setRewardSelectionPlayerId(null);
    setSelectedRewardTargetId(null);
  };

  const handleCancelRewardSelection = () => {
    setRewardSelectionPlayerId(null);
    setSelectedRewardTargetId(null);
  };

  const currentRewardPlayer =
    rewardSelectionPlayerId !== null ? participantById.get(rewardSelectionPlayerId) ?? null : null;
  const currentRewardMission =
    rewardSelectionPlayerId !== null ? gameState.players[rewardSelectionPlayerId]?.mission ?? null : null;
  const eligibleRewardTargets = participants.filter(
    (participant) => participant.id !== rewardSelectionPlayerId
  );

  const currentRewards = gameState.totalDistributedDrinks;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <Card className="w-full max-w-5xl max-h-[98vh] md:max-h-[95vh] overflow-y-auto shadow-2xl">
        <CardHeader className="space-y-3 border-b border-border/50 sticky top-0 bg-card z-10 py-3 md:py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-lg md:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
                Missions secrètes
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
                Chaque joueur reçoit une mission discrète. Quand quelqu’un pense l’avoir réussie, le groupe valide ou refuse, puis la récompense tombe sur un autre joueur.
              </p>
            </div>

            <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">Missions validées</p>
              <p className="text-lg md:text-xl font-bold">{gameState.totalValidatedMissions}</p>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">Gorgées distribuées</p>
              <p className="text-lg md:text-xl font-bold">{currentRewards}</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">En attente</p>
              <p className="text-lg md:text-xl font-bold">{pendingPlayers.length}</p>
            </div>
            <div className="rounded-lg border border-slate-500/20 bg-slate-500/10 px-3 py-2">
              <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">Missions actives</p>
              <p className="text-lg md:text-xl font-bold">{activePlayers.length}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Button
              onClick={handleToggleAutoAssign}
              variant={gameState.autoAssignNextMission ? 'default' : 'outline'}
              className="justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Nouvelle mission auto
              </span>
              <span className="text-xs opacity-80">{gameState.autoAssignNextMission ? 'Activé' : 'Désactivé'}</span>
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsResetConfirmOpen(true)}
                variant="outline"
                size="sm"
                className="flex-1 md:flex-none"
              >
                <RotateCcw className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline ml-2">Réinitialiser ce jeu</span>
              </Button>
              <Button onClick={onClose} variant="secondary" size="sm" className="flex-1 md:flex-none">
                Retour
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 md:p-6 space-y-4 md:space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                Missions par joueur
              </h2>
              <p className="text-[11px] md:text-xs text-muted-foreground">
                Clique sur ton joueur pour révéler uniquement sa mission.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {participants.map((participant) => {
                const playerState = gameState.players[participant.id];
                const mission = playerState?.mission ?? null;
                const isRevealed = revealedPlayerId === participant.id;
                const statusLabel = mission?.status ?? 'none';
                const statusStyles: Record<string, string> = {
                  active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                  pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
                  validated: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
                  refused: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
                  none: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
                };

                return (
                  <Card key={participant.id} className="border-2 shadow-sm">
                    <CardHeader className="space-y-2 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {participant.name}
                          </CardTitle>
                          <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] md:text-xs font-semibold ${statusStyles[statusLabel]}`}>
                            {statusLabel === 'active' && 'Active'}
                            {statusLabel === 'pending' && 'A valider'}
                            {statusLabel === 'validated' && 'Reussie'}
                            {statusLabel === 'refused' && 'Refusee'}
                            {statusLabel === 'none' && 'Sans mission'}
                          </div>
                        </div>
                        <div className="text-right text-[10px] md:text-xs text-muted-foreground">
                          <p>Ordre #{playerState?.mission?.assignedOrder ?? '—'}</p>
                          <p>{playerState?.successCount ?? 0} réussie(s)</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3">
                        <p className="text-[11px] md:text-xs text-muted-foreground mb-1">Mission</p>
                        <p className="text-sm md:text-base leading-relaxed">
                          {isRevealed && mission ? mission.text : getMissionSummary(mission)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleRevealToggle(participant.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={!mission}
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="ml-2">Masquer</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="ml-2">Révéler</span>
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => handleMissionClaim(participant.id)}
                          size="sm"
                          className="flex-1"
                          disabled={!mission || mission.status !== 'active'}
                        >
                          <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="ml-2">J’ai réussi ma mission</span>
                        </Button>
                      </div>

                      {mission?.status === 'pending' && (
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-2">
                          <p className="text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Mission en attente de validation
                          </p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleOpenRewardSelection(participant.id)}
                              size="sm"
                              className="flex-1"
                            >
                              <Gift className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="ml-2">Valider</span>
                            </Button>
                            <Button
                              onClick={() => handleRefuseMission(participant.id)}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="ml-2">Refuser</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] md:text-xs text-muted-foreground space-y-1">
                        <p>Attribuée le {mission?.assignedAt ? new Date(mission.assignedAt).toLocaleString('fr-FR') : '—'}</p>
                        <p>Réussites du joueur: {playerState?.successCount ?? 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Missions à valider
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Le groupe peut confirmer ou refuser une mission en attente.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {pendingPlayers.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                    Aucune mission à valider pour le moment.
                  </div>
                ) : (
                  pendingPlayers.map((participant) => {
                    const mission = gameState.players[participant.id]?.mission;
                    if (!mission) {
                      return null;
                    }

                    return (
                      <div key={participant.id} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{participant.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Mission demandée le {mission.requestedAt ? new Date(mission.requestedAt).toLocaleString('fr-FR') : '—'}
                            </p>
                          </div>
                          <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-[10px] md:text-xs font-semibold text-amber-700 dark:text-amber-300">
                            En attente
                          </span>
                        </div>
                        <p className="text-sm md:text-base leading-relaxed">{mission.text}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => handleOpenRewardSelection(participant.id)}>
                            <Gift className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="ml-2">Valider</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRefuseMission(participant.id)}>
                            <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="ml-2">Refuser</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Historique
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Les dernières décisions prises sur les missions.
                </p>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {history.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                    Aucun historique pour l’instant.
                  </div>
                ) : (
                  history.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-border/60 bg-muted/20 p-3 text-sm space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{entry.playerName}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] md:text-xs font-semibold ${entry.status === 'validated' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'}`}>
                          {entry.status === 'validated' ? 'Validée' : 'Refusée'}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{entry.missionText}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(entry.resolvedAt).toLocaleString('fr-FR')}
                        {entry.status === 'validated' && entry.rewardTargetName ? ` · ${entry.rewardTargetName} boit ${entry.rewardDrinks} gorgées` : ''}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </CardContent>
      </Card>

      {rewardSelectionPlayerId !== null && currentRewardPlayer && currentRewardMission && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg md:text-2xl flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Choisir qui boit
              </CardTitle>
              <p className="text-sm md:text-base text-muted-foreground">
                Mission de {currentRewardPlayer.name} validée en attente. Sélectionne un autre joueur pour lui donner {currentRewardMission.rewardDrinks} gorgées.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Mission validée</p>
                <p className="mt-1 text-sm md:text-base leading-relaxed">{currentRewardMission.text}</p>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {eligibleRewardTargets.map((participant) => {
                  const isSelected = selectedRewardTargetId === participant.id;
                  return (
                    <button
                      key={participant.id}
                      onClick={() => setSelectedRewardTargetId(participant.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${isSelected ? 'border-primary bg-primary/10' : 'border-border/60 hover:border-primary/60 hover:bg-muted/40'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{participant.name}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {eligibleRewardTargets.length === 0 && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                  Au moins deux joueurs sont nécessaires pour attribuer la récompense.
                </div>
              )}

              <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                <Button variant="outline" onClick={handleCancelRewardSelection}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmRewardSelection}
                  disabled={selectedRewardTargetId === null || eligibleRewardTargets.length === 0}
                >
                  Valider et donner {currentRewardMission.rewardDrinks} gorgées
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmResetModal
        isOpen={isResetConfirmOpen}
        onCancel={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          handleReset();
          setIsResetConfirmOpen(false);
        }}
        title="Réinitialiser Missions secrètes"
        description="Cette action supprime uniquement la progression de ce jeu. Les autres jeux et données de la soirée ne seront pas touchés."
        confirmLabel="Oui, réinitialiser ce jeu"
      />
    </div>
  );
}
