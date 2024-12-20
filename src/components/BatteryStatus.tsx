import React, { useState, useEffect } from 'react';
import { Battery, Plug } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { simulateBatteryStatus } from '../utils/simulators';
import { loadSettings } from '../utils/storage';

interface BatteryStatus {
  voltage: number;
  capacity: number;
  is_plugged: boolean;
  is_low: boolean;
  is_full: boolean;
}

function BatteryStatus() {
  const [status, setStatus] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatteryStatus = async () => {
      try {
        const settings = loadSettings();
        if (settings.simulationMode) {
          setStatus(simulateBatteryStatus());
          return;
        }

        const response = await fetch(`${API_BASE_URL}/battery`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setStatus(data);
        setError(null);
      } catch (err) {
        setError('Failed to read battery status');
        console.error('Battery status error:', err);
      }
    };

    fetchBatteryStatus();
    const interval = setInterval(fetchBatteryStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const getBatteryColor = () => {
    if (status.capacity < 15) return 'bg-red-500';
    if (status.capacity < 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed top-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 text-white/90 shadow-lg">
      <div className="relative w-8 h-4 border-2 border-current rounded-sm">
        {/* Battery nub */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-[2px] h-2 bg-current" />
        {/* Battery fill */}
        <div 
          className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${getBatteryColor()}`}
          style={{ width: `${Math.min(100, status.capacity)}%` }}
        />
      </div>
      <span className="text-xs font-medium min-w-[2.5rem]">
        {status.capacity}%
      </span>
      {status.is_plugged && (
        <Plug size={14} className="text-green-400" />
      )}
    </div>
  );
}

export default BatteryStatus;