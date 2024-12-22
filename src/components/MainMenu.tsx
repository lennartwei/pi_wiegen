import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Trophy, PlayCircle, Scale } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { useNavigationSetup } from '../hooks/useNavigation';

function MainMenu() {
  const navigate = useNavigate();
  useNavigationSetup(4); // 4 menu items
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold mb-8">Drink & Roll</h1>
      
      <div className="grid gap-4 w-full max-w-xs">
        <NavigationItem
          index={0}
          onClick={() => navigate('/game')}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors cursor-pointer"
        >
          <PlayCircle size={24} />
          Start Game
        </NavigationItem>
        
        <NavigationItem
          index={1}
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors cursor-pointer"
        >
          <Settings size={24} />
          Settings
        </NavigationItem>
        
        <NavigationItem
          index={2}
          onClick={() => navigate('/leaderboard')}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg transition-colors cursor-pointer"
        >
          <Trophy size={24} />
          Leaderboard
        </NavigationItem>
        
        <NavigationItem
          index={3}
          onClick={() => navigate('/calibration')}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors cursor-pointer"
        >
          <Scale size={24} />
          Calibrate Scale
        </NavigationItem>
      </div>
    </div>
  );
}

export default MainMenu;