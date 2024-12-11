import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session, SessionContextType, GameSettings, GameState } from '../types/session';
import { API_BASE_URL } from '../config';

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const updateSession = useCallback(async (settings?: GameSettings, gameState?: GameState) => {
    if (!session) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, game_state: gameState })
      });

      if (!response.ok) throw new Error('Failed to update session');
      
      const updatedSession = await response.json();
      setSession(updatedSession);
    } catch (error) {
      console.error('Session update error:', error);
      throw error;
    }
  }, [session]);

  const handleSetSession = (newSession: Session | null) => {
    setSession(newSession);
    if (newSession) {
      const playerName = localStorage.getItem('playerName');
      setIsOwner(playerName === newSession.owner);
    } else {
      setIsOwner(false);
    }
  };

  return (
    <SessionContext.Provider value={{
      session,
      isOwner,
      updateSession,
      setSession: handleSetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}