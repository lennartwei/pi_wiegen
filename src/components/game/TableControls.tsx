import React from 'react';
import { Dice1 } from 'lucide-react';

interface TableControlsProps {
  onRoll?: () => void;
  isRolling?: boolean;
}

function TableControls({ onRoll, isRolling }: TableControlsProps) {
  return (
    <div className="text-center transform scale-100 transition-all duration-300">
      <button
        onClick={onRoll}
        disabled={isRolling}
        className={`
          relative group
          w-32 h-32 rounded-full
          bg-gradient-to-br from-green-500 to-green-600
          hover:from-green-400 hover:to-green-500
          disabled:from-gray-500 disabled:to-gray-600
          shadow-lg transition-all duration-300
          ${isRolling ? 'animate-spin' : 'hover:scale-105'}
        `}
      >
        <div className="absolute inset-1 rounded-full bg-green-500 group-hover:bg-green-400 transition-colors">
          <div className="absolute inset-0 flex items-center justify-center">
            <Dice1 
              size={48} 
              className={`text-white transform transition-all duration-300
                ${isRolling ? 'rotate-180 scale-90' : 'group-hover:scale-110'}`}
            />
          </div>
        </div>
      </button>
      <div className="mt-4 text-xl font-bold text-white/90">
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </div>
    </div>
  );
}

export default TableControls;