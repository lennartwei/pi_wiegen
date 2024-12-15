import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Settings, History } from 'lucide-react';
import { loadPlayerStats } from '../utils/storage';
import PlayerStatsCard from './PlayerStats';
import LeaderboardManagement from './LeaderboardManagement';
import LeaderboardTabs from './LeaderboardTabs';
import PlayerRankings from './PlayerRankings';
import GameHistory from './GameHistory';

function Leaderboard() {
  const [stats, setStats] = useState(loadPlayerStats());
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [activeTab, setActiveTab] = useState<'rankings' | 'history'>('rankings');
  const navigate = useNavigate();

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

      <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="w-full max-w-2xl">
        {stats.length === 0 ? (
          <div className="bg-white/10 p-8 rounded-lg text-center">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p>No entries yet. Start playing to see the leaderboard!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'rankings' ? (
              <PlayerRankings
                stats={stats}
                selectedPlayer={selectedPlayer}
                onPlayerSelect={setSelectedPlayer}
              />
            ) : (
              <GameHistory stats={stats} />
            )}

            {/* Detailed Player Stats */}
            {selectedPlayer && activeTab === 'rankings' && (
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