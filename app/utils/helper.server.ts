import type { Dispatch, ReactNode, SetStateAction } from "react";

type StateSetter<T> = Dispatch<SetStateAction<T>>;

type Children = {
  children: ReactNode,
};

type WithChildren<T> = T & Children;

type Nullable<T> = T | null;

export type {
  StateSetter,
  Children,
  WithChildren,
  Nullable,
};