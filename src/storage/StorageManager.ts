import { GameData, StorageConfig, SyncResult } from './types';
import { LocalStorage } from './LocalStorage';
import { FileStorage } from './FileStorage';
import { SyncManager } from './SyncManager';

export class StorageManager {
  private localStorage: LocalStorage;
  private fileStorage: FileStorage;
  private syncManager: SyncManager;
  private autoSyncEnabled = false;
  private autoSyncInterval?: NodeJS.Timeout;

  constructor(config: StorageConfig) {
    this.localStorage = new LocalStorage();
    this.fileStorage = new FileStorage(config.dataFileName);
    this.syncManager = new SyncManager(
      this.localStorage,
      this.fileStorage,
      config.backupInterval
    );
  }

  async initialize(): Promise<void> {
    // Initial sync from file to localStorage
    await this.syncManager.syncToLocal();
  }

  getData(): GameData | null {
    return this.localStorage.load();
  }

  saveData(data: GameData): void {
    this.localStorage.save(data);
    
    // Trigger sync if enough time has passed
    if (this.syncManager.shouldSync()) {
      this.syncManager.syncFromLocal().catch(console.error);
    }
  }

  async syncAfterTurn(): Promise<SyncResult> {
    return this.syncManager.syncFromLocal();
  }

  enableAutoSync(interval: number = 30000): void {
    if (this.autoSyncEnabled) return;

    this.autoSyncEnabled = true;
    this.autoSyncInterval = setInterval(() => {
      if (this.syncManager.shouldSync()) {
        this.syncManager.syncFromLocal().catch(console.error);
      }
    }, interval);
  }

  disableAutoSync(): void {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
    }
    this.autoSyncEnabled = false;
  }

  async forceSync(): Promise<SyncResult> {
    return this.syncManager.syncFromLocal();
  }

  getLastSyncTime(): number {
    return this.syncManager.getLastSyncTime();
  }
}