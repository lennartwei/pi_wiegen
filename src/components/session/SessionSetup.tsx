import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import { GameSettings } from '../../types/session';
import { API_BASE_URL } from '../../config';

export default function SessionSetup() {
  const { session, updateSession, isOwner, setSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPlayer, setNewPlayer] = useState('');
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [settings, setSettings] = useState<GameSettings>({
    margin: 5,
    maxRetries: 2,
    players: [],
    scoring: {
      perfectScore: 1000,
      marginPenalty: 100,
      failurePenalty: 200,
      minScore: -500
    }
  });

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
        if (!response.ok) throw new Error('Session not found');
        
        const sessionData = await response.json();
        setSession(sessionData);
        if (sessionData.settings) {
          setSettings(sessionData.settings);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        navigate('/');
      }
    };

    fetchSession();
  }, [sessionId, setSession, navigate]);

  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;
    
    setSettings(prev => ({
      ...prev,
      players: [...prev.players, { name: newPlayer.trim(), score: 0 }]
    }));
    setNewPlayer('');
  };

  const handleRemovePlayer = (index: number) => {
    setSettings(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!isOwner) {
      setError('Only the session owner can modify settings');
      return;
    }

    if (settings.players.length === 0) {
      setError('Please add at least one player');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateSession({
        ...settings,
        players: settings.players
      }, {
        currentPlayerIndex: 0,
        dice1: 0,
        dice2: 0,
        targetWeight: 0,
        phase: 'rolling',
        attempts: 0
      });
      navigate(`/session/${sessionId}/game`);
    } catch (error) {
      setError('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <Loader2 className="animate-spin mx-auto mb-4" />
        Loading session...
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">Waiting for Game Setup</h2>
        <p className="opacity-75">The game host is currently setting up the session...</p>
        <div className="mt-8">
          <Loader2 className="animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Game Setup</h1>
        <div className="w-8" />
      </div>

      <div className="bg-white/10 p-6 rounded-lg space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={20} />
            Players
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                className="flex-1 bg-white/20 p-2 rounded border border-white/30"
                placeholder="Enter player name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              />
              <button
                onClick={handleAddPlayer}
                className="bg-green-600 hover:bg-green-700 px-4 rounded transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {settings.players.length > 0 ? (
              <div className="space-y-2">
                {settings.players.map((player, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/20 p-2 rounded">
                    <span>{player.name}</span>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center opacity-75 py-4">
                No players added yet
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Weight Margin (±g)</label>
            <input
              type="number"
              value={settings.margin}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                margin: Number(e.target.value)
              }))}
              className="w-full bg-white/20 p-2 rounded border border-white/30"
              min={1}
              max={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Maximum Retries</label>
            <input
              type="number"
              value={settings.maxRetries}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxRetries: Number(e.target.value)
              }))}
              className="w-full bg-white/20 p-2 rounded border border-white/30"
              min={1}
              max={5}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm p-4 bg-red-400/10 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          {isLoading ? 'Starting Game...' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}