import type { LoaderArgs, LinksFunction } from "@remix-run/node";

import { redirect } from "@remix-run/router";
import { useLoaderData } from "@remix-run/react";
import post_stylesheet from "~/css/post.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: post_stylesheet,
    },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.slug)
    return redirect("/post");
  const post = await fetch(`API_URL/post/slug/${params.slug}`);
  if (!post.ok)
    throw new Error(":(");
  const res = await post.json();
  return { ...res, html: formatContent(res.html) };
};

function formatContent(content: string) {
  return content.replace(/__GHOST_URL__/g, "CONTENT_URL");
}

export default function () {
  const post = useLoaderData<typeof loader>();

  return (
    <main className="my-32 container mx-auto">
      <section className="gh-canvas">
        <h1 className="text-6xl text-white-300 mb-16">{post.title}</h1>
      </section>
      <section className="gh-content gh-canvas" dangerouslySetInnerHTML={{ __html: post.html }} />
    </main>
  );
}