import type { ReactNode } from "react";

import { useFetcher } from "@remix-run/react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const ThemeContext = createContext<Theme | null>(null);

function ThemeProvider({ theme, children }: { theme?: Theme, children: ReactNode }) {
  const theme_effect_event = useRef<Theme>();
  useEffect(() => {
    theme_effect_event.current = theme;
  }, [ theme ]);

  const fetcher = useFetcher();
  const fetcher_effect_event = useRef(fetcher);
  useEffect(() => {
    fetcher_effect_event.current = fetcher;
  }, [ fetcher ]);

  const theme_shadow = useMemo(() => theme ? theme : (typeof window === "undefined") ? null : window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.DARK : Theme.LIGHT, [ theme ]);
  useEffect(() => {
    if (theme_effect_event.current !== undefined || !theme_shadow) return;
    fetcher_effect_event.current.submit({ theme: theme_shadow }, { action: "action/setTheme", method: "post" });
  }, [ theme_shadow ]);

  return (
    <ThemeContext.Provider value={theme_shadow}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const current_theme = useContext(ThemeContext);
  const fetcher = useFetcher();

  return {
    read() {
      return current_theme;
    },
    update(target?: Theme) {
      fetcher.submit({
        theme: target ? target : current_theme === "dark" ? "light" : "dark",
      }, {
        action: "Action/SetTheme", method: "post",
      });
    },
  };
}

export {
  Theme,
  ThemeProvider,
  useTheme,
};