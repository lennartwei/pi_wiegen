import { GameSettings, PlayerStats } from '../types';
import { DEFAULT_PRESETS } from './defaultSettings';

const SETTINGS_KEY = 'gameSettings';
const PLAYER_STATS_KEY = 'playerStats';

const DEFAULT_SETTINGS: GameSettings = {
  activePresetId: 'standard',
  presets: DEFAULT_PRESETS,
  players: [],
  simulationMode: false
};

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    
    const settings = JSON.parse(stored);
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      presets: [...DEFAULT_PRESETS, ...(settings.presets || []).filter(
        (preset: any) => !DEFAULT_PRESETS.find(dp => dp.id === preset.id)
      )]
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function getActivePreset(settings: GameSettings) {
  return settings.presets.find(p => p.id === settings.activePresetId) || DEFAULT_PRESETS[0];
}

export function savePlayerStats(stats: PlayerStats[]): void {
  localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats));
}

export function loadPlayerStats(): PlayerStats[] {
  try {
    const stored = localStorage.getItem(PLAYER_STATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading player stats:', error);
    return [];
  }
}