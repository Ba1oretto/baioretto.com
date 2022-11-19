import React from "react";
import useDarkMode from "../../hook/useDarkMode";
import useTranslation from "../../hook/useTranslation";
import { headerCSS } from "./PageHeader";
import { DarkIcon, LightIcon } from "../../api/Icon";

export default function ColorScheme() {
  const [isDarkMode, toggle] = useDarkMode();
  const { t } = useTranslation();

  const tip = `${t("color.change.tip")}: ${isDarkMode ? t("color.dark") : t("color.light")}`;

  return (
    <button aria-label={tip} title={tip} onClick={toggle} className={headerCSS.btn}>
      {isDarkMode ? <DarkIcon /> : <LightIcon />}
      <span className="md:hidden ml-4 text-xl font-bold">{t("toggle.scheme")}</span>
    </button>
  );
}