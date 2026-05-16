import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a stable debounced version of the given callback.
 * The debounced function delays invoking callback until after
 * `delay` milliseconds have elapsed since the last invocation.
 * Cleans up on unmount.
 */
export function useDebounce(callback, delay = 1500) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Keep callback ref fresh without restarting the timer
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debouncedFn = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { debouncedFn, cancel };
}
