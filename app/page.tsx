'use client';

import { useEffect, useState } from 'react';
import { AppState, Config, Participant, initialAppState } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Header from '@/components/Header';
import SetupForm from '@/components/SetupForm';
import ParticipantEntry from '@/components/ParticipantEntry';
import ResultsScreen from '@/components/ResultsScreen';
import EditParticipantModal from '@/components/EditParticipantModal';

export default function Home() {
  const [appState, setAppState, clearAppState, isClient] = useLocalStorage<AppState>(
    'bzzgre-state',
    initialAppState
  );

  const [currentScreen, setCurrentScreen] = useState<'setup' | 'entry' | 'results'>('setup');
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);

  // Déterminer l'écran à afficher au chargement
  useEffect(() => {
    if (!isClient) return;

    if (appState.isSetupComplete && appState.participants.length > 0) {
      setCurrentScreen('results');
    } else if (appState.config.numberOfPeople > 0) {
      setCurrentScreen('entry');
    } else {
      setCurrentScreen('setup');
    }
  }, [isClient, appState]);

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

  // Nouvelle partie
  const handleNewGame = () => {
    clearAppState();
    setCurrentScreen('setup');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <Header onReset={handleNewGame} />

      {currentScreen === 'setup' && (
        <SetupForm onSubmit={handleSetupSubmit} initialConfig={appState.config} />
      )}

      {currentScreen === 'entry' && (
        <ParticipantEntry
          totalPeople={appState.config.numberOfPeople}
          drinksPerPerson={appState.config.drinksPerPerson}
          participants={appState.participants}
          onSaveParticipant={handleSaveParticipant}
          onComplete={handleEntryComplete}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          participants={appState.participants}
          onDrawDrinks={handleDrawDrinks}
          onEditParticipant={handleEditParticipant}
          onAddParticipant={handleAddParticipant}
          isDrawn={appState.isDrawingComplete}
        />
      )}

      {editingParticipantId !== null && (
        <EditParticipantModal
          participant={appState.participants.find((p) => p.id === editingParticipantId)!}
          onSave={handleSaveEditedParticipant}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}
