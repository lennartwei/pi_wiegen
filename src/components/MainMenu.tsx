import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trophy, Scale } from 'lucide-react';
import CreateSession from './session/CreateSession';
import JoinSession from './session/JoinSession';
import PlayerNameInput from './session/PlayerNameInput';

function MainMenu() {
  const [showCreate, setShowCreate] = useState(false);
  const [showNameInput, setShowNameInput] = useState(!localStorage.getItem('playerName'));
  const navigate = useNavigate();
  
  if (showNameInput) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <PlayerNameInput onSubmit={() => setShowNameInput(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-4xl font-bold mb-8">Drink & Roll</h1>
      
      <div className="grid gap-4 w-full max-w-md">
        {!showCreate ? (
          <>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
            >
              <UserPlus size={24} />
              Create Session
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-purple-900 to-indigo-800 text-white/60">
                  or join existing
                </span>
              </div>
            </div>

            <JoinSession />
          </>
        ) : (
          <>
            <CreateSession />
            
            <button
              onClick={() => setShowCreate(false)}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to sessions list
            </button>
          </>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-4">
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
            Calibrate
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;