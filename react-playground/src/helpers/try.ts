import { useCallback, useEffect, useState } from 'react';

const TTL = 1000 * 60 * 5;
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const inFlight = new Map<string, Promise<unknown>>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      try {
        const cached = cache.get(url);
        if (cached) {
          setData(cached.data as T);
          if (cached.expiresAt > Date.now()) return;
        }

        setError(null);
        setIsLoading(true);

        let promise = inFlight.get(url);
        if (!promise) {
          promise = fetch(url)
            .then((response) => {
              if (!response.ok) throw new Error('not ok');
              return response.json();
            })
            .then((data) => {
              cache.set(url, { data, expiresAt: Date.now() + TTL });
              return data;
            })
            .finally(() => {
              inFlight.delete(url);
            });
        }

        inFlight.set(url, promise);

        const abortPromise = new Promise((_, rej) => {
          signal.addEventListener('abort', () => {
            rej(new DOMException());
          });
        });

        const result = await Promise.race([promise, abortPromise]);
        setData(result as T);
      } catch (err) {
        if (signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!signal.aborted) setIsLoading(false);
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
