import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getThemeToggledHeader } from "~/utils/theme.server";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  return json("ok", { headers: await getThemeToggledHeader(request) });
};
