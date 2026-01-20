import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

interface UseFetchOptions extends AxiosRequestConfig {
  skip?: boolean; // Skip automatic fetch on mount
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>;
}

/**
 * Custom hook to handle backend requests with axios
 * @template T - The type of the response data
 * @param url - The API endpoint URL
 * @param options - Axios request config and hook options
 * @returns Object containing data, loading, error states and refetch function
 *
 * @example
 * const { data, loading, error, refetch } = useFetch('/api/owners');
 *
 * @example
 * const { data, loading, error } = useFetch('/api/owners', {
 *   method: 'POST',
 *   data: { name: 'John' },
 *   skip: true // Don't fetch on mount
 * });
 */
export const useFetch = <T = unknown,>(
  url: string,
  options?: UseFetchOptions
): UseFetchReturn<T> => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { skip = false, ...axiosConfigOptions } = options || {};
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { skip: _, ...axiosConfig } = optionsRef.current || {};
      const response = await axios<T>(url, {
        ...axiosConfig,
      });
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const error = err instanceof AxiosError ? err : new AxiosError('Unknown error');
      setState({
        data: null,
        loading: false,
        error,
      });
    }
  }, [url]);

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [fetchData, skip]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
};

export default useFetch;
