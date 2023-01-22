import React, { useState } from "react";
import "./menu.css";
import useTranslation from "../../hook/useTranslation";
import Navigator from "./Navigator";
import Settings from "./Settings";

export default function Header() {
  const [ showMenu, setShowMenu ] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="md:py-6 relative md:sticky flex top-0 backdrop-blur-sm shadow-md dark:bg-black-750/80">
      <div className="menu container md:mx-auto" data-menu-active={showMenu}>
        <button className="md:hidden flex items-center py-8 pl-4 w-full" onClick={() => setShowMenu(prevState => !prevState)}>
          <div className="bar">
            <div />
            <div />
            <div />
          </div>
          <span className="ml-4 font-bold text-xl dark:text-white">{t("toggle.menu")}</span>
        </button>
        <menu className="flex flex-col md:flex-row justify-between md:items-center">
          <Navigator showMenu={setShowMenu} />
          <Settings />
        </menu>
      </div>
    </header>
  );
}