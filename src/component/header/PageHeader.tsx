import React, { createContext, useCallback, useContext, useState } from "react";
import ToggleMenuBtn from "./ToggleMenuBtn";
import classNames from "classnames";
import { ElRefs } from "../../App";
import { DomElementContext } from "../../type";
import NavigatorList from "./NavigatorList";
import ToolBar from "./ToolBar";
import "./MenuBarCSS.css";

export const headerCSS = {
  ul: "md:flex md:justify-center md:items-center",
  li: "mb-4 lg:mr-4 md:mb-0 last:mr-0 relative",
  link: "flex items-center p-6 text-xl rounded-md transition-colors font-bold lg:text-lg lg:px-4 md:py-2",
  btn: "rounded-md lg:rounded-2/4 flex w-full items-center transition-colors p-6 md:p-4 hover:bg-yellow-550 hover:text-amber-800 md:hover:bg-gray-500 md:hover:text-inherit",
};

type MenuCondition = {
  visible: boolean
  setVisible: (condition?: boolean) => void
}

const ToggleVisibility = createContext<MenuCondition>({} as MenuCondition);

export default function PageHeader() {
  const [isOpen, setOpen] = useState(false);
  const { bodyReference } = useContext(ElRefs) as DomElementContext;

  const setOverflow = useCallback((condition: boolean) => {
    condition ? bodyReference.current.classList.add("mobile:overflow-hidden") : bodyReference.current.classList.remove("mobile:overflow-hidden");
    // eslint-disable-next-line
  }, []);

  const handleMenuToggle = useCallback((condition?: boolean) => {
    if (typeof condition === "boolean") {
      setOverflow(condition);
      setOpen(condition);
    } else setOpen(open => {
      setOverflow(!open);
      return !open;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className={"lg:py-6 sticky flex items-center top-0 bg-dark-test/80 backdrop-blur-sm"}>
      <ToggleVisibility.Provider value={{ visible: isOpen, setVisible: handleMenuToggle }}>
        <nav id="header-nav" className={classNames("z-40 container mx-auto", { "open": isOpen })}>
          <ToggleMenuBtn />
          <div className={"menu flex md:items-center justify-between flex-col md:flex-row uppercase tracking-wide"}>
            <NavigatorList />
            <ToolBar />
          </div>
        </nav>
      </ToggleVisibility.Provider>
    </header>
  );
}

export { ToggleVisibility };