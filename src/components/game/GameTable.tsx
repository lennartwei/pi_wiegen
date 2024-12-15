import React from 'react';
import { User } from 'lucide-react';
import { Player } from '../../types';
import PlayerSeat from './PlayerSeat';

interface GameTableProps {
  players: Player[];
  currentPlayerIndex: number;
}

function GameTable({ players, currentPlayerIndex }: GameTableProps) {
  // Calculate positions for players around a circular table
  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // Start from top (-90 degrees)
    const radius = 42; // Percentage-based radius
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Sort players by score to determine rankings
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

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Table Surface */}
      <div className="absolute w-[70%] h-[70%] rounded-full bg-gradient-to-br from-amber-900/80 to-amber-800/80 shadow-xl">
        {/* Table Pattern */}
        <div className="absolute inset-4 rounded-full border-4 border-amber-700/30" />
        <div className="absolute inset-8 rounded-full border-2 border-amber-600/20" />
        
        {/* Table Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
      </div>
      
      {/* Table Edge */}
      <div className="absolute w-[75%] h-[75%] rounded-full border-8 border-amber-950/90 -z-10" />
      
      {/* Table Shadow */}
      <div className="absolute w-[78%] h-[78%] rounded-full bg-black/30 blur-xl -z-20" />
      
      {/* Players */}
      {players.map((player, index) => {
        const pos = getPlayerPosition(index, players.length);
        return (
          <div
            key={player.name}
            className="absolute"
            style={{
              left: `${50 + pos.x}%`,
              top: `${50 + pos.y}%`,
            }}
          >
            <PlayerSeat
              player={player}
              isActive={index === currentPlayerIndex}
              rank={playerRankings[player.name]}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GameTable;