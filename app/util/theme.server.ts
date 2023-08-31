import { createCookieSessionStorage } from "@remix-run/node";
import { COOKIE_SECRET, IS_PRODUCTION } from "./variable.server";

type Theme = "dark" | "light";

function validateTheme(theme: unknown): theme is Theme {
  return theme === "dark" || theme === "light";
}

const theme_storage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    secure: IS_PRODUCTION,
    secrets: [ COOKIE_SECRET ],
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  },
});

async function getTheme(request: Request): Promise<{ theme: Theme, headers?: HeadersInit }> {
  const session = await theme_storage.getSession(request.headers.get("Cookie"));
  const theme = session.get("theme");
  if (validateTheme(theme)) {
    return { theme };
  } else {
    session.set("theme", "dark");
    return {
      theme: "dark",
      headers: {
        "Set-Cookie": await theme_storage.commitSession(session),
      },
    };
  }
}

async function getThemeToggledHeader(request: Request) {
  const session = await theme_storage.getSession(request.headers.get("Cookie"));
  const current_theme = session.get("theme");

  if (!validateTheme(current_theme)) {
    session.set("theme", "dark");
  } else {
    session.set("theme", current_theme === "dark" ? "light" : "dark");
  }

  return {
    "Set-Cookie": await theme_storage.commitSession(session),
  };
}

export {
  getTheme,
  getThemeToggledHeader,
};