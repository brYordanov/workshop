import { useCallback, useEffect, useState } from 'react';

const cache = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

// export function useFetch<T>(url: string) {
//   const [data, setData] = useState<T | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [reloadIndex, setReloadIndex] = useState(0);

//   const refetch = () => {
//     cache.delete(url);
//     setReloadIndex((i) => i + 1);
//   };

//   const fetchData = useCallback(
//     async (signal: AbortSignal) => {
//       setIsLoading(true);
//       setError(null);

//       if (cache.has(url)) {
//         setData(cache.get(url) as T);
//         setIsLoading(false);
//         return;
//       }
//       if (inFlight.has(url)) {
//         const existingPromise = inFlight.get(url);
//         const result = await existingPromise;
//         setData(result as T);
//         setIsLoading(false);

//         return;
//       }

//       const fetchPromise = fetch(url, { signal })
//         .then((res) => {
//           if (!res.ok) throw new Error(`HTTP ${res.status}`);
//           return res.json();
//         })
//         .then((json) => {
//           cache.set(url, json);
//           inFlight.delete(url);
//           return json;
//         })
//         .catch((err) => {
//           inFlight.delete(url);
//           throw err;
//         });

//       inFlight.set(url, fetchPromise);

//       try {
//         const result = await fetchPromise;
//         setData(result);
//       } catch (err) {
//         const error = err instanceof Error ? err : new Error(String(err));
//         if (error.name === 'AbortError') return;
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [url]
//   );

//   useEffect(() => {
//     const controller = new AbortController();
//     fetchData(controller.signal);

//     return () => {
//       controller.abort();
//     };
//   }, [url, fetchData, reloadIndex]);

//   return { data, error, isLoading, refetch };
// }

export function useFetchV2<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => {
    cache.delete(url);
    setReloadIndex((i) => i + 1);
  }, [url]);

  const fetchData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);

      try {
        if (cache.has(url)) {
          setData(cache.get(url) as T);
          return;
        }

        // Reuse or create a signal-agnostic shared promise
        let promise = inFlight.get(url);
        if (!promise) {
          promise = fetch(url) // no signal — shared across all consumers
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
            .then((json) => {
              cache.set(url, json);
              return json;
            })
            .finally(() => {
              inFlight.delete(url);
            });

          inFlight.set(url, promise);
        }

        const result = await promise;

        // Per-component guard: we awaited, but were we cancelled in the meantime?
        if (signal.aborted) return;

        setData(result as T);
      } catch (err) {
        if (signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        // Only update loading state if we're still the active request
        if (!signal.aborted) setIsLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData, reloadIndex]);

  return { data, error, isLoading, refetch };
}
