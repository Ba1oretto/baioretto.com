import React, { useCallback, useEffect, useRef, useState } from "react";
import useTranslation from "../../hook/useTranslation";
import { headerCSS } from "./PageHeader";
import { LanguageIcon } from "../../api/Icon";
import LanguageSelector, { languageList } from "../../api/LanguageSelector";
import useOverflow from "../../hook/useOverflow";

export default function Language() {
  const [showSelector, setShowSelector] = useState(false);
  const btnRef = useRef<HTMLButtonElement>({} as HTMLButtonElement);
  const { language, t } = useTranslation();
  const { setOverflow, resetOverflow } = useOverflow();

  const tip = `${t("language.change.tip")}: ${languageList[language]}`;

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (btnRef.current.contains(e.target as HTMLElement)) setShowSelector(prevState => !prevState);
  }, []);

  useEffect(() => {
    if (showSelector) setOverflow("hidden");
    else resetOverflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSelector]);

  return (
    <button ref={btnRef} aria-label={tip} title={tip} onClick={handleClick}
            className={headerCSS.btn}>
      <LanguageIcon />
      {showSelector && <LanguageSelector setShowSelector={setShowSelector} />}
      <span className="md:hidden ml-4 text-xl font-bold">{t("toggle.language")}</span>
    </button>
  );
}