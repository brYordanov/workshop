import { useCallback, useRef } from 'react';

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
