import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { useScale } from '../hooks/useScale';

function WeightDisplay() {
  const [weight, setWeight] = useState<number | null>(null);
  const { getWeight } = useScale();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let isMounted = true;
    
    const updateWeight = async () => {
      try {
        const measured = await getWeight(false); // Set priority to false for background updates
        if (isMounted && measured !== 0) { // Only update if we got a real measurement
          setWeight(Math.abs(measured));
        }
      } catch (error) {
        console.error('Error reading weight:', error);
      }
    };

    // Update weight every 2 seconds
    updateWeight();
    intervalId = setInterval(updateWeight, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [getWeight]);

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