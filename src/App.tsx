/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import useDarkMode from "./hook/useDarkMode";
import PageHeader from "./component/header/PageHeader";
import PageFooter from "./component/footer/PageFooter";
import PageContent from "./component/container/PageContent";
import PageModal from "./component/modal/PageModal";
import { DomElementContext } from "./type";

export const ElRefs = createContext<DomElementContext | undefined>(undefined);

function App() {
  const [modalClassName, setModalClassName] = useState<string>("opacity-0 pointer-events-none");
  const [isDarkMode] = useDarkMode(true);

  const modalRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const bodyRef = useRef<HTMLBodyElement>({} as HTMLBodyElement);
  const rootRef = useRef<HTMLDivElement>({} as HTMLDivElement);

  useLayoutEffect(() => {
    rootRef.current = document.getElementById("root") as HTMLDivElement;
    bodyRef.current = document.body as HTMLBodyElement;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <div className={"min-h-screen grid grid-rows-body dark:bg-dark-bg dark:text-dark-text"}>
      <ElRefs.Provider value={{
        modalReference: { modal: modalRef, setter: setModalClassName },
        rootReference: rootRef,
        bodyReference: bodyRef,
      }}>
        <PageHeader />
        <PageContent />
        <PageFooter />
      </ElRefs.Provider>
      <PageModal ref={modalRef} className={modalClassName} />
    </div>
  );
}

export default App;
