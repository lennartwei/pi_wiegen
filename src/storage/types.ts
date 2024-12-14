// Storage Types
export interface GameData {
    settings: GameSettings;
    playerStats: PlayerStats[];
  }
  
  export interface StorageConfig {
    dataFileName: string;
    backupInterval?: number; // milliseconds
  }
  
  export interface SyncResult {
    success: boolean;
    error?: string;
    timestamp: number;
  }
  
  export interface StorageErrorOptions {
    code: 'SYNC_ERROR' | 'READ_ERROR' | 'WRITE_ERROR';
    details?: unknown;
  }
  
  export class StorageError extends Error {
    readonly code: StorageErrorOptions['code'];
    readonly details?: unknown;
  
    constructor(message: string, options: StorageErrorOptions) {
      super(message);
      this.name = 'StorageError';
      this.code = options.code;
      this.details = options.details;
      
      // Ensure proper prototype chain for instanceof checks
      Object.setPrototypeOf(this, StorageError.prototype);
    }
  }