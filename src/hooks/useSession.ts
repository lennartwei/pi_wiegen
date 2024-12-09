import { useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { SOCKET_URL } from '../config';
import { GameSession, SessionState } from '../types';

export function useSession() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [session, setSession] = useState<SessionState>({
    sessionId: null,
    isHost: false,
    connected: false
  });
  const [gameState, setGameState] = useState<GameSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      path: '/socket.io'
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSession(prev => ({ ...prev, connected: true }));
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server');
      setSession(prev => ({ ...prev, connected: false }));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setSession(prev => ({ ...prev, connected: false }));
    });

    newSocket.on('session_created', (data) => {
      console.log('Session created:', data);
      if (data.sessionId) {
        setSession(prev => ({
          ...prev,
          sessionId: data.sessionId,
          isHost: true
        }));
        setError(null);
      }
    });

    newSocket.on('session_joined', (data) => {
      console.log('Session joined:', data);
      if (data.sessionId) {
        setSession(prev => ({
          ...prev,
          sessionId: data.sessionId,
          isHost: data.isHost || false
        }));
        setError(null);
      }
    });

    newSocket.on('session_state', (state: GameSession) => {
      console.log('Received game state:', state);
      setGameState(state);
    });

    newSocket.on('session_ended', () => {
      console.log('Session ended');
      setSession({ sessionId: null, isHost: false, connected: true });
      setGameState(null);
    });

    newSocket.on('error', (message: string) => {
      console.error('Server error:', message);
      setError(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createSession = useCallback(() => {
    if (!socket?.connected) {
      setError('Not connected to server');
      return;
    }

    const sessionId = uuidv4();
    console.log('Creating session:', sessionId);
    socket.emit('create_session', { sessionId });
  }, [socket]);

  const joinSession = useCallback((sessionId: string) => {
    if (!socket?.connected) {
      setError('Not connected to server');
      return;
    }

    console.log('Joining session:', sessionId);
    socket.emit('join_session', { sessionId });
  }, [socket]);

  const leaveSession = useCallback(() => {
    if (!socket || !session.sessionId) return;

    console.log('Leaving session:', session.sessionId);
    socket.emit('leave_session', { sessionId: session.sessionId });
    setSession({ sessionId: null, isHost: false, connected: socket.connected });
    setGameState(null);
  }, [socket, session.sessionId]);

  const updateGameState = useCallback((update: Partial<GameSession>) => {
    if (!socket || !session.sessionId || !session.isHost) return;

    socket.emit('update_state', {
      sessionId: session.sessionId,
      update
    });
  }, [socket, session]);

  return {
    session,
    gameState,
    error,
    createSession,
    joinSession,
    leaveSession,
    updateGameState
  };
}