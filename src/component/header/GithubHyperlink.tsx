import React from "react";
import Hyperlink from "../../api/Hyperlink";
import { headerCSS } from "./PageHeader";
import useTranslation from "../../hook/useTranslation";
import { GithubIcon } from "../../api/Icon";

export default function GithubHyperlink() {
  const { t } = useTranslation();
  return(
    <Hyperlink link={"https://github.com/Ba1oretto/Blog-Website"} target={"_blank"} elementClass={headerCSS.btn}>
      <GithubIcon />
      <span className="md:hidden ml-4 text-xl font-bold">{t("other.source")}</span>
    </Hyperlink>
  );
}