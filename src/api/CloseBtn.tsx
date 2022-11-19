import React from "react";
import useTranslation from "../hook/useTranslation";

type OnClickFn = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

export default function CloseBtn({ onClick }: OnClickFn) {
  const { t } = useTranslation();

  return (
    <button
      className={"top-0 right-0 absolute p-1 mobile:p-3 m-3 flex items-center font-bold uppercase text-sm transition-colors hover:text-red-500 group mobile:bg-gray-800 rounded-xl"}
      onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="20" height="20"
           className="mr-2 transition-transform group-hover:rotate-90 mobile:hidden">
        <path
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
      </svg>
      <svg viewBox="0 0 36 36" fill="currentColor" width="24" height="24" className={"lg:hidden"}>
        <path
          d="M36.0002 5.00012L30.7462 -0.253906L17.8731 12.6191L5.00012 -0.253866L-0.253906 5.00016L12.6191 17.8732L-0.253784 30.7461L5.00024 36.0001L17.8731 23.1272L30.7461 36.0001L36.0001 30.7461L23.1272 17.8732L36.0002 5.00012Z"></path>
      </svg>
      <span className={"mobile:hidden"}>{t("action.close")}</span>
    </button>
  );
}