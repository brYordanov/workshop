import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebouncedState<T>(value: T, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

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
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: { isLeading: boolean; isTrailing: boolean } = {
    isLeading: true,
    isTrailing: false,
  }
) {
  const { isLeading, isTrailing } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  const shouldtrailRef = useRef(false);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (!timerRef.current && isLeading) {
        fnRef.current(...args);
        shouldtrailRef.current = false;
      } else {
        shouldtrailRef.current = true;
      }

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (shouldtrailRef.current && isTrailing) {
          fnRef.current(...args);
        }
        timerRef.current = null;
      }, delay);
    },
    [delay, isLeading, isTrailing]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFn;
}

// eslint-disable-next-line
export function useThrottle<T extends (...args: any[]) => any>(
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
