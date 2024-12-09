import React, { useState } from 'react';
import { X, Save, Lock, Unlock } from 'lucide-react';
import { PlayerStats } from '../types';
import { savePlayerStats } from '../utils/storage';

const ADMIN_PIN = '1234';

interface LeaderboardManagementProps {
  stats: PlayerStats[];
  onClose: () => void;
  onUpdate: (newStats: PlayerStats[]) => void;
}

function LeaderboardManagement({ stats, onClose, onUpdate }: LeaderboardManagementProps) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [editableStats, setEditableStats] = useState<PlayerStats[]>(stats);
  const [error, setError] = useState('');

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const handleRemovePlayer = (playerName: string) => {
    const newStats = editableStats.filter(stat => stat.name !== playerName);
    setEditableStats(newStats);
  };

  const handleSave = () => {
    savePlayerStats(editableStats);
    onUpdate(editableStats);
    onClose();
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock size={24} />
              Admin Access
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="w-full bg-gray-700 p-2 rounded border border-gray-600"
                maxLength={4}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              onClick={handlePinSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Unlock size={24} />
            Manage Leaderboard
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {editableStats.map((player) => (
            <div key={player.name} className="bg-gray-700 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{player.name}</h3>
                <button
                  onClick={() => handleRemovePlayer(player.name)}
                  className="text-red-400 hover:text-red-300 px-2 py-1 rounded"
                >
                  Remove Player
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Games: {player.games}</div>
                <div>Perfect Drinks: {player.perfectDrinks}</div>
                <div>Total Score: {player.totalScore}</div>
                <div>Win Rate: {player.winRate.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardManagement;