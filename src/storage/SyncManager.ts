import { GameData, SyncResult, StorageError } from './types';
import { LocalStorage } from './LocalStorage';
import { FileStorage } from './FileStorage';

export class SyncManager {
  private syncInProgress = false;
  private lastSyncTime = 0;

  constructor(
    private readonly localStorage: LocalStorage,
    private readonly fileStorage: FileStorage,
    private readonly backupInterval: number = 5000 // 5 seconds default
  ) {}

  async syncToLocal(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        error: 'Sync already in progress',
        timestamp: Date.now()
      };
    }

    try {
      this.syncInProgress = true;
      const fileData = await this.fileStorage.load();
      
      if (fileData) {
        this.localStorage.save(fileData);
        this.lastSyncTime = Date.now();
        return {
          success: true,
          timestamp: this.lastSyncTime
        };
      }
      
      return {
        success: false,
        error: 'No data found in file storage',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during sync',
        timestamp: Date.now()
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncFromLocal(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        error: 'Sync already in progress',
        timestamp: Date.now()
      };
    }

    try {
      this.syncInProgress = true;
      const localData = this.localStorage.load();
      
      if (localData) {
        await this.fileStorage.save(localData);
        this.lastSyncTime = Date.now();
        return {
          success: true,
          timestamp: this.lastSyncTime
        };
      }

      return {
        success: false,
        error: 'No data found in local storage',
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during sync',
        timestamp: Date.now()
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  shouldSync(): boolean {
    return Date.now() - this.lastSyncTime >= this.backupInterval;
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }
}