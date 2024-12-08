import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { loadSettings, saveSettings } from '../utils/storage';
import type { GameSettings } from '../types';

function Settings() {
  const [settings, setSettings] = useState<GameSettings>({
    margin: 5,
    maxRetries: 2,
    players: []
  });
  const [newPlayer, setNewPlayer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadSettings();
    setSettings(savedSettings);
  }, []);

  const addPlayer = () => {
    if (newPlayer.trim()) {
      setSettings(prev => ({
        ...prev,
        players: [...prev.players, newPlayer.trim()]
      }));
      setNewPlayer('');
    }
  };

  const removePlayer = (index: number) => {
    setSettings(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const handleSettingChange = (key: keyof GameSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
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

      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md space-y-6">
        <div>
          <label className="block mb-2">Weight Margin (±g)</label>
          <input
            type="number"
            value={settings.margin}
            onChange={(e) => handleSettingChange('margin', Number(e.target.value))}
            min={1}
            max={20}
            className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
          />
        </div>

        <div>
          <label className="block mb-2">Maximum Retries</label>
          <input
            type="number"
            value={settings.maxRetries}
            onChange={(e) => handleSettingChange('maxRetries', Number(e.target.value))}
            min={1}
            max={5}
            className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
          />
          <p className="text-sm opacity-75 mt-1">
            Number of attempts allowed before moving to next player
          </p>
        </div>

        <div>
          <label className="block mb-2">Players</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              className="flex-1 bg-white/20 p-2 rounded border border-white/30 text-white"
              placeholder="Enter player name"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button
              onClick={addPlayer}
              className="bg-green-600 hover:bg-green-700 px-4 rounded transition-colors"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {settings.players.map((player, index) => (
              <li key={index} className="flex justify-between items-center bg-white/20 p-2 rounded">
                {player}
                <button
                  onClick={() => removePlayer(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={saveAndExit}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <SettingsIcon size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default Settings;