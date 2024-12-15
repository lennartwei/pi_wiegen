import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { loadSettings, saveSettings } from '../utils/storage';
import type { GameSettings, GameSettingPreset } from '../types';
import SettingPresets from './settings/SettingPresets';
import PresetEditor from './settings/PresetEditor';
import PlayerManager from './settings/PlayerManager';

function Settings() {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [editingPreset, setEditingPreset] = useState<GameSettingPreset | undefined>();
  const [showPresetEditor, setShowPresetEditor] = useState(false);
  const navigate = useNavigate();

  const handlePresetSelect = (presetId: string) => {
    setSettings(prev => ({
      ...prev,
      activePresetId: presetId
    }));
  };

  const handlePresetEdit = (preset: GameSettingPreset) => {
    setEditingPreset(preset);
    setShowPresetEditor(true);
  };

  const handlePresetCreate = () => {
    setEditingPreset(undefined);
    setShowPresetEditor(true);
  };

  const handlePresetSave = (preset: GameSettingPreset) => {
    setSettings(prev => {
      const existingIndex = prev.presets.findIndex(p => p.id === preset.id);
      const newPresets = [...prev.presets];
      
      if (existingIndex >= 0) {
        newPresets[existingIndex] = preset;
      } else {
        newPresets.push(preset);
      }

      return {
        ...prev,
        presets: newPresets
      };
    });
    setShowPresetEditor(false);
  };

  const handlePlayerAdd = (name: string) => {
    if (name.trim()) {
      setSettings(prev => ({
        ...prev,
        players: [...prev.players, name.trim()]
      }));
    }
  };

  const handlePlayerRemove = (index: number) => {
    setSettings(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const saveAndExit = () => {
    saveSettings(settings);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">Settings</h1>
      </div>

      <div className="w-full max-w-4xl space-y-8 p-6 bg-white/10 rounded-lg">
        <SettingPresets
          presets={settings.presets}
          activePresetId={settings.activePresetId}
          onPresetSelect={handlePresetSelect}
          onPresetEdit={handlePresetEdit}
          onPresetCreate={handlePresetCreate}
        />

        <div className="border-t border-white/10 pt-8">
          <PlayerManager
            players={settings.players}
            onPlayerAdd={handlePlayerAdd}
            onPlayerRemove={handlePlayerRemove}
          />
        </div>

        <button
          onClick={saveAndExit}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <SettingsIcon size={20} />
          Save Settings
        </button>
      </div>

      {showPresetEditor && (
        <PresetEditor
          preset={editingPreset}
          onSave={handlePresetSave}
          onClose={() => setShowPresetEditor(false)}
        />
      )}
    </div>
  );
}

export default Settings;