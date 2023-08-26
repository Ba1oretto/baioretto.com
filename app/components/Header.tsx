import type { Dispatch, MouseEvent, SetStateAction } from "react";
import { useId, useState } from "react";
import { Link, useLocation, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { ToggleColorSchemeButton, UploadFileButton } from "~/components/Settings";

function MenuToggleButton({ menu_state }: { menu_state: [ boolean, Dispatch<SetStateAction<boolean>> ] }) {
  const [ open, setOpen ] = menu_state;

  function onButtonClick() {
    setOpen(prev_state => {
      const next_state = !prev_state;
      document.body.classList[next_state ? "add" : "remove"]("Freeze");
      return next_state;
    });
  }

  return (
    <button className="md:hidden flex items-center py-8 pl-8 w-full border-none dark:text-white-200" onClick={ onButtonClick }>
      <div>
        <div className={ classNames("menu-toggle-button-line", open && "rotate-45 !top-2.5") } />
        <div className={ classNames("menu-toggle-button-line m-[6px_0]", open && "rotate-180 opacity-0") } />
        <div className={ classNames("menu-toggle-button-line", open && "-rotate-45 !-top-2.5") } />
      </div>
      <span className="ml-4 font-bold text-xl">Toggle Menu</span>
    </button>
  );
}

function LinkButton({ name, path, clickHandler }: { name: string, path: string, clickHandler: (value: boolean) => void }) {
  const detail_id = useId();
  const is_pending = useNavigation().state === "loading";
  const { pathname } = useLocation();

  const is_active = pathname === path;

  function onLinkClick(event: MouseEvent) {
    if (is_active || is_pending) {
      event.preventDefault();
    } else {
      clickHandler(false);
    }
  }

  return (
    <Link
      to={ path }
      aria-describedby={ detail_id }
      aria-hidden={ is_active }
      onClick={ onLinkClick }
      className={ classNames("link-button", is_active && "bg-blue-300") }
    >
      <p id={ detail_id } className="sr-only">Navigate to { name }</p>
      { name }
    </Link>
  );
}

export default function Header() {
  const menu_state = useState(false);
  const [ is_open, setOpen ] = menu_state;

  return (
    <header className="fixed top-0 w-full flex md:py-6 dark:bg-blue-1050/80 shadow-md backdrop-blur-sm z-50">
      <div className="md:container md:mx-auto w-full">
        <MenuToggleButton menu_state={ menu_state } />
        <menu className="header-menu" data-open={ is_open }>
          <nav className="md:flex uppercase tracking-wider ml-1">
            <LinkButton name="home" path="/home" clickHandler={ setOpen } />
            <LinkButton name="post" path="/post" clickHandler={ setOpen } />
            <LinkButton name="test2" path="/test2" clickHandler={ setOpen } />
          </nav>
          <div className="md:flex">
            <ToggleColorSchemeButton />
            <UploadFileButton />
          </div>
        </menu>
      </div>
    </header>
  );
}
