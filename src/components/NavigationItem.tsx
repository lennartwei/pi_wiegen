import React from 'react';
import { useNavigation } from '../hooks/useNavigation';

interface NavigationItemProps {
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function NavigationItem({ 
  index, 
  children, 
  onClick, 
  className = '' 
}: NavigationItemProps) {
  const { selectedIndex } = useNavigation();
  const isSelected = selectedIndex === index;

  return (
    <div
      data-nav-index={index}
      onClick={onClick}
      className={`
        transition-all duration-200
        ${isSelected ? 'scale-105 ring-2 ring-white/50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}