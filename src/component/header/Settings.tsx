import React, { useEffect, useRef, useState } from "react";
import useTranslation from "../../hook/useTranslation";
import useOverflow from "../../hook/useOverflow";
import type { Lang } from "../../type";
import Modal from "../modal/Modal";
import classNames from "classnames";
import useDarkMode from "../../hook/useDarkMode";

const languageList = {
  en: "English",
  ja: "日本語",
  zhCN: "简体中文",
  zhTW: "繁體中文",
};

function LanguageSetting() {
  const [ modalVisible, setModalVisible ] = useState(false);
  const { language, t, setLanguage } = useTranslation();
  const enableOverflow = useOverflow();

  const langSettingBtn = useRef({} as HTMLButtonElement);
  const firstLang = useRef({} as HTMLButtonElement);
  const lastLang = useRef({} as HTMLButtonElement);
  const currentLang = useRef<HTMLButtonElement>(null); // make this ref nullable

  function changeLanguage(key: string) {
    setLanguage(key as Lang);
    setModalVisible(false);
  }

  function showModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (langSettingBtn.current.contains(e.target as HTMLElement)) setModalVisible(true);
  }

  useEffect(() => {
    enableOverflow(!modalVisible);
  }, [ modalVisible ]);

  return (
    <>
      <button ref={langSettingBtn} aria-label={t("toggle.language")} onClick={showModal} className="setting">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z " />
        </svg>
      </button>
      {modalVisible &&
        <Modal
          firstElement={firstLang}
          lastElement={lastLang}
          onLeaveFocusEl={langSettingBtn}
          setModalVisible={setModalVisible}
          onEnterFocusEl={currentLang}
        >
          <div id="language-selector" className="bg-white dark:bg-black-750 rounded-md leading-8 transition-transform transform p-6">
            <h1 className="font-bold mb-4 text-3xl leading-snug">{t("language.index")}</h1>
            <p className="mb-10">{t("language.intro")}</p>
            <ul className="md:justify-center">
              {Object.entries(languageList).map(([ key, value ], index) => (
                <li key={key}>
                  <button ref={index === 0 ? firstLang : language === key ? currentLang : null} className={classNames("InteractiveBlock", (language === key) && "bg-blue-300 pointer-events-none")} key={key} onClick={() => changeLanguage(key)}>
                    {value}
                  </button>
                </li>
              ))}
            </ul>
            <button ref={lastLang} onClick={() => setModalVisible(false)} className="flex absolute top-0 right-0 p-6 md:m-3 md:p-3 uppercase text-sm font-bold rounded-xl transition-colors hover:text-red-500 group">
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="20" height="20" className="transition-transform group-hover:rotate-90 hidden md:block">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
              <svg viewBox="0 0 36 36" fill="currentColor" width="24" height="24" className={"md:hidden"}>
                <path d="M36.0002 5.00012L30.7462 -0.253906L17.8731 12.6191L5.00012 -0.253866L-0.253906 5.00016L12.6191 17.8732L-0.253784 30.7461L5.00024 36.0001L17.8731 23.1272L30.7461 36.0001L36.0001 30.7461L23.1272 17.8732L36.0002 5.00012Z"></path>
              </svg>
              <span className={"ml-2 hidden md:block"}>{t("action.close")}</span>
            </button>
          </div>
        </Modal>
      }
    </>
  );
}

function ColorSetting() {
  const { setDarkMode } = useDarkMode();
  const { t } = useTranslation();

  function toggleDarkMode() {
    setDarkMode(prevState => !prevState);
  }

  return (
    <button aria-label={t("toggle.scheme")} onClick={toggleDarkMode} className="setting">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="hidden dark:block">
        <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
      </svg>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="dark:hidden">
        <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
      </svg>
    </button>
  );
}

export default function Settings() {
  return (
    <div className="settings md:flex">
      <ColorSetting />
      <LanguageSetting />
    </div>
  );
}