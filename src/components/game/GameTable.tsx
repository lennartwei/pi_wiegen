import React from 'react';
import { User } from 'lucide-react';
import { Player } from '../../types';
import PlayerSeat from './PlayerSeat';
import DiceDisplay from './DiceDisplay';
import TableControls from './TableControls';

interface GameTableProps {
  players: Player[];
  currentPlayerIndex: number;
  dice1?: number;
  dice2?: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  onRoll?: () => void;
  isRolling?: boolean;
}

function GameTable({ 
  players, 
  currentPlayerIndex, 
  dice1, 
  dice2, 
  phase,
  onRoll,
  isRolling 
}: GameTableProps) {
  const getTableSize = (playerCount: number) => {
    if (playerCount <= 6) return { width: 60, height: 70 };
    if (playerCount <= 8) return { width: 55, height: 65 };
    if (playerCount <= 12) return { width: 50, height: 60 };
    return { width: 45, height: 55 }; // For very large groups
  };

  const getPlayerPosition = (index: number, total: number) => {
    // Adjust spacing for larger groups
    const angleOffset = total > 12 ? -60 : -90; // Start from top for larger groups
    const angle = (index * (total > 12 ? 300 : 360) / total) + angleOffset;
    const isLeftSide = angle > 90 && angle < 270;
    
    // Adjust radius based on player count
    let radiusX = total <= 6 ? 46 : total <= 8 ? 52 : total <= 12 ? 58 : 64;
    let radiusY = total <= 6 ? 42 : total <= 8 ? 48 : total <= 12 ? 54 : 60;

    const x = Math.cos((angle * Math.PI) / 180) * radiusX;
    const y = Math.sin((angle * Math.PI) / 180) * radiusY;
    
    return { x, y, position: isLeftSide ? 'left' : 'right' };
  };

  const playerRankings = [...players]
    .sort((a, b) => b.score - a.score)
    .reduce((acc, player, index) => {
      acc[player.name] = index + 1;
      return acc;
    }, {} as Record<string, number>);

  if (players.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center opacity-50">
          <User size={48} className="mx-auto mb-2" />
          <p>No players added</p>
        </div>
      </div>
    );
  }

  const tableSize = getTableSize(players.length);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Table Surface */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-amber-900/80 to-amber-800/80 shadow-xl"
        style={{
          width: `${tableSize.width}%`,
          height: `${tableSize.height}%`
        }}
      >
        {/* Table Pattern */}
        <div className="absolute inset-4 rounded-full border-4 border-amber-700/30" />
        <div className="absolute inset-8 rounded-full border-2 border-amber-600/20" />
        
        {/* Table Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {phase === 'rolling' ? (
            <TableControls onRoll={onRoll} isRolling={isRolling} />
          ) : (
            <DiceDisplay
              dice1={dice1}
              dice2={dice2}
              phase={phase}
            />
          )}
        </div>
      </div>
      
      {/* Table Edge */}
      <div 
        className="absolute rounded-full border-8 border-amber-950/90 -z-10"
        style={{
          width: `${tableSize.width + 2}%`,
          height: `${tableSize.height + 2}%`
        }}
      />
      
      {/* Table Shadow */}
      <div 
        className="absolute rounded-full bg-black/30 blur-xl -z-20"
        style={{
          width: `${tableSize.width + 4}%`,
          height: `${tableSize.height + 4}%`
        }}
      />
      
      {/* Players */}
      {players.map((player, index) => {
        const pos = getPlayerPosition(index, players.length);
        
        return (
          <div
            key={player.name}
            className="absolute transition-all duration-500"
            style={{
              left: `${50 + pos.x}%`,
              top: `${50 + pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <PlayerSeat
              player={player}
              isActive={index === currentPlayerIndex}
              rank={playerRankings[player.name]}
              position={pos.position}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GameTable;