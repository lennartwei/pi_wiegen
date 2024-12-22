import { useState, useEffect } from 'react';
import { useScale } from './useScale';
import { loadSettings } from '../utils/storage';
import { updatePlayerStats } from '../utils/playerStats';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import type { GameStateWithDuel } from '../types';

export interface RoundScore {
  score: number;
  isPerfect: boolean;
  deviation: number;
}

export function useGameRound(
  state: GameStateWithDuel,
  moveToNextPlayer: () => void,
  incrementAttempts: () => void,
  updatePlayerScore: (score: number) => void
) {
  const { getWeight, tare, isLoading, error: scaleError } = useScale();
  const [weight, setWeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState<RoundScore>({ score: 0, isPerfect: false, deviation: 0 });
  const [isTared, setIsTared] = useState(false);
  const [waitingForSpacebar, setWaitingForSpacebar] = useState(false);
  const [showingDuelResult, setShowingDuelResult] = useState(false);

  useEffect(() => {
    const handleSpacebar = (event: KeyboardEvent) => {
      if (event.code === 'Space' && (waitingForSpacebar || showingDuelResult)) {
        setShowResult(false);
        setWaitingForSpacebar(false);
        setShowingDuelResult(false);
        if (state.duel?.isActive) {
          moveToNextPlayer();
          setWeight(0);
          setIsTared(false);
        }
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [waitingForSpacebar, showingDuelResult, state.duel, moveToNextPlayer]);

  const handleTare = async () => {
    try {
      await tare();
      setIsTared(true);
    } catch (error) {
      console.error('Tare error:', error);
      setIsTared(false);
    }
  };

  const handleMeasure = async () => {
    if (!isTared) return;
    
    let finalWeight = 0;
    try {
      const measured = await getWeight(true);
      finalWeight = Math.abs(measured);
      
      if (measured === 0) {
        throw new Error('Invalid measurement, please try again');
      }
      
      setWeight(finalWeight);
      
      if (state.duel?.isActive) {
        const currentPlayer = state.players[state.currentPlayerIndex];

        // Update duel weights and wait for state to update
        state.updateDuelWeight(finalWeight);
        
        if (state.duel.currentTurn === 'challenger') {
          console.log('Challenger weight:', finalWeight);
          setShowResult(true);
          setWaitingForSpacebar(true);
          
          // Update stats for challenger
          await updatePlayerStats(currentPlayer.name, {
            score: 0, // Temporary score until duel completes
            deviation: Math.abs(finalWeight - state.targetWeight),
            targetWeight: state.targetWeight,
            actualWeight: finalWeight,
            timestamp: Date.now(),
            isPerfect: false
          });
          return;
        }

        console.log('Opponent weight:', finalWeight);
        setShowResult(true);
        setShowingDuelResult(true);
        
        // Ensure we have both weights
        if (state.duel.challengerWeight === null) {
          throw new Error('Missing challenger weight');
        }
        
        const challengerDelta = Math.abs(state.duel.challengerWeight - state.targetWeight);
        const opponentDelta = Math.abs(finalWeight - state.targetWeight);
        const challengerWins = challengerDelta <= opponentDelta;
        
        const score = challengerWins ? -500 : 1000;

        await updatePlayerStats(currentPlayer.name, {
          score: score,
          deviation: Math.abs(finalWeight - state.targetWeight),
          targetWeight: state.targetWeight,
          actualWeight: finalWeight,
          timestamp: Date.now(),
          isPerfect: false
        });
        
        updatePlayerScore(score);
        return;
      }
      
      // Normal game mode handling
      setShowResult(true);
      
      const settings = loadSettings();
      const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
      if (!activePreset) return;
      
      const score = calculateScore(measured, state.targetWeight, activePreset);
      setRoundScore(score);
      updatePlayerScore(score.score);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const isWin = isValidWeight(measured, state.targetWeight, state.margin);
      
      await updatePlayerStats(currentPlayer.name, {
        score: score.score,
        deviation: score.deviation,
        targetWeight: state.targetWeight,
        actualWeight: finalWeight,
        timestamp: Date.now(),
        isPerfect: score.isPerfect
      });
      
      setShowResult(true);
      
      if (isWin) {
        setWaitingForSpacebar(true);
        setTimeout(() => {
          if (!state.duel?.isActive) {
            setShowResult(false);
            moveToNextPlayer();
            setWeight(0);
            setIsTared(false);
            setWaitingForSpacebar(false);
          }
        }, 5000);
      } else {
        incrementAttempts();
        const isLastAttempt = state.attempts + 1 >= state.maxAttempts;
        
        setWaitingForSpacebar(true);
        setTimeout(() => {
          if (!state.duel?.isActive) {
            setShowResult(false);
            if (isLastAttempt) {
              moveToNextPlayer();
              setWeight(0);
            }
            setIsTared(false);
            setWaitingForSpacebar(false);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Measurement error:', error);
      if (state.duel?.isActive) {
        // Ensure duel state is updated even on error
        state.updateDuelWeight(finalWeight);
      }
      setIsTared(false);
    }
  };

  return {
    weight,
    showResult,
    roundScore,
    isTared,
    isLoading,
    showingDuelResult,
    scaleError,
    handleTare,
    handleMeasure,
    setShowResult
  };
}