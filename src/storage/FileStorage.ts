import { GameData, StorageError } from './types';
import { API_BASE_URL } from '../config';

export class FileStorage {
  constructor(private readonly filename: string) {}

  async save(data: GameData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/storage/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: this.filename,
          data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new StorageError('Failed to save to file', {
        code: 'WRITE_ERROR',
        details: error
      });
    }
  }

  async load(): Promise<GameData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/storage/load?filename=${this.filename}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new StorageError('Failed to load from file', {
        code: 'READ_ERROR',
        details: error
      });
    }
  }
}