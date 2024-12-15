import React from 'react';
import { Check, Edit2 } from 'lucide-react';
import { GameSettingPreset } from '../../types';

interface PresetCardProps {
  preset: GameSettingPreset;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

function PresetCard({ preset, isActive, onSelect, onEdit }: PresetCardProps) {
  return (
    <div className={`
      relative p-4 rounded-lg transition-all duration-300
      ${isActive 
        ? 'bg-blue-600 ring-2 ring-blue-400' 
        : 'bg-white/10 hover:bg-white/20'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold">{preset.name}</h3>
          <p className="text-sm opacity-75">{preset.description}</p>
        </div>
        {isActive && (
          <div className="bg-blue-500 p-1 rounded-full">
            <Check size={16} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mt-4">
        <div className="bg-black/20 p-2 rounded">
          <div className="opacity-75">Margin</div>
          <div className="font-bold">±{preset.margin}g</div>
        </div>
        <div className="bg-black/20 p-2 rounded">
          <div className="opacity-75">Retries</div>
          <div className="font-bold">{preset.maxRetries}</div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onSelect}
          className={`px-3 py-1 rounded-full text-sm transition-colors
            ${isActive 
              ? 'bg-blue-700 hover:bg-blue-800' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isActive ? 'Selected' : 'Select'}
        </button>
        <button
          onClick={onEdit}
          className="p-1 rounded-full hover:bg-black/20 transition-colors"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default PresetCard;