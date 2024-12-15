import React from 'react';
import { PlayerStats } from '../types';
import GameHistoryFilter from './GameHistoryFilter';
import GameHistoryList from './GameHistoryList';
import { useGameHistory } from '../hooks/useGameHistory';

interface GameHistoryProps {
  stats: PlayerStats[];
}

function GameHistory({ stats }: GameHistoryProps) {
  const {
    selectedDate,
    setSelectedDate,
    uniqueDates,
    filteredGames
  } = useGameHistory(stats);

  return (
    <div className="space-y-6">
      <GameHistoryFilter
        selectedDate={selectedDate}
        dates={uniqueDates}
        onDateChange={setSelectedDate}
      />
      <GameHistoryList games={filteredGames} />
    </div>
  );
}

export default GameHistory;