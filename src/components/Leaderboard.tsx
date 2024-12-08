import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  games: number;
  perfectDrinks: number;
}

function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEntries = localStorage.getItem('leaderboard');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">Leaderboard</h1>
      </div>

      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No entries yet. Start playing to see the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/20 p-4 rounded-lg"
              >
                <div>
                  <h3 className="font-bold">{entry.name}</h3>
                  <p className="text-sm opacity-75">Games: {entry.games}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{entry.perfectDrinks}</p>
                  <p className="text-sm opacity-75">Perfect Drinks</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;