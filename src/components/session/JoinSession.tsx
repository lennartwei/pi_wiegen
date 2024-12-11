import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RefreshCw, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useSession } from '../../contexts/SessionContext';
import { useSessionFetch } from '../../hooks/useSessionFetch';
import SessionList from './SessionList';
import PlayerNameInput from './PlayerNameInput';

export default function JoinSession() {
  const { sessions, loading, error, fetchSessions } = useSessionFetch();
  const [showNameInput, setShowNameInput] = useState(!localStorage.getItem('playerName'));
  const { setSession } = useSession();
  const navigate = useNavigate();

  const handleJoin = async (sessionId: string) => {
    const playerName = localStorage.getItem('playerName');
    if (!playerName) {
      setShowNameInput(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
      if (!response.ok) throw new Error('Session not found');
      
      const session = await response.json();
      setSession(session);
      navigate(`/session/${sessionId}/game`);
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  if (showNameInput) {
    return <PlayerNameInput onSubmit={() => setShowNameInput(false)} />;
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="animate-spin mx-auto mb-4" />
        Loading sessions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Available Sessions</h2>
        <button
          onClick={fetchSessions}
          className="text-blue-400 hover:text-blue-300"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      <SessionList sessions={sessions} onJoin={handleJoin} />
    </div>
  );
}