import { useCallback, useEffect, useState } from 'react';

const cache = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = () => {
    cache.delete(url);
    setReloadIndex((i) => i + 1);
  };

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);

      if (cache.has(url)) {
        setData(cache.get(url) as T);
        setIsLoading(false);
        setError(null);
        return;
      }
      if (inFlight.has(url)) {
        const existingPromise = inFlight.get(url);
        const result = await existingPromise;
        setData(result as T);
        setIsLoading(false);
        setError(null);

        return;
      }

      setError(null);
      const fetchPromise = fetch(url, { signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          cache.set(url, json);
          inFlight.delete(url);
          return json;
        })
        .catch((err) => {
          inFlight.delete(url);
          throw err;
        });

      inFlight.set(url, fetchPromise);

      try {
        const result = await fetchPromise;
        setData(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (error.name === 'AbortError') return;
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [url, fetchData, reloadIndex]);

  return { data, error, isLoading, refetch };
}
