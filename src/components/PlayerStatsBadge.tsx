import React from 'react';

interface PlayerStatsBadgeProps {
  label: string;
  value: string;
}

function PlayerStatsBadge({ label, value }: PlayerStatsBadgeProps) {
  return (
    <div className="bg-white/10 p-2 rounded text-sm">
      <div className="opacity-75">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

export default PlayerStatsBadge;