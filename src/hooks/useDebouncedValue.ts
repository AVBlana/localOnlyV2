import { useEffect, useState } from "react";

/**
 * Returns a debounced version of `value` that updates only after `delay` ms
 * of the value not changing. Uses for performance (e.g. search-as-you-type).
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
