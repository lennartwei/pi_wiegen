import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DuelState } from '../../types';

interface GameStatusProps {
  currentPlayer: string;
  duel: DuelState | null;
  attempts: number;
  maxAttempts: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  targetWeight?: number;
  margin?: number;
}

function GameStatus({
  currentPlayer,
  duel,
  attempts,
  maxAttempts,
  phase,
  targetWeight,
  margin
}: GameStatusProps) {
  return (
    <div className="bg-white/10 p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {duel ? (
            <span className="flex items-center gap-2">
              <span className={duel.currentTurn === 'challenger' ? 'text-red-400' : ''}>
                {duel.challenger}
              </span>
              <span className="text-sm opacity-75">vs</span>
              <span className={duel.currentTurn === 'opponent' ? 'text-red-400' : ''}>
                {duel.opponent}
              </span>
            </span>
          ) : (
            `${currentPlayer}'s Turn`
          )}
        </h2>
        {phase === 'drinking' && (
          <div className="text-sm opacity-75">
            Attempt {attempts + 1}/{maxAttempts}
          </div>
        )}
      </div>

      {phase === 'drinking' && targetWeight && margin && (
        <div className="text-center text-lg">
          Target: {targetWeight}g ±{margin}g
        </div>
      )}

      {attempts > 0 && (
        <div className="flex items-center justify-center gap-2 text-yellow-300">
          <AlertTriangle size={16} />
          {maxAttempts - attempts} {maxAttempts - attempts === 1 ? 'try' : 'tries'} remaining
        </div>
      )}
    </div>
  );
}

export default GameStatus;