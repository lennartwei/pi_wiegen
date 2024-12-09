import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, LogIn } from 'lucide-react';
import { useSession } from '../hooks/useSession';

function SessionManager() {
  const [sessionId, setSessionId] = useState('');
  const { createSession, joinSession, error } = useSession();
  const navigate = useNavigate();

  const handleCreateSession = () => {
    createSession();
    navigate('/game');
  };

  const handleJoinSession = () => {
    if (sessionId.trim()) {
      joinSession(sessionId.trim());
      navigate('/game');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md space-y-6">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-4 opacity-75" />
          <h2 className="text-2xl font-bold mb-2">Game Session</h2>
          <p className="opacity-75">Create a new session or join an existing one</p>
        </div>

        {error && (
          <div className="bg-red-500/20 p-4 rounded-lg text-center text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCreateSession}
            className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create New Session
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-purple-900 text-white/60">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter Session ID"
              className="w-full bg-white/20 p-4 rounded-lg border border-white/30 text-white placeholder-white/50"
            />
            <button
              onClick={handleJoinSession}
              disabled={!sessionId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Join Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionManager;