import { useState, useMemo } from 'react';
import { PlayerStats, CompleteGameHistory } from '../types';
import { formatDate } from '../utils/dateFormat';

// Helper function to group games by timestamp (rounded to nearest hour)
function groupGamesByTimestamp(stats: PlayerStats[]): CompleteGameHistory[] {
  const gameMap = new Map<string, CompleteGameHistory>();

  stats.forEach(player => {
    player.lastTenGames.forEach(game => {
      // Round timestamp to nearest hour to group games played together
      const roundedTime = Math.floor(game.timestamp / (3600 * 1000)) * (3600 * 1000);
      const gameId = roundedTime.toString();

      if (!gameMap.has(gameId)) {
        gameMap.set(gameId, {
          id: gameId,
          timestamp: game.timestamp,
          players: [],
          winner: '',
          totalPerfectDrinks: 0
        });
      }

      const currentGame = gameMap.get(gameId)!;
      
      // Add player result if not already added
      if (!currentGame.players.find(p => p.playerName === player.name)) {
        currentGame.players.push({
          playerName: player.name,
          score: game.score,
          perfectDrinks: game.isPerfect ? 1 : 0,
          attempts: 1
        });

        if (game.isPerfect) {
          currentGame.totalPerfectDrinks++;
        }
      }
    });
  });

  // Process games to determine winners
  return Array.from(gameMap.values())
    .map(game => ({
      ...game,
      winner: game.players.reduce((prev, current) => 
        current.score > prev.score ? current : prev
      ).playerName
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function useGameHistory(stats: PlayerStats[]) {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const allGames = useMemo(() => 
    groupGamesByTimestamp(stats)
  , [stats]);

  const uniqueDates = useMemo(() => 
    [...new Set(allGames.map(game => formatDate(game.timestamp)))]
  , [allGames]);

  const filteredGames = useMemo(() => 
    selectedDate
      ? allGames.filter(game => formatDate(game.timestamp) === selectedDate)
      : allGames
  , [allGames, selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    uniqueDates,
    filteredGames
  };
}

export default useGameHistory;