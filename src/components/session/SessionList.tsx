import React from 'react';
import { Users } from 'lucide-react';
import { Session } from '../../types';

interface SessionListProps {
  sessions: Session[];
  onJoin: (sessionId: string) => void;
}

export default function SessionList({ sessions, onJoin }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white/10 p-8 rounded-lg text-center">
        <Users size={48} className="mx-auto mb-4 opacity-50" />
        <p>No active sessions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sessions.map(session => (
        <button
          key={session.id}
          onClick={() => onJoin(session.id)}
          className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors text-left"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{session.name}</div>
              <div className="text-sm opacity-75">
                Created by {session.owner}
              </div>
            </div>
            <Users size={20} className="opacity-50" />
          </div>
        </button>
      ))}
    </div>
  );
}