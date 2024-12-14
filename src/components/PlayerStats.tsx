import React from 'react';
import { PlayerStats as PlayerStatsType } from '../types';
import { Trophy, Target, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface PlayerStatsProps {
  stats: PlayerStatsType;
}

function PlayerStatsCard({ stats }: PlayerStatsProps) {
  return (
    <div className="bg-white/10 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy size={24} className="text-yellow-400" />
        {stats.name}'s Stats
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded">
          <div className="text-sm opacity-75">Games Played</div>
          <div className="text-2xl font-bold">{stats.games}</div>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <div className="text-sm opacity-75">Perfect Drinks</div>
          <div className="text-2xl font-bold text-green-400">{stats.perfectDrinks}</div>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <div className="text-sm opacity-75">Win Rate</div>
          <div className="text-2xl font-bold text-blue-400">{stats.winRate.toFixed(1)}%</div>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <div className="text-sm opacity-75">Best Streak</div>
          <div className="text-2xl font-bold text-purple-400">{stats.longestWinStreak}</div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BarChart2 size={20} />
          Recent Performance
        </h4>
        <div className="space-y-2">
          {stats.lastTenGames.map((game, index) => (
            <div key={index} className="bg-white/5 p-3 rounded flex items-center justify-between">
              <div>
                <div className="text-sm opacity-75">
                  Target: {game.targetWeight}g
                </div>
                <div className="text-sm">
                  Actual: {game.actualWeight}g
                </div>
              </div>
              <div className={`text-lg font-bold ${game.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {game.score > 0 ? '+' : ''}{game.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-400" />
            <div className="text-sm opacity-75">Best Score</div>
          </div>
          <div className="text-xl font-bold text-green-400">
            {stats.bestScore}
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-400" />
            <div className="text-sm opacity-75">Worst Score</div>
          </div>
          <div className="text-xl font-bold text-red-400">
            {stats.worstScore}
          </div>
        </div>

        <div className="col-span-2 bg-white/5 p-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-blue-400" />
            <div className="text-sm opacity-75">Average Deviation</div>
          </div>
          <div className="text-xl font-bold text-blue-400">
            {stats.averageDeviation.toFixed(1)}g
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerStatsCard;