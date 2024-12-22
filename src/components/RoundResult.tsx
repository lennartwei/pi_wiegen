import React from 'react';
import { Check, AlertCircle, Swords } from 'lucide-react';

interface RoundResultProps {
  isWin: boolean;
  weight: number;
  targetWeight: number;
  margin: number;
  attemptsLeft: number;
  score: number;
  isPerfect: boolean;
  isDuel?: boolean;
  isFirstDuelPlayer?: boolean;
  nextPlayerName?: string;
  duelState?: {
    challengerWeight: number | null;
    opponentWeight: number | null;
    challenger: string;
    opponent: string;
  };
}

function RoundResult({ 
  isWin, 
  weight, 
  targetWeight, 
  margin, 
  attemptsLeft,
  score,
  isPerfect,
  isDuel,
  isFirstDuelPlayer,
  nextPlayerName,
  duelState
}: RoundResultProps) {
  const difference = Math.abs(weight - targetWeight);
  const differenceText = isPerfect
    ? 'Perfect drink!' 
    : `${difference.toFixed(1)}g ${weight > targetWeight ? 'too much' : 'too little'}`;

  // First duelist result
  if (isDuel && isFirstDuelPlayer) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-blue-900/90 p-8 rounded-lg text-center transform animate-bounce">
          <h2 className="text-2xl font-bold mb-4">First Round Complete!</h2>
          <div className="text-xl font-bold text-yellow-400">
            Get ready {nextPlayerName}...
          </div>
          <p className="text-sm mt-4 opacity-75">Press spacebar to continue</p>
        </div>
      </div>
    );
  }

  // Final duel result
  if (isDuel && !isFirstDuelPlayer && duelState) {
    const challengerWeight = duelState.challengerWeight || 0;
    const opponentWeight = duelState.opponentWeight || 0;
    const challengerAbsDelta = Math.abs(challengerWeight - targetWeight);
    const opponentAbsDelta = Math.abs(opponentWeight - targetWeight);
    const challengerWins = challengerAbsDelta <= opponentAbsDelta;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-purple-900/90 p-8 rounded-lg text-center">
          <Swords size={48} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-4">
            {challengerWins ? `${duelState.challenger} wins!` : `${duelState.opponent} wins!`}
          </h2>
          <div className="space-y-2 mb-4">
            <p className="text-lg">
              {duelState.challenger}: {challengerWeight.toFixed(1)}g 
              <span className="opacity-75 ml-2">
                ({challengerAbsDelta.toFixed(1)}g off target)
              </span>
            </p>
            <p className="text-lg">
              {duelState.opponent}: {opponentWeight.toFixed(1)}g 
              <span className="opacity-75 ml-2">
                ({opponentAbsDelta.toFixed(1)}g off target)
              </span>
            </p>
          </div>
          <p className="text-sm mt-4 opacity-75">Press spacebar to continue</p>
          <p className={`text-xl font-bold ${score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Score: {score > 0 ? '+' : ''}{score}
          </p>
        </div>
      </div>
    );
  }

  // Normal game result
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`
        transform scale-100 transition-transform duration-300
        ${isWin ? 'bg-green-900/90' : 'bg-red-900/90'}
        p-8 rounded-lg text-center animate-bounce
      `}>
        {isWin ? (
          <Check size={64} className="mx-auto mb-4 text-green-400" />
        ) : (
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
        )}
        <h2 className="text-2xl font-bold mb-2">
          {isWin ? 'Success!' : attemptsLeft > 0 ? 'Try Again!' : 'Next Player!'}
        </h2>
        <p className="text-lg mb-1">Weight: {weight.toFixed(1)}g</p>
        <p className="opacity-80">{differenceText}</p>
        <p className={`text-lg mt-2 ${score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Score: {score > 0 ? '+' : ''}{score}
        </p>
        {!isWin && attemptsLeft > 0 && (
          <p className="text-sm mt-2 opacity-75">
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
          </p>
        )}
        <p className="text-sm mt-4 opacity-75">Press spacebar to continue</p>
      </div>
    </div>
  );
}

export default RoundResult;