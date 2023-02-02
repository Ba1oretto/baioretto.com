import type { StateSetter } from "~/utils/helper.server";

import { Link, useLocation } from "@remix-run/react";
import { memo, useId, useState } from "react";
import classNames from "classnames";
import { ColorScheme, useColorScheme } from "~/utils/ColorSchemeProvider";

type NavLinkArgs = {
  name: string,
  path: string,
};

const NavLinks: NavLinkArgs[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Post",
    path: "/post",
  },
];

function NavigatorLink({ name, path }: NavLinkArgs) {
  const linkDescriptionId = useId();
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link
      to={path}
      prefetch="intent"
      aria-describedby={linkDescriptionId}
      aria-hidden={isActive}
      tabIndex={isActive ? -1 : undefined}
      className={classNames(
        "flex items-center rounded-md font-bold text-xl md:text-lg mb-4 md:mb-0 md:mr-4 last:mr-0 p-6 md:px-4 md:py-2 transition-colors hover:bg-amber-200 hover:text-amber-800 group",
        isActive && "bg-blue-300 pointer-events-none",
      )}
    >
      <p id={linkDescriptionId} className="hidden">Navigate to {name}</p>
      {name}
    </Link>
  );
}

const Navigator = memo(function Navigator() {
  return (
    <nav className="md:flex uppercase tracking-wider ml-1">
      {NavLinks.map(l => (
        <NavigatorLink key={l.name} {...l} />
      ))}
    </nav>
  );
});

function ToggleColorScheme() {
  const { setColorScheme } = useColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(prevState => prevState === ColorScheme.DARK ? ColorScheme.LIGHT : ColorScheme.DARK);
  };

  return (
    <button onClick={toggleColorScheme} className="RoundedButton">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="hidden md:dark:block">
        <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
      </svg>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="dark:hidden max-md:hidden">
        <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
      </svg>
      <span className="md:hidden font-bold text-xl">Toggle Color Scheme</span>
    </button>
  );
}

function Setting() {
  return (
    <div className="md:flex">
      <ToggleColorScheme />
      <div>1</div>
    </div>
  );
}

const ToggleMenu = memo(function ToggleMenu({ setOpen }: { setOpen: StateSetter<boolean> }) {
  return (
    <button className="md:hidden flex items-center py-8 pl-4 w-full" onClick={() => setOpen(prevState => !prevState)}>
      <div className="bar">
        <div />
        <div />
        <div />
      </div>
      <span className="ml-4 font-bold text-xl dark:text-white">Toggle Menu</span>
    </button>
  );
});

export default function Header() {
  const [ open, setOpen ] = useState(false);

  return (
    <header className="md:py-6 relative md:sticky flex top-0 backdrop-blur-sm shadow-md dark:bg-black-700/80 w-full">
      <div className="HeaderMenu container md:mx-auto" data-headermenu-open={open}>
        <ToggleMenu setOpen={setOpen} />
        <menu className="flex flex-col md:flex-row justify-between md:items-center">
          <Navigator />
          <Setting />
        </menu>
      </div>
    </header>
  );
}
