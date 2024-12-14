import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface RoundResultProps {
  isWin: boolean;
  weight: number;
  targetWeight: number;
  margin: number;
  attemptsLeft: number;
  score: number;
  isPerfect: boolean;
}

function RoundResult({ 
  isWin, 
  weight, 
  targetWeight, 
  margin, 
  attemptsLeft,
  score,
  isPerfect
}: RoundResultProps) {
  const difference = Math.abs(weight - targetWeight);
  const differenceText = isPerfect
    ? 'Perfect drink!' 
    : `${difference.toFixed(1)}g ${weight > targetWeight ? 'too much' : 'too little'}`;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50`}>
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
      </div>
    </div>
  );
}

export default RoundResult;