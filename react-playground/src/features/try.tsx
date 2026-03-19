import { useEffect, useRef, useState } from 'react';

export function useDebouncedState<T>(value: T, delay: number) {
  const [debouncedState, setDebouncedState] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedState;
}

export function useThrottledState(value, delay) {
  const [throttledState, setThrottledState] = useState(value);
  const lastCallTimeRef = useRef(0);

  const throttledSet = (value) => {
    const now = Date.now();
    if (now - lastCallTimeRef.current >= delay) {
      setThrottledState(value);
      lastCallTimeRef.current = now;
    }
  };

  return { throttledState, throttledSet };
}
