import { useCallback, useEffect, useState } from 'react';

const TTL = 1000 * 60 * 5;

const cache = new Map<string, { data: unknown; expires: number }>();
const inFlight = new Map<string, Promise<unknown>>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLaoding, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      try {
        const cached = cache.get(url);
        if (cached) {
          setData(cache.get(url)!.data as T);
          if (cached.expires > Date.now()) return;
          else setIsLoading(true);
        }
        setError(null);

        let promise = inFlight.get(url);
        if (!promise) {
          promise = fetch(url, { signal })
            .then((response) => {
              if (!response.ok) throw new Error('not ok');
              return response.json();
            })
            .then((data) => {
              cache.set(url, { data, expires: Date.now() + TTL });
              return data;
            })
            .finally(() => {
              inFlight.delete(url);
            });

          inFlight.set(url, promise);
        }

        const abortPromise = new Promise((res, rej) => {
          signal.addEventListener('abort', () => {
            rej(new DOMException('Aborted', 'AbortError'));
          });
        });

        const result = Promise.race([promise, abortPromise]);

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

  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchData(controller.signal);

    return () => controller.abort();
  }, [fetchData, refetchIndex]);

  return { data, isLaoding, error, refetch };
}
