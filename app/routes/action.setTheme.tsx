import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { updateTheme } from "~/utils/theme.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const theme = new URLSearchParams(await request.text()).get("theme") as string;
  const headers = await updateTheme(request, theme);
  if (!headers) return null;
  return json("ok", { headers });
};