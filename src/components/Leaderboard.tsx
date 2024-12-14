import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Settings } from 'lucide-react';
import { loadPlayerStats } from '../utils/storage';
import PlayerStatsCard from './PlayerStats';
import LeaderboardManagement from './LeaderboardManagement';

function Leaderboard() {
  const [stats, setStats] = useState(loadPlayerStats());
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const navigate = useNavigate();

  // Sort players by total score
  const sortedStats = [...stats].sort((a, b) => b.totalScore - a.totalScore);

  const getPlayerRank = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}th`;
    }
  };

  const handleStatsUpdate = (newStats: typeof stats) => {
    setStats(newStats);
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
        <h1 className="text-2xl font-bold flex-1 text-center">Leaderboard</h1>
        <button
          onClick={() => setShowManagement(true)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>

      <div className="w-full max-w-2xl">
        {stats.length === 0 ? (
          <div className="bg-white/10 p-8 rounded-lg text-center">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No entries yet. Start playing to see the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Rankings */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Overall Rankings
              </h2>
              <div className="space-y-3">
                {sortedStats.map((player, index) => (
                  <button
                    key={player.name}
                    onClick={() => setSelectedPlayer(player.name)}
                    className={`w-full text-left p-4 rounded-lg transition-colors
                      ${selectedPlayer === player.name ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPlayerRank(index)}</span>
                        <div>
                          <div className="font-bold">{player.name}</div>
                          <div className="text-sm opacity-75">
                            {player.games} games played
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {player.totalScore.toLocaleString()} pts
                        </div>
                        <div className="text-sm opacity-75">
                          {player.perfectDrinks} perfect drinks
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                      <div className="bg-white/10 p-2 rounded">
                        <div className="opacity-75">Win Rate</div>
                        <div className="font-bold">{player.winRate.toFixed(1)}%</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded">
                        <div className="opacity-75">Best Streak</div>
                        <div className="font-bold">{player.longestWinStreak}</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded">
                        <div className="opacity-75">Avg Score</div>
                        <div className="font-bold">{Math.round(player.averageScore)}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Player Stats */}
            {selectedPlayer && (
              <PlayerStatsCard 
                stats={stats.find(s => s.name === selectedPlayer)!} 
              />
            )}
          </div>
        )}
      </div>

      {showManagement && (
        <LeaderboardManagement
          stats={stats}
          onClose={() => setShowManagement(false)}
          onUpdate={handleStatsUpdate}
        />
      )}
    </div>
  );
}

export default Leaderboard;