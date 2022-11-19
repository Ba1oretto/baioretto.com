import { useState } from "react";
import useDeepCompareEffect from "./useDeepCompareEffect";

export default function useDebouncedValue<T>(value: T, delay?: number): [T, (value: T) => void] {
  const [v, sv] = useState<T>(value);
  const [debouncedValue, setDebouncedValue] = useState<T>(v);

  function setValue(value: T) {
    sv(value);
  }

  useDeepCompareEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(v), delay ?? 500);
    return () => clearTimeout(timer);
  }, [v, delay]);

  return [debouncedValue, setValue];
}