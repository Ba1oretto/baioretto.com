import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/util/database.server";

export const loader = ({ request }: LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  let value;

  if ((value = params.get("category"))) {
    return db.category.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        slug: {
          startsWith: value,
          mode: "insensitive",
        },
      },
    });
  } else if ((value = params.get("tag"))) {
    return db.tag.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        slug: {
          startsWith: value,
          mode: "insensitive",
        },
      },
    });
  }

  return null;
};
