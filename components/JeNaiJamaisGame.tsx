'use client';

import { useState, useEffect } from 'react';
import { Participant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmResetModal from '@/components/ConfirmResetModal';
import { X, RotateCcw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface JeNaiJamaisGameProps {
  participants: Participant[];
  gameId: string;
  onClose: () => void;
}

// 100 questions "Je n'ai jamais" progressives (soft à osé)
const JE_NAI_JAMAIS_QUESTIONS = [
  // Questions 1-10: Niveau Soft
  "Je n'ai jamais menti sur mon âge.",
  "Je n'ai jamais chanté sous la douche.",
  "Je n'ai jamais regardé une série en entier en une journée.",
  "Je n'ai jamais fait semblant d'être malade pour ne pas aller en cours/au travail.",
  "Je n'ai jamais raté un transport en public à cause d'un réveil tardif.",
  "Je n'ai jamais oublié un anniversaire important.",
  "Je n'ai jamais stalké quelqu'un sur les réseaux sociaux.",
  "Je n'ai jamais pleuré devant un film ou une série.",
  "Je n'ai jamais triché à un jeu de société.",
  "Je n'ai jamais commandé de la nourriture à 2h du matin.",

  // Questions 11-20: Niveau Léger
  "Je n'ai jamais envoyé un message à la mauvaise personne.",
  "Je n'ai jamais embrassé quelqu'un le premier soir.",
  "Je n'ai jamais fait semblant d'aimer un cadeau alors que je le détestais.",
  "Je n'ai jamais ghosté quelqu'un après un rendez-vous.",
  "Je n'ai jamais menti sur mon nombre de partenaires.",
  "Je n'ai jamais fait un date Tinder.",
  "Je n'ai jamais eu le béguin pour quelqu'un dans cette pièce.",
  "Je n'ai jamais eu une aventure d'un soir.",
  "Je n'ai jamais pleuré après une rupture.",
  "Je n'ai jamais été en couple avec deux personnes en même temps sans qu'elles le sachent.",

  // Questions 21-30: Niveau Moyen
  "Je n'ai jamais embrassé deux personnes le même soir.",
  "Je n'ai jamais menti sur ma situation amoureuse.",
  "Je n'ai jamais eu un crush sur l'ex de mon ami(e).",
  "Je n'ai jamais embrassé quelqu'un juste pour rendre quelqu'un d'autre jaloux.",
  "Je n'ai jamais consulté le téléphone de mon/ma partenaire en cachette.",
  "Je n'ai jamais eu des sentiments pour quelqu'un en couple.",
  "Je n'ai jamais flirté avec quelqu'un alors que j'étais en couple.",
  "Je n'ai jamais fait semblant d'avoir un orgasme.",
  "Je n'ai jamais eu une relation avec un(e) collègue de travail.",
  "Je n'ai jamais regretté d'avoir couché avec quelqu'un.",

  // Questions 31-40: Niveau Épicé
  "Je n'ai jamais embrassé mon meilleur ami ou ma meilleure amie.",
  "Je n'ai jamais eu une relation avec une personne beaucoup plus âgée que moi.",
  "Je n'ai jamais couché avec quelqu'un dont j'ai oublié le nom.",
  "Je n'ai jamais eu des relations sexuelles dans un lieu public.",
  "Je n'ai jamais envoyé une photo osée à quelqu'un.",
  "Je n'ai jamais eu une relation purement physique.",
  "Je n'ai jamais trompé mon/ma partenaire.",
  "Je n'ai jamais participé à un plan à trois.",
  "Je n'ai jamais fait l'amour dans la nature.",
  "Je n'ai jamais eu des relations sexuelles dans les toilettes d'un bar/boîte.",

  // Questions 41-50: Niveau Osé
  "Je n'ai jamais regardé du contenu pour adultes avec quelqu'un d'autre.",
  "Je n'ai jamais utilisé un sex-toy.",
  "Je n'ai jamais pratiqué le sexting avec plusieurs personnes en même temps.",
  "Je n'ai jamais couché avec deux personnes dans la même semaine.",
  "Je n'ai jamais eu des relations avec quelqu'un de ce groupe.",
  "Je n'ai jamais fantasmé sur quelqu'un pendant que j'étais avec mon/ma partenaire.",
  "Je n'ai jamais été attiré(e) par quelqu'un du même sexe.",
  "Je n'ai jamais expérimenté le bondage ou BDSM.",
  "Je n'ai jamais eu des relations dans une voiture.",
  "Je n'ai jamais embrassé quelqu'un du même sexe.",

  // Questions 51-60: Niveau Très Osé
  "Je n'ai jamais fait un strip-tease pour quelqu'un.",
  "Je n'ai jamais eu des relations pendant que d'autres personnes étaient dans la pièce.",
  "Je n'ai jamais participé à un jeu sexuel en groupe.",
  "Je n'ai jamais couché avec l'ex de mon ami(e).",
  "Je n'ai jamais utilisé de la nourriture pendant un moment intime.",
  "Je n'ai jamais eu des relations dans les toilettes d'un avion.",
  "Je n'ai jamais fait l'amour dehors en pleine journée.",
  "Je n'ai jamais eu un plan régulier avec quelqu'un.",
  "Je n'ai jamais couché avec quelqu'un le jour de notre rencontre.",
  "Je n'ai jamais fantasmé sur un membre de ma belle-famille.",

  // Questions 61-70: Niveau Très Chaud
  "Je n'ai jamais participé à une soirée coquine.",
  "Je n'ai jamais eu des relations avec une personne en couple (en sachant qu'elle était en couple).",
  "Je n'ai jamais tourné une vidéo intime.",
  "Je n'ai jamais pratiqué le candaulisme (partage de son/sa partenaire).",
  "Je n'ai jamais eu des relations avec plus de deux personnes dans la même nuit.",
  "Je n'ai jamais été dans un club libertin.",
  "Je n'ai jamais fantasmé sur quelqu'un de ma famille d'accueil/belle-famille.",
  "Je n'ai jamais eu des relations avec quelqu'un contre de l'argent.",
  "Je n'ai jamais payé pour des services sexuels.",
  "Je n'ai jamais participé à une orgie.",

  // Questions 71-80: Niveau Extrême
  "Je n'ai jamais été attiré(e) par un professeur/patron.",
  "Je n'ai jamais couché avec deux personnes de ce groupe.",
  "Je n'ai jamais fantasmé sur tous les participants de ce jeu.",
  "Je n'ai jamais eu une relation incestueuse.",
  "Je n'ai jamais pratiqué l'échangisme.",
  "Je n'ai jamais couché avec quelqu'un pour obtenir quelque chose en retour.",
  "Je n'ai jamais eu des relations dans un endroit religieux.",
  "Je n'ai jamais participé à un gang bang.",
  "Je n'ai jamais eu des pensées impures pendant un enterrement.",
  "Je n'ai jamais été excité(e) dans une situation totalement inappropriée.",

  // Questions 81-90: Niveau Sans Filtre
  "Je n'ai jamais masturbé quelqu'un sous la table lors d'un repas de famille/amis.",
  "Je n'ai jamais couché avec un membre de la famille d'un(e) ex.",
  "Je n'ai jamais eu des relations avec mon/ma meilleur(e) ami(e) en couple.",
  "Je n'ai jamais filmé quelqu'un à son insu dans un contexte intime.",
  "Je n'ai jamais pratiqué des jeux d'urine ou autres pratiques extrêmes.",
  "Je n'ai jamais couché avec quelqu'un alors qu'une autre personne dormait dans la même pièce.",
  "Je n'ai jamais eu des relations sexuelles alors que mes parents étaient à la maison.",
  "Je n'ai jamais fait l'amour dans la maison/chambre de mes parents.",
  "Je n'ai jamais eu des relations à moins de 5 mètres de mes parents.",
  "Je n'ai jamais eu des pensées sexuelles sur le partenaire de mon meilleur ami.",

  // Questions 91-100: Niveau Ultime
  "Je n'ai jamais couché avec plus de 3 personnes dans cette pièce.",
  "Je n'ai jamais eu envie de coucher avec tous les participants de ce jeu.",
  "Je n'ai jamais trompé plusieurs partenaires en même temps.",
  "Je n'ai jamais eu des relations avec des jumeaux/jumelles.",
  "Je n'ai jamais participé à un plan à plus de 4 personnes.",
  "Je n'ai jamais eu des relations dans un lieu de culte.",
  "Je n'ai jamais couché avec quelqu'un dont j'ignorais complètement le prénom.",
  "Je n'ai jamais été l'amant(e) secret(e) de quelqu'un dans ce groupe.",
  "Je n'ai jamais eu une double vie amoureuse ou sexuelle sur plusieurs mois.",
  "Je n'ai jamais fait quelque chose d'absolument dégueulasse que je n'avouerai jamais.",
];

const TOTAL_QUESTIONS = JE_NAI_JAMAIS_QUESTIONS.length;

interface GameState {
  currentQuestionIndex: number | null;
  askedQuestions: number[]; // Array of indexes of questions already asked
}

export default function JeNaiJamaisGame({
  participants,
  gameId,
  onClose,
}: JeNaiJamaisGameProps) {
  const storageKey = `bzzgre_je_nai_jamais_${gameId}`;
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  
  const [isWarningVisible, setIsWarningVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Initialize state from localStorage or create fresh state
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return {
      currentQuestionIndex: null,
      askedQuestions: [],
    };

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
      }
    }

    return {
      currentQuestionIndex: null,
      askedQuestions: [],
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(gameState));
    }
  }, [gameState, storageKey]);

  // Draw a random question
  const drawQuestion = () => {
    const availableQuestions = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i)
      .filter(i => !gameState.askedQuestions.includes(i));
    
    if (availableQuestions.length === 0) {
      return null; // No more questions
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionIndex = availableQuestions[randomIndex];

    setGameState({
      currentQuestionIndex: questionIndex,
      askedQuestions: [...gameState.askedQuestions, questionIndex],
    });

    return questionIndex;
  };

  // Reset game
  const handleReset = () => {
    const resetState: GameState = {
      currentQuestionIndex: null,
      askedQuestions: [],
    };
    setGameState(resetState);
    localStorage.setItem(storageKey, JSON.stringify(resetState));
  };

  // Get difficulty level color and label
  const getDifficultyInfo = (index: number) => {
    if (index < 10) return { color: 'text-green-400', label: 'Soft', bg: 'bg-green-500/10' };
    if (index < 20) return { color: 'text-blue-400', label: 'Léger', bg: 'bg-blue-500/10' };
    if (index < 30) return { color: 'text-yellow-400', label: 'Moyen', bg: 'bg-yellow-500/10' };
    if (index < 40) return { color: 'text-orange-400', label: 'Épicé', bg: 'bg-orange-500/10' };
    if (index < 50) return { color: 'text-red-400', label: 'Osé', bg: 'bg-red-500/10' };
    if (index < 60) return { color: 'text-pink-400', label: 'Très Osé', bg: 'bg-pink-500/10' };
    if (index < 70) return { color: 'text-purple-400', label: 'Très Chaud', bg: 'bg-purple-500/10' };
    if (index < 80) return { color: 'text-red-600', label: 'Extrême', bg: 'bg-red-600/10' };
    if (index < 90) return { color: 'text-fuchsia-500', label: 'Sans Filtre', bg: 'bg-fuchsia-500/10' };
    return { color: 'text-rose-600', label: 'Ultime 🔥', bg: 'bg-rose-600/10' };
  };

  const questionsRemaining = TOTAL_QUESTIONS - gameState.askedQuestions.length;
  const currentQuestion = gameState.currentQuestionIndex !== null 
    ? JE_NAI_JAMAIS_QUESTIONS[gameState.currentQuestionIndex]
    : null;
  const difficultyInfo = gameState.currentQuestionIndex !== null 
    ? getDifficultyInfo(gameState.currentQuestionIndex)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4">
        <Card className="shadow-2xl">
          {/* Header */}
          <CardHeader className="space-y-2 p-3 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent">
                  🍺 Je n'ai jamais...
                </CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Ceux qui ont déjà fait l'action boivent ! 🥂
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Warning Banner - Collapsible */}
            <div className="mt-2">
              <button
                onClick={() => setIsWarningVisible(!isWarningVisible)}
                className="w-full flex items-center justify-between gap-2 p-2 md:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg md:text-xl shrink-0">⚠️</span>
                  <span className="text-[10px] md:text-xs text-yellow-600 dark:text-yellow-400 font-medium text-left">
                    Attention : Les questions deviennent progressivement osées
                  </span>
                </div>
                {isWarningVisible ? (
                  <ChevronUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
                )}
              </button>
              
              {isWarningVisible && (
                <div className="mt-2 p-2 md:p-3 bg-muted/50 rounded-lg text-[10px] md:text-xs text-muted-foreground space-y-1">
                  <p>• Les questions progressent par paliers de 10 (Soft → Ultime)</p>
                  <p>• Respectez les limites de chacun</p>
                  <p>• Ce qui se dit ici reste ici</p>
                  <p>• Vous pouvez passer une question si trop gênante</p>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-3 md:p-6 md:pt-0">
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-sm text-muted-foreground bg-muted/30 p-2 md:p-3 rounded-lg">
              <div className="flex items-center gap-1 md:gap-2">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden md:inline">Questions restantes:</span>
                <span className="md:hidden">Restantes:</span>
                <span className="font-bold text-primary">{questionsRemaining}/{TOTAL_QUESTIONS}</span>
              </div>
              {questionsRemaining === 0 && (
                <span className="text-green-500 font-semibold text-[10px] md:text-sm">
                  🎉 Toutes les questions posées !
                </span>
              )}
            </div>

            {/* Current Question Display */}
            {currentQuestion && difficultyInfo && (
              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${difficultyInfo.bg} ${difficultyInfo.color}`}>
                      {difficultyInfo.label}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">
                      Question {gameState.askedQuestions.length}/{TOTAL_QUESTIONS}
                    </div>
                  </div>
                  
                  <p className="text-base md:text-xl font-semibold text-foreground leading-relaxed">
                    {currentQuestion}
                  </p>
                  
                  <div className="pt-2 md:pt-3 border-t border-border">
                    <p className="text-[10px] md:text-xs text-muted-foreground italic">
                      💡 Les personnes qui ont déjà fait ça doivent boire !
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Question State */}
            {!currentQuestion && (
              <Card className="border-2 border-dashed border-muted">
                <CardContent className="p-6 md:p-12 text-center space-y-3 md:space-y-4">
                  <div className="text-4xl md:text-6xl mb-2 md:mb-4">🎲</div>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    {questionsRemaining === 0 
                      ? "Vous avez terminé toutes les questions ! Recommencer ?"
                      : "Prêts à découvrir les secrets ? Tirez une question !"
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
              <Button
                onClick={() => drawQuestion()}
                disabled={questionsRemaining === 0}
                className="flex-1 h-10 md:h-12 text-sm md:text-base font-semibold"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {currentQuestion ? 'Question Suivante' : 'Commencer'}
              </Button>
              
              <Button
                onClick={() => setIsResetConfirmOpen(true)}
                variant="outline"
                className="h-10 md:h-12 text-sm md:text-base"
                size="lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Recommencer</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 md:space-y-2">
              <div className="w-full bg-muted rounded-full h-1 md:h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-pink-600 h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((gameState.askedQuestions.length) / TOTAL_QUESTIONS) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[10px] md:text-xs text-center text-muted-foreground">
                {Math.round(((gameState.askedQuestions.length) / TOTAL_QUESTIONS) * 100)}% complété
              </p>
            </div>

            {/* Back Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-xs md:text-sm"
            >
              ← Retour à la sélection
            </Button>
          </CardContent>
        </Card>

        <ConfirmResetModal
          isOpen={isResetConfirmOpen}
          onCancel={() => setIsResetConfirmOpen(false)}
          onConfirm={() => {
            handleReset();
            setIsResetConfirmOpen(false);
          }}
        />
      </div>
    </div>
  );
}
