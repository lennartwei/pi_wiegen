import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useGameRound } from '../hooks/useGameRound';
import { useRollAnimation } from '../hooks/useRollAnimation';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { loadSettings } from '../utils/storage';
import RoundResult from './RoundResult';
import GameTable from './game/GameTable';
import GameControls from './game/GameControls';
import GameStatus from './game/GameStatus';
import KeyboardHelp from './game/KeyboardHelp';
import { BUTTON_COLORS } from '../constants/gameColors';

function Game() {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);
  const [colors, setColors] = useState(BUTTON_COLORS[0]);

  const { 
    state, 
    rollDice, 
    setPlayers, 
    setMargin, 
    incrementAttempts, 
    moveToNextPlayer,
    updatePlayerScore 
  } = useGameState();

  const {
    weight,
    showResult,
    roundScore,
    isTared,
    isLoading,
    scaleError,
    handleTare,
    handleMeasure,
    setShowResult
  } = useGameRound(state, moveToNextPlayer, incrementAttempts, updatePlayerScore);

  const { isRolling, handleRollClick } = useRollAnimation();

  useEffect(() => {
    const settings = loadSettings();
    setPlayers(settings.players.map(name => ({ name, score: 0 })));
    const activePreset = settings.presets.find(p => p.id === settings.activePresetId);
    if (activePreset) {
      setMargin(activePreset.margin);
    }
  }, [setPlayers, setMargin]);

  useEffect(() => {
    setColors(BUTTON_COLORS[state.attempts % BUTTON_COLORS.length]);
  }, [state.phase, state.currentPlayerIndex, state.attempts]);

  useKeyboardControls({
    onRoll: () => handleRollClick(rollDice),
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
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center w-full max-w-4xl">
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

      {showControls && (
        <div className="w-full max-w-4xl">
          <KeyboardHelp />
        </div>
      )}

      <div className="relative w-full max-w-4xl aspect-[16/9]">
        <GameTable 
          players={state.players}
          currentPlayerIndex={state.currentPlayerIndex}
          dice1={state.dice1}
          dice2={state.dice2}
          phase={state.phase}
          onRoll={state.phase === 'rolling' ? () => handleRollClick(rollDice) : undefined}
          isRolling={isRolling}
        />
      </div>

      <div className="w-full max-w-md space-y-3">
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

        {state.phase === 'drinking' && (
          <GameControls
            phase={state.phase}
            isLoading={isLoading}
            isTared={isTared}
            onTare={handleTare}
            onMeasure={handleMeasure}
            buttonColors={colors}
          />
        )}
      </div>

      {showResult && (
        <RoundResult 
          isWin={weight <= state.targetWeight + state.margin && weight >= state.targetWeight - state.margin}
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