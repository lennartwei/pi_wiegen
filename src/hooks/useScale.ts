import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';

// Singleton to manage weight measurement priority
const weightMeasurement = {
  isPriority: false,
  setPriority: (value: boolean) => {
    weightMeasurement.isPriority = value;
  }
};

export interface ScaleResponse {
  weight: number;
  error?: string;
}

export function useScale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeight = useCallback(async (priority: boolean = false): Promise<number> => {
    if (!priority && weightMeasurement.isPriority) {
      // Skip non-priority measurements when a priority measurement is in progress
      return 0;
    }

    if (priority) {
      weightMeasurement.setPriority(true);
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/weight`);
      const data: ScaleResponse = await response.json();
      if (data.error) throw new Error(data.error);
      return data.weight;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read weight';
      setError(message);
      return 0;
    } finally {
      setIsLoading(false);
      if (priority) {
        weightMeasurement.setPriority(false);
      }
    }
  }, []);

  const tare = useCallback(async (): Promise<boolean> => {
    weightMeasurement.setPriority(true);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to tare scale';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
      weightMeasurement.setPriority(false);
    }
  }, []);

  const resetScale = useCallback(async (): Promise<boolean> => {
    weightMeasurement.setPriority(true);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset scale';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
      weightMeasurement.setPriority(false);
    }
  }, []);

  return { getWeight, tare, resetScale, isLoading, error };
}