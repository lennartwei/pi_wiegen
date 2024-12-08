import { useState, useCallback, useEffect } from 'react';
import { Player } from '../types';
import { loadSettings } from '../utils/storage';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice1: number;
  dice2: number;
  targetWeight: number;
  margin: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  attempts: number;
  maxAttempts: number;
}

export function useGameState(initialMargin: number = 5) {
  const [state, setState] = useState<GameState>(() => {
    const settings = loadSettings();
    return {
      players: [],
      currentPlayerIndex: 0,
      dice1: 0,
      dice2: 0,
      targetWeight: 0,
      margin: settings.margin,
      phase: 'rolling',
      attempts: 0,
      maxAttempts: settings.maxRetries,
    };
  });

  // Update state when settings change
  useEffect(() => {
    const settings = loadSettings();
    setState(prev => ({
      ...prev,
      margin: settings.margin,
      maxAttempts: settings.maxRetries
    }));
  }, []);

  const rollDice = useCallback(() => {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    
    // Determine which dice should be first (higher number)
    const [dice1, dice2] = firstDice >= secondDice 
      ? [firstDice, secondDice] 
      : [secondDice, firstDice];
    
    const targetWeight = Number(`${dice1}${dice2}`);
    
    setState(prev => ({
      ...prev,
      dice1,
      dice2,
      targetWeight,
      phase: 'drinking',
      attempts: 0, // Reset attempts when rolling new dice
    }));
  }, []);

  const nextPhase = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: prev.phase === 'drinking' ? 'measuring' : 'rolling',
    }));
  }, []);

  const moveToNextPlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      phase: 'rolling',
      dice1: 0,
      dice2: 0,
      attempts: 0,
    }));
  }, []);

  const incrementAttempts = useCallback(() => {
    setState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
    }));
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    setState(prev => ({ ...prev, players }));
  }, []);

  const setMargin = useCallback((margin: number) => {
    setState(prev => ({ ...prev, margin }));
  }, []);

  return {
    state,
    rollDice,
    nextPhase,
    moveToNextPlayer,
    setPlayers,
    setMargin,
    incrementAttempts,
  };
}