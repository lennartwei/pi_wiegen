import React from 'react';
import { User, Trophy, Medal, Crown } from 'lucide-react';
import { Player } from '../../types';

interface PlayerSeatProps {
  player: Player;
  isActive: boolean;
  rank: number;
  position: 'left' | 'right';
}

function PlayerSeat({ player, isActive, rank, position }: PlayerSeatProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={16} />;
      case 2:
      case 3: return <Medal size={16} />;
      default: return null;
    }
  };

  return (
    <div className={`
      flex items-center gap-4
      ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}
      ${isActive ? 'scale-110' : 'scale-100'}
      transition-all duration-300
    `}>
      {/* Avatar Container */}
      <div className="relative">
        {/* Rank Badge */}
        {rank <= 3 && (
          <div className={`absolute -top-1 ${position === 'right' ? '-left-1' : '-right-1'} w-6 h-6 rounded-full 
            flex items-center justify-center z-10
            ${getRankColor(rank)} bg-gray-900/90 shadow-lg`}
          >
            {getRankIcon(rank)}
          </div>
        )}
        
        {/* Avatar Circle */}
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${isActive 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 ring-4 ring-blue-400/50' 
            : 'bg-gradient-to-br from-gray-700 to-gray-800'}
          shadow-lg transition-all duration-300
        `}>
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center
            ${isActive ? 'bg-blue-400' : 'bg-gray-600'}
            transition-all duration-300
          `}>
            <User size={28} className="text-white" />
          </div>
        </div>
      </div>
      
      {/* Name and Score Stack */}
      <div className={`flex flex-col gap-1 ${position === 'right' ? 'items-end' : 'items-start'}`}>
        {/* Name Tag */}
        <div className={`
          px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap
          ${isActive 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
            : 'bg-gray-800 text-gray-300'}
          transition-all duration-300
        `}>
          {player.name}
        </div>

        {/* Game Score */}
        <div className={`
          px-3 py-0.5 rounded-full text-sm font-bold
          ${isActive 
            ? 'bg-yellow-500 text-yellow-950' 
            : 'bg-yellow-500/20 text-yellow-200'}
          transition-all duration-300
        `}>
          {player.score} pts
        </div>

        {/* Current Rank */}
        {rank > 3 && (
          <div className="text-xs text-gray-400">
            #{rank}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerSeat;