import { createCookieSessionStorage } from "@remix-run/node";
import { IS_PRODUCTION, COOKIE_SECRET } from "./variable.server";
import type { Theme } from "~/components/ThemeProvider";

function isTheme(theme: unknown): theme is Theme {
  return theme === "dark" || theme === "light";
}

const storage = createCookieSessionStorage({
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

function getThemeSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getTheme(request: Request) {
  const session = await getThemeSession(request);
  const theme = session.get("theme");
  return isTheme(theme) ? theme : undefined;
}

async function updateTheme(request: Request, theme: string) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  if (theme === session.get("theme")) return undefined;
  session.set("theme", theme);
  return {
    "Set-Cookie": await storage.commitSession(session),
  };
}

export {
  getTheme,
  updateTheme,
};