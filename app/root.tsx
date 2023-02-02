import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import type { Children } from "~/utils/helper.server";
import type { ColorScheme } from "~/utils/ColorSchemeProvider";

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import Header from "~/components/Header";

import tailwindStyleUrl from "./styles/app.css";
import { ColorSchemeHead, ColorSchemeProvider, useColorScheme } from "~/utils/ColorSchemeProvider";
import { getColorSchemeSession } from "~/utils/color_scheme.server";

export const links: LinksFunction = () => ([
  {
    rel: "stylesheet",
    href: tailwindStyleUrl,
  },
]);

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getColorSchemeSession(request);
  return {
    color_scheme: session.read(),
  };
};

function Document({ children }: Children) {
  return (
    <html>
      <head>
        <Meta />
        <Links />
        <ColorSchemeMeta />
      </head>
      <Body>
        <div id="content" className="min-h-screen grid grid-rows-[auto_1fr_auto] dark:bg-black-800 dark:text-white-100">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Body>
    </html>
  );
}

function ColorSchemeMeta() {
  const {color_scheme} = useColorScheme();
  return (
    <meta name="color-scheme" content={color_scheme === "dark" ? "dark light" : "light dark"}/>
  );
}

// optimize render
function Body({ children }: Children) {
  const { color_scheme } = useColorScheme();
  const data = useLoaderData<typeof loader>();
  return (
    <body className={color_scheme ? color_scheme : ""}>
      <ColorSchemeHead provided={Boolean(data.color_scheme)} />
      {children}
    </body>
  );
}

function DocumentWithProvider({ children }: Children) {
  const data = useLoaderData<{ color_scheme: ColorScheme | null }>();
  return (
    <ColorSchemeProvider _default={data.color_scheme}>
      <Document>
        {children}
      </Document>
    </ColorSchemeProvider>
  );
}

export default function App() {
  return (
    <DocumentWithProvider>
      <Header />
      <Outlet />
    </DocumentWithProvider>
  );
}

export function CatchBoundary() {
  // const caught = useCatch();
  return (
    <DocumentWithProvider>
      ?
    </DocumentWithProvider>
  );
}