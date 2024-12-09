import { useState, useEffect, useCallback } from 'react';
import { WEIGHT_DISPLAY_CONFIG } from '../config';
import type { WeightDisplayConfig } from '../types';

const WEIGHT_DISPLAY_KEY = 'weightDisplayConfig';

const DEFAULT_CONFIG: WeightDisplayConfig = {
  enabled: false,
  updateRate: WEIGHT_DISPLAY_CONFIG.DEFAULT_UPDATE_RATE
};

export function useWeightDisplayConfig() {
  const [config, setConfig] = useState<WeightDisplayConfig>(() => {
    try {
      const stored = localStorage.getItem(WEIGHT_DISPLAY_KEY);
      if (!stored) return DEFAULT_CONFIG;
      
      const parsed = JSON.parse(stored);
      return {
        enabled: Boolean(parsed.enabled),
        updateRate: Number(parsed.updateRate) || DEFAULT_CONFIG.updateRate
      };
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WEIGHT_DISPLAY_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving weight display config:', error);
    }
  }, [config]);

  const toggleWeightDisplay = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  }, []);

  const setUpdateRate = useCallback((rate: number) => {
    const validRate = Math.max(
      WEIGHT_DISPLAY_CONFIG.MIN_UPDATE_RATE,
      Math.min(WEIGHT_DISPLAY_CONFIG.MAX_UPDATE_RATE, rate)
    );
    
    setConfig(prev => ({
      ...prev,
      updateRate: validRate
    }));
  }, []);

  return {
    showWeightDisplay: config.enabled,
    updateRate: config.updateRate,
    toggleWeightDisplay,
    setUpdateRate
  };
}