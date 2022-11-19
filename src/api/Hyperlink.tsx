import React, { HTMLAttributeAnchorTarget } from "react";
import { ClassAndChildren } from "../type";

export default function Hyperlink({ link, children, elementClass, target}: {link: string, target?: HTMLAttributeAnchorTarget} & ClassAndChildren) {
  return(
    <a href={link} className={elementClass} target={target}>
      {children}
    </a>
  );
}