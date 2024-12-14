export interface Player {
  name: string;
  score: number;
}

export interface GameSettings {
  margin: number;
  players: string[];
  maxRetries: number;
  scoring: {
    perfectScore: number;     // Points for perfect match (0 deviation)
    marginPenalty: number;    // Points deducted per gram within margin
    failurePenalty: number;   // Points deducted per gram outside margin
    minScore: number;         // Minimum score possible for a round
  };
}

export interface GameResult {
  score: number;
  deviation: number;
  targetWeight: number;
  actualWeight: number;
  timestamp: number;
  isPerfect: boolean;
}

export interface PlayerStats {
  name: string;
  games: number;
  perfectDrinks: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  averageDeviation: number;
  lastTenGames: GameResult[];
  winRate: number;
  longestWinStreak: number;
  currentWinStreak: number;
}

export interface RoundScore {
  score: number;
  isPerfect: boolean;
  deviation: number;
}