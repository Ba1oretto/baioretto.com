import React from "react";
import ColorScheme from "./ColorScheme";
import GithubHyperlink from "./GithubHyperlink";
import classNames from "classnames";
import Language from "./Language";
import { headerCSS } from "./PageHeader";

export default function ToolBar() {
  return(
    <ul className={headerCSS.ul}>
      <li className={classNames(headerCSS.li)}>
        <ColorScheme />
      </li>
      <li className={classNames(headerCSS.li)}>
        <GithubHyperlink />
      </li>
      <li className={classNames(headerCSS.li)}>
        <Language />
      </li>
    </ul>
  );
}