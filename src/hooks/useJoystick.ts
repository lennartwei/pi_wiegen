import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config';

export type Direction = 'up' | 'down' | 'left' | 'right';

export function useJoystick() {
  const [direction, setDirection] = useState<Direction>('right');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('joystick_event', (data: { direction: Direction }) => {
      setDirection(data.direction);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return {
    direction,
    isConnected: socket?.connected ?? false
  };
}