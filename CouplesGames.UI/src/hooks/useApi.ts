import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

// Generic hook for API calls with error and loading state management.
interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
}

interface ApiHookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: ApiHookOptions<T> = {}
): ApiHookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error(error, {
          action: apiFunction.name,
          additionalInfo: { args }
        });
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { data, loading, error, execute };
}