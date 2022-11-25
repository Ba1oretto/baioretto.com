import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "./component/header/PageHeader";
import PageFooter from "./component/footer/PageFooter";
import PageContent from "./component/container/PageContent";
import PageModal from "./component/modal/PageModal";
import type { DomModalContext } from "./type";
import classNames from "classnames";

type NavbarState = {
  isNavbarActive: boolean,
  setNavbarActive: React.Dispatch<React.SetStateAction<boolean>>,
  toggleNavbarState: () => void,
}

export const ModalContext = createContext<DomModalContext>({} as DomModalContext);
export const NavbarContext = createContext<NavbarState>({} as NavbarState);

function App() {
  const modalObject = useRef<DomModalContext>({} as DomModalContext);
  const [modalState, setModalState] = useState<DomModalContext>({} as DomModalContext);
  const [isNavbarActive, setNavbarActive] = useState(false);

  const toggleNavbarState = useCallback(() => {
    setNavbarActive(prevState => !prevState);
  }, []);

  useEffect(() => {
    setModalState({
      ref: modalObject.current.ref,
      setClassList: modalObject.current.setClassList,
      backToDefault: modalObject.current.backToDefault,
    });
  }, [modalObject]);

  return (
    <div
      className={classNames("min-h-screen grid grid-rows-[auto_1fr_auto] dark:bg-dark dark:text-dark", { "navbar-open": isNavbarActive })}>
      <ModalContext.Provider value={modalState}>
        <NavbarContext.Provider value={{ isNavbarActive, setNavbarActive, toggleNavbarState }}>
          <PageHeader />
        </NavbarContext.Provider>
        <PageContent />
        <PageFooter />
      </ModalContext.Provider>
      <PageModal ref={modalObject} />
    </div>
  );
}

export default App;
