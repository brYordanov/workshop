import { useCallback, useEffect, useRef, useState } from 'react';

export function useInfiniteScroll<T>(fetchFn: (page: number) => Promise<T[]>) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const fnRef = useRef(fetchFn);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchMore = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await fnRef.current(page);

      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        fetchMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchMore, hasMore]);

  return { items, sentinelRef, isLoading };
}
