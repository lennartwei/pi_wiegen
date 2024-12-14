import { useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Player } from '../types';
import { loadSettings } from '../utils/storage';
import { API_BASE_URL } from '../config';

const socket = io(API_BASE_URL);

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

  // Listen for game state updates from server
  useEffect(() => {
    socket.on('gameState', (newState) => {
      setState(prev => ({
        ...prev,
        ...newState
      }));
    });

    return () => {
      socket.off('gameState');
    };
  }, []);

  // Update state when settings change
  useEffect(() => {
    const settings = loadSettings();
    setState(prev => ({
      ...prev,
      margin: settings.margin,
      maxAttempts: settings.maxRetries
    }));
  }, []);

  const updateServerState = useCallback((updates: Partial<GameState>) => {
    socket.emit('updateGameState', updates);
  }, []);

  const rollDice = useCallback(() => {
    const firstDice = Math.floor(Math.random() * 6) + 1;
    const secondDice = Math.floor(Math.random() * 6) + 1;
    
    const [dice1, dice2] = firstDice >= secondDice 
      ? [firstDice, secondDice] 
      : [secondDice, firstDice];
    
    const targetWeight = Number(`${dice1}${dice2}`);
    
    updateServerState({
      dice1,
      dice2,
      targetWeight,
      phase: 'drinking',
      attempts: 0,
    });
  }, [updateServerState]);

  const nextPhase = useCallback(() => {
    updateServerState({
      phase: state.phase === 'drinking' ? 'measuring' : 'rolling',
    });
  }, [state.phase, updateServerState]);

  const moveToNextPlayer = useCallback(() => {
    updateServerState({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      phase: 'rolling',
      dice1: 0,
      dice2: 0,
      attempts: 0,
    });
  }, [state.currentPlayerIndex, state.players.length, updateServerState]);

  const incrementAttempts = useCallback(() => {
    updateServerState({
      attempts: state.attempts + 1,
    });
  }, [state.attempts, updateServerState]);

  const setPlayers = useCallback((players: Player[]) => {
    updateServerState({ players });
  }, [updateServerState]);

  const setMargin = useCallback((margin: number) => {
    updateServerState({ margin });
  }, [updateServerState]);

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