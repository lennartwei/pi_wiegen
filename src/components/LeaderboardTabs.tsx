import React from 'react';
import { Trophy, History } from 'lucide-react';

interface LeaderboardTabsProps {
  activeTab: 'rankings' | 'history';
  onTabChange: (tab: 'rankings' | 'history') => void;
}

function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  return (
    <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
      <button
        onClick={() => onTabChange('rankings')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
          ${activeTab === 'rankings' 
            ? 'bg-white/20 text-white' 
            : 'text-white/60 hover:text-white/80'}`}
      >
        <Trophy size={20} />
        Rankings
      </button>
      <button
        onClick={() => onTabChange('history')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
          ${activeTab === 'history' 
            ? 'bg-white/20 text-white' 
            : 'text-white/60 hover:text-white/80'}`}
      >
        <History size={20} />
        Game History
      </button>
    </div>
  );
}

export default LeaderboardTabs;