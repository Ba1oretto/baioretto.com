import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import type { MouseEvent } from "react";

import { Suspense, useRef, useState } from "react";
import { Await, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { defer } from "@remix-run/router";
import PostList from "./PostList";
import { LoadingShimmer } from "~/components/Animation";

export type Post = {
  [index: string]: string | string[],
  slug: string,
  title: string,
  category: string,
  author: string,
  tags: string[],
  published_at: string,
};

export const meta: V2_MetaFunction = () => ([
  {
    title: "Post",
  },
]);

export const loader: LoaderFunction = async () => {
  throw new Error("not implemented😅");
  return defer({
    posts: fetch(`API_URL/post`).then(res => res.json()),
  });
};

export default function () {
  const data = useLoaderData();
  const [ query, setQuery ] = useState("");
  const input_ref = useRef<HTMLInputElement>(null);

  function handleQueryResetClick(event: MouseEvent) {
    event.preventDefault();
    input_ref.current!.focus();
    setQuery("");
  }

  return (
    <main className="my-32 container mx-auto flex flex-col gap-y-10">
      <section className="relative flex mt-5">
        <label className="flex items-center w-full h-14 px-3 pr-10 shadow-blue focus-within:shadow-[inset_0_0_0_3px_hsla(220,100%,50%,80%)] transition-all rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="28" width="28" className="text-cyan-500">
            <path fill="currentColor" d="M791.681 942.826 530.833 682.138q-29.761 24.523-69.28 38.464-39.52 13.941-84.481 13.941-110.274 0-186.742-76.521-76.468-76.522-76.468-185.355 0-108.834 76.522-185.355 76.522-76.522 185.688-76.522 109.167 0 185.355 76.522 76.189 76.521 76.189 185.455 0 43.711-13.602 83.019-13.601 39.308-39.471 72.323L846.138 888.45l-54.457 54.376ZM376.462 658.79q77.437 0 131.419-54.438 53.981-54.439 53.981-131.685 0-77.247-54.005-131.685-54.005-54.439-131.395-54.439-77.945 0-132.396 54.439-54.45 54.438-54.45 131.685 0 77.246 54.427 131.685 54.427 54.438 132.419 54.438Z" />
          </svg>
          <input ref={input_ref} className="appearance-none h-full w-full bg-transparent text-xl px-2 shadow-none"
                 value={query} onInput={event => setQuery(event.currentTarget.value)} placeholder="Start typing..."
                 type="text" autoComplete="off" spellCheck="false" />
        </label>
        <button className={classNames(
          "absolute right-3 self-center p-1 opacity-0 pointer-events-none text-white-800 transition-all rounded-full",
          query.length && "opacity-100 pointer-events-auto",
        )} title="Clear the query" onClick={handleQueryResetClick} disabled={!query}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" height="28" width="28" fill="currentColor">
            <path d="m251.333 857.71-53.043-53.043L426.957 576 198.29 347.333l53.043-53.043L480 522.957 708.667 294.29l53.043 53.043L533.043 576 761.71 804.667l-53.043 53.043L480 629.043 251.333 857.71Z" />
          </svg>
        </button>
      </section>
      <Suspense fallback={<LoadingShimmer />}>
        <Await resolve={data.posts}>
          <PostList query={query} />
        </Await>
      </Suspense>
    </main>
  );
}