import React from "react";

export declare interface DomModalContext {
  ref: React.MutableRefObject<HTMLDivElement>;
  setClassList: React.Dispatch<React.SetStateAction<string>>,
  backToDefault: () => void,
}

export declare interface ComponentEntry {
  name: string;
  component: JSX.Element;
}

export type Lang = "en" | `zh${"CN" | "TW"}` | "ja";

export type Post = {
  id: string,
  tag: string[],
  date: string,
  title: string,
  category: string,
};

export type CategorizedPosts = {
  [index: string]: Post[],
};