import { useCallback, useEffect, useState } from 'react';
import { StorageManager } from '../storage/StorageManager';
import { GameData } from '../storage/types';

const storageManager = new StorageManager({
  dataFileName: 'game-data.json',
  backupInterval: 5000 // 5 seconds
});

export function useStorage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initStorage = async () => {
      try {
        await storageManager.initialize();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize storage');
      }
    };

    initStorage();

    // Enable auto-sync
    storageManager.enableAutoSync();

    return () => {
      storageManager.disableAutoSync();
    };
  }, []);

  const saveData = useCallback((data: GameData) => {
    try {
      storageManager.saveData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    }
  }, []);

  const getData = useCallback((): GameData | null => {
    try {
      return storageManager.getData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get data');
      return null;
    }
  }, []);

  const syncAfterTurn = useCallback(async () => {
    try {
      const result = await storageManager.syncAfterTurn();
      if (!result.success) {
        setError(result.error || 'Sync failed');
      } else {
        setError(null);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync');
      return {
        success: false,
        error: 'Sync failed',
        timestamp: Date.now()
      };
    }
  }, []);

  return {
    isInitialized,
    error,
    saveData,
    getData,
    syncAfterTurn,
    lastSyncTime: storageManager.getLastSyncTime()
  };
}