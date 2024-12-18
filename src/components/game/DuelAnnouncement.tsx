import React from 'react';
import { Swords } from 'lucide-react';

interface DuelAnnouncementProps {
  player1: string;
  player2: string;
}

function DuelAnnouncement({ player1, player2 }: DuelAnnouncementProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-red-900/90 p-8 rounded-lg text-center transform animate-bounce">
        <div className="relative">
          <Swords size={64} className="mx-auto mb-4 text-red-400 animate-pulse" />
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Duel Time!</h2>
        <div className="flex items-center justify-center gap-4 text-xl">
          <span className="font-bold">{player1}</span>
          <span className="text-red-400">vs</span>
          <span className="font-bold">{player2}</span>
        </div>
        <p className="mt-4 opacity-80">
          May the steadiest hand win!
        </p>
      </div>
    </div>
  );
}

export default DuelAnnouncement;