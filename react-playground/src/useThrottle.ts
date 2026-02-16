import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
    const lastRef = useRef(0)

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now()
        if(now - lastRef.current >= delay) {
            lastRef.current = now
            fn(...args)
        } 
    }, [fn, delay])
}