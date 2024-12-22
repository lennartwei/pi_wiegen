import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJoystick, Direction } from '../hooks/useJoystick';
import { debounce } from '../utils/debounce';

interface NavigationContextType {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleSelect: () => void;
  maxIndex: number;
  setMaxIndex: (max: number) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  selectedIndex: 0,
  setSelectedIndex: () => {},
  handleSelect: () => {},
  maxIndex: 0,
  setMaxIndex: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<Direction | null>(null);
  const [lastActivationTime, setLastActivationTime] = useState(0);
  const { direction } = useJoystick();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = () => {
    const now = Date.now();
    if (now - lastActivationTime < 300) return; // Debounce activation
    
    const element = document.querySelector(`[data-nav-index="${selectedIndex}"]`) as HTMLElement;
    if (element) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(clickEvent);
      setLastActivationTime(now);
    }
  };

  // Reset selection when route changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [location.pathname]);

  // Handle joystick navigation
  useEffect(() => {
    if (direction === lastDirection) return;
    setLastDirection(direction);

    switch (direction) {
      case 'up':
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'down':
        setSelectedIndex(prev => Math.min(maxIndex, prev + 1));
        break;
      case 'left':
        if (location.pathname !== '/') {
          navigate(-1);
        }
        break;
      case 'right':
        handleSelect();
        break;
      default:
        break;
    }
  }, [direction, maxIndex, navigate, location.pathname, lastDirection, selectedIndex]);

  return (
    <NavigationContext.Provider 
      value={{ 
        selectedIndex, 
        setSelectedIndex, 
        handleSelect,
        maxIndex,
        setMaxIndex
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}