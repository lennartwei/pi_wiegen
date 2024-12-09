import React, { useState, useEffect, useCallback } from 'react';
import { Scale } from 'lucide-react';
import { useScale } from '../hooks/useScale';
import { useWeightDisplayConfig } from '../hooks/useWeightDisplayConfig';

function WeightDisplay() {
  const [weight, setWeight] = useState<number | null>(null);
  const { getWeight } = useScale();
  const { updateRate } = useWeightDisplayConfig();

  const updateWeight = useCallback(async () => {
    try {
      const measured = await getWeight(false);
      setWeight(measured !== 0 ? Math.abs(measured) : null);
    } catch (error) {
      console.error('Error reading weight:', error);
      setWeight(null);
    }
  }, [getWeight]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const runUpdate = async () => {
      if (isMounted) {
        await updateWeight();
      }
    };

    // Initial update
    runUpdate();

    // Set up interval
    intervalId = setInterval(runUpdate, updateRate);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      setWeight(null);
    };
  }, [updateRate, updateWeight]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 text-white/90 shadow-lg">
      <Scale size={20} className="text-blue-400" />
      <span className="font-mono text-lg">
        {weight === null ? '--.-' : weight.toFixed(1)}g
      </span>
    </div>
  );
}

export default WeightDisplay;