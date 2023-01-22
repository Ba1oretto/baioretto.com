import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import useTranslation from "../../hook/useTranslation";
import type { SetStateAction } from "../../type";

type RouterLink = `navigation.${"home" | "post" | "media" | "project"}`;

const routerPath = [
  { name: "home", path: "/" },
  { name: "post", path: "post" },
  // { name: "media", path: "media" },
  // { name: "project", path: "test" },
];

export default function Navigator({ showMenu }: { showMenu: SetStateAction<boolean> }) {
  const { t } = useTranslation();

  function closeMenu() {
    showMenu(false);
  }

  return (
    <nav className="uppercase tracking-wider ml-1">
      <ul onClick={closeMenu}>
        {routerPath.map(({ name, path }) => (
          <li key={name}>
            <NavLink to={path} className={({ isActive }) => classNames("InteractiveBlock", isActive && "bg-blue-300 pointer-events-none")}>
              {t(`navigation.${name}` as RouterLink)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}