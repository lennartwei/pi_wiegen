import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { loadSettings, saveSettings } from '../utils/storage';
import type { GameSettings } from '../types';
import { NavigationItem } from './NavigationItem';
import { useNavigationSetup } from '../hooks/useNavigation';

function Settings() {
  const [settings, setSettings] = useState<GameSettings>({
    margin: 5,
    maxRetries: 2,
    players: [],
    scoring: {
      perfectScore: 1000,
      marginPenalty: 100,
      failurePenalty: 200,
      minScore: -500
    }
  });
  const [newPlayer, setNewPlayer] = useState('');
  const navigate = useNavigate();
  const playerCount = settings.players.length;
  const totalItems = playerCount + 8; // Settings inputs + Add Player + Save button
  useNavigationSetup(totalItems);

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

  const handleScoringChange = (key: keyof GameSettings['scoring'], value: number) => {
    setSettings(prev => ({
      ...prev,
      scoring: {
        ...prev.scoring,
        [key]: value
      }
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
          <NavigationItem index={0}>
            <input
              type="number"
              value={settings.margin}
              onChange={(e) => handleSettingChange('margin', Number(e.target.value))}
              min={1}
              max={20}
              className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
            />
          </NavigationItem>
        </div>

        <div>
          <label className="block mb-2">Maximum Retries</label>
          <NavigationItem index={1}>
            <input
              type="number"
              value={settings.maxRetries}
              onChange={(e) => handleSettingChange('maxRetries', Number(e.target.value))}
              min={1}
              max={5}
              className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
            />
          </NavigationItem>
          <p className="text-sm opacity-75 mt-1">
            Number of attempts allowed before moving to next player
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-lg font-semibold mb-4">Scoring Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Perfect Score</label>
              <NavigationItem index={2}>
                <input
                  type="number"
                  value={settings.scoring.perfectScore}
                  onChange={(e) => handleScoringChange('perfectScore', Number(e.target.value))}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
                />
              </NavigationItem>
              <p className="text-sm opacity-75 mt-1">Points awarded for perfect match</p>
            </div>

            <div>
              <label className="block mb-2">Margin Penalty</label>
              <NavigationItem index={3}>
                <input
                  type="number"
                  value={settings.scoring.marginPenalty}
                  onChange={(e) => handleScoringChange('marginPenalty', Number(e.target.value))}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
                />
              </NavigationItem>
              <p className="text-sm opacity-75 mt-1">Points deducted per gram within margin</p>
            </div>

            <div>
              <label className="block mb-2">Failure Penalty</label>
              <NavigationItem index={4}>
                <input
                  type="number"
                  value={settings.scoring.failurePenalty}
                  onChange={(e) => handleScoringChange('failurePenalty', Number(e.target.value))}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
                />
              </NavigationItem>
              <p className="text-sm opacity-75 mt-1">Points deducted per gram outside margin</p>
            </div>

            <div>
              <label className="block mb-2">Minimum Score</label>
              <NavigationItem index={5}>
                <input
                  type="number"
                  value={settings.scoring.minScore}
                  onChange={(e) => handleScoringChange('minScore', Number(e.target.value))}
                  min={-1000}
                  max={0}
                  step={100}
                  className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
                />
              </NavigationItem>
              <p className="text-sm opacity-75 mt-1">Minimum possible score for a round</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2">Players</label>
          <div className="flex gap-2 mb-2">
            <NavigationItem index={6}>
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                className="flex-1 bg-white/20 p-2 rounded border border-white/30 text-white"
                placeholder="Enter player name"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
            </NavigationItem>
            <NavigationItem index={7}>
              <button
                onClick={addPlayer}
                className="bg-green-600 hover:bg-green-700 px-4 rounded transition-colors"
              >
                Add
              </button>
            </NavigationItem>
          </div>

          <ul className="space-y-2">
            {settings.players.map((player, index) => (
              <NavigationItem key={index} index={8 + index}>
                <li className="flex justify-between items-center bg-white/20 p-2 rounded">
                  {player}
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </li>
              </NavigationItem>
            ))}
          </ul>
        </div>

        <NavigationItem index={totalItems - 1}>
          <button
            onClick={saveAndExit}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <SettingsIcon size={20} />
            Save Settings
          </button>
        </NavigationItem>
      </div>
    </div>
  );
}

export default Settings;