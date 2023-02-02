import type { Children, Nullable, StateSetter } from "~/utils/helper.server";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";

enum ColorScheme {
  DARK = "dark",
  LIGHT = "light",
}

type ColorSchemeContextValue = {
  color_scheme: Nullable<ColorScheme>,
  setColorScheme: StateSetter<Nullable<ColorScheme>>,
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(undefined);

const getPreferredColorScheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? ColorScheme.DARK : ColorScheme.LIGHT;

const color_scheme_option = Object.values(ColorScheme);

function isColorScheme(scheme: unknown): scheme is ColorScheme {
  return typeof scheme === "string" && color_scheme_option.includes(scheme as ColorScheme);
}

function ColorSchemeProvider({ children, _default }: Children & { _default: Nullable<ColorScheme> }) {
  const [ color_scheme, setColorScheme ] = useState<Nullable<ColorScheme>>(() => _default ? _default : (typeof window === "undefined") ? null : getPreferredColorScheme());

  const persist_color_scheme = useFetcher();

  const persist_color_scheme_ref = useRef(persist_color_scheme);
  useEffect(() => {
    persist_color_scheme_ref.current = persist_color_scheme;
  }, [ persist_color_scheme ]);

  const mount_run = useRef(false);

  useEffect(() => {
    if (!mount_run.current) {
      mount_run.current = true;
      return;
    }

    if (!color_scheme) {
      return;
    }

    persist_color_scheme_ref.current.submit({ color_scheme }, { action: "action/SetColorScheme", method: "post" });
  }, [ color_scheme ]);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setColorScheme(matchMedia.matches ? ColorScheme.DARK : ColorScheme.LIGHT);
    matchMedia.addEventListener("change", onChange);
    return () => matchMedia.removeEventListener("change", onChange);
  }, []);

  return (
    <ColorSchemeContext.Provider value={{ color_scheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) throw new Error("...");
  return context;
}

const clientColorSchemeCode = `;(() => {
  const classes = document.body.classList;
  if (classes.contains("dark") || classes.contains("light")) return;
  const color_scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  classes.add(color_scheme);
  const meta = document.querySelector("meta[name=color-scheme]");
  if (meta) meta.content = color_scheme === "dark" ? "dark light" : "light dark";
})();`;

function ColorSchemeHead({ provided }: { provided: boolean }) {
  return provided ? null : (
    <script dangerouslySetInnerHTML={{ __html: clientColorSchemeCode }} />
  );
}

export {
  ColorScheme,
  ColorSchemeHead,
  ColorSchemeProvider,
  useColorScheme,
  isColorScheme,
};