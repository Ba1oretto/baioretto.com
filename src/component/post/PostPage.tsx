import React, { useCallback, useEffect, useRef, useState } from "react";
import "./postlist.css";
import { useEventListener } from "usehooks-ts";
import { ThinBatsuIcon } from "../../api/Icon";
import { useDebounce } from "use-debounce";
import type { CategorizedPosts, Post } from "../../type";
import PostList from "./PostList";

// region Types
type StrictAndValue = {
  strict: boolean,
  value: string,
};

type PredicateKey = "category" | "tag" | "title";

type Predicate = {
  [P in PredicateKey]: StrictAndValue[];
};
// endregion

const FilterInput = React.forwardRef<HTMLInputElement, { setSearchText: React.Dispatch<React.SetStateAction<string>> }>(function FilterInput({ setSearchText }, ref) {

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setSearchText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center mb-8">
      <form className="items-center shadow-blue bg-black rounded-lg flex h-14 px-3 w-full md:w-2/5">
        <label className="text-blue select-none" htmlFor="filter-input">
          <svg width="28" height="28" viewBox="0 0 20 20">
            <path stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" />
          </svg>
        </label>
        <input
          className="appearance-none filter-input border-0 text-[#f5f6f7] flex-1 text-xl h-full outline-0 pl-2 w-full"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" enterKeyHint="search" spellCheck="false"
          placeholder="Start typing..." maxLength={64} type="text" ref={ref} id="filter-input"
          onInput={handleInput} />
        <button title="Clear the query" onClick={handleClick}
                className="group appearance-none hidden opacity-0 group:opacity-100 transition-all group">
          <ThinBatsuIcon />
        </button>
      </form>
    </div>
  );
});

export function mockRequest(): Post[] {
  return [
    {
      id: "uuid here", // get post by this id
      tag: [ "algo", "cs", "python", "discrete" ], // not for category but search
      date: "22 Nov 2022",
      title: "Introduction to Dijkstra's Algorithm",
      category: "Algorithm", // not for search but category post
    },
    {
      id: "some UUID",
      tag: [ "git" ],
      date: "12 Nov 2022",
      title: "Git Workflow",
      category: "Git",
    },
    {
      id: "UUID1",
      tag: [ "nonlinear", "algo", "ADT" ],
      date: "12 Nov 2021",
      title: "Graph",
      category: "Data_Structure",
    },
    {
      id: "UUID3",
      tag: [ "nonlinear", "algo", "ADT" ],
      date: "12 Nov 2021",
      title: "Tree",
      category: "Data_Structure",
    },
    {
      id: "UUID4",
      tag: [ "linear", "algo", "ADT" ],
      date: "12 Nov 2021",
      title: "Linked List",
      category: "Data_Structure",
    },
  ];
}

/**
 * search by category: @category
 * search by tag: #tag
 * search by title: title
 * */
export function getFormatData(predicateText: string, data: Post[]) {
  // region Get Categorized Predicate
  const categorizedPredicate = predicateText ? {} as Predicate : null;
  categorizedPredicate && predicateText.trim().split(" ").forEach(predicate => {
    const type = predicate[0];
    const index: "category" | "tag" | "title" = type === "@" ? "category" : type === "#" ? "tag" : "title";
    const strict = predicate.at(-1) === "!";
    const value = {
      strict,
      value: strict ? predicate.substring(index === "title" ? 0 : 1, predicate.length - 1) : index === "title" ? predicate : predicate.substring(1),
    };
    categorizedPredicate[index] ? categorizedPredicate[index].push(value) : categorizedPredicate[index] = [ value ];
  });
  // endregion

  const res = {} as CategorizedPosts;
  const resKeys: string[] = [];
  const categories = categorizedPredicate && categorizedPredicate["category"];

  data.forEach(post => {
    // since type narrowing, we know categories cannot be undefined
    if (categories) {
      for (const { value, strict } of categories) {
        if (!(strict ? value.toLowerCase() === post.category.toLowerCase() : post.category.toLowerCase().includes(value.toLowerCase()))) return;
      }
    }
    // we don't want NPE
    if (res[post.category]) res[post.category].push(post);
    else res[post.category] = [ post ];
    if (!resKeys.includes(post.category)) resKeys.push(post.category);
  });

  // just not filter
  if (!categorizedPredicate) {
    return res;
  }

  // then tag
  const tags = categorizedPredicate["tag"];
  if (tags) {
    // complexity not good :(
    const remove: string[] = [];
    for (const resKey of resKeys) {
      const newPosts = res[resKey].filter(post => {
        let matches = 0;
        for (const { value, strict } of tags) { // "nonlinear" "linear"
          for (const postTag of post.tag) { // "algo", "nonlinear", "ADT"
            if (strict ? value.toLowerCase().includes(postTag.toLowerCase()) : postTag.toLowerCase().includes(value.toLowerCase())) {
              matches++;
              break;
            }
          }
        }
        return matches === tags.length;
      });

      if (!newPosts.length) {
        delete res[resKey]; // remove key from res
        remove.push(resKey);
      } else res[resKey] = newPosts;
    }

    // remove value from resKeys, prevent bug so don't do this in for loop above
    for (const key of remove) {
      const index = resKeys.indexOf(key);
      (index + 1) && resKeys.splice(index, 1);
    }
  }

  // title at last
  const titles = categorizedPredicate["title"];
  if (titles) {
    for (const resKey of resKeys) {
      const newPosts = res[resKey].filter(post => { // Introduction to Dijkstra's Algorithm
        let matches = 0;
        for (const { value, strict } of titles) { // ["intro!", "algo!"]
          if (strict ? post.title.toLowerCase().split(" ").includes(value.toLowerCase()) : post.title.toLowerCase().includes(value.toLowerCase())) matches++;
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
  const [ requestedData, setRequestedData ] = useState({} as Post[]);
  const [ inputText, setInputText ] = useState("");
  const [ filterPredicateText ] = useDebounce(inputText, 200);
  const [ filteredResult, setFilteredResult ] = useState({} as CategorizedPosts);
  const inputRef = useRef({} as HTMLInputElement);

  useEventListener("keydown", (e) => {
    if (e.key !== "/" || e.target === inputRef.current) return;
    e.preventDefault();
    inputRef.current.focus();
  });

  useEffect(() => {
    setRequestedData(mockRequest());
  }, []);

  useEffect(() => {
    if (requestedData.length) setFilteredResult(getFormatData(filterPredicateText, requestedData));
  }, [ filterPredicateText, requestedData ]);

  return (
    <>
      <FilterInput ref={inputRef} setSearchText={setInputText} />
      <PostList data={filteredResult} />
    </>
  );
}
