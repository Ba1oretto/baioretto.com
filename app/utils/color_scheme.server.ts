import type { ColorScheme } from "~/utils/ColorSchemeProvider";

import { createCookieSessionStorage } from "@remix-run/node";
import { is_production, session_secret } from "~/utils/session.server";
import { isColorScheme } from "~/utils/ColorSchemeProvider";

const COLOR_SCHEME = "color_scheme";

const storage = createCookieSessionStorage({
  cookie: {
    name: COLOR_SCHEME,
    secure: is_production,
    secrets: [ session_secret ],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 1707195600,
  },
});

const getColorSchemeSession = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return {
    read: () => {
      const value = session.get(COLOR_SCHEME);
      return isColorScheme(value) ? value : null;
    },
    update: (colorScheme: ColorScheme) => session.set(COLOR_SCHEME, colorScheme),
    commit: () => storage.commitSession(session),
  };
};

export {
  getColorSchemeSession,
};