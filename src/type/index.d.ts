import { Dispatch, MutableRefObject, ReactNode, SetStateAction } from "react";


export declare interface ElementClass {
  elementClass?: string;
}

export declare interface ElementChildren {
  children: ReactNode;
}

export declare interface ClassAndChildren extends ElementClass, ElementChildren {
}

declare interface StateSetter<T> {
  setter: Dispatch<SetStateAction<T>>;
}

export declare interface DomModalContext extends StateSetter<string> {
  modal: MutableRefObject<HTMLDivElement>;
}

export declare interface DomElementContext {
  modalReference: DomModalContext;
  rootReference: MutableRefObject<HTMLDivElement>;
  bodyReference: MutableRefObject<HTMLBodyElement>;
}