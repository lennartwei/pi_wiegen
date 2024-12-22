import { useState, useCallback, useEffect } from 'react';
import { Player, DuelState } from '../types';
import { loadSettings, getActivePreset } from '../utils/storage';

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
  duel: DuelState | null;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const settings = loadSettings();
    const activePreset = getActivePreset(settings);
    return {
      players: [],
      currentPlayerIndex: 0,
      dice1: 0,
      dice2: 0,
      targetWeight: 0,
      margin: activePreset.margin,
      phase: 'rolling',
      attempts: 0,
      maxAttempts: activePreset.maxRetries,
      duel: null,
    };
  });

  useEffect(() => {
    const settings = loadSettings();
    const activePreset = getActivePreset(settings);
    setState(prev => ({
      ...prev,
      margin: activePreset.margin,
      maxAttempts: activePreset.maxRetries
    }));
  }, []);

  const updatePlayerScore = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map((player, index) => 
        index === prev.currentPlayerIndex
          ? { ...player, score: player.score + score }
          : player
      )
    }));
  }, []);

  const rollDice = useCallback(() => {
    // const firstDice = Math.floor(Math.random() * 6) + 1;
    // const secondDice = Math.floor(Math.random() * 6) + 1;
    const firstDice = 2;
    const secondDice = 3;
    const dice1 = firstDice >= secondDice ? firstDice : secondDice;
    const dice2 = firstDice >= secondDice ? secondDice : firstDice;
    
    const targetWeight = Number(`${dice1}${dice2}`);
    
    setState(prev => {
      // Check for doubles and initiate duel
      const isDuel = dice1 === dice2;
      if (isDuel && prev.players.length > 1) {
        const availableOpponents = prev.players
          .filter((_, i) => i !== prev.currentPlayerIndex);
        
        if (availableOpponents.length > 0) {
          const opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
          return {
            ...prev,
            dice1,
            dice2,
            targetWeight,
            phase: 'drinking',
            attempts: 0,
            maxAttempts: 1, // Force 1 attempt for duels
            duel: {
              isActive: true,
              challenger: prev.players[prev.currentPlayerIndex].name,
              opponent: opponent.name,
              challengerWeight: null,
              opponentWeight: null,
              currentTurn: 'challenger'
            }
          };
        }
      }

      return {
        ...prev,
        dice1,
        dice2,
        targetWeight,
        phase: 'drinking',
        attempts: 0
      };
    });
  }, [state.players, state.currentPlayerIndex]);

  const nextPhase = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: prev.phase === 'drinking' ? 'measuring' : 'rolling',
    }));
  }, []);

  const moveToNextPlayer = useCallback(() => {
    setState(prev => {
      // Handle duel mode transitions
      if (prev.duel?.isActive && prev.duel.currentTurn === 'challenger') {
        // Move from challenger to opponent
        const opponentIndex = prev.players.findIndex(p => p.name === prev.duel?.opponent);
        return {
          ...prev,
          currentPlayerIndex: opponentIndex,
          duel: {
            ...prev.duel,
            currentTurn: 'opponent'
          }
        };
      }
      
      // End duel and continue with next player after challenger
      if (prev.duel?.isActive && prev.duel.currentTurn === 'opponent') {
        // Find the index of the challenger
        const challengerIndex = prev.players.findIndex(p => p.name === prev.duel?.challenger);
        // Get the next player after the challenger
        const nextPlayerIndex = (challengerIndex + 1) % prev.players.length;
        
        return {
          ...prev,
          currentPlayerIndex: nextPlayerIndex,
          phase: 'rolling',
          dice1: 0,
          dice2: 0,
          attempts: 0,
          duel: null,
        };
      }
      
      // Normal game mode transition
      return {
        ...prev,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
        phase: 'rolling',
        dice1: 0,
        dice2: 0,
        attempts: 0,
        duel: null
      };
    });
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

  const updateDuelWeight = useCallback((weight: number) => {
    setState(prev => {
      if (!prev.duel) return prev;
      const isChallenger = prev.duel.currentTurn === 'challenger';
      const updatedDuel = {
        ...prev.duel,
        challengerWeight: isChallenger ? weight : prev.duel.challengerWeight,
        opponentWeight: !isChallenger ? weight : prev.duel.opponentWeight
      };

      return { ...prev, duel: updatedDuel };
    });
  }, []);

  return {
    state,
    rollDice,
    nextPhase,
    moveToNextPlayer,
    setPlayers,
    setMargin,
    incrementAttempts,
    updatePlayerScore,
    updateDuelWeight,
  };
}