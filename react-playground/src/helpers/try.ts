import { useCallback, useEffect, useState } from 'react';

const cache = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);

      if (cache.has(url)) {
        setData(cache.get(url) as T);
        setLoading(false);
        return;
      }

      if (inFlight.has(url)) {
        const existingPromise = inFlight.get(url);
        const data = await existingPromise;
        setData(data as T);
        setLoading(false);
        return;
      }

      const fetchPromise = fetch(url, { signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Response status: ${res.status}`);

          return res.json();
        })
        .then((data) => {
          cache.set(url, data);
          inFlight.delete(url);
          return data;
        })
        .catch((err) => {
          inFlight.delete(url);
          throw err;
        });

      inFlight.set(url, fetchPromise);
      try {
        const response = await fetchPromise;
        setData(response);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (error.name === 'AbortError') return;
        setError(error);
      } finally {
        setLoading(false);
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
  }, [fetchData, url]);

  return { data, error, loading };
}
