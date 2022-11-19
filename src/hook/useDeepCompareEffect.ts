import isEqual from "lodash.isequal";
import { useEffect, useRef } from "react";

export default function useDeepCompareEffect<T extends unknown[]>(callback: () => void, deps?: T): void {
  const depsRef = useRef<T>();

  if (!isEqual(depsRef.current, deps)) {
    depsRef.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, depsRef.current);
}