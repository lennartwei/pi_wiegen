import React from 'react';
import { CompleteGameHistory } from '../types';
import GameHistoryCard from './GameHistoryCard';

interface GameHistoryListProps {
  games: CompleteGameHistory[];
}

function GameHistoryList({ games }: GameHistoryListProps) {
  if (games.length === 0) {
    return (
      <div className="bg-white/10 p-6 rounded-lg text-center">
        <p className="text-white/60">No games played yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameHistoryCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default GameHistoryList;