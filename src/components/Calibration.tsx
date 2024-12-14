import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, RotateCcw } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useScale } from '../hooks/useScale';

function Calibration() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');
  const [knownWeight, setKnownWeight] = useState<number>(100);
  const navigate = useNavigate();
  const { resetScale } = useScale();

  const calibrate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/calibrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step, known_weight: knownWeight }),
      });
      
      const data = await response.json();
      setStatus(data.message);
      
      if (data.success) {
        if (step < 3) {
          setStep(step + 1);
        } else {
          setTimeout(() => navigate('/'), 2000);
        }
      }
    } catch (error) {
      setStatus('Error during calibration');
      console.error('Calibration error:', error);
    }
  };

  const handleReset = async () => {
    try {
      const success = await resetScale();
      if (success) {
        setStatus('Scale reset to factory defaults');
        setTimeout(() => setStatus(''), 2000);
      }
    } catch (error) {
      setStatus('Error resetting scale');
      console.error('Reset error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">Scale Calibration</h1>
      </div>

      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md">
        <div className="text-center mb-6">
          <Scale size={48} className="mx-auto mb-4" />
          <h2 className="text-xl mb-2">Step {step} of 3</h2>
          {step === 1 && (
            <p>Remove all weight from the scale and press calibrate</p>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Calibration Weight (grams)
                </label>
                <input
                  type="number"
                  value={knownWeight}
                  onChange={(e) => setKnownWeight(Number(e.target.value))}
                  className="w-full bg-white/20 p-2 rounded border border-white/30 text-white"
                  min="1"
                  max="1000"
                />
              </div>
              <p>Place the weight on the scale and press calibrate</p>
            </div>
          )}
          {step === 3 && (
            <p>Remove the weight and press calibrate to finish</p>
          )}
        </div>

        {status && (
          <div className="mb-6 p-4 bg-white/20 rounded-lg text-center">
            {status}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={calibrate}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors"
          >
            Calibrate
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Reset to Factory Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calibration;