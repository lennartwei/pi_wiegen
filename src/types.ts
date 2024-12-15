export interface Player {
  name: string;
  score: number;
}

export interface GameSettingPreset {
  id: string;
  name: string;
  description: string;
  margin: number;
  maxRetries: number;
  scoring: {
    perfectScore: number;
    marginPenalty: number;
    failurePenalty: number;
    minScore: number;
  };
}

export interface GameSettings {
  activePresetId: string;
  presets: GameSettingPreset[];
  players: string[];
}

export interface GameResult {
  score: number;
  deviation: number;
  targetWeight: number;
  actualWeight: number;
  timestamp: number;
  isPerfect: boolean;
}

export interface PlayerGameResult {
  playerName: string;
  score: number;
  perfectDrinks: number;
  attempts: number;
}

export interface CompleteGameHistory {
  id: string;
  timestamp: number;
  players: PlayerGameResult[];
  winner: string;
  totalPerfectDrinks: number;
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