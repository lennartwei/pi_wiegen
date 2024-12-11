import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface PlayerNameInputProps {
  onSubmit: () => void;
}

export default function PlayerNameInput({ onSubmit }: PlayerNameInputProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleSubmit = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    localStorage.setItem('playerName', playerName.trim());
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Users size={48} className="mx-auto mb-4 opacity-75" />
        <h2 className="text-xl font-bold mb-2">Enter Your Name</h2>
        <p className="opacity-75">This will be used to identify you in the game</p>
      </div>

      <div>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full bg-white/20 p-2 rounded border border-white/30"
          placeholder="Your name"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors"
      >
        Continue
      </button>
    </div>
  );
}