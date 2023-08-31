import type { LoaderArgs } from "@remix-run/node";
import { validate } from "~/util/user.server";
import { redirect } from "@remix-run/router";

export const loader = async ({ request }: LoaderArgs) => {
  const logged_in = await validate(request);
  if (!logged_in) return redirect(request.referrer.length ? request.referrer : "/home");
  return null;
};

export default function New() {
  return (
    <div>
      111
    </div>
  );
}