import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './contexts/SessionContext';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import Calibration from './components/Calibration';
import SessionSetup from './components/session/SessionSetup';
import WeightDisplay from './components/WeightDisplay';
import BatteryStatus from './components/BatteryStatus';

function App() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/session/:sessionId/setup" element={<SessionSetup />} />
            <Route path="/session/:sessionId/game" element={<Game />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/calibration" element={<Calibration />} />
          </Routes>
        </div>
        <WeightDisplay />
        <BatteryStatus />
      </div>
    </SessionProvider>
  );
}

export default App;