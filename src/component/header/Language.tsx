import React, { useCallback, useContext, useRef, useState } from "react";
import useTranslation, { Lang } from "../../hook/useTranslation";
import Modal from "../../api/Modal";
import { useEventListener } from "usehooks-ts";
import classNames from "classnames";
import { Interaction } from "../../util";
import { headerCSS } from "./PageHeader";
import CloseBtn from "../../api/CloseBtn";
import { ElRefs } from "../../App";
import { DomElementContext } from "../../type";
import { LanguageIcon } from "../../api/Icon";

function LanguageSelector({ hidden, setHidden }: { hidden: boolean, setHidden: React.Dispatch<boolean> }) {
  const { language, t, setLanguage } = useTranslation();
  const { modalReference } = useContext(ElRefs) as DomElementContext;
  const { modal } = modalReference;

  useEventListener("click", (e) => {
    if (modal.current === e.target) setHidden(true);
  }, modal);

  function handleChangeLanguage(key: string) {
    if (key === language) return;
    setLanguage(key as Lang);
    setHidden(true);
  }

  const handleClose = useCallback(() => {
    setHidden(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hidden ? null : (
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

const languageList = {
  en: "English",
  ja: "日本語",
  zhCN: "简体中文",
  zhTW: "繁體中文",
};

export default function Language() {
  const [hidden, setHidden] = useState(true);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const { language, t } = useTranslation();
  const tip = `${t("language.change.tip")}: ${languageList[language]}`;

  const handleCLick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (btnRef.current?.contains(e.target as Node)) setHidden(!hidden);
  }, [hidden]);

  return (
    <button ref={btnRef} aria-label={tip} title={tip} onClick={handleCLick}
            className={headerCSS.btn}>
      <LanguageIcon />
      <LanguageSelector hidden={hidden} setHidden={setHidden} />
      <span className="md:hidden ml-4 text-xl font-bold">{t("toggle.language")}</span>
    </button>
  );
}