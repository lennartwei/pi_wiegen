import { useEffect, useCallback } from 'react';

export function useKeyboardControls({
  onRoll,
  onTare,
  onMeasure,
  canRoll,
  canTare,
  canMeasure,
}: {
  onRoll: () => void;
  onTare: () => void;
  onMeasure: () => void;
  canRoll: boolean;
  canTare: boolean;
  canMeasure: boolean;
}) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent handling if user is typing in an input
    if (event.target instanceof HTMLInputElement) return;
    
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        if (canRoll) {
          onRoll();
        } else if (canMeasure) {
          onMeasure();
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        if (canTare) {
          onTare();
        }
        break;
    }
  }, [onRoll, onTare, onMeasure, canRoll, canTare, canMeasure]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}