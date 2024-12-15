import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useScale } from '../hooks/useScale';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { loadSettings } from '../utils/storage';
import { updatePlayerStats } from '../utils/playerStats';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import RoundResult from './RoundResult';
import GameTable from './game/GameTable';
import GameControls from './game/GameControls';
import GameStatus from './game/GameStatus';
import KeyboardHelp from './game/KeyboardHelp';

const BUTTON_COLORS = [
  { tare: 'bg-yellow-600 hover:bg-yellow-700', measure: 'bg-blue-600 hover:bg-blue-700' },
  { tare: 'bg-purple-600 hover:bg-purple-700', measure: 'bg-pink-600 hover:bg-pink-700' },
  { tare: 'bg-orange-600 hover:bg-orange-700', measure: 'bg-cyan-600 hover:bg-cyan-700' },
];

function Game() {
  const navigate = useNavigate();
  const { 
    state, 
    rollDice, 
    nextPhase, 
    setPlayers, 
    setMargin, 
    incrementAttempts, 
    moveToNextPlayer,
    updatePlayerScore 
  } = useGameState();
  
  const { getWeight, tare, isLoading, error: scaleError } = useScale();
  const [weight, setWeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState({ score: 0, isPerfect: false, deviation: 0 });
  const [isTared, setIsTared] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Get the current color scheme based on attempts
  const colors = BUTTON_COLORS[state.attempts % BUTTON_COLORS.length];

  useEffect(() => {
    const settings = loadSettings();
    setPlayers(settings.players.map(name => ({ name, score: 0 })));
    const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
    if (activePreset) {
      setMargin(activePreset.margin);
    }
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
      const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
      if (!activePreset) return;
      
      const score = calculateScore(measuredWeight, state.targetWeight, activePreset);
      setRoundScore(score);
      updatePlayerScore(score.score);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const isWin = isValidWeight(measuredWeight, state.targetWeight, state.margin);
      
      await updatePlayerStats(currentPlayer.name, {
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

  useKeyboardControls({
    onRoll: handleRollClick,
    onTare: handleTare,
    onMeasure: handleMeasure,
    canRoll: state.phase === 'rolling' && !isLoading && !isRolling,
    canTare: state.phase === 'drinking' && !isLoading && !isTared,
    canMeasure: state.phase === 'drinking' && !isLoading && isTared,
  });

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
        <button
          onClick={() => setShowControls(!showControls)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Keyboard size={24} />
        </button>
      </div>

      {showControls && <KeyboardHelp />}

      <div className="relative w-full aspect-square max-w-3xl mb-8">
        <GameTable 
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
        />
      </div>

      <div className="w-full max-w-md space-y-4">
        {scaleError && (
          <div className="bg-red-500/20 p-4 rounded-lg">
            {scaleError}
          </div>
        )}

        <GameStatus
          currentPlayer={state.players[state.currentPlayerIndex].name}
          attempts={state.attempts}
          maxAttempts={state.maxAttempts}
          phase={state.phase}
          targetWeight={state.targetWeight}
          margin={state.margin}
        />

        <GameControls
          phase={state.phase}
          isLoading={isLoading}
          isTared={isTared}
          onRoll={handleRollClick}
          onTare={handleTare}
          onMeasure={handleMeasure}
          buttonColors={colors}
        />
      </div>

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
  );
}

export default Game;