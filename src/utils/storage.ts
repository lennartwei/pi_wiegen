import { GameSettings, LeaderboardEntry } from '../types';

const SETTINGS_KEY = 'gameSettings';
const LEADERBOARD_KEY = 'leaderboard';

const DEFAULT_SETTINGS: GameSettings = {
  margin: 5,
  players: [],
  maxRetries: 2
};

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): GameSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  
  const settings = JSON.parse(stored);
  // Ensure all fields exist with defaults
  return {
    ...DEFAULT_SETTINGS,
    ...settings
  };
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function loadLeaderboard(): LeaderboardEntry[] {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function updateLeaderboard(playerName: string, isPerfectDrink: boolean): void {
  const entries = loadLeaderboard();
  const playerEntry = entries.find(entry => entry.name === playerName);
  
  if (playerEntry) {
    playerEntry.games++;
    if (isPerfectDrink) playerEntry.perfectDrinks++;
  } else {
    entries.push({
      name: playerName,
      games: 1,
      perfectDrinks: isPerfectDrink ? 1 : 0,
    });
  }
  
  saveLeaderboard(entries);
}