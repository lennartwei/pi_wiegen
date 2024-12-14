import { GameData, StorageError } from './types';

export class LocalStorage {
  private readonly STORAGE_KEY = 'drinkAndRoll';

  save(data: GameData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      throw new StorageError('Failed to save to localStorage', {
        code: 'WRITE_ERROR',
        details: error
      });
    }
  }

  load(): GameData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new StorageError('Failed to load from localStorage', {
        code: 'READ_ERROR',
        details: error
      });
    }
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}