import type { FormEvent, MouseEvent } from "react";
import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import type { LinksFunction, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import classNames from "classnames";

import posts_styles from "~/routes/_content.post._index/posts.css";
import type { Posts } from "~/util/post.server";
import { getPosts } from "~/util/post.server";
import { LoadingSpinner } from "~/routes/_content/route";
import { IS_PRODUCTION } from "~/util/variable.server";

export const meta: V2_MetaFunction = () => [
  { title: "Posts" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: posts_styles },
];

export const loader = ({ request }: LoaderArgs) => {
  const filter = new URL(request.url).searchParams.get("filter") ?? "";
  return defer({
    IS_PRODUCTION,
    posts: getPosts(filter),
  });
};

export default function Posts() {
  const data = useLoaderData<typeof loader>();

  const fetcher = useRef(useFetcher());

  const [ filter, setFilter ] = useState("");

  const input_ref = useRef<HTMLInputElement>(null);
  const is_init = useRef([ true, true ]);

  useEffect(() => {
    // filter should not be submitted while initialing
    if (is_init.current.length) {
      if (IS_PRODUCTION) {
        is_init.current = [];
      } else {
        is_init.current.pop();
      }
      return;
    }

    const timer = setTimeout(() => {
      fetcher.current!.submit({ filter });
    }, 500);
    return () => clearTimeout(timer);
  }, [ data.IS_PRODUCTION, filter ]);

  function onSearchBarClear(event: MouseEvent) {
    event.preventDefault();
    setFilter("");
    fetcher.current!.submit({ filter: "" });
    input_ref.current!.focus();
    is_init.current = [ true, true ];
  }

  function onSearchBarInput(event: FormEvent<HTMLInputElement>) {
    setFilter(event.currentTarget.value);
  }

  return (
    <Fragment>
      <section className="relative flex mt-5">
        <label className="search-bar-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="28" width="28" className="text-azure">
            <path fill="currentColor" d="M791.681 942.826 530.833 682.138q-29.761 24.523-69.28 38.464-39.52 13.941-84.481 13.941-110.274 0-186.742-76.521-76.468-76.522-76.468-185.355 0-108.834 76.522-185.355 76.522-76.522 185.688-76.522 109.167 0 185.355 76.522 76.189 76.521 76.189 185.455 0 43.711-13.602 83.019-13.601 39.308-39.471 72.323L846.138 888.45l-54.457 54.376ZM376.462 658.79q77.437 0 131.419-54.438 53.981-54.439 53.981-131.685 0-77.247-54.005-131.685-54.005-54.439-131.395-54.439-77.945 0-132.396 54.439-54.45 54.438-54.45 131.685 0 77.246 54.427 131.685 54.427 54.438 132.419 54.438Z" />
          </svg>
          <input
            ref={ input_ref }
            value={ filter }
            onInput={ onSearchBarInput }
            placeholder="Start typing..."
            type="text"
            autoComplete="off"
            spellCheck="false"
            id="search-bar-input"
          />
        </label>
        <button
          className={ classNames("search-bar-clean-button opacity-0 pointer-events-none", filter.length && "opacity-100 pointer-events-auto") }
          title="Clear the query"
          onClick={ onSearchBarClear }
          disabled={ !filter }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="28" width="28" fill="currentColor">
            <path d="m251.333 857.71-53.043-53.043L426.957 576 198.29 347.333l53.043-53.043L480 522.957 708.667 294.29l53.043 53.043L533.043 576 761.71 804.667l-53.043 53.043L480 629.043 251.333 857.71Z" />
          </svg>
        </button>
      </section>
      <Suspense fallback={ <LoadingSpinner /> }>
        <Await resolve={ data.posts }>
          { posts => (
            <ul>
              <PostList posts={ posts } />
            </ul>
          ) }
        </Await>
      </Suspense>
    </Fragment>
  );
}

function PostList({ posts }: { posts: Posts }) {
  return posts.map(post => (
    <li key={ post.slug } className="border-b-2 first:border-t-2 hover:bg-ink-blue transition-all">
      <article className="relative px-8 py-9">
        <h2>{ post.title }</h2>
        <section className="flex gap-4 mt-4 font-semibold text-slate-gray">
          <p>
            { post.published_at }
          </p>
          <p>
            By { post.author }
          </p>
          <p>
            In { post.category }
          </p>
        </section>
        <p className="mt-3 text-slate-gray">
          { post.excerpt }
        </p>
        <Link to={ `${ post.slug }?id=${ post.id }&title=${ post.title }` } className="max-w-fit block mt-6 rounded">
          <span className="absolute inset-y-0 inset-x-0" />
          <p className="text-azure">read more</p>
        </Link>
      </article>
    </li>
  ));
}
