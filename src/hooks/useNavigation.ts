import { useContext, useEffect } from 'react';
import { NavigationContext } from '../contexts/NavigationContext';

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

export function useNavigationSetup(itemCount: number) {
  const { setMaxIndex } = useNavigation();
  
  useEffect(() => {
    setMaxIndex(itemCount - 1);
  }, [itemCount, setMaxIndex]);
}