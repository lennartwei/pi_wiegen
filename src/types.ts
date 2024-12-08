export interface Player {
  name: string;
  score: number;
}

export interface GameSettings {
  margin: number;
  players: string[];
  maxRetries: number;
}

export interface LeaderboardEntry {
  name: string;
  games: number;
  perfectDrinks: number;
}