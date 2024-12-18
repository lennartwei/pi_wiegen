import { useState } from 'react';
import { useScale } from './useScale';
import { loadSettings } from '../utils/storage';
import { updatePlayerStats } from '../utils/playerStats';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import type { GameState } from './useGameState';

export interface RoundScore {
  score: number;
  isPerfect: boolean;
  deviation: number;
}

export function useGameRound(state: GameState, moveToNextPlayer: () => void, incrementAttempts: () => void, updatePlayerScore: (score: number) => void) {
  const { getWeight, tare, isLoading, error: scaleError } = useScale();
  const [weight, setWeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState<RoundScore>({ score: 0, isPerfect: false, deviation: 0 });
  const [isTared, setIsTared] = useState(false);

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

    try {
      const measured = await getWeight(true);
      const measuredWeight = Math.abs(measured);
      setWeight(measuredWeight);
      
      const settings = loadSettings();
      const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
      if (!activePreset) return;
      
      const score = calculateScore(measuredWeight, state.targetWeight, activePreset);
      setRoundScore(score);
      updatePlayerScore(score.score);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const isWin = isValidWeight(measuredWeight, state.targetWeight, state.margin);
      
      await updatePlayerStats(currentPlayer.name, {
        score: score.score,
        deviation: score.deviation,
        targetWeight: state.targetWeight,
        actualWeight: measuredWeight,
        timestamp: Date.now(),
        isPerfect: score.isPerfect
      });
      
      setShowResult(true);
      
      if (isWin) {
        setTimeout(() => {
          setShowResult(false);
          moveToNextPlayer();
          setWeight(0);
          setIsTared(false);
        }, 2000);
      } else {
        incrementAttempts();
        const isLastAttempt = state.attempts + 1 >= state.maxAttempts;
        
        setTimeout(() => {
          setShowResult(false);
          if (isLastAttempt) {
            moveToNextPlayer();
            setWeight(0);
          }
          setIsTared(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Measurement error:', error);
      setIsTared(false);
    }
  };

  return {
    weight,
    showResult,
    roundScore,
    isTared,
    isLoading,
    scaleError,
    handleTare,
    handleMeasure,
    setShowResult
  };
}