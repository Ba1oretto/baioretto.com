import type { ActionArgs, ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getThemeToggledHeader } from "~/util/theme.server";
import { redirect } from "@remix-run/router";
import { UpdateType } from "~/util/helper";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  return json({ updated: UpdateType.Theme }, { headers: await getThemeToggledHeader(request) });
};

export const loader: LoaderFunction = ({ request }) => {
  return redirect(request.referrer.length ? request.referrer : "/home");
};
