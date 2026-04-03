'use client';

import { useState, useEffect, useRef } from 'react';
import { Participant, Bar } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import { X, RotateCcw, Play, Pause, Check, ChevronRight, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface BzzgreTimeUpGameProps {
  participants: Participant[];
  gameId: string;
  selectedBar: Bar | null;
  onClose: () => void;
}

interface Mot {
  nom: string;
  emoji: string;
}

// Liste 1 - Classiques Pop Culture
const LISTE_1: Mot[] = [
  { nom: "Jack Sparrow", emoji: "🏴‍☠️" },
  { nom: "Nemo", emoji: "🐠" },
  { nom: "Les Dents de la Mer", emoji: "🦈" },
  { nom: "Harry Potter", emoji: "⚡" },
  { nom: "Jurassic Park", emoji: "🦖" },
  { nom: "Game of Thrones", emoji: "👑" },
  { nom: "Batman", emoji: "🦇" },
  { nom: "Barbie", emoji: "💗" },
  { nom: "Breaking Bad", emoji: "🧪" },
  { nom: "ET", emoji: "👽" },
  { nom: "Titanic", emoji: "🚢" },
  { nom: "Shrek", emoji: "🟢" },
  { nom: "La Casa de Papel", emoji: "💰" },
  { nom: "Le Seigneur des Anneaux", emoji: "💍" },
  { nom: "Terminator", emoji: "🤖" },
  { nom: "Stranger Things", emoji: "🔦" },
  { nom: "Mickey Mouse", emoji: "🐭" },
  { nom: "James Bond", emoji: "🔫" },
  { nom: "La Reine des Neiges", emoji: "❄️" },
  { nom: "Les Soprano", emoji: "🤵" },
  { nom: "Spiderman", emoji: "🕷️" },
  { nom: "Rocky", emoji: "🥊" },
  { nom: "Woody", emoji: "🤠" },
  { nom: "The Walking Dead", emoji: "🧟" },
  { nom: "Matrix", emoji: "💊" },
  { nom: "Le Hobbit", emoji: "🧝" },
  { nom: "Thor", emoji: "⚡" },
  { nom: "Retour vers le Futur", emoji: "🚗" },
  { nom: "Suits", emoji: "👔" },
  { nom: "Captain America", emoji: "🛡️" },
  { nom: "Le Roi Lion", emoji: "🦁" },
  { nom: "Buzz Lightyear", emoji: "🚀" },
  { nom: "Lost", emoji: "🏝️" },
  { nom: "Hulk", emoji: "💚" },
  { nom: "Fast and Furious", emoji: "🏎️" },
  { nom: "Dr House", emoji: "🩺" },
  { nom: "Gladiator", emoji: "⚔️" },
  { nom: "Rick et Morty", emoji: "🧪" },
  { nom: "Iron Man", emoji: "🤖" },
  { nom: "Le Parrain", emoji: "🤵" },
];

// Liste 2 - Séries & Films Récents
const LISTE_2: Mot[] = [
  { nom: "Squid Game", emoji: "🟥" },
  { nom: "Wednesday", emoji: "🖤" },
  { nom: "The Last of Us", emoji: "🍄" },
  { nom: "Peaky Blinders", emoji: "🎩" },
  { nom: "Narcos", emoji: "💊" },
  { nom: "Oppenheimer", emoji: "💣" },
  { nom: "Top Gun Maverick", emoji: "✈️" },
  { nom: "Dune", emoji: "🏜️" },
  { nom: "The Witcher", emoji: "🗡️" },
  { nom: "Black Mirror", emoji: "📱" },
  { nom: "The Boys", emoji: "💥" },
  { nom: "Wednesday Addams", emoji: "🕷️" },
  { nom: "Avatar 2", emoji: "🌊" },
  { nom: "John Wick", emoji: "🔫" },
  { nom: "Deadpool", emoji: "❤️" },
  { nom: "La Casa de Papel", emoji: "🎭" },
  { nom: "Vikings", emoji: "⚔️" },
  { nom: "Money Heist", emoji: "💰" },
  { nom: "Succession", emoji: "💼" },
  { nom: "Euphoria", emoji: "💎" },
  { nom: "The Crown", emoji: "👑" },
  { nom: "Daredevil", emoji: "👊" },
  { nom: "Lucifer", emoji: "😈" },
  { nom: "The Mandalorian", emoji: "🛡️" },
  { nom: "Brooklyn 99", emoji: "👮" },
  { nom: "Black Panther", emoji: "🐆" },
  { nom: "Doctor Strange", emoji: "🔮" },
  { nom: "Guardians of the Galaxy", emoji: "🚀" },
  { nom: "The Batman", emoji: "🦇" },
  { nom: "Joker", emoji: "🃏" },
  { nom: "Venom", emoji: "👅" },
  { nom: "Aquaman", emoji: "🔱" },
  { nom: "Shang-Chi", emoji: "🐲" },
  { nom: "Loki", emoji: "💚" },
  { nom: "WandaVision", emoji: "🔴" },
  { nom: "Moon Knight", emoji: "🌙" },
  { nom: "Hawkeye", emoji: "🏹" },
  { nom: "She-Hulk", emoji: "💪" },
  { nom: "Ant-Man", emoji: "🐜" },
  { nom: "The Flash", emoji: "⚡" },
];

// Liste 3 - Disney, Pixar & Animation
const LISTE_3: Mot[] = [
  { nom: "Vaiana", emoji: "🌺" },
  { nom: "Encanto", emoji: "🦋" },
  { nom: "Coco", emoji: "🎸" },
  { nom: "Soul", emoji: "🎹" },
  { nom: "Ratatouille", emoji: "🐀" },
  { nom: "Vice-Versa", emoji: "😊" },
  { nom: "Toy Story", emoji: "🤠" },
  { nom: "Monsters Inc", emoji: "👹" },
  { nom: "Cars", emoji: "🚗" },
  { nom: "Raiponce", emoji: "👸" },
  { nom: "Aladdin", emoji: "🧞" },
  { nom: "La Belle et la Bête", emoji: "🌹" },
  { nom: "Mulan", emoji: "🗡️" },
  { nom: "Pocahontas", emoji: "🍃" },
  { nom: "Tarzan", emoji: "🦍" },
  { nom: "Hercule", emoji: "💪" },
  { nom: "La Petite Sirène", emoji: "🧜" },
  { nom: "Le Monde de Nemo", emoji: "🐠" },
  { nom: "Monstres et Cie", emoji: "👀" },
  { nom: "Les Indestructibles", emoji: "🦸" },
  { nom: "Là-haut", emoji: "🎈" },
  { nom: "Rebelle", emoji: "🏹" },
  { nom: "Zootopie", emoji: "🦊" },
  { nom: "Bigfoot Junior", emoji: "👣" },
  { nom: "Dragons", emoji: "🐉" },
  { nom: "Kung Fu Panda", emoji: "🐼" },
  { nom: "Madagascar", emoji: "🦁" },
  { nom: "Shrek", emoji: "👹" },
  { nom: "Les Trolls", emoji: "💇" },
  { nom: "Moi Moche et Méchant", emoji: "👽" },
  { nom: "Les Minions", emoji: "💛" },
  { nom: "Schtroumpfs", emoji: "🔵" },
  { nom: "Pat Patrouille", emoji: "🐶" },
  { nom: "Peppa Pig", emoji: "🐷" },
  { nom: "Bob l'Éponge", emoji: "🧽" },
  { nom: "Les Simpson", emoji: "🍩" },
  { nom: "Family Guy", emoji: "👨‍👩‍👧‍👦" },
  { nom: "South Park", emoji: "🎿" },
  { nom: "Futurama", emoji: "🚀" },
  { nom: "Adventure Time", emoji: "🗡️" },
];

const LISTES_MOTS = {
  1: LISTE_1,
  2: LISTE_2,
  3: LISTE_3,
};

const DUREE_TOUR_1_2 = 30; // secondes
const DUREE_TOUR_3 = 40; // secondes
const NOMBRE_TOURS = 3;

interface Equipe {
  nom: string;
  joueurs: number[];
  score: number;
}

interface GameState {
  tour: number;
  temps: number;
  equipes: Equipe[];
  equipeActuelleIndex: number;
  motsUtilisesCeTour: number[]; // Indices des mots trouvés ce tour
  motActuelIndex: number | null;
  enPause: boolean;
  mancheTerminee: boolean;
  tourTermine: boolean;
  jeuTermine: boolean;
  etapeSelection: boolean;
  listeSelectionnee: 1 | 2 | 3;
}

export default function BzzgreTimeUpGame({
  participants,
  gameId,
  selectedBar,
  onClose,
}: BzzgreTimeUpGameProps) {
  const storageKey = `bzzgre_timesup_${gameId}`;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [isWarningVisible, setIsWarningVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // État pour le drag and drop
  const [draggedPlayer, setDraggedPlayer] = useState<number | null>(null);

  // Générer les styles de couleur basés sur le thème du bar
  const getBarThemeStyles = () => {
    if (!selectedBar?.theme) {
      // Couleurs par défaut si pas de thème
      return {
        background: 'hsl(30 15% 15%)',
        border: 'hsl(30 25% 30%)',
        hoverBorder: 'hsl(30 35% 40%)',
        text: 'hsl(30 85% 90%)',
      };
    }
    
    return {
      background: `hsl(${selectedBar.theme.cardBg})`,
      border: `hsl(${selectedBar.theme.secondary} / 0.3)`,
      hoverBorder: `hsl(${selectedBar.theme.secondary} / 0.6)`,
      text: `hsl(${selectedBar.theme.accent})`,
    };
  };

  const barThemeStyles = getBarThemeStyles();

  // État initial
  const [gameState, setGameState] = useState<GameState>(() => {
    const defaultState: GameState = {
      tour: 1,
      temps: DUREE_TOUR_1_2,
      equipes: [
        { nom: "Équipe 1", joueurs: [], score: 0 },
        { nom: "Équipe 2", joueurs: [], score: 0 },
      ],
      equipeActuelleIndex: 0,
      motsUtilisesCeTour: [],
      motActuelIndex: null,
      enPause: true,
      mancheTerminee: false,
      tourTermine: false,
      jeuTermine: false,
      etapeSelection: true,
      listeSelectionnee: 1,
    };

    if (typeof window === 'undefined') return defaultState;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Vérifier si c'est l'ancien format (avec equipe1Joueurs/equipe2Joueurs)
        if (parsedState.equipe1Joueurs !== undefined || parsedState.equipe2Joueurs !== undefined) {
          // Migrer l'ancien format vers le nouveau
          return {
            ...defaultState,
            equipes: [
              { nom: "Équipe 1", joueurs: parsedState.equipe1Joueurs || [], score: parsedState.scoreEq1 || 0 },
              { nom: "Équipe 2", joueurs: parsedState.equipe2Joueurs || [], score: parsedState.scoreEq2 || 0 },
            ],
            tour: parsedState.tour || 1,
            equipeActuelleIndex: parsedState.equipeActuelle === 2 ? 1 : 0,
            listeSelectionnee: 1,
          };
        }
        // Nouveau format
        return {
          ...defaultState,
          ...parsedState,
          equipes: parsedState.equipes || defaultState.equipes,
          listeSelectionnee: parsedState.listeSelectionnee || 1,
        };
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
      }
    }

    return defaultState;
  });

  // Liste de mots actuelle
  const MOTS_ACTUELS = LISTES_MOTS[gameState.listeSelectionnee];

  // Sauvegarder l'état
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  // Ajouter une équipe
  const ajouterEquipe = () => {
    setGameState(prev => ({
      ...prev,
      equipes: [...prev.equipes, { nom: `Équipe ${prev.equipes.length + 1}`, joueurs: [], score: 0 }],
    }));
  };

  // Supprimer une équipe
  const supprimerEquipe = (index: number) => {
    if (gameState.equipes.length <= 1) {
      alert("Il faut au moins 1 équipe !");
      return;
    }
    setGameState(prev => ({
      ...prev,
      equipes: prev.equipes.filter((_, i) => i !== index),
    }));
  };

  // Renommer une équipe
  const renommerEquipe = (index: number, nouveauNom: string) => {
    setGameState(prev => ({
      ...prev,
      equipes: prev.equipes.map((eq, i) => i === index ? { ...eq, nom: nouveauNom } : eq),
    }));
  };

  // Toggle joueur équipe
  const toggleJoueurEquipe = (joueurId: number, equipeIndex: number) => {
    setGameState(prev => ({
      ...prev,
      equipes: prev.equipes.map((eq, i) => {
        const joueurs = [...eq.joueurs];
        const idx = joueurs.indexOf(joueurId);
        
        if (i === equipeIndex) {
          // Ajouter le joueur à cette équipe s'il n'y est pas déjà
          if (idx === -1) {
            joueurs.push(joueurId);
          }
        } else {
          // Retirer le joueur des autres équipes
          if (idx !== -1) {
            joueurs.splice(idx, 1);
          }
        }
        
        return { ...eq, joueurs };
      }),
    }));
  };

  // Retirer un joueur de toutes les équipes
  const retirerJoueur = (joueurId: number) => {
    setGameState(prev => ({
      ...prev,
      equipes: prev.equipes.map(eq => ({
        ...eq,
        joueurs: eq.joueurs.filter(id => id !== joueurId),
      })),
    }));
  };

  // Drag and Drop handlers
  const handleDragStart = (joueurId: number) => (e: React.DragEvent) => {
    setDraggedPlayer(joueurId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropEquipe = (equipeIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPlayer !== null) {
      toggleJoueurEquipe(draggedPlayer, equipeIndex);
      setDraggedPlayer(null);
    }
  };

  const handleDropRetirer = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPlayer !== null) {
      retirerJoueur(draggedPlayer);
      setDraggedPlayer(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
  };

  // Démarrer le jeu
  const demarrerJeu = () => {
    const equipesAvecJoueurs = gameState.equipes.filter(eq => eq.joueurs.length > 0);
    if (equipesAvecJoueurs.length === 0) {
      alert("Au moins une équipe doit avoir des joueurs !");
      return;
    }
    setGameState(prev => ({ ...prev, etapeSelection: false }));
  };

  // Sons et vibrations
  const playBeep = (frequency: number, duration: number) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const vibrate = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Timer
  useEffect(() => {
    if (gameState.temps > 0 && !gameState.enPause && !gameState.mancheTerminee && !gameState.etapeSelection) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTemps = prev.temps - 1;
          
          if (newTemps === 10) {
            playBeep(800, 0.1);
            vibrate(100);
          } else if (newTemps === 5) {
            playBeep(1000, 0.1);
            vibrate([100, 50, 100]);
          } else if (newTemps === 0) {
            playBeep(400, 0.5);
            vibrate([200, 100, 200]);
            return { ...prev, temps: 0, enPause: true, mancheTerminee: true };
          }
          
          return { ...prev, temps: newTemps };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.temps, gameState.enPause, gameState.mancheTerminee, gameState.etapeSelection]);

  // Tirer un mot
  const tirerMot = () => {
    setGameState(prev => {
      const motsDisponibles = MOTS_ACTUELS
        .map((_, index) => index)
        .filter(index => !prev.motsUtilisesCeTour.includes(index));

      if (motsDisponibles.length === 0) {
        return { ...prev, tourTermine: true, enPause: true, motActuelIndex: null };
      }

      const randomIndex = motsDisponibles[Math.floor(Math.random() * motsDisponibles.length)];
      return { ...prev, motActuelIndex: randomIndex };
    });
  };

  // Démarrer manche
  const demarrerManche = () => {
    if (gameState.motActuelIndex === null) {
      tirerMot();
    }
    playBeep(600, 0.2);
    setGameState(prev => ({ ...prev, enPause: false }));
  };

  // Pause
  const pauserManche = () => {
    playBeep(400, 0.2);
    setGameState(prev => ({ ...prev, enPause: true }));
  };

  // Mot passé
  const motPasse = () => {
    playBeep(1200, 0.1);
    vibrate(50);
    
    setGameState(prev => {
      const nouveauxMots = prev.motActuelIndex !== null 
        ? [...prev.motsUtilisesCeTour, prev.motActuelIndex]
        : prev.motsUtilisesCeTour;

      // Vérifier si tous les mots sont trouvés
      const tousMotsTrouves = nouveauxMots.length >= MOTS_ACTUELS.length;

      // Mettre à jour le score de l'équipe actuelle
      const nouvellesEquipes = prev.equipes.map((eq, i) => 
        i === prev.equipeActuelleIndex ? { ...eq, score: eq.score + 1 } : eq
      );

      // Tirer immédiatement le mot suivant depuis le nouvel état pour éviter les doublons
      // liés aux lectures d'état obsolète entre deux setState.
      const motsDisponibles = MOTS_ACTUELS
        .map((_, index) => index)
        .filter(index => !nouveauxMots.includes(index));

      const prochainMotIndex = tousMotsTrouves || motsDisponibles.length === 0
        ? null
        : motsDisponibles[Math.floor(Math.random() * motsDisponibles.length)];

      return {
        ...prev,
        equipes: nouvellesEquipes,
        motsUtilisesCeTour: nouveauxMots,
        motActuelIndex: prochainMotIndex,
        tourTermine: tousMotsTrouves,
        enPause: tousMotsTrouves,
      };
    });
  };

  // Skip mot
  const skipMot = () => {
    playBeep(300, 0.15);
    tirerMot();
  };

  // Manche suivante (changement d'équipe)
  const mancheSuivante = () => {
    const duree = gameState.tour === 3 ? DUREE_TOUR_3 : DUREE_TOUR_1_2;
    setGameState(prev => ({
      ...prev,
      equipeActuelleIndex: (prev.equipeActuelleIndex + 1) % prev.equipes.length,
      temps: duree,
      mancheTerminee: false,
      enPause: true,
      motActuelIndex: null,
    }));
  };

  // Tour suivant
  const tourSuivant = () => {
    playBeep(800, 0.3);
    
    if (gameState.tour >= NOMBRE_TOURS) {
      setGameState(prev => ({ ...prev, jeuTermine: true, tourTermine: false }));
    } else {
      const duree = gameState.tour + 1 === 3 ? DUREE_TOUR_3 : DUREE_TOUR_1_2;
      setGameState(prev => ({
        ...prev,
        tour: prev.tour + 1,
        temps: duree,
        // L'équipe qui a trouvé le dernier mot ne commence pas : on passe à la suivante
        equipeActuelleIndex: (prev.equipeActuelleIndex + 1) % prev.equipes.length,
        motActuelIndex: null,
        motsUtilisesCeTour: [],
        enPause: true,
        mancheTerminee: false,
        tourTermine: false,
      }));
    }
  };

  // Reset
  const resetJeu = () => {
    setGameState(prev => ({
      ...prev,
      tour: 1,
      temps: DUREE_TOUR_1_2,
      equipes: prev.equipes.map(eq => ({ ...eq, score: 0 })),
      equipeActuelleIndex: 0,
      motsUtilisesCeTour: [],
      motActuelIndex: null,
      enPause: true,
      mancheTerminee: false,
      tourTermine: false,
      jeuTermine: false,
      etapeSelection: true,
    }));
  };

  // Mot actuel
  const getMotActuel = (): { texte: string; instruction: string } => {
    if (gameState.motActuelIndex === null) {
      return { texte: "Appuyez sur PLAY", instruction: "" };
    }

    const mot = MOTS_ACTUELS[gameState.motActuelIndex];
    
    switch (gameState.tour) {
      case 1:
        return { texte: mot.nom, instruction: "TOUR 1 : Décris sans dire le mot !" };
      case 2:
        return { texte: mot.nom, instruction: "TOUR 2 : 1 MOT SEULEMENT !" };
      case 3:
        return { texte: mot.nom, instruction: "TOUR 3 : MIME (tu ne parles pas) !" };
      default:
        return { texte: "", instruction: "" };
    }
  };

  const motActuel = getMotActuel();
  
  // Calcul du classement
  const classement = [...gameState.equipes].sort((a, b) => b.score - a.score);
  const meilleurScore = classement[0]?.score || 0;
  const gagnants = classement.filter(eq => eq.score === meilleurScore);
  
  const dureeManche = gameState.tour === 3 ? DUREE_TOUR_3 : DUREE_TOUR_1_2;
  const equipeActuelle = gameState.equipes[gameState.equipeActuelleIndex];

  // ÉCRAN SÉLECTION ÉQUIPES
  if (gameState.etapeSelection) {
    // Joueurs non assignés
    const joueursAssignes = new Set(gameState.equipes.flatMap(eq => eq.joueurs));
    const joueursNonAssignes = participants.filter(p => !joueursAssignes.has(p.id));

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 md:p-4 overflow-y-auto">
        <div className="w-full max-w-4xl my-2 md:my-4">
          <Card className="shadow-2xl">
            <CardHeader className="space-y-1 md:space-y-2 p-2 md:p-6">
              <div className="flex items-start justify-between gap-1 md:gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                    ⏱️ Constitution des Équipes
                  </CardTitle>
                  <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                    Créez vos équipes et assignez les joueurs
                  </p>
                </div>
                <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 md:space-y-4 p-2 md:p-6">
              {/* Sélecteur de liste */}
              <Card className="border-2 border-primary/50 bg-primary/5">
                <CardContent className="p-2 md:p-3">
                  <p className="text-[10px] md:text-xs font-semibold mb-1 md:mb-2">📋 Choisis ta liste de mots :</p>
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, listeSelectionnee: 1 }))}
                      variant={gameState.listeSelectionnee === 1 ? "default" : "outline"}
                      size="sm"
                      className="text-[9px] md:text-xs h-auto py-1 md:py-2 leading-tight"
                    >
                      Liste 1<br />Classiques
                    </Button>
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, listeSelectionnee: 2 }))}
                      variant={gameState.listeSelectionnee === 2 ? "default" : "outline"}
                      size="sm"
                      className="text-[9px] md:text-xs h-auto py-1 md:py-2 leading-tight"
                    >
                      Liste 2<br />Séries & Films
                    </Button>
                    <Button
                      onClick={() => setGameState(prev => ({ ...prev, listeSelectionnee: 3 }))}
                      variant={gameState.listeSelectionnee === 3 ? "default" : "outline"}
                      size="sm"
                      className="text-[9px] md:text-xs h-auto py-1 md:py-2 leading-tight"
                    >
                      Liste 3<br />Animation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des équipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {gameState.equipes.map((equipe, equipeIndex) => {
                  const couleurs = [
                    { 
                      border: "border-blue-500", 
                      bg: "bg-blue-500/10", 
                      text: "text-blue-600 dark:text-blue-400", 
                      hover: "hover:bg-blue-500/20"
                    },
                    { 
                      border: "border-red-500", 
                      bg: "bg-red-500/10", 
                      text: "text-red-600 dark:text-red-400", 
                      hover: "hover:bg-red-500/20"
                    },
                    { 
                      border: "border-green-500", 
                      bg: "bg-green-500/10", 
                      text: "text-green-600 dark:text-green-400", 
                      hover: "hover:bg-green-500/20"
                    },
                    { 
                      border: "border-yellow-500", 
                      bg: "bg-yellow-500/10", 
                      text: "text-yellow-600 dark:text-yellow-400", 
                      hover: "hover:bg-yellow-500/20"
                    },
                    { 
                      border: "border-purple-500", 
                      bg: "bg-purple-500/10", 
                      text: "text-purple-600 dark:text-purple-400", 
                      hover: "hover:bg-purple-500/20"
                    },
                    { 
                      border: "border-orange-500", 
                      bg: "bg-orange-500/10", 
                      text: "text-orange-600 dark:text-orange-400", 
                      hover: "hover:bg-orange-500/20"
                    },
                  ];
                  const couleur = couleurs[equipeIndex % couleurs.length];
                  const joueursEquipe = participants.filter(p => equipe.joueurs.includes(p.id));

                  return (
                    <Card key={equipeIndex} className={`border-2 ${couleur.border}`}>
                      <CardHeader className="p-2 md:p-3">
                        <div className="flex items-center gap-1 md:gap-2 justify-between">
                          <input
                            type="text"
                            value={equipe.nom}
                            onChange={(e) => renommerEquipe(equipeIndex, e.target.value)}
                            className={`text-xs md:text-base font-semibold bg-transparent border-none outline-none flex-1 ${couleur.text}`}
                            placeholder="Nom de l'équipe"
                          />
                          {gameState.equipes.length > 1 && (
                            <Button
                              onClick={() => supprimerEquipe(equipeIndex)}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 md:h-10 md:w-10 p-0 hover:bg-red-500/20 group"
                            >
                              <X className="h-5 w-5 md:h-8 md:w-8 text-red-500 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent
                        className={`p-2 md:p-3 pt-0 space-y-1 md:space-y-2 min-h-[60px] md:min-h-[100px] ${couleur.bg} rounded-b-lg transition-colors ${couleur.hover}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDropEquipe(equipeIndex)}
                      >
                        {joueursEquipe.length === 0 && (
                          <p className="text-[10px] md:text-xs text-muted-foreground italic text-center py-3 md:py-6">
                            Glisse les joueurs ici 👆
                          </p>
                        )}
                        {joueursEquipe.map(p => (
                          <div
                            key={p.id}
                            draggable
                            onDragStart={handleDragStart(p.id)}
                            onDragEnd={handleDragEnd}
                            style={{
                              backgroundColor: barThemeStyles.background,
                              borderColor: barThemeStyles.border,
                              color: barThemeStyles.text,
                            }}
                            className={`p-1.5 md:p-2 rounded border-2 cursor-move hover:shadow-lg transition-all flex items-center justify-between ${
                              draggedPlayer === p.id ? 'opacity-50' : ''
                            }`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = barThemeStyles.hoverBorder;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = barThemeStyles.border;
                            }}
                          >
                            <span className="text-[10px] md:text-xs font-medium">👤 {p.name}</span>
                            <button
                              onClick={() => retirerJoueur(p.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-0.5 md:p-1"
                            >
                              <X className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Ajouter équipe */}
              {gameState.equipes.length < 6 && (
                <Button onClick={ajouterEquipe} variant="outline" size="sm" className="w-full text-xs md:text-sm h-8 md:h-10">
                  + Ajouter une équipe
                </Button>
              )}

              {/* Joueurs non assignés */}
              {joueursNonAssignes.length > 0 && (
                <Card 
                  className="border-2 border-dashed"
                  style={{
                    borderColor: barThemeStyles.hoverBorder,
                  }}
                >
                  <CardContent
                    className="p-2 md:p-3 space-y-1 md:space-y-2 min-h-[60px] md:min-h-[100px] transition-colors rounded-lg"
                    style={{
                      backgroundColor: `${barThemeStyles.background}20`,
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDropRetirer}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${barThemeStyles.background}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${barThemeStyles.background}20`;
                    }}
                  >
                    <p 
                      className="text-[10px] md:text-xs font-semibold"
                      style={{ color: barThemeStyles.text }}
                    >
                      Joueurs non assignés - Glisse-les dans une équipe 👇
                    </p>
                    <div className="space-y-1 md:space-y-2">
                      {joueursNonAssignes.map(p => (
                        <div
                          key={p.id}
                          draggable
                          onDragStart={handleDragStart(p.id)}
                          onDragEnd={handleDragEnd}
                          style={{
                            backgroundColor: barThemeStyles.background,
                            borderColor: barThemeStyles.border,
                            color: barThemeStyles.text,
                          }}
                          className={`p-1.5 md:p-2 rounded border-2 cursor-move hover:shadow-lg transition-all ${
                            draggedPlayer === p.id ? 'opacity-50' : ''
                          }`}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = barThemeStyles.hoverBorder;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = barThemeStyles.border;
                          }}
                        >
                          <span className="text-[10px] md:text-xs font-medium">👤 {p.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={demarrerJeu} size="sm" className="w-full text-xs md:text-base h-10 md:h-12">
                <Users className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Commencer le jeu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ÉCRAN FIN DE JEU
  if (gameState.jeuTermine) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 md:p-4 overflow-y-auto">
        <div className="w-full max-w-2xl my-2 md:my-4">
          <Card className="shadow-2xl">
            <CardContent className="p-4 md:p-12 text-center space-y-2 md:space-y-4">
              <div className="text-4xl md:text-8xl mb-2 md:mb-4">🏆</div>
              <h2 className="text-xl md:text-4xl font-bold">
                {gagnants.length === 1 ? `${gagnants[0].nom} gagne !` : "Égalité !"}
              </h2>
              
              {/* Classement */}
              <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
                {classement.map((equipe, index) => (
                  <div
                    key={index}
                    className={`p-2 md:p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20 border-2 border-yellow-500' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm md:text-base font-semibold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`} {equipe.nom}
                      </span>
                      <span className="text-lg md:text-xl font-bold">{equipe.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>

              {gagnants.length === 1 && classement.length > 1 && (
                <div className="mt-2 md:mt-4 p-2 md:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-xs md:text-lg font-semibold text-red-600 dark:text-red-400">
                    🍺 Les perdants boivent !
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-2 md:pt-4">
                <Button onClick={() => setIsResetConfirmOpen(true)} className="flex-1" size="sm">
                  <RotateCcw className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-xs md:text-base">Rejouer</span>
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1" size="sm">
                  <span className="text-xs md:text-base">Retour</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmResetModal
            isOpen={isResetConfirmOpen}
            onCancel={() => setIsResetConfirmOpen(false)}
            onConfirm={() => {
              resetJeu();
              setIsResetConfirmOpen(false);
            }}
          />
        </div>
      </div>
    );
  }

  // ÉCRAN PRINCIPAL JEU
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 md:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-2 md:my-4">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 md:space-y-2 p-2 md:p-6">
            <div className="flex items-start justify-between gap-1 md:gap-2">
              <div className="flex-1">
                <CardTitle className="text-base md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                  ⏱️ Chrono BzzGre
                </CardTitle>
                <p className="text-[10px] md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                  Tours 1-2: 30s | Tour 3: 40s
                </p>
              </div>
              <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>

            {/* Warning */}
            <div className="mt-1 md:mt-2">
              <button
                onClick={() => setIsWarningVisible(!isWarningVisible)}
                className="w-full flex items-center justify-between gap-1 md:gap-2 p-1.5 md:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <div className="flex items-center gap-1 md:gap-2 flex-1">
                  <span className="text-base md:text-lg shrink-0">⚠️</span>
                  <span className="text-[9px] md:text-xs text-yellow-600 dark:text-yellow-400 font-medium text-left">
                    Règles : Chaque tour dure jusqu'à ce que tous les mots soient trouvés !
                  </span>
                </div>
                {isWarningVisible ? <ChevronUp className="h-3 w-3 md:h-4 md:w-4" /> : <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />}
              </button>
              
              {isWarningVisible && (
                <div className="mt-1 md:mt-2 p-1.5 md:p-3 bg-muted/50 rounded-lg text-[9px] md:text-xs text-muted-foreground space-y-0.5 md:space-y-1">
                  <p><strong>Tour 1:</strong> Décris (30s/manche)</p>
                  <p><strong>Tour 2:</strong> 1 mot (30s/manche)</p>
                  <p><strong>Tour 3:</strong> Mime (40s/manche)</p>
                  <p>🍺 Perdants boivent l'écart de points</p>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-2 md:space-y-3 p-2 md:p-6 md:pt-0">
            {/* Équipes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
              {gameState.equipes.map((equipe, index) => {
                const couleurs = [
                  "border-blue-500 bg-blue-500/10",
                  "border-red-500 bg-red-500/10",
                  "border-green-500 bg-green-500/10",
                  "border-yellow-500 bg-yellow-500/10",
                  "border-purple-500 bg-purple-500/10",
                  "border-orange-500 bg-orange-500/10",
                ];
                const couleur = couleurs[index % couleurs.length];
                const estActive = index === gameState.equipeActuelleIndex;
                const joueursEquipe = participants.filter(p => equipe.joueurs.includes(p.id));

                return (
                  <Card
                    key={index}
                    className={`${estActive ? `border-2 ${couleur}` : 'opacity-60'}`}
                  >
                    <CardContent className="p-1.5 md:p-3">
                      <div className="flex items-center justify-between mb-0.5 md:mb-1">
                        <span className="text-[10px] md:text-xs font-semibold truncate">{equipe.nom}</span>
                        <span className="text-base md:text-xl font-bold">{equipe.score}</span>
                      </div>
                      <div className="text-[8px] md:text-[10px] text-muted-foreground truncate">
                        {joueursEquipe.map(p => p.name).join(', ')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Stats */}
            <Card className="bg-muted/30">
              <CardContent className="p-2 md:p-3">
                <div className="flex items-center justify-between text-center gap-2 md:gap-3">
                  <div className="flex-1">
                    <div className="text-[9px] md:text-xs text-muted-foreground">Tour</div>
                    <div className="text-xl md:text-2xl font-bold">{gameState.tour}/3</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] md:text-xs text-muted-foreground">Temps</div>
                    <div className={`text-2xl md:text-3xl font-bold ${gameState.temps <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                      {Math.floor(gameState.temps / 60)}:{String(gameState.temps % 60).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] md:text-xs text-muted-foreground">Mots</div>
                    <div className="text-xl md:text-2xl font-bold">{gameState.motsUtilisesCeTour.length}/40</div>
                  </div>
                </div>
                <div className="mt-1 md:mt-2 w-full bg-muted rounded-full h-1.5 md:h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-red-500 h-full transition-all"
                    style={{ width: `${(gameState.temps / dureeManche) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Fin de manche */}
            {gameState.mancheTerminee && !gameState.tourTermine && (
              <Card className="border-2 border-yellow-500 bg-yellow-500/10">
                <CardContent className="p-3 md:p-4 text-center space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-3xl">⏰</div>
                  <h3 className="text-base md:text-lg font-bold">Temps écoulé !</h3>
                  <Button onClick={mancheSuivante} size="sm" className="w-full">
                    <ChevronRight className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs md:text-base">{gameState.equipes[(gameState.equipeActuelleIndex + 1) % gameState.equipes.length].nom} joue</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Fin de tour */}
            {gameState.tourTermine && (
              <Card className="border-2 border-green-500 bg-green-500/10">
                <CardContent className="p-3 md:p-4 text-center space-y-2 md:space-y-3">
                  <div className="text-2xl md:text-3xl">🎉</div>
                  <h3 className="text-base md:text-lg font-bold">Tour {gameState.tour} terminé !</h3>
                  <div className="space-y-0.5 md:space-y-1">
                    {gameState.equipes.map((eq, i) => (
                      <div key={i} className="flex justify-between items-center text-sm md:text-base">
                        <span className="font-semibold">{eq.nom}</span>
                        <span className="text-base md:text-lg font-bold">{eq.score} pts</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={tourSuivant} size="sm" className="w-full">
                    <ChevronRight className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-xs md:text-base">{gameState.tour >= NOMBRE_TOURS ? 'Résultats' : `Tour ${gameState.tour + 1}`}</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Mot */}
            {!gameState.mancheTerminee && !gameState.tourTermine && (
              <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-3 md:p-6 space-y-2 md:space-y-4">
                  <div className="text-center space-y-1 md:space-y-2">
                    <div className="text-[9px] md:text-xs text-muted-foreground">{motActuel.instruction}</div>
                    <div className="text-2xl md:text-5xl font-bold min-h-[60px] md:min-h-[100px] flex items-center justify-center">
                      {motActuel.texte}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    <Button
                      onClick={motPasse}
                      disabled={gameState.enPause || gameState.motActuelIndex === null}
                      className="h-12 md:h-16 bg-green-600 hover:bg-green-700 text-xs md:text-base"
                      size="sm"
                    >
                      <Check className="mr-0.5 md:mr-1 h-4 w-4 md:h-5 md:w-5" />
                      PASSÉ
                    </Button>

                    <Button
                      onClick={skipMot}
                      disabled={gameState.enPause || gameState.motActuelIndex === null}
                      variant="destructive"
                      className="h-12 md:h-16 text-xs md:text-base"
                      size="sm"
                    >
                      <X className="mr-0.5 md:mr-1 h-4 w-4 md:h-5 md:w-5" />
                      SKIP
                    </Button>

                    <Button
                      onClick={gameState.enPause ? demarrerManche : pauserManche}
                      variant="outline"
                      className="h-12 md:h-16 text-xs md:text-base"
                      size="sm"
                    >
                      {gameState.enPause ? (
                        <><Play className="mr-0.5 md:mr-1 h-4 w-4 md:h-5 md:w-5" />PLAY</>
                      ) : (
                        <><Pause className="mr-0.5 md:mr-1 h-4 w-4 md:h-5 md:w-5" />PAUSE</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setIsResetConfirmOpen(true)} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={onClose} variant="ghost" className="flex-1">
                ← Retour
              </Button>
            </div>
          </CardContent>
        </Card>

        <ConfirmResetModal
          isOpen={isResetConfirmOpen}
          onCancel={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            resetJeu();
            setIsResetConfirmOpen(false);
          }}
        />
      </div>
    </div>
  );
}
