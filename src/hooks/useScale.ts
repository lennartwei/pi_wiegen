import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';

export interface ScaleResponse {
  weight: number;
  error?: string;
}

export function useScale() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeight = useCallback(async (): Promise<number> => {
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
    }
  }, []);

  const tare = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tare`, {
        method: 'POST',
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
    }
  }, []);

  return { getWeight, tare, isLoading, error };
}