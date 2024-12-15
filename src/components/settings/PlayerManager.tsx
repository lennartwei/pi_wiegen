import React, { useState } from 'react';
import { Users, UserPlus, X } from 'lucide-react';

interface PlayerManagerProps {
  players: string[];
  onPlayerAdd: (name: string) => void;
  onPlayerRemove: (index: number) => void;
}

function PlayerManager({ players, onPlayerAdd, onPlayerRemove }: PlayerManagerProps) {
  const [newPlayer, setNewPlayer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim()) {
      onPlayerAdd(newPlayer);
      setNewPlayer('');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Users size={20} />
        Players
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          className="flex-1 bg-white/20 p-2 rounded border border-white/30 text-white"
          placeholder="Enter player name"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 rounded transition-colors flex items-center gap-2"
        >
          <UserPlus size={20} />
          Add
        </button>
      </form>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center bg-white/20 p-2 rounded"
          >
            {player}
            <button
              onClick={() => onPlayerRemove(index)}
              className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerManager;