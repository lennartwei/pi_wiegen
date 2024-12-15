import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { useGameState } from '../hooks/useGameState';
import { useScale } from '../hooks/useScale';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { loadSettings, updatePlayerStats } from '../utils/storage';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import RoundResult from './RoundResult';
import AnimatedDice from './AnimatedDice';
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
  const { state, rollDice, nextPhase, setPlayers, setMargin, incrementAttempts, moveToNextPlayer } = useGameState();
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
      setIsTared(false);
    }
  };

  // Set up keyboard controls
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
    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto px-4 py-8">
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

      {scaleError && (
        <div className="bg-red-500/20 p-4 rounded-lg w-full">
          {scaleError}
        </div>
      )}

      {showControls && <KeyboardHelp />}

      <div className="w-full flex flex-col items-center gap-8">
        <GameStatus
          currentPlayer={state.players[state.currentPlayerIndex]?.name}
          attempts={state.attempts}
          maxAttempts={state.maxAttempts}
          phase={state.phase}
          targetWeight={state.targetWeight}
          margin={state.margin}
        />

        <div className="relative w-full aspect-square max-w-[600px]">
          <GameTable
            players={state.players}
            currentPlayerIndex={state.currentPlayerIndex}
          />
        </div>

        {(state.dice1 > 0 && state.dice2 > 0) && (
          <div className="flex justify-center gap-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={state.dice1} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={state.dice2} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
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