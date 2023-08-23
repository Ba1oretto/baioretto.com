import type { Post } from "./route";

import { Link, useAsyncValue } from "@remix-run/react";
import { HoverVisible } from "~/components/Animation";

type Query = {
  strict: boolean,
  text: string,
};

type QueryObject = {
  [index: string]: Query[],
  category: Query[],
  tag: Query[],
  title: Query[],
};

export default function ({ query }: { query: string }) {
  let posts = useAsyncValue() as Post[];
  if (query && posts)
    posts = formatPost(posts, query);

  return (
    <ul>
      {posts && posts.map((post: Post) => post.tags && post.tags.length && (
        <li key={post.slug} className="px-1 py-6 border-b-2 hover:bg-blue-1050 transition-colors first:border-t-2">
          <Link to={post.slug} className="block p-2 focus:shadow-[inset_0_0_0_3px_hsla(220,100%,50%,80%)] rounded-xl">
            <article className="[&>*:not(:last-child)]:mb-1.5">
              <h3>{post.title}</h3>
              <section className="relative">
                  <span>
                    By {post.author} in{" "}
                  </span>
                <HoverVisible trigger={post.tags[0]} styles="absolute bottom-[250%] left-0 px-2 bg-gray-300/80 rounded-lg">
                  {post.tags.join(", ")}
                </HoverVisible>
                {" - "}
                <HoverVisible trigger={timeElapsed(post.published_at)}>
                  {` on ${new Date(post.published_at).toDateString()}`}
                </HoverVisible>
              </section>
              <p>
                {post.category.replace("_", " ")}
              </p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function timeElapsed(time: string) {
  const formatTime = (time: number, name: string) => `${Math.floor(time)} ${Math.floor(time) - 1 ? name + "s" : name} ago`;

  const elapsed_minute = (Date.now() - Date.parse(time)) / 60000,
    elapsed_hour = elapsed_minute / 60,
    elapsed_day = elapsed_hour / 24,
    elapsed_month = elapsed_day / 31,
    elapsed_year = elapsed_day / 365;

  return elapsed_minute - 1 < 0 ? "a few seconds ago" :
    elapsed_hour - 1 < 0 ? formatTime(elapsed_minute, "minute") :
      elapsed_day - 1 < 0 ? formatTime(elapsed_hour, "hour") :
        elapsed_month - 1 < 0 ? formatTime(elapsed_day, "day") :
          elapsed_year - 1 < 0 ? formatTime(elapsed_month, "month") :
            formatTime(elapsed_year, "year");
}

function contains(source: string, strict: boolean, target: string) {
  return strict ?
    source.toLocaleLowerCase("en-US") === target.toLocaleLowerCase("en-US") :
    source.toLocaleLowerCase("en-US").includes(target.toLocaleLowerCase("en-US"));
}

function matchAll(source: Query[], target: string[]) {
  let match_count = 0;
  for (const { strict, text } of source)
    for (const t of target)
      if (contains(t.replace(/[ -]/g, "_"), strict, text)) {
        match_count++;
        break;
      }
  return source.length === match_count;
}

function filterPost(query_text: string) {
  const query_object: QueryObject = {
    category: [],
    tag: [],
    title: [],
  };

  const split_query = query_text.match(/[@#]\w+!?|\w+!?/g);
  if (!split_query) return undefined;

  for (const query of split_query)
    query_object[query[0] === "@" ? "category" : query[0] === "#" ? "tag" : "title"].push({
      strict: query.endsWith("!"),
      text: query.endsWith("!") ?
        query.slice(Number(query[0] === "@" || query[0] === "#"), query.length - 1) :
        query[0] === "@" || query[0] === "#" ? query.slice(1) : query,
    });

  return query_object;
}

function formatPost(post_list: Post[], query_text: string) {
  const query_object = filterPost(query_text);
  if (!query_object) return post_list;

  const filtered_post_list = [];
  for (const post of post_list) {
    if (
      query_object.category[0] &&
      !contains(post.category, query_object.category[0].strict, query_object.category[0].text)
    ) continue;

    if (!matchAll(query_object.tag, post.tags)) continue;

    if (!matchAll(query_object.title, post.title.split(" "))) continue;

    filtered_post_list.push(post);
  }

  return filtered_post_list;
}