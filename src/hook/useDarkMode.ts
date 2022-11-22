import { useCallback, useEffect } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

export default function useDarkMode(defaultValue?: boolean): { isDarkMode: boolean, toggleDarkMode: () => void } {
  const isDarkOS = useMediaQuery("(prefers-color-scheme)");
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>("dark-mode", defaultValue ?? isDarkOS);

  const toggleState = useCallback(() => {
    setDarkMode(prevState => !prevState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode: toggleState };
}