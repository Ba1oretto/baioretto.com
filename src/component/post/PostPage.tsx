import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import "./postlist.css";
import { useEventListener } from "usehooks-ts";
import type { CategorizedPosts, Post } from "../../type";
import classNames from "classnames";
import useAxios from "../../hook/useAxios";
import PostList from "./PostList";

type PredicateKey = "category" | "tag" | "title";
type PredicateValue = {
  strict: boolean,
  text: string,
};
type Predicate = {
  [P in PredicateKey]: PredicateValue[];
};

type FilterState = {
  filterTextSetter: React.Dispatch<React.SetStateAction<string>>;
}

const FilterInput = React.forwardRef<HTMLInputElement, FilterState>(function FilterInput({
  filterTextSetter,
}, ref) {
  const [ filter, setFilter ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      filterTextSetter(filter);
    }, 200);
    return () => clearTimeout(timer);
  }, [ filter ]);

  function handleSearch(e: React.FormEvent<HTMLInputElement>)
  {
    setFilter(e.currentTarget.value);
  }

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const inputEl = (ref as MutableRefObject<HTMLInputElement>).current;
    inputEl.value = "";
    filterTextSetter("");
    setFilter("");
    inputEl.focus();
  }, []);

  return (
    <div className="flex justify-center mb-8 select-none">
      <form className="flex items-center shadow-blue bg-gray-100 dark:bg-black text-black dark:text-black-50/80 rounded-lg h-14 px-3 w-full md:w-2/5">
        <label className="text-blue-200" htmlFor="filter-input">
          <svg width="28" height="28" viewBox="0 0 20 20">
            <path stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" />
          </svg>
        </label>
        <input
          className="appearance-none select-auto bg-transparent border-0 flex-1 text-xl h-full outline-0 pl-2 w-full"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" enterKeyHint="search" spellCheck="false"
          placeholder="Start typing..." maxLength={64} type="text" ref={ref} id="filter-input"
          onChange={handleSearch} />
        <button title="Clear the query" onClick={handleClick} className={classNames("group transition-all", !filter && "opacity-0")} tabIndex={filter ? 0 : -1}>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="20" height="20" className="transition-transform group-hover:rotate-90 lg:block">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </form>
    </div>
  );
});

function getPredicate(predicates?: string): Predicate | null
{
  if (!predicates) return null;

  const predicatesObject = {} as Predicate;
  predicates.trim().split(" ").forEach(predicate => {
    const searchMode: PredicateKey = predicate[0] === "@" ? "category" : predicate[0] === "#" ? "tag" : "title";
    const strictMode = predicate.at(-1) === "!";
    const text = strictMode ? predicate.substring(searchMode === "title" ? 0 : 1, predicate.length - 1) : searchMode === "title" ? predicate : predicate.substring(1);
    const v: PredicateValue = {
      strict: strictMode,
      text: text.toLowerCase(),
    };
    predicatesObject[searchMode] ? predicatesObject[searchMode].push(v) : predicatesObject[searchMode] = [ v ];
  });
  return predicatesObject;
}

/**
 * search by category: @category
 * search by tag: #tag
 * search by title: title
 * */
function getFormatData(data: Post[], rawPredicate?: string): CategorizedPosts
{
  const predicate = getPredicate(rawPredicate);

  const res = {} as CategorizedPosts;
  const resKeys: string[] = [];
  const categories = predicate && predicate["category"];

  data.forEach(post => {
    if (categories)
    {
      const { strict, text } = categories[0];
      if (!(strict ? text === post.category.toLowerCase() : post.category.toLowerCase().includes(text))) return;
    }
    // we don't want NPE
    res[post.category] ? res[post.category].push(post) : res[post.category] = [ post ];
    !resKeys.includes(post.category) && resKeys.push(post.category);
  });

  // just not filter
  if (!predicate) return res;

  // then tag
  const tags = predicate["tag"];
  if (tags)
  {
    // complexity not good :(
    const remove: string[] = [];
    for (const resKey of resKeys)
    {
      const newPosts = res[resKey].filter(post => {
        let matches = 0;

        for (const { text, strict } of tags)
        { // "nonlinear" "linear"
          for (const postTag of post.tag)
          { // "algo", "linear", "ADT"
            if (strict ? text === postTag.toLowerCase() : postTag.toLowerCase().includes(text))
            {
              matches++;
              break;
            }
          }
        }
        return matches === tags.length;
      });

      if (!newPosts.length)
      {
        delete res[resKey]; // remove key from res
        remove.push(resKey);
      } else res[resKey] = newPosts;
    }

    // remove value from resKeys, prevent bug so don't do this in for loop above
    for (const key of remove)
    {
      const index = resKeys.indexOf(key);
      (index + 1) && resKeys.splice(index, 1);
    }
  }

  // title at last
  const titles = predicate["title"];
  if (titles)
  {
    for (const resKey of resKeys)
    {
      const newPosts = res[resKey].filter(post => { // Introduction to Dijkstra's Algorithm
        let matches = 0;
        for (const { text, strict } of titles)
        { // ["intro!", "algo!"]
          if (strict ? post.title.toLowerCase().split(" ").includes(text) : post.title.toLowerCase().includes(text)) matches++;
          else break;
        }
        return matches === titles.length;
      });

      if (!newPosts.length) delete res[resKey];
      else res[resKey] = newPosts;
    }
  }

  return res;
}

export default function PostPage() {
  const [ filter, setFilter ] = useState("");
  const inputRef = useRef({} as HTMLInputElement);
  const { response, fetch } = useAxios<Post[]>();
  const [ post, setPost ] = useState<CategorizedPosts>();

  useEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target === inputRef.current) return;
    e.preventDefault();
    inputRef.current.focus();
  });

  useEffect(() => {
    if (!response) return;
    setPost(getFormatData(response, filter));
  }, [ filter ]);

  useEffect(() => {
    fetch("get", "people/1");
  }, []);

  useEffect(() => {
    if (!response) return;
    setPost(getFormatData(response));
  }, [ response ]);

  return (
    <>
      <FilterInput ref={inputRef} filterTextSetter={setFilter} />
      {post && <PostList data={post} />}
    </>
  );
}
