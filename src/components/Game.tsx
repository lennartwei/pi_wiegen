import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Dice1, Scale, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useSession } from '../contexts/SessionContext';
import { useScale } from '../hooks/useScale';
import { isValidWeight, calculateScore } from '../utils/gameLogic';
import RoundResult from './RoundResult';
import AnimatedDice from './AnimatedDice';
import { API_BASE_URL } from '../config';

const BUTTON_COLORS = [
  { tare: 'bg-yellow-600 hover:bg-yellow-700', measure: 'bg-blue-600 hover:bg-blue-700' },
  { tare: 'bg-purple-600 hover:bg-purple-700', measure: 'bg-pink-600 hover:bg-pink-700' },
  { tare: 'bg-orange-600 hover:bg-orange-700', measure: 'bg-cyan-600 hover:bg-cyan-700' },
];

function Game() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { session, isOwner, updateSession, setSession } = useSession();
  const { getWeight, tare, isLoading, error: scaleError } = useScale();
  const [weight, setWeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundScore, setRoundScore] = useState({ score: 0, isPerfect: false, deviation: 0 });
  const [isTared, setIsTared] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState('');

  // Get the current color scheme based on attempts
  const colors = BUTTON_COLORS[session?.game_state.attempts % BUTTON_COLORS.length || 0];

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
        if (!response.ok) throw new Error('Session not found');
        
        const sessionData = await response.json();
        setSession(sessionData);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        navigate('/');
      }
    };

    if (!session) {
      fetchSession();
    }

    // Poll for updates every 2 seconds if not the owner
    let interval: NodeJS.Timeout;
    if (!isOwner && session) {
      interval = setInterval(fetchSession, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, session, setSession, navigate, isOwner]);

  const handleRollDice = async () => {
    if (!isOwner) return;
    
    setIsRolling(true);
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const targetWeight = Number(`${Math.max(dice1, dice2)}${Math.min(dice1, dice2)}`);

    try {
      await updateSession(undefined, {
        ...session!.game_state,
        dice1,
        dice2,
        targetWeight,
        phase: 'drinking',
        attempts: 0
      });
    } catch (error) {
      setError('Failed to update game state');
    } finally {
      setIsRolling(false);
    }
  };

  const handleTare = async () => {
    if (!isOwner) return;
    
    try {
      await tare();
      setIsTared(true);
    } catch (error) {
      console.error('Tare error:', error);
      setIsTared(false);
    }
  };

  const handleMeasure = async () => {
    if (!isOwner || !isTared) return;

    try {
      const measured = await getWeight(true);
      const measuredWeight = Math.abs(measured);
      setWeight(measuredWeight);
      
      const score = calculateScore(
        measuredWeight, 
        session!.game_state.targetWeight, 
        session!.settings
      );
      setRoundScore(score);
      
      const isWin = isValidWeight(
        measuredWeight, 
        session!.game_state.targetWeight, 
        session!.settings.margin
      );
      
      setShowResult(true);

      // Update player score
      const currentPlayer = session!.settings.players[session!.game_state.currentPlayerIndex];
      const updatedPlayers = [...session!.settings.players];
      updatedPlayers[session!.game_state.currentPlayerIndex] = {
        ...currentPlayer,
        score: currentPlayer.score + score.score
      };

      if (isWin) {
        setTimeout(async () => {
          setShowResult(false);
          await updateSession(
            { ...session!.settings, players: updatedPlayers },
            {
              ...session!.game_state,
              currentPlayerIndex: (session!.game_state.currentPlayerIndex + 1) % session!.settings.players.length,
              phase: 'rolling',
              dice1: 0,
              dice2: 0,
              attempts: 0
            }
          );
          setWeight(0);
          setIsTared(false);
        }, 2000);
      } else {
        const newAttempts = session!.game_state.attempts + 1;
        const isLastAttempt = newAttempts >= session!.settings.maxRetries;
        
        setTimeout(async () => {
          setShowResult(false);
          await updateSession(
            { ...session!.settings, players: updatedPlayers },
            {
              ...session!.game_state,
              attempts: newAttempts,
              ...(isLastAttempt ? {
                currentPlayerIndex: (session!.game_state.currentPlayerIndex + 1) % session!.settings.players.length,
                phase: 'rolling',
                dice1: 0,
                dice2: 0,
                attempts: 0
              } : {})
            }
          );
          if (isLastAttempt) {
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

  if (!session) {
    return (
      <div className="text-center py-8">
        <Loader2 className="animate-spin mx-auto mb-4" />
        Loading game...
      </div>
    );
  }

  const currentPlayer = session.settings.players[session.game_state.currentPlayerIndex];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">{session.name}</h1>
      </div>

      <div className="bg-white/10 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">
            Current Player: {currentPlayer.name}
          </h2>
          {session.game_state.phase === 'drinking' && (
            <div className="text-sm opacity-75">
              Attempt {session.game_state.attempts + 1}/{session.settings.maxRetries}
            </div>
          )}
        </div>

        {(scaleError || error) && (
          <div className="bg-red-500/20 p-4 rounded-lg mb-4">
            {scaleError || error}
          </div>
        )}

        {session.game_state.phase === 'rolling' && (
          <button
            onClick={handleRollDice}
            className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            disabled={!isOwner || isLoading || isRolling}
          >
            <Dice1 size={24} />
            Roll Dice
          </button>
        )}

        {(session.game_state.dice1 > 0 && session.game_state.dice2 > 0) && (
          <div className="flex justify-center gap-4 my-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={session.game_state.dice1} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
              <p className="text-center mt-2">{session.game_state.dice1}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <AnimatedDice 
                value={session.game_state.dice2} 
                onAnimationComplete={() => setIsRolling(false)} 
              />
              <p className="text-center mt-2">{session.game_state.dice2}</p>
            </div>
          </div>
        )}

        {session.game_state.phase === 'drinking' && (
          <div className="text-center space-y-4">
            <p className="text-lg mb-4">
              Target: {session.game_state.targetWeight}g ±{session.settings.margin}g
            </p>
            
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleTare}
                  className={`w-full p-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2
                    ${isTared ? 'bg-green-600 hover:bg-green-700' : colors.tare}`}
                  disabled={!isOwner || isLoading}
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
                  disabled={!isOwner || isLoading || !isTared}
                >
                  <Scale size={24} />
                  Measure Drink
                </button>
              </div>
            </div>

            {session.game_state.attempts > 0 && (
              <div className="mt-4 text-yellow-300 flex items-center justify-center gap-2">
                <AlertTriangle size={16} />
                {session.settings.maxRetries - session.game_state.attempts} {
                  session.settings.maxRetries - session.game_state.attempts === 1 ? 'try' : 'tries'
                } remaining
              </div>
            )}
          </div>
        )}

        {showResult && (
          <RoundResult 
            isWin={isValidWeight(weight, session.game_state.targetWeight, session.settings.margin)}
            weight={weight}
            targetWeight={session.game_state.targetWeight}
            margin={session.settings.margin}
            attemptsLeft={session.settings.maxRetries - session.game_state.attempts - 1}
            score={roundScore.score}
            isPerfect={roundScore.isPerfect}
          />
        )}

        {/* Scoreboard */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-3">Scoreboard</h3>
          <div className="space-y-2">
            {session.settings.players.map((player, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center p-2 rounded
                  ${index === session.game_state.currentPlayerIndex ? 'bg-white/20' : 'bg-white/10'}`}
              >
                <span>{player.name}</span>
                <span className="font-mono">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        {!isOwner && (
          <div className="mt-4 text-center text-sm opacity-75">
            Spectator Mode - Only the game host can control the game
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;