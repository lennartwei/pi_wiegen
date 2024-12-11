export interface Session {
  id: string;
  name: string;
  owner: string;
  created_at: number;
  settings: GameSettings;
  game_state: GameState;
  last_updated: number;
}

export interface GameSettings {
  margin: number;
  maxRetries: number;
  players: Player[];
  scoring: {
    perfectScore: number;
    marginPenalty: number;
    failurePenalty: number;
    minScore: number;
  };
}

export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  currentPlayerIndex: number;
  dice1: number;
  dice2: number;
  targetWeight: number;
  phase: 'setup' | 'rolling' | 'drinking' | 'measuring';
  attempts: number;
}

export interface SessionContextType {
  session: Session | null;
  isOwner: boolean;
  updateSession: (settings?: GameSettings, gameState?: GameState) => Promise<void>;
  setSession: (session: Session | null) => void;
}export interface Session {
  id: string;
  name: string;
  owner: string;
  created_at: number;
  settings: GameSettings;
  game_state: GameState;
  last_updated: number;
}

export interface GameSettings {
  margin: number;
  maxRetries: number;
  players: Player[];
  scoring: {
    perfectScore: number;
    marginPenalty: number;
    failurePenalty: number;
    minScore: number;
  };
}

export interface Player {
  name: string;
  score: number;
}

export interface GameState {
  currentPlayerIndex: number;
  dice1: number;
  dice2: number;
  targetWeight: number;
  phase: 'setup' | 'rolling' | 'drinking' | 'measuring';
  attempts: number;
}

export interface SessionContextType {
  session: Session | null;
  isOwner: boolean;
  updateSession: (settings?: GameSettings, gameState?: GameState) => Promise<void>;
  setSession: (session: Session | null) => void;
}