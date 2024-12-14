import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Trophy, PlayCircle, Scale } from 'lucide-react';

function MainMenu() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold mb-8">Drink & Roll</h1>
      
      <div className="grid gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate('/game')}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
        >
          <PlayCircle size={24} />
          Start Game
        </button>
        
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
        >
          <Settings size={24} />
          Settings
        </button>
        
        <button
          onClick={() => navigate('/leaderboard')}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg transition-colors"
        >
          <Trophy size={24} />
          Leaderboard
        </button>
        
        <button
          onClick={() => navigate('/calibration')}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors"
        >
          <Scale size={24} />
          Calibrate Scale
        </button>
      </div>
    </div>
  );
}

export default MainMenu;