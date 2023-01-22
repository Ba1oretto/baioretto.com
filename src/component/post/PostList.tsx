import React, { useCallback, useEffect, useState } from "react";
import type { CategorizedPosts, Post } from "../../type";
import { Link } from "react-router-dom";
import isEqual from "lodash.isequal";
import difference from "lodash.difference";

type KeyBehaviour = {
  [index: string]: "increase" | "decrease",
};

function Category({ category }: { category: string })
{
  return (
    <div className="flex flex-row items-center mb-4">
      <svg aria-hidden="true" viewBox="0 0 512 512" width="28" height="28">
        <path fill="currentColor"
              d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z" />
      </svg>
      <div className="font-bold text-2xl mt-1 text-[1.5rem] leading-5 pb-2 ml-3">{category.replaceAll("_", " ")}</div>
    </div>
  );
}

function Posts({ posts }: { posts: Post[] })
{
  const [ isInitial, setInitial ] = useState(() => true);
  const [ cachedPosts, setCachedPosts ] = useState(() => posts);
  const [ keyBehaviour, setKeyBehaviour ] = useState({} as KeyBehaviour);
  const [ variable, setVariable ] = useState(0);

  useEffect(() => {
    if (isEqual(posts, cachedPosts) && !isInitial) return;

    if (isInitial) setInitial(false);

    const isIncr = posts.length > cachedPosts.length;
    const differentValue = difference(isIncr ? posts : cachedPosts, isIncr ? cachedPosts : posts);

    const behaviours = {} as KeyBehaviour;
    for (const element of differentValue)
      behaviours[element.id] = isIncr ? "increase" : "decrease";
    setKeyBehaviour(behaviours);

    setVariable(isIncr ? 0 : 1);
    const intervalId = setInterval(() => setVariable(prevState => prevState + (isIncr ? 0.04 : -0.04)), 8);

    if (isIncr)
    {
      setCachedPosts(posts);
      setTimeout(() => {
        setVariable(1);
        clearInterval(intervalId);
      }, 200); // do not clearTimeout()!
      return;
    }

    setTimeout(() => {
      setCachedPosts(posts);
      setVariable(0);
      clearInterval(intervalId);
    }, 200);
  }, [ posts ]);

  return (
    <ul className="pl-5">
      {cachedPosts.map(post => {
        const isInitial = keyBehaviour[post.id] === undefined;
        return (
          <li key={post.id} className="list-disc list-outside text-2xl" style={{
            opacity: isInitial ? 1 : variable,
            padding: isInitial ? "8px 8px 8px 16px" : `${8 * variable}px ${8 * variable}px ${8 * variable}px ${16 * variable}px`,
            maxHeight: (isInitial || variable === 1) ? "100%" : 50 * variable,
          }}>
            <em className="mr-4 font-light">{post.date}</em>
            <Link className="text-sky-500 hover:underline" to={`post/${post.id}`}>{post.title}</Link>
          </li>
        );
      })}
    </ul>
  );
}

function PostList({ data }: { data: CategorizedPosts })
{
  const [ isInitial, setInitial ] = useState(() => true);
  const [ cachedData, setCachedData ] = useState({} as CategorizedPosts);
  const [ cachedDataKeys, setCachedDataKeys ] = useState([] as string[]);
  const [ keyBehaviour, setKeyBehaviour ] = useState({} as KeyBehaviour);
  const [ variable, setVariable ] = useState(0);

  // SMART CODE!
  useEffect(() => {
    if (isEqual(data, cachedData)) return;

    const dataKeys = Object.keys(data);
    if (isInitial)
    {
      setInitial(false);
      setData(data, dataKeys);
      return;
    }

    if (isEqual(dataKeys, cachedDataKeys))
    {
      setData(data, dataKeys);
      return;
    }

    const isIncr = dataKeys.length > cachedDataKeys.length;
    const differentValue = difference(isIncr ? dataKeys : cachedDataKeys, isIncr ? cachedDataKeys : dataKeys);

    const behaviours = {} as KeyBehaviour;
    for (const element of differentValue)
    {
      behaviours[element] = isIncr ? "increase" : "decrease";
    }

    setKeyBehaviour(behaviours);

    setVariable(isIncr ? 0 : 1);
    const intervalId = setInterval(() => {
      setVariable(prevState => prevState + (isIncr ? 0.02 : -0.02));
    }, 1);

    if (isIncr)
    {
      setData(data, dataKeys);
      setTimeout(() => {
        setVariable(1);
        clearInterval(intervalId);
      }, 200); // do not clearTimeout()!
      return;
    }

    setTimeout(() => {
      setData(data, dataKeys);
      setVariable(0);
      clearInterval(intervalId);
    }, 200);
  }, [ data ]);

  const setData = useCallback((d: CategorizedPosts, dk: string[]) => {
    setCachedData(d);
    setCachedDataKeys(dk);
  }, []);

  return (
    <div className="post-list dark:bg-black-750/80">
      {cachedDataKeys.map(category => {
        const isInitial = keyBehaviour[category] === undefined;
        return (
          <section key={category} style={{
            opacity: isInitial ? 1 : variable,
            padding: isInitial ? "16px 16px 16px 32px" : `${16 * variable}px ${16 * variable}px ${16 * variable}px ${32 * variable}px`,
            maxHeight: (isInitial || variable === 1) ? "100%" : 50 * (cachedData[category].length + 2) * variable,
          }}>
            <Category category={category} />
            <Posts posts={cachedData[category]} />
          </section>
        );
      })}
    </div>
  );
}

export default PostList;