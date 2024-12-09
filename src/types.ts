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
    minScore: number;         // Minimum possible score for a round
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

export interface GameSession {
  id: string;
  hostId: string;
  players: Player[];
  currentPlayerIndex: number;
  dice1: number;
  dice2: number;
  targetWeight: number;
  margin: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  attempts: number;
  maxAttempts: number;
  isActive: boolean;
}

export interface SessionState {
  sessionId: string | null;
  isHost: boolean;
  connected: boolean;
}

export interface WeightDisplayConfig {
  enabled: boolean;
  updateRate: number; // in milliseconds
}