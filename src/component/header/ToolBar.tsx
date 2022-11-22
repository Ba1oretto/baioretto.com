import React from "react";
import Language from "./Language";
import { headerCSS } from "./PageHeader";
import useTranslation from "../../hook/useTranslation";
import { DarkIcon, GithubIcon, LightIcon } from "../../api/Icon";
import useDarkMode from "../../hook/useDarkMode";
import type { ComponentEntry } from "../../type";

function ColorScheme() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const tip = `${t("color.change.tip")}: ${isDarkMode ? t("color.dark") : t("color.light")}`;

  return (
    <button aria-label={tip} title={tip} onClick={toggleDarkMode} className={headerCSS.btn}>
      {isDarkMode ? <DarkIcon /> : <LightIcon />}
      <span className="md:hidden ml-4 text-xl font-bold">{t("toggle.scheme")}</span>
    </button>
  );
}

function GithubHyperlink() {
  const { t } = useTranslation();
  return (
    <a href={"https://github.com/Ba1oretto/Blog-Website"} className={headerCSS.btn} target={"_blank"} rel="noreferrer">
      <GithubIcon />
      <span className="md:hidden ml-4 text-xl font-bold">{t("other.source")}</span>
    </a>
  );
}

const ToolList: ComponentEntry[] = [
  {name: "ColorScheme", component: <ColorScheme />},
  {name: "GithubHyperlink", component: <GithubHyperlink />},
  {name: "Language", component: <Language />},
];

export default function ToolBar() {
  return (
    <ul className={headerCSS.ul}>
      {ToolList.map(entry => (
        <li className={headerCSS.li} key={entry.name}>
          {entry.component}
        </li>
      ))}
    </ul>
  );
}