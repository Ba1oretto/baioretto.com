import { useCallback } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

export default function useDarkMode(defaultValue?: boolean): readonly [boolean, (() => void)] {
  const isDarkOS = useMediaQuery("(prefers-color-scheme)");
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>("dark-mode", defaultValue ?? isDarkOS);

  const toggle = useCallback<() => void>(() => {
    setDarkMode(!isDarkMode);
    // eslint-disable-next-line
  }, [isDarkMode]);

  return [isDarkMode, toggle] as const;
}