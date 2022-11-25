import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Interaction } from "../../util";
import useTranslation from "../../hook/useTranslation";
import { headerCSS } from "./PageHeader";
import { NavbarContext } from "../../App";

const routerPath = [
  { name: "home", path: "/" },
  { name: "post", path: "/post" },
  { name: "media", path: "/media" },
  { name: "project", path: "/test" },
];

type RouterLink = `navigation.${"home" | "post" | "media" | "project"}`;

export default function Navigator() {
  const location = useLocation();
  const { t } = useTranslation();
  const { setNavbarActive } = useContext(NavbarContext);

  function handleClick(keep: boolean) {
    if (!keep) setNavbarActive(false);
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