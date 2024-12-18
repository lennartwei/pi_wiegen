import { useState } from 'react';

export function useRollAnimation() {
  const [isRolling, setIsRolling] = useState(false);

  const handleRollClick = async (rollDice: () => void) => {
    setIsRolling(true);
    rollDice();
    setTimeout(() => {
      setIsRolling(false);
    }, 1500);
  };

  return {
    isRolling,
    handleRollClick
  };
}