import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import { isRouteErrorResponse, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from "@remix-run/react";
import Header from "~/header/Header";
import { getTheme } from "~/util/theme.server";
import Terminal from "~/terminal/Terminal";

import base_styles from "./tailwind.css";
import header_styles from "~/header/header.css";
import modal_styles from "~/modal/modal.css";
import terminal_styles from "~/terminal/terminal.css";
import { getSessionUser } from "~/util/user.server";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [ { rel: "stylesheet", href: cssBundleHref } ] : []),
	{ rel: "stylesheet", href: base_styles },
	{ rel: "stylesheet", href: header_styles },
	{ rel: "stylesheet", href: modal_styles },
	{ rel: "stylesheet", href: terminal_styles },
];

export const loader = async ({ request }: LoaderArgs) => {
	const { theme, headers } = await getTheme(request);
	return json({
		theme,
		username: (await getSessionUser(request))?.username,
	}, {
		headers,
	});
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
				<Terminal />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	return (
		<html className="dark">
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body className="h-screen container mx-auto flex items-center">
				{ isRouteErrorResponse(error) ? (
					<section>
						<h1>
							{ error.status } { error.statusText }
						</h1>
						<p>{ error.data }</p>
					</section>
				) : error instanceof Error ? (
					<section className="flex flex-col gap-4">
						<h1>Error</h1>
						<h2>{ error.message }</h2>
						<h3>The stack trace is:</h3>
						<p>{ error.stack }</p>
					</section>
				) : (
					<h1>Unknown Error</h1>
				) }
				<Scripts />
			</body>
		</html>
	);
}