import { API_BASE_URL } from '../config';
import { PlayerStats, GameSettings } from '../types';

export async function syncDataToServer(
  playerStats: PlayerStats[],
  settings: GameSettings
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerStats,
        settings,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to sync data');
    return true;
  } catch (error) {
    console.error('Sync error:', error);
    return false;
  }
}

export async function fetchSyncedData(): Promise<{
  playerStats: PlayerStats[];
  settings: GameSettings;
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync`);
    if (!response.ok) throw new Error('Failed to fetch synced data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Fetch sync error - using local data:', error);
    return null;
  }
}