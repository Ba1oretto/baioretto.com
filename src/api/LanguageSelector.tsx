import React, { useCallback, useContext } from "react";
import useTranslation from "../hook/useTranslation";
import { ModalContext } from "../App";
import type { DomModalContext, Lang } from "../type";
import { useEventListener } from "usehooks-ts";
import Modal from "./Modal";
import CloseBtn from "./CloseBtn";
import { headerCSS } from "../component/header/PageHeader";
import classNames from "classnames";
import { Interaction } from "../util";

export const languageList = {
  en: "English",
  ja: "日本語",
  zhCN: "简体中文",
  zhTW: "繁體中文",
};

export default function LanguageSelector({ setShowSelector }: { setShowSelector: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { language, t, setLanguage } = useTranslation();
  const { ref } = useContext(ModalContext) as DomModalContext;

  useEventListener("click", (e) => {
    if (ref.current === e.target) setShowSelector(false);
  }, ref);

  function handleChangeLanguage(key: string) {
    if (key === language) return;
    setLanguage(key as Lang);
    handleClose();
  }

  const handleClose = useCallback(() => {
    setShowSelector(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal className={"grid-cols-modal550"}>
      <div className={"p-6 transition-transform transform bg-gray-900 rounded-md leading-8"}>
        <CloseBtn onClick={handleClose} />
        <h1 className={"mb-6 text-6xl font-bold"}>{t("language.index")}</h1>
        <p className={"mb-6"}>{t("language.intro")}</p>
        <ul className={headerCSS.ul}>
          {Object.entries(languageList).map(([key, value]) =>
            <li key={key} className={headerCSS.li}>
              <button onClick={() => handleChangeLanguage(key)}
                      className={classNames("w-full", headerCSS.link, Interaction(language === key, "bg-blue-600", "hover:bg-yellow-550 hover:text-amber-800"))}>
                {value}
              </button>
            </li>,
          )}
        </ul>
      </div>
    </Modal>
  );
}