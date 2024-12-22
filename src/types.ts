export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice1: number;
  dice2: number;
  targetWeight: number;
  margin: number;
  phase: 'rolling' | 'drinking' | 'measuring';
  attempts: number;
  maxAttempts: number;
  duel: DuelState | null;
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

export interface DuelState {
  isActive: boolean;
  challenger: string;
  opponent: string;
  challengerWeight: number | null;
  opponentWeight: number | null;
  currentTurn: 'challenger' | 'opponent';
}

export interface GameSettings {
  activePresetId: string;
  presets: GameSettingPreset[];
  players: string[];
  simulationMode: boolean;
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