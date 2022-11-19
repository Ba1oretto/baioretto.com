import React, { useContext } from "react";
import "./ToggleMenuBtnCSS.css";
import { ToggleVisibility } from "./PageHeader";
import useTranslation from "../../hook/useTranslation";

export default function ToggleMenuBtn() {
  const { setVisible } = useContext(ToggleVisibility);
  const { t } = useTranslation();

  return (
    <div className={"cursor-pointer flex items-center ml-auto block md:hidden py-8 px-4"} onClick={() => setVisible()}>
      <div id="animated-bar" className={"select-none"}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
      <span className="font-bold ml-4 text-white text-xl">{t("toggle.menu")}</span>
    </div>
  );
}