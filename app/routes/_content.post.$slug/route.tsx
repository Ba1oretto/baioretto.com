import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import viewer_stylesheet from "~/routes/_content.post.$slug/viewer.css";
import { Await, useLoaderData } from "@remix-run/react";
import { LoadingSpinner } from "~/routes/_content/route";
import { Suspense } from "react";
import { getPost } from "~/util/post.server";

function formatSlug(slug: string | undefined) {
  return slug ? slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
}

export const meta: V2_MetaFunction = ({ params, location }) => {
  let title = new URLSearchParams(location.search).get("title");

  // url does not contain a title param
  if (!title) {
    title = formatSlug(params.slug);
  }

  return [
    { title },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: viewer_stylesheet },
];

export const loader = ({ request, params }: LoaderArgs) => {
  const search_params = new URL(request.url).searchParams;
  const id = search_params.get("id");

  return defer({
    post: getPost(id ? id : params.slug, !!id),
  });
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={ <LoadingSpinner /> }>
      <Await resolve={ post }>
        { post => post ? (
          <section className="viewer" dangerouslySetInnerHTML={ { __html: post.content } } />
        ) : (
          <section>TODO handle not found</section>
        ) }
      </Await>
    </Suspense>
  );
}
