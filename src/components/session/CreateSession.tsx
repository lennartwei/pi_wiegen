import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { useSession } from '../../contexts/SessionContext';

export default function CreateSession() {
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useSession();

  const handleCreate = async () => {
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    const playerName = localStorage.getItem('playerName');
    if (!playerName) {
      setError('Player name not found');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sessionName.trim(),
          owner: playerName
        })
      });

      if (!response.ok) throw new Error('Failed to create session');
      
      const session = await response.json();
      setSession(session);
      navigate(`/session/${session.id}/setup`);
    } catch (error) {
      setError('Failed to create session');
      console.error('Session creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Session Name</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full bg-white/20 p-2 rounded border border-white/30"
          placeholder="Enter session name"
          disabled={isLoading}
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Plus size={20} />
        )}
        {isLoading ? 'Creating...' : 'Create Session'}
      </button>
    </div>
  );
}