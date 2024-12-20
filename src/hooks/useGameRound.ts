import { useState, useEffect } from 'react';
import { useScale } from './useScale';
import { loadSettings } from '../utils/storage';
import { updatePlayerStats } from '../utils/playerStats';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import type { GameState } from './useGameState';

interface GameStateWithDuel extends GameState {
  updateDuelWeight: (weight: number) => void;
}

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
      if (measured === 0) {
        throw new Error('Invalid measurement, please try again');
      }
      
      finalWeight = Math.abs(measured);
      setWeight(finalWeight);

      if (state.duel?.isActive && state.updateDuelWeight) {
        // Update duel weights
        await state.updateDuelWeight(finalWeight);
        const currentPlayer = state.players[state.currentPlayerIndex];
        
        // Only show result for first player if it's a duel
        if (state.duel.currentTurn === 'challenger') {
          setShowResult(true);
        }

        // Check if both players have measured
        if (state.duel.challengerWeight && state.duel.opponentWeight) {
          setShowResult(true); // Show final result for second player
          setShowingDuelResult(true);
          const challengerDelta = Math.abs(state.duel.challengerWeight - state.targetWeight);
          const opponentDelta = Math.abs(state.duel.opponentWeight - state.targetWeight);
          
          // Determine winner and scores
          const challengerWins = challengerDelta <= opponentDelta;
          const score = state.duel.currentTurn === 'challenger'
            ? (challengerWins ? 1000 : -500)
            : (challengerWins ? -500 : 1000);
          
          // Update stats for both players
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

        // Update stats for first player
        await updatePlayerStats(currentPlayer.name, {
          score: 0, // No score yet until duel completes
          deviation: Math.abs(finalWeight - state.targetWeight),
          targetWeight: state.targetWeight,
          actualWeight: finalWeight,
          timestamp: Date.now(),
          isPerfect: false
        });
        updatePlayerScore(0); // Temporary score until duel completes

        // First player finished - show intermediate result
        setWaitingForSpacebar(true);
        return;
      }
      
      // Normal game mode handling
      setShowResult(true);
      
      const settings = loadSettings();
      const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
      if (!activePreset) return;
      
      const score = calculateScore(finalWeight, state.targetWeight, activePreset);
      setRoundScore(score);
      updatePlayerScore(score.score);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const isWin = isValidWeight(finalWeight, state.targetWeight, state.margin);
      
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
          setShowResult(false);
          moveToNextPlayer();
          setWeight(0);
          setIsTared(false);
          setWaitingForSpacebar(false);
        }, 2000);
      } else {
        incrementAttempts();
        const isLastAttempt = state.attempts + 1 >= state.maxAttempts;
        
        setWaitingForSpacebar(true);
        setTimeout(() => {
          setShowResult(false);
          if (isLastAttempt) {
            moveToNextPlayer();
            setWeight(0);
          }
          setIsTared(false);
          setWaitingForSpacebar(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Measurement error:', error);
      if (state.duel?.isActive && state.updateDuelWeight) {
        // Ensure duel state is updated even if there's an error
        await state.updateDuelWeight(finalWeight);
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