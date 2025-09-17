import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void;
}

export function useRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
) {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async (...args: Parameters<T>) => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          setIsRetrying(true);
          onRetry?.(attempt);
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
        
        const result = await fn(...args);
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          setRetryCount(0);
          setIsRetrying(false);
          throw lastError;
        }
        
        setRetryCount(attempt + 1);
      }
    }
  }, [fn, maxRetries, retryDelay, onRetry]);

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries
  };
}
