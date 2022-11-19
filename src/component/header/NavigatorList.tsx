import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Interaction } from "../../util";
import useTranslation from "../../hook/useTranslation";
import { headerCSS, ToggleVisibility } from "./PageHeader";

const routerPath = [
  { name: "home", path: "/" },
  { name: "blog", path: "/blog" },
  { name: "media", path: "/media" },
  { name: "project", path: "/project" }
];

type RouterLink = `navigation.${"home" | "blog" | "media" | "project"}`;

export default function NavigatorList() {
  const location = useLocation();
  const { t } = useTranslation();
  const { setVisible } = useContext(ToggleVisibility);

  function handleClick(keep: boolean) {
    if (!keep) setVisible();
  }

  return (
    <ul className={headerCSS.ul}>
      {routerPath.map(({ name, path }, index) => (
        <li key={index} className={headerCSS.li}>
          <Link to={path} onClick={() => handleClick(location.pathname === path)}
                className={classNames(headerCSS.link, Interaction(location.pathname === path, "bg-blue-600", "hover:bg-yellow-550 hover:text-amber-800"))}>
            {t(`navigation.${name}` as RouterLink)}
          </Link>
        </li>
      ))}
    </ul>
  );
}