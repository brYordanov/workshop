import { useCallback, useEffect, useState } from 'react';

const cache = new Map<string, { data: unknown; expiresAt: number }>();
const TTL = 1000 * 60 * 5;
const inFlight = new Map<string, Promise<unknown>>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      try {
        setError(null);

        const cached = cache.get(url);
        if (cached) {
          setData(cached.data as T);
          if (cached.expiresAt > Date.now()) return;
        }

        setIsLoading(true);

        let promise = inFlight.get(url);
        if (!promise) {
          promise = fetch(url, { signal })
            .then((response) => {
              if (!response.ok) throw new Error(`HTTP err: ${response.status}`);
              return response.json();
            })
            .then((res) => {
              cache.set(url, { data: res, expiresAt: Date.now() + TTL });
              return data;
            })
            .finally(() => {
              inFlight.delete(url);
            });
          inFlight.set(url, promise);
        }

        const abortPromise = new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted'));
          });
        });

        const result = await Promise.race([promise, abortPromise]);

        setData(result as T);
      } catch (err) {
        if (signal.aborted) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  const refetch = () => setRefetchIndex((prev) => prev + 1);

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller.signal);

    return () => controller.abort();
  }, [fetchData, refetchIndex]);

  return { data, error, isLoading, refetch };
}
