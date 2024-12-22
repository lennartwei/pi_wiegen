import React from 'react';
import AnimatedDice from '../AnimatedDice';

interface DiceDisplayProps {
  dice1?: number;
  dice2?: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  margin?: number;
}

function DiceDisplay({ dice1, dice2, phase, margin }: DiceDisplayProps) {
  if (!dice1 || !dice2) return null;

  const targetWeight = Number(`${dice1}${dice2}`);

  return (
    <div className="text-center transform transition-all duration-500">
      <div className="flex items-center justify-center gap-6">
        <AnimatedDice value={dice1} size={48} />
        <AnimatedDice value={dice2} size={48} />
      </div>
      {phase !== 'rolling' && (
        <div className="mt-4">
          <div className="text-6xl font-bold mb-1">{targetWeight}g</div>
          <div className="text-lg text-white/60">
            Target Weight {margin && `±${margin}g`}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiceDisplay; 