import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Calibration from './components/Calibration';
import WeightDisplay from './components/WeightDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/calibration" element={<Calibration />} />
        </Routes>
      </div>
      <WeightDisplay />
    </div>
  );
}

export default App;