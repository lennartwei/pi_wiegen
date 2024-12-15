import React from 'react';
import { Dice1, Scale, CheckCircle2 } from 'lucide-react';

interface GameControlsProps {
  phase: 'rolling' | 'drinking' | 'measuring';
  isLoading: boolean;
  isTared: boolean;
  onRoll: () => void;
  onTare: () => void;
  onMeasure: () => void;
  buttonColors: {
    tare: string;
    measure: string;
  };
}

function GameControls({
  phase,
  isLoading,
  isTared,
  onRoll,
  onTare,
  onMeasure,
  buttonColors
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      {phase === 'rolling' && (
        <button
          onClick={onRoll}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Dice1 size={24} />
          Roll Dice
        </button>
      )}

      {phase === 'drinking' && (
        <>
          <button
            onClick={onTare}
            disabled={isLoading}
            className={`w-full p-4 rounded-lg transition-colors flex items-center justify-center gap-2
              ${isTared ? 'bg-green-600 hover:bg-green-700' : buttonColors.tare}`}
          >
            {isTared ? <CheckCircle2 size={24} /> : <Scale size={24} />}
            {isTared ? 'Scale Tared' : 'Tare Scale'}
          </button>

          <button
            onClick={onMeasure}
            disabled={isLoading || !isTared}
            className={`w-full p-4 rounded-lg transition-colors flex items-center justify-center gap-2
              ${!isTared ? 'bg-gray-600 cursor-not-allowed' : buttonColors.measure}`}
          >
            <Scale size={24} />
            Measure Drink
          </button>
        </>
      )}
    </div>
  );
}

export default GameControls;