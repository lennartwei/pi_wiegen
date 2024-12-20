import React from 'react';
import { Settings, Plus, Cpu } from 'lucide-react';
import { GameSettingPreset } from '../../types';
import PresetCard from './PresetCard';

interface SettingPresetsProps {
  presets: GameSettingPreset[];
  activePresetId: string;
  simulationMode: boolean;
  onPresetSelect: (presetId: string) => void;
  onPresetEdit: (preset: GameSettingPreset) => void;
  onPresetCreate: () => void;
  onSimulationToggle: () => void;
}

function SettingPresets({
  presets,
  activePresetId,
  simulationMode,
  onPresetSelect,
  onPresetEdit,
  onPresetCreate,
  onSimulationToggle
}: SettingPresetsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings size={20} />
          Game Presets
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulationToggle}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors
              ${simulationMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}`}
          >
            <Cpu size={16} />
            {simulationMode ? 'Simulation On' : 'Simulation Off'}
          </button>
          <button
            onClick={onPresetCreate}
            className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors"
          >
            <Plus size={16} />
            New Preset
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {presets.map(preset => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isActive={preset.id === activePresetId}
            onSelect={() => onPresetSelect(preset.id)}
            onEdit={() => onPresetEdit(preset)}
          />
        ))}
      </div>
    </div>
  );
}

export default SettingPresets;