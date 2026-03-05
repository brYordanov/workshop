import { useCallback, useEffect, useRef, useState } from 'react';

interface DebounceOptions {
  isLeading?: boolean;
  isTrailing?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) => {
  const timerRef = useRef(0);
  const fnRef = useRef(fn);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return debouncedFn;
};

export const useDebouncedState = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFancyDeb<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  { isLeading = true, isTrailing = true }: DebounceOptions = {}
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  const lastArgs = useRef<Parameters<T> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current && lastArgs.current) {
      fnRef.current(...lastArgs.current);
      cancel();
    }
  }, [cancel]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      lastArgs.current = args;

      if (timerRef.current) clearTimeout(timerRef.current);

      if (isLeading && !timerRef.current) {
        fnRef.current(...lastArgs.current);
        lastArgs.current = null;
      }

      timerRef.current = setTimeout(() => {
        if (isTrailing && lastArgs.current) {
          fnRef.current(...lastArgs.current);
        }

        timerRef.current = null;
      }, delay);
    },
    [delay, isLeading, isTrailing]
  );

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => () => cancel(), [cancel]);

  return { debouncedFn, cancel, flush };
}
