import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { useEffect } from "react";

const darkModeAtom = atomWithStorage("dark-mode", window.matchMedia("(prefers-color-scheme: dark)").matches);

export default function () {
  const [ isDarkMode, setDarkMode ] = useAtom(darkModeAtom);

  useEffect(() => {
    document.body.setAttribute("data-darkmode-enable", isDarkMode ? "true" : "false");
  }, [ isDarkMode ]);

  return {
    setDarkMode,
  };
}