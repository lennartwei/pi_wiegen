import { PlayerStats, GameResult } from '../types';
import { savePlayerStats, loadPlayerStats } from './storage';

export async function updatePlayerStats(
  playerName: string,
  gameResult: GameResult
): Promise<void> {
  const allStats = loadPlayerStats();
  const playerStats = allStats.find(stats => stats.name === playerName);
  
  if (playerStats) {
    // Update existing player stats
    playerStats.games++;
    playerStats.totalScore += gameResult.score;
    playerStats.averageScore = playerStats.totalScore / playerStats.games;
    
    if (gameResult.isPerfect) {
      playerStats.perfectDrinks++;
    }
    
    // Update best and worst scores
    playerStats.bestScore = Math.max(playerStats.bestScore, gameResult.score);
    playerStats.worstScore = Math.min(playerStats.worstScore, gameResult.score);
    
    // Update average deviation
    const totalDeviation = playerStats.averageDeviation * (playerStats.games - 1) + gameResult.deviation;
    playerStats.averageDeviation = totalDeviation / playerStats.games;
    
    // Update win streaks
    if (gameResult.score > 0) {
      playerStats.currentWinStreak++;
      playerStats.longestWinStreak = Math.max(playerStats.longestWinStreak, playerStats.currentWinStreak);
    } else {
      playerStats.currentWinStreak = 0;
    }
    
    // Update win rate
    const wins = playerStats.lastTenGames.filter(game => game.score > 0).length;
    playerStats.winRate = (wins / playerStats.games) * 100;
    
    // Update last ten games
    playerStats.lastTenGames.unshift(gameResult);
    if (playerStats.lastTenGames.length > 10) {
      playerStats.lastTenGames.pop();
    }
  } else {
    // Create new player stats
    allStats.push({
      name: playerName,
      games: 1,
      perfectDrinks: gameResult.isPerfect ? 1 : 0,
      totalScore: gameResult.score,
      averageScore: gameResult.score,
      bestScore: gameResult.score,
      worstScore: gameResult.score,
      averageDeviation: gameResult.deviation,
      lastTenGames: [gameResult],
      winRate: gameResult.score > 0 ? 100 : 0,
      longestWinStreak: gameResult.score > 0 ? 1 : 0,
      currentWinStreak: gameResult.score > 0 ? 1 : 0
    });
  }
  
  savePlayerStats(allStats);
}