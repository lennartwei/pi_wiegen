import React from 'react';
import { Trophy } from 'lucide-react';
import { PlayerStats } from '../types';
import PlayerRankCard from './PlayerRankCard';

interface PlayerRankingsProps {
  stats: PlayerStats[];
  selectedPlayer: string | null;
  onPlayerSelect: (player: string) => void;
}

function PlayerRankings({ stats, selectedPlayer, onPlayerSelect }: PlayerRankingsProps) {
  const sortedStats = [...stats].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="bg-white/10 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-400" />
        Overall Rankings
      </h2>
      <div className="space-y-3">
        {sortedStats.map((player, index) => (
          <PlayerRankCard
            key={player.name}
            player={player}
            rank={index}
            isSelected={selectedPlayer === player.name}
            onSelect={() => onPlayerSelect(player.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default PlayerRankings;