import React, { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface AnimatedDiceProps {
  value: number;
  size?: number;
  onAnimationComplete?: () => void;
}

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

function AnimatedDice({ value, size = 48, onAnimationComplete }: AnimatedDiceProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 6);
    }, 100);

    const timeout = setTimeout(() => {
      setIsAnimating(false);
      clearInterval(interval);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAnimating, onAnimationComplete]);

  const DiceIcon = isAnimating ? DICE_ICONS[currentFrame] : DICE_ICONS[value - 1];

  return (
    <div className={`transform transition-transform duration-300 ${isAnimating ? 'animate-spin' : ''}`}>
      <DiceIcon size={size} className={isAnimating ? 'opacity-75' : 'opacity-100'} />
    </div>
  );
}

export default AnimatedDice;