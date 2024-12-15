import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GameSettingPreset } from '../../types';

interface PresetEditorProps {
  preset?: GameSettingPreset;
  onSave: (preset: GameSettingPreset) => void;
  onClose: () => void;
}

function PresetEditor({ preset, onSave, onClose }: PresetEditorProps) {
  const [form, setForm] = useState<GameSettingPreset>(preset || {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    margin: 5,
    maxRetries: 2,
    scoring: {
      perfectScore: 1000,
      marginPenalty: 100,
      failurePenalty: 200,
      minScore: -500
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {preset ? 'Edit Preset' : 'New Preset'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-700 p-2 rounded h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Margin (±g)</label>
              <input
                type="number"
                value={form.margin}
                onChange={e => setForm(prev => ({ ...prev, margin: Number(e.target.value) }))}
                className="w-full bg-gray-700 p-2 rounded"
                min={1}
                max={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Retries</label>
              <input
                type="number"
                value={form.maxRetries}
                onChange={e => setForm(prev => ({ ...prev, maxRetries: Number(e.target.value) }))}
                className="w-full bg-gray-700 p-2 rounded"
                min={1}
                max={5}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium mb-3">Scoring Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Perfect Score</label>
                <input
                  type="number"
                  value={form.scoring.perfectScore}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    scoring: { ...prev.scoring, perfectScore: Number(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 p-2 rounded"
                  min={100}
                  step={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Margin Penalty</label>
                <input
                  type="number"
                  value={form.scoring.marginPenalty}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    scoring: { ...prev.scoring, marginPenalty: Number(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 p-2 rounded"
                  min={0}
                  step={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Failure Penalty</label>
                <input
                  type="number"
                  value={form.scoring.failurePenalty}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    scoring: { ...prev.scoring, failurePenalty: Number(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 p-2 rounded"
                  min={0}
                  step={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Minimum Score</label>
                <input
                  type="number"
                  value={form.scoring.minScore}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    scoring: { ...prev.scoring, minScore: Number(e.target.value) }
                  }))}
                  className="w-full bg-gray-700 p-2 rounded"
                  max={0}
                  step={100}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
            >
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PresetEditor;