'use client';

import { useEffect, useState } from 'react';
import { AppState, Config, Participant, initialAppState, Bar, AVAILABLE_BARS } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Header from '@/components/Header';
import SetupForm from '@/components/SetupForm';
import ParticipantEntry from '@/components/ParticipantEntry';
import ResultsScreen from '@/components/ResultsScreen';
import EditParticipantModal from '@/components/EditParticipantModal';
import BarSelectionModal from '@/components/BarSelectionModal';
import ThemeProvider from '@/components/ThemeProvider';

export default function Home() {
  const [appState, setAppState, clearAppState, isClient, isStorageHydrated] = useLocalStorage<AppState>(
    'bzzgre-state',
    initialAppState
  );

  const [currentScreen, setCurrentScreen] = useState<'setup' | 'entry' | 'results'>('setup');
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
  const [isBarSelectionOpen, setIsBarSelectionOpen] = useState(false);

  // Déterminer l'écran à afficher au chargement
  useEffect(() => {
    if (!isClient || !isStorageHydrated) return;

    if (appState.isSetupComplete && appState.participants.length > 0) {
      setCurrentScreen('results');
    } else if (appState.config.numberOfPeople > 0) {
      setCurrentScreen('entry');
    } else {
      setCurrentScreen('setup');
    }
  }, [isClient, appState]);

  // Initialiser le bar par défaut avec Fusion si aucun bar n'est sélectionné
  useEffect(() => {
    if (!isClient || !isStorageHydrated) return;
    
    if (!appState.config.selectedBar && AVAILABLE_BARS.length > 0) {
      setAppState((previousState) => ({
        ...previousState,
        config: {
          ...previousState.config,
          selectedBar: AVAILABLE_BARS[0], // Fusion est le premier bar
        },
      }));
    }
  }, [isClient, isStorageHydrated, appState.config.selectedBar]);


  // Gestion de la configuration initiale
  const handleSetupSubmit = (config: Config) => {
    setAppState({
      ...initialAppState,
      config,
      participants: [],
      isSetupComplete: false,
      isDrawingComplete: false,
    });
    setCurrentScreen('entry');
  };

  // Changement de bar immédiat (sans soumettre le formulaire)
  const handleBarChange = (bar: Bar | null) => {
    setAppState({
      ...appState,
      config: {
        ...appState.config,
        selectedBar: bar,
      },
    });
  };

  // Sauvegarde d'un participant
  const handleSaveParticipant = (participant: Participant, isLastParticipant: boolean) => {
    const updatedParticipants = [...appState.participants];
    const existingIndex = updatedParticipants.findIndex((p) => p.id === participant.id);

    if (existingIndex >= 0) {
      updatedParticipants[existingIndex] = participant;
    } else {
      updatedParticipants.push(participant);
    }

    // Mise à jour unique incluant le participant ET le flag de complétion si c'est le dernier
    setAppState({
      ...appState,
      participants: updatedParticipants,
      isSetupComplete: isLastParticipant ? true : appState.isSetupComplete,
    });

    // Redirection vers l'écran results si c'est le dernier participant
    if (isLastParticipant) {
      setCurrentScreen('results');
    }
  };

  // Complétion de la saisie (fonction de compatibilité, non utilisée)
  const handleEntryComplete = () => {
    // Cette fonction n'est plus nécessaire car la logique est dans handleSaveParticipant
  };

  // Tirage aléatoire des boissons
  const handleDrawDrinks = () => {
    // Récupérer TOUTES les boissons de TOUS les participants
    const allDrinks: string[] = [];
    appState.participants.forEach((participant) => {
      allDrinks.push(...participant.drinks);
    });

    // Mélanger aléatoirement (algorithme Fisher-Yates)
    const shuffledDrinks = [...allDrinks];
    for (let i = shuffledDrinks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDrinks[i], shuffledDrinks[j]] = [shuffledDrinks[j], shuffledDrinks[i]];
    }

    // Attribuer une boisson à chaque participant
    const updatedParticipants = appState.participants.map((participant, index) => ({
      ...participant,
      assignedDrink: shuffledDrinks[index] || null,
    }));

    setAppState({
      ...appState,
      participants: updatedParticipants,
      isDrawingComplete: true,
    });
  };

  // Relancer la boisson d'un participant uniquement
  const handleRerollDrinkForParticipant = (participantId: number) => {
    if (!appState.isDrawingComplete) return;

    const allDrinks: string[] = [];
    appState.participants.forEach((participant) => {
      allDrinks.push(...participant.drinks);
    });

    if (allDrinks.length === 0) return;

    const updatedParticipants = appState.participants.map((participant) => {
      if (participant.id !== participantId) return participant;

      const availableDrinks = allDrinks.filter((drink) => drink !== participant.assignedDrink);
      const rerollPool = availableDrinks.length > 0 ? availableDrinks : allDrinks;
      const newDrink = rerollPool[Math.floor(Math.random() * rerollPool.length)] || null;

      return {
        ...participant,
        assignedDrink: newDrink,
      };
    });

    setAppState({
      ...appState,
      participants: updatedParticipants,
      isDrawingComplete: true,
    });
  };

  // Éditer un participant spécifique
  const handleEditParticipant = (participantId: number) => {
    setEditingParticipantId(participantId);
  };

  // Sauvegarder les modifications d'un participant
  const handleSaveEditedParticipant = (updatedParticipant: Participant) => {
    const updatedParticipants = appState.participants.map((p) =>
      p.id === updatedParticipant.id ? updatedParticipant : p
    );

    setAppState({
      ...appState,
      participants: updatedParticipants,
      isDrawingComplete: false, // Reset le tirage car les boissons ont changé
    });

    setEditingParticipantId(null);
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingParticipantId(null);
  };

  // Ajouter un nouveau participant
  const handleAddParticipant = () => {
    const newId = Math.max(...appState.participants.map((p) => p.id), 0) + 1;

    setAppState({
      ...appState,
      config: {
        ...appState.config,
        numberOfPeople: appState.config.numberOfPeople + 1,
      },
      isSetupComplete: false,
      isDrawingComplete: false,
    });

    // Naviguer vers l'écran de saisie pour le nouveau participant
    setTimeout(() => setCurrentScreen('entry'), 100);
  };

  // Supprimer un participant
  const handleDeleteParticipant = (participantId: number) => {
    const updatedParticipants = appState.participants.filter((p) => p.id !== participantId);

    setAppState({
      ...appState,
      participants: updatedParticipants,
      config: {
        ...appState.config,
        numberOfPeople: Math.max(updatedParticipants.length, 0),
      },
      isDrawingComplete: false, // Reset le tirage car les participants ont changé
    });

    // Si plus de participants, retourner à l'écran de configuration
    if (updatedParticipants.length === 0) {
      setCurrentScreen('setup');
    }
  };

  // Nouvelle partie
  const handleNewGame = () => {
    clearAppState();
    setCurrentScreen('setup');
  };

  if (!isClient || !isStorageHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-900 via-stone-900 to-yellow-950">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-amber-400/30 bg-black/20 px-10 py-8 text-amber-50 shadow-2xl backdrop-blur-sm">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border-4 border-amber-300/20 border-t-amber-300 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border-4 border-yellow-400/20 border-b-yellow-300 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
            />
            <div className="absolute inset-[34%] rounded-full bg-amber-300 shadow-[0_0_20px_rgba(252,211,77,0.8)]" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold tracking-wide">Chargement</p>
            <p className="text-sm text-amber-100/80">Préparation de la soirée...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider bar={appState.config.selectedBar}>
      <Header onReset={handleNewGame} />

      {currentScreen === 'setup' && (
        <SetupForm 
          onSubmit={handleSetupSubmit} 
          onBarChange={handleBarChange}
          initialConfig={appState.config} 
        />
      )}

      {currentScreen === 'entry' && (
        <ParticipantEntry
          totalPeople={appState.config.numberOfPeople}
          drinksPerPerson={appState.config.drinksPerPerson}
          participants={appState.participants}
          selectedBar={appState.config.selectedBar}
          onSaveParticipant={handleSaveParticipant}
          onComplete={handleEntryComplete}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          participants={appState.participants}
          selectedBar={appState.config.selectedBar}
          onDrawDrinks={handleDrawDrinks}
          onRerollDrink={handleRerollDrinkForParticipant}
          onEditParticipant={handleEditParticipant}
          onAddParticipant={handleAddParticipant}
          onDeleteParticipant={handleDeleteParticipant}
          onChangeBar={() => setIsBarSelectionOpen(true)}
          isDrawn={appState.isDrawingComplete}
        />
      )}

      {editingParticipantId !== null && (
        <EditParticipantModal
          participant={appState.participants.find((p) => p.id === editingParticipantId)!}
          selectedBar={appState.config.selectedBar}
          onSave={handleSaveEditedParticipant}
          onCancel={handleCancelEdit}
        />
      )}

      {isBarSelectionOpen && (
        <BarSelectionModal
          currentBar={appState.config.selectedBar}
          onSelectBar={handleBarChange}
          onClose={() => setIsBarSelectionOpen(false)}
        />
      )}
    </ThemeProvider>
  );
}
