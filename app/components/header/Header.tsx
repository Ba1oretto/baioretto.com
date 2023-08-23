import { createContext, useState } from "react";

import { _NavLinks, PathLink } from "./PathLink";
import { ChangeColorScheme, UploadFile } from "~/components/header/Settings";
import MenuToggler from "~/components/header/MenuToggler";

export const HeaderStateContext = createContext((_: boolean) => {});

export default function Header() {
  const open_state = useState(false);
  const [ open, setOpen ] = open_state;

  return (
    <header className="w-full z-50 fixed top-0 flex md:py-6 dark:bg-blue-1050/80 shadow-md backdrop-blur-sm">
      <div className="container md:mx-auto">
        <HeaderStateContext.Provider value={setOpen}>
          <MenuToggler open_state={open_state} />
          <menu className="max-md:absolute max-md:top-0 max-md:left-0 max-md:right-0 flex flex-col md:flex-row justify-between md:items-center max-md:px-3 max-md:py-6 max-md:bg-white-900/50 max-md:dark:bg-blue-1050/80 max-md:[&>*>*]:shadow-md max-md:[&>*>*]:backdrop-blur-sm max-md:pointer-events-none max-md:invisible max-md:opacity-0 max-md:transition-all data-[open=true]:pointer-events-auto data-[open=true]:visible data-[open=true]:top-full data-[open=true]:opacity-100" data-open={open}>
            <nav className="md:flex uppercase tracking-wider ml-1">
              {_NavLinks.map(link => (
                <PathLink key={link.name} {...link} />
              ))}
            </nav>
            <div className="md:flex">
              <UploadFile />
              <ChangeColorScheme />
              {/* TODO Implement: i18n */}
            </div>
          </menu>
        </HeaderStateContext.Provider>
      </div>
    </header>
  );
}
