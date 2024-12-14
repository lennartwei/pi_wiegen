import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dice1, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useScale } from '../hooks/useScale';
import { loadSettings, updatePlayerStats } from '../utils/storage';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import RoundResult from './RoundResult';
import AnimatedDice from './AnimatedDice';

const BUTTON_COLORS = [
  { tare: 'bg-yellow-600 hover:bg-yellow-700', measure: 'bg-blue-600 hover:bg-blue-700' },
  { tare: 'bg-purple-600 hover:bg-purple-700', measure: 'bg-pink-600 hover:bg-pink-700' },
  { tare: 'bg-orange-600 hover:bg-orange-700', measure: 'bg-cyan-600 hover:bg-cyan-700' },
];

function Game() {
  const navigate = useNavigate();
  const { state, rollDice, nextPhase, setPlayers, setMargin, incrementAttempts, moveToNextPlayer } = useGameState();
  const { getWeight, tare, isLoading, error } = useScale();
  const [weight, setWeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState({ score: 0, isPerfect: false, deviation: 0 });
  const [isTared, setIsTared] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  // Get the current color scheme based on attempts
  const colors = BUTTON_COLORS[state.attempts % BUTTON_COLORS.length];

  useEffect(() => {
    const settings = loadSettings();
    setPlayers(settings.players.map(name => ({ name, score: 0 })));
    setMargin(settings.margin);
  }, [setPlayers, setMargin]);

  useEffect(() => {
    setIsTared(false);
  }, [state.phase, state.currentPlayerIndex, state.attempts]);

  const handleRollClick = () => {
    setIsRolling(true);
    rollDice();
  };

  const handleTare = async () => {
    try {
      await tare();
      setIsTared(true);
    } catch (error) {
      console.error('Tare error:', error);
      setIsTared(false);
    }
  };

  const handleMeasure = async () => {
    if (!isTared) return;

    try {
      const measured = await getWeight(true);
      const measuredWeight = Math.abs(measured);
      setWeight(measuredWeight);
      
      const settings = loadSettings();
      const score = calculateScore(measuredWeight, state.targetWeight, settings);
      setRoundScore(score);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const isWin = isValidWeight(measuredWeight, state.targetWeight, state.margin);
      
      updatePlayerStats(currentPlayer.name, {
        score: score.score,
        deviation: score.deviation,
        targetWeight: state.targetWeight,
        actualWeight: measuredWeight,
        timestamp: Date.now(),
        isPerfect: score.isPerfect
      });
      
      setShowResult(true);
      
      if (isWin) {
        setTimeout(() => {
          setShowResult(false);
          moveToNextPlayer();
          setWeight(0);
          setIsTared(false);
        }, 2000);
      } else {
        incrementAttempts();
        const isLastAttempt = state.attempts + 1 >= state.maxAttempts;
        
        setTimeout(() => {
          setShowResult(false);
          if (isLastAttempt) {
            moveToNextPlayer();
            setWeight(0);
          }
          setIsTared(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Measurement error:', error);
      setIsTared(false);
    }
  };

  if (state.players.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">Please add players in settings first!</p>
        <button
          onClick={() => navigate('/settings')}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">Game Round</h1>
      </div>

      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">
            Player: {state.players[state.currentPlayerIndex]?.name}
          </h2>
          {state.phase === 'drinking' && (
            <div className="text-sm opacity-75">
              Attempt {state.attempts + 1}/{state.maxAttempts}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {state.phase === 'rolling' && (
          <button
            onClick={handleRollClick}
            className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={isLoading || isRolling}
          >
            <Dice1 size={24} />
            Roll Dice
          </button>
        )}

        {(state.dice1 > 0 && state.dice2 > 0) && (
          <div className="flex justify-center gap-4 my-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={state.dice1} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
              <p className="text-center mt-2">{state.dice1}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={state.dice2} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
              <p className="text-center mt-2">{state.dice2}</p>
            </div>
          </div>
        )}

        {state.phase === 'drinking' && (
          <div className="text-center space-y-4">
            <p className="text-lg mb-4">
              Target: {state.targetWeight}g ±{state.margin}g
            </p>
            
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleTare}
                  className={`w-full p-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2
                    ${isTared ? 'bg-green-600 hover:bg-green-700' : colors.tare}`}
                  disabled={isLoading}
                >
                  {isTared ? <CheckCircle2 size={24} /> : <Scale size={24} />}
                  {isTared ? 'Scale Tared' : 'Tare Scale'}
                </button>
                <div className={`flex items-center justify-center gap-2 text-sm
                  ${isTared ? 'text-green-300' : 'text-yellow-300'}`}
                >
                  {isTared ? (
                    <>
                      <CheckCircle2 size={16} />
                      Scale is ready for measurement
                    </>
                  ) : (
                    'Place drink on scale and tare before measuring!'
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={handleMeasure}
                  className={`w-full p-4 rounded-lg transition-colors flex items-center justify-center gap-2
                    ${!isTared ? 'bg-gray-600 cursor-not-allowed' : colors.measure}`}
                  disabled={isLoading || !isTared}
                >
                  <Scale size={24} />
                  Measure Drink
                </button>
              </div>
            </div>

            {state.attempts > 0 && (
              <div className="mt-4 text-yellow-300 flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                {state.maxAttempts - state.attempts} {state.maxAttempts - state.attempts === 1 ? 'try' : 'tries'} remaining
              </div>
            )}
          </div>
        )}

        {showResult && (
          <RoundResult 
            isWin={isValidWeight(weight, state.targetWeight, state.margin)}
            weight={weight}
            targetWeight={state.targetWeight}
            margin={state.margin}
            attemptsLeft={state.maxAttempts - state.attempts - 1}
            score={roundScore.score}
            isPerfect={roundScore.isPerfect}
          />
        )}
      </div>
    </div>
  );
}

export default Game;