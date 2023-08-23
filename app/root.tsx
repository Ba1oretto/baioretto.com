import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation, useNavigate } from "@remix-run/react";

import base_styles from "./tailwind.css";
import shimmer_style from "~/css/shimmer.css";
import animation_style from "~/css/animation.css";
import { getTheme } from "~/utils/theme.server";
import { ThemeProvider } from "~/components/ThemeProvider";
import Header from "~/components/header/Header";
import { ModalOutlet, ModalProvider } from "~/components/modal/Modal";
import { _NavLinks } from "~/components/header/PathLink";
import classNames from "classnames";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [ { rel: "stylesheet", href: cssBundleHref } ] : []),
  { rel: "stylesheet", href: base_styles },
  { rel: "stylesheet", href: shimmer_style },
  { rel: "stylesheet", href: animation_style },
];

export const loader = async ({ request }: LoaderArgs) => {
  const theme = await getTheme(request);
  return {
    theme: theme,
  };
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const display_header = Boolean(_NavLinks.findIndex(({ path }) => path === pathname) + 1);

  useEffect(() => {
    const handler: EventListenerOrEventListenerObject = (e) => {
      const element_id = (e as CustomEvent).detail.elementId;
      const target = document.getElementById(element_id);
      if (!target) return;
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    };

    window.addEventListener("scrollintoview", handler);

    return () => window.removeEventListener("scrollintoview", handler);
  }, []);

  useEffect(() => {
    const bash_open_handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey && event.key === "/") || pathname === "/bash") return;
      navigate("/bash");
    };

    const bash_close_handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey && event.key === "\\") || pathname === "/home") return;
      navigate("/home");
    };

    window.addEventListener("keydown", bash_open_handler);
    window.addEventListener("keydown", bash_close_handler);

    return () => {
      window.removeEventListener("keydown", bash_open_handler);
      window.removeEventListener("keydown", bash_close_handler);
    };
  }, [ navigate, pathname ]);

  return (
    <ThemeProvider { ...data } >
      <ModalProvider>
        <html className={ data.theme ? data.theme : "" }>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body className={ classNames(display_header ? "min-h-screen grid grid-rows-[auto_1fr_auto]" : "", "transition-colors") }>
            { display_header && <Header /> }
            <Outlet />
            <ModalOutlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </ModalProvider>
    </ThemeProvider>
  );
}