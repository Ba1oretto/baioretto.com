import { createCookieSessionStorage } from "@remix-run/node";
import { IS_PRODUCTION, COOKIE_SECRET } from "./variable.server";

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
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function getTheme(request: Request): Promise<Theme>  {
  const session = await theme_storage.getSession(request.headers.get("Cookie"));
  const theme = session.get("theme");
  return validateTheme(theme) ? theme : "dark";
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