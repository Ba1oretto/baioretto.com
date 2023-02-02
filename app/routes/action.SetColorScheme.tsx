import type { ActionArgs } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import { getColorSchemeSession } from "~/utils/color_scheme.server";
import { isColorScheme } from "~/utils/ColorSchemeProvider";

export const action = async ({ request }: ActionArgs) => {
  const session = await getColorSchemeSession(request);
  const form = new URLSearchParams(await request.text());
  const color_scheme = form.get("color_scheme");

  if (!isColorScheme(color_scheme))
    return json({
      success: false,
      message: `color scheme value of ${color_scheme} is not a valid option`,
    });

  session.update(color_scheme);

  return json({ success: true }, {
    headers: {
      "Set-Cookie": await session.commit(),
    },
  });
};

export const loader = async () => redirect("/", { status: 404 });