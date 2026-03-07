import { useCallback, useEffect, useRef, useState } from 'react';

export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
) => {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        fn(...args);
      }
    },
    [fn, delay]
  );
};

export function useThrottledState<T>(initialValue: T, delay: number = 300) {
  const [throttledValue, setThrottledValue] = useState(initialValue);
  const lastCallTime = useRef(0);

  const throttledSet = useCallback(
    (value: T) => {
      const now = Date.now();
      if (now - lastCallTime.current >= delay) {
        lastCallTime.current = now;
        setThrottledValue(value);
      }
    },
    [delay]
  );

  return [throttledValue, throttledSet] as const;
}

// eslint-disable-next-line
export function useFancyThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: { isLeading: boolean; isTrailing: boolean } = {
    isLeading: true,
    isTrailing: false,
  }
) {
  const { isLeading, isTrailing } = options;
  const lastCallTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const throttledFunc = useCallback(
    (...args: Parameters<T>) => {
      lastArgs.current = args;
      const now = Date.now();

      const remaining = delay - (now - lastCallTimeRef.current);

      if (remaining <= 0 && isLeading) {
        fnRef.current(...lastArgs.current);
        timerRef.current = null;
        if (timerRef.current) clearTimeout(timerRef.current);
        lastCallTimeRef.current = now;
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(
          () => {
            if (lastArgs.current && isTrailing)
              fnRef.current(...lastArgs.current);
            lastCallTimeRef.current = Date.now();
            timerRef.current = null;
          },
          remaining <= 0 ? delay : remaining
        );
      }
    },
    [delay, isLeading, isTrailing]
  );

  return throttledFunc;
}
