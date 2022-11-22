import React, { useContext } from "react";
import Navigator from "./Navigator";
import "./header.css";
import useTranslation from "../../hook/useTranslation";
import { NavbarContext } from "../../App";
import ToolBar from "./ToolBar";

export const headerCSS = {
  ul: "md:flex md:justify-center md:items-center",
  li: "mb-4 lg:mr-4 md:mb-0 last:mr-0 relative",
  link: "flex items-center p-6 text-xl rounded-md transition-colors font-bold lg:text-lg lg:px-4 md:py-2",
  btn: "rounded-md lg:rounded-2/4 flex w-full items-center transition-colors p-6 md:p-4 hover:bg-yellow-550 hover:text-amber-800 md:hover:bg-gray-500 md:hover:text-inherit",
};

function ToggleMenuBtn() {
  const { toggleNavbarState } = useContext(NavbarContext);
  const { t } = useTranslation();

  return (
    <div className={"cursor-pointer flex items-center block lg:hidden py-8 pl-4"} onClick={toggleNavbarState}>
      <div id="animated-bar" className={"select-none"}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
      <span className="font-bold ml-4 text-white text-xl">{t("toggle.menu")}</span>
    </div>
  );
}

export default function PageHeader() {
  return (
    <header className={"lg:py-6 sticky mobile:relative flex items-center top-0 bg-dark-frost/80 backdrop-blur-sm"}>
      <nav id="header-nav" className="container mobile:max-w-full lg:mx-auto">
        <ToggleMenuBtn />
        <div className={"menu flex md:items-center justify-between flex-col md:flex-row uppercase tracking-wide"}>
          <Navigator />
          <ToolBar />
        </div>
      </nav>
    </header>
  );
}