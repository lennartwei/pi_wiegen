import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, RefreshCcw } from 'lucide-react';

interface ScaleControlsProps {
  weight: number;
  onTare: () => void;
  onMeasure: () => void;
  isStable?: boolean;
  isMeasuring?: boolean;
  isCalibrated?: boolean;
}

export const ScaleControls: React.FC<ScaleControlsProps> = ({
  weight,
  onTare,
  onMeasure,
  isStable = true,
  isMeasuring = false,
  isCalibrated = true,
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-gray-50/50">
      {/* Weight Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className={`text-6xl font-bold transition-colors duration-300 ${
          !isCalibrated ? 'text-red-500' :
          !isStable ? 'text-yellow-500' :
          'text-green-600'
        }`}>
          {weight.toFixed(1)}g
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {!isCalibrated ? 'Scale needs calibration' :
           !isStable ? 'Stabilizing...' :
           'Ready to measure'}
        </div>
      </motion.div>

      {/* Main Measure Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onMeasure}
        disabled={!isStable || isMeasuring || !isCalibrated}
        className={`
          px-8 py-4 rounded-xl shadow-lg
          text-xl font-semibold
          transition-all duration-300
          ${isMeasuring ? 
            'bg-yellow-500 text-white' :
            'bg-blue-600 text-white hover:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isMeasuring ? 'Measuring...' : 'Measure Drink'}
      </motion.button>

      {/* Tare FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onTare}
        className="fixed bottom-8 right-8 p-4 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
      >
        <RefreshCcw className="w-6 h-6" />
      </motion.button>

      {/* Scale Status Icon */}
      <motion.div 
        className="fixed bottom-8 left-8 p-4"
        animate={{ opacity: isCalibrated ? 1 : 0.5 }}
      >
        <Scale className={`w-6 h-6 ${isCalibrated ? 'text-green-600' : 'text-red-500'}`} />
      </motion.div>
    </div>
  );
};