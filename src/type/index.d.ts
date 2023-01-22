import type { ReactNode } from "react";
import React from "react";

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

export type Children = {
  children: ReactNode
}

export type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>

export type Optional<T> = {
  [Prop in keyof T]+?: T[Prop]
}