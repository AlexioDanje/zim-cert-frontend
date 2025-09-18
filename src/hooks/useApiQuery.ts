/**
 * Professional React Query hook wrapper with enhanced error handling
 * Provides consistent loading states, error handling, and caching
 */

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { handleApiError } from '../utils/apiErrorHandler';

// Enhanced query options interface
export interface UseApiQueryOptions<T> {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

// Enhanced mutation options interface
export interface UseApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  invalidateQueries?: QueryKey[];
}

/**
 * Enhanced useQuery wrapper with professional error handling
 */
export function useApiQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions<T> = {}
) {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retry = 2,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    ...queryOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await queryFn();
        
        if (onSuccess) {
          onSuccess(data);
        }
        
        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }
        
        return data;
      } catch (error) {
        const apiError = handleApiError(error);
        
        if (onError) {
          onError(new Error(apiError.message));
        }
        
        if (showErrorToast) {
          toast.error(apiError.message);
        }
        
        throw new Error(apiError.message);
      }
    },
    enabled,
    staleTime,
    cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      const apiError = handleApiError(error);
      if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
        return false;
      }
      
      if (typeof retry === 'boolean') {
        return retry && failureCount < 3;
      }
      
      return failureCount < retry;
    },
    refetchOnWindowFocus,
    ...queryOptions,
  });
}

/**
 * Enhanced useMutation wrapper with professional error handling
 */
export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables> = {}
) {
  const queryClient = useQueryClient();
  
  const {
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = true,
    successMessage,
    invalidateQueries = [],
  } = options;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        const data = await mutationFn(variables);
        return data;
      } catch (error) {
        const apiError = handleApiError(error);
        throw new Error(apiError.message);
      }
    },
    onSuccess: async (data, variables) => {
      if (onSuccess) {
        onSuccess(data, variables);
      }
      
      if (showSuccessToast) {
        toast.success(successMessage || 'Operation completed successfully');
      }
      
      // Invalidate specified queries
      for (const queryKey of invalidateQueries) {
        await queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error: Error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      
      if (showErrorToast) {
        toast.error(error.message);
      }
    },
  });
}

/**
 * Hook for managing loading states across multiple queries
 */
export function useLoadingState(queries: Array<{ isLoading: boolean; error?: Error | null }>) {
  const isLoading = queries.some(query => query.isLoading);
  const hasError = queries.some(query => query.error);
  const errors = queries.filter(query => query.error).map(query => query.error!);

  return {
    isLoading,
    hasError,
    errors,
    isReady: !isLoading && !hasError,
  };
}

/**
 * Hook for managing pagination state
 */
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (newPage: number) => setPage(Math.max(1, newPage));
  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    setPage,
    setPageSize,
  };
}

/**
 * Hook for managing search/filter state
 */
export function useSearchFilters<T extends Record<string, any>>(
  initialFilters: T,
  debounceMs = 500
) {
  const [filters, setFilters] = React.useState<T>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = React.useState<T>(initialFilters);

  // Debounce filter changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [filters, debounceMs]);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = React.useMemo(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      const initialValue = initialFilters[key];
      
      if (typeof value === 'string') {
        return value.trim() !== (initialValue as string || '').trim();
      }
      
      return value !== initialValue;
    });
  }, [filters, initialFilters]);

  return {
    filters,
    debouncedFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    setFilters,
  };
}
