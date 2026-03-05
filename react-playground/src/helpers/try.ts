import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottledFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: { isTrailing: boolean; isLeading: boolean } = {
    isLeading: false,
    isTrailing: true,
  }
) {
  const { isLeading, isTrailing } = options;
  const lastCallTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const fnRef = useRef(fn);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      const now = Date.now();
      const remaining = delay - (now - lastCallTimeRef.current);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        fnRef.current(...args!);
        lastCallTimeRef.current = now;
        timerRef.current = null;
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            fnRef.current(...lastArgsRef.current!);
            lastCallTimeRef.current = Date.now();
            timerRef.current = null;
          }
        }, remaining);
      }
    },
    [delay]
  );

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return throttledFn;
}
