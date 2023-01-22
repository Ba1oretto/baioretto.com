import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import usePageTransition from "./usePageTransition";

type FetchFn = (
  method: "get" | "post" | "put" | "delete",
  url: string,
  extra?: AxiosRequestConfig,
) => void;

const baseURL = "https://swapi.dev/api/";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function <T = unknown>(): { readonly response: T | null, fetch: FetchFn } {
  const [ response, setResponse ] = useState<T | null>(null);
  const { setTransition } = usePageTransition();
  const [ controller, setController ] = useState<AbortController>();

  const fetch: FetchFn = async (
    method,
    url,
    extra,
  ) => {
    try
    {
      setTransition("on");
      const ctrl = new AbortController();
      setController(ctrl);
      // const res = await instance[method](url, {
      //   ...extra,
      //   signal: ctrl.signal,
      // });
      // setResponse(res.data);

      // test start
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResponse([
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
      ] as T);
      // test end
    } catch (e)
    {
      // TODO handle error message
      console.log(":(");
    } finally
    {
      setTransition("off");
    }
  };

  useEffect(() => {
    // prevent memory leak
    return () => controller?.abort();
  }, [ controller ]);

  return {
    response,
    fetch,
  };
}