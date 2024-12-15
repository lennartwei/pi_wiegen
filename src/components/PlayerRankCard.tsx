import React from 'react';
import { PlayerStats } from '../types';
import PlayerStatsBadge from './PlayerStatsBadge';

interface PlayerRankCardProps {
  player: PlayerStats;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}

function PlayerRankCard({ player, rank, isSelected, onSelect }: PlayerRankCardProps) {
  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}th`;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg transition-colors
        ${isSelected ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getRankEmoji(rank)}</span>
          <div>
            <div className="font-bold">{player.name}</div>
            <div className="text-sm opacity-75">
              {player.games} games played
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">
            {player.totalScore.toLocaleString()} pts
          </div>
          <div className="text-sm opacity-75">
            {player.perfectDrinks} perfect drinks
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <PlayerStatsBadge
          label="Win Rate"
          value={`${player.winRate.toFixed(1)}%`}
        />
        <PlayerStatsBadge
          label="Best Streak"
          value={player.longestWinStreak.toString()}
        />
        <PlayerStatsBadge
          label="Avg Score"
          value={Math.round(player.averageScore).toString()}
        />
      </div>
    </button>
  );
}

export default PlayerRankCard;