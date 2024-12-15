import React from 'react';
import { Trophy, Target, Crown } from 'lucide-react';
import { CompleteGameHistory } from '../types';
import { formatTime } from '../utils/dateFormat';

interface GameHistoryCardProps {
  game: CompleteGameHistory;
}

function GameHistoryCard({ game }: GameHistoryCardProps) {
  // Sort players by score in descending order
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm opacity-75">
            {formatTime(game.timestamp)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Crown size={16} className="text-yellow-400" />
            <span className="font-bold">{game.winner}</span>
          </div>
        </div>
        {game.totalPerfectDrinks > 0 && (
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Target size={14} />
            {game.totalPerfectDrinks} perfect
          </div>
        )}
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.playerName}
            className={`flex items-center justify-between p-2 rounded ${
              index === 0 ? 'bg-yellow-500/20' : 'bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              {index === 0 && <Trophy size={16} className="text-yellow-400" />}
              <span className="font-medium">{player.playerName}</span>
            </div>
            <div className="flex items-center gap-4">
              {player.perfectDrinks > 0 && (
                <div className="text-sm text-green-400">
                  {player.perfectDrinks} perfect
                </div>
              )}
              <div className="font-bold">
                {player.score.toLocaleString()} pts
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameHistoryCard;