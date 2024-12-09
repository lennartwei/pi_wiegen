import React from 'react';
import { Users } from 'lucide-react';
import { useSession } from '../hooks/useSession';

function SessionDisplay() {
  const { session } = useSession();

  if (!session.sessionId) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 text-white/90 shadow-lg">
      <Users size={16} className="text-blue-400" />
      <div className="flex flex-col">
        <span className="text-xs opacity-75">Session ID</span>
        <code className="font-mono text-sm select-all" onClick={(e) => {
          e.currentTarget.select();
          navigator.clipboard.writeText(session.sessionId || '');
        }}>
          {session.sessionId}
        </code>
      </div>
      {session.isHost && (
        <span className="text-xs bg-blue-500/50 px-2 py-0.5 rounded ml-2">Host</span>
      )}
    </div>
  );
}

export default SessionDisplay;