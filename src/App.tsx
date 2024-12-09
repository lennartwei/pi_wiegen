import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Calibration from './components/Calibration';
import SessionManager from './components/SessionManager';
import WeightDisplay from './components/WeightDisplay';
import SessionDisplay from './components/SessionDisplay';
import { useWeightDisplayConfig } from './hooks/useWeightDisplayConfig';

function App() {
  const { showWeightDisplay } = useWeightDisplayConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/session" element={<SessionManager />} />
        </Routes>
      </div>
      {showWeightDisplay && <WeightDisplay />}
      <SessionDisplay />
    </div>
  );
}

export default App;