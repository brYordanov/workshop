import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) => {
  const timerRef = useRef(0);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

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
