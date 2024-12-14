import { loadSettings, saveSettings, loadPlayerStats, savePlayerStats } from './storage';
import { syncDataToServer, fetchSyncedData } from './api';
import { PlayerStats, GameSettings } from '../types';

export async function initializeDataSync(): Promise<void> {
  try {
    // Fetch data from server
    const syncedData = await fetchSyncedData();
    
    if (syncedData) {
      const localSettings = loadSettings();
      const localStats = loadPlayerStats();
      
      // Merge server data with local data, preferring the most recent updates
      const mergedSettings = mergeSettings(localSettings, syncedData.settings);
      const mergedStats = mergePlayerStats(localStats, syncedData.playerStats);
      
      // Update local storage
      saveSettings(mergedSettings);
      savePlayerStats(mergedStats);
      
      // Sync merged data back to server
      await syncDataToServer(mergedStats, mergedSettings);
    }
  } catch (error) {
    console.error('Data sync initialization error:', error);
  }
}

export async function syncPlayerUpdate(playerName: string): Promise<void> {
  try {
    const settings = loadSettings();
    const stats = loadPlayerStats();
    await syncDataToServer(stats, settings);
  } catch (error) {
    console.error('Player update sync error:', error);
  }
}

function mergeSettings(local: GameSettings, server: GameSettings): GameSettings {
  // Prefer local settings but merge any new fields from server
  return {
    ...server,
    ...local,
    scoring: {
      ...server.scoring,
      ...local.scoring,
    }
  };
}

function mergePlayerStats(local: PlayerStats[], server: PlayerStats[]): PlayerStats[] {
  const merged = new Map<string, PlayerStats>();
  
  // Add all server stats to map
  server.forEach(stat => merged.set(stat.name, stat));
  
  // Merge or override with local stats based on most recent games
  local.forEach(stat => {
    const existing = merged.get(stat.name);
    if (!existing) {
      merged.set(stat.name, stat);
    } else {
      // Compare last game timestamps to determine which data is more recent
      const localLastGame = stat.lastTenGames[0]?.timestamp || 0;
      const serverLastGame = existing.lastTenGames[0]?.timestamp || 0;
      
      if (localLastGame >= serverLastGame) {
        merged.set(stat.name, stat);
      }
    }
  });
  
  return Array.from(merged.values());
}