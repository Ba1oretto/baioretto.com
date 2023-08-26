import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { getTheme } from "~/utils/theme.server";

import base_styles from "./tailwind.css";
import animation_styles from "~/css/animation.css";
import header_styles from "~/css/header.css";
import modal_styles from "~/css/modal.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [ { rel: "stylesheet", href: cssBundleHref } ] : []),
  { rel: "stylesheet", href: base_styles },
  { rel: "stylesheet", href: animation_styles },
  { rel: "stylesheet", href: header_styles },
  { rel: "stylesheet", href: modal_styles },
];

// export const loader = async ({ request }: LoaderArgs) => {
//   const theme = await getTheme(request);
//   return {
//     theme: theme,
//   };
// };
//
// export default function App() {
//   const data = useLoaderData<typeof loader>();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//
//   useEffect(() => {
//     const bash_open_handler = (event: KeyboardEvent) => {
//       if (!(event.ctrlKey && event.key === "/") || pathname === "/bash") return;
//       navigate("/bash");
//     };
//
//     const bash_close_handler = (event: KeyboardEvent) => {
//       if (!(event.ctrlKey && event.key === "\\") || pathname === "/home") return;
//       navigate("/home");
//     };
//
//     window.addEventListener("keydown", bash_open_handler);
//     window.addEventListener("keydown", bash_close_handler);
//
//     return () => {
//       window.removeEventListener("keydown", bash_open_handler);
//       window.removeEventListener("keydown", bash_close_handler);
//     };
//   }, [ navigate, pathname ]);
//
//   return (
//     <ThemeProvider { ...data } >
//       <ModalProvider>
//         <html className={ data.theme ? data.theme : "" }>
//           <head>
//             <meta charSet="utf-8" />
//             <meta name="viewport" content="width=device-width,initial-scale=1" />
//             <Meta />
//             <Links />
//           </head>
//           <body className={ classNames(display_header ? "min-h-screen grid grid-rows-[auto_1fr_auto]" : "", "transition-colors") }>
//             { display_header && <Header /> }
//             <Outlet />
//             {/*<ModalOutlet />*/}
//             <ScrollRestoration />
//             <Scripts />
//             <LiveReload />
//           </body>
//         </html>
//       </ModalProvider>
//     </ThemeProvider>
//   );
// }

export const loader: LoaderFunction = async ({ request }) => {
  return {
    theme: await getTheme(request),
  };
};

export default function App() {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <html className={ theme }>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}