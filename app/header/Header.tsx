import type { Dispatch, MouseEvent, SetStateAction } from "react";
import { memo, useId, useState } from "react";
import { Link, useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { ToggleColorSchemeButton, UploadFileButton } from "~/header/Settings";
import type { loader } from "~/root";

function MenuToggleButton({ menu_state }: { menu_state: [ boolean, Dispatch<SetStateAction<boolean>> ] }) {
  const [ open, setOpen ] = menu_state;

  function onButtonClick() {
    setOpen(prev_state => {
      const next_state = !prev_state;
      document.body.classList[next_state ? "add" : "remove"]("freeze");
      return next_state;
    });
  }

  return (
    <button className="w-full md:hidden flex items-center py-8 pl-8 border-none" onClick={ onButtonClick }>
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
      document.body.classList.remove("freeze");
    }
  }

  return (
    <Link
      to={ path }
      aria-describedby={ detail_id }
      aria-hidden={ is_active }
      onClick={ onLinkClick }
      className={ classNames("link-button", is_active && "bg-royal-blue") }
    >
      <p id={ detail_id } className="sr-only">Navigate to { name }</p>
      { name }
    </Link>
  );
}

export default memo(function Header() {
  const { user } = useLoaderData<typeof loader>();
  const menu_state = useState(false);
  const [ is_open, setOpen ] = menu_state;
  const post_name = new URLSearchParams(useLocation().search).get("title");

  return (
    <header className="fixed top-0 w-full flex md:py-6 dark:bg-ink-blue/80 dark:text-light-gray shadow-md backdrop-blur-sm z-20">
      <div className="md:container md:mx-auto w-full">
        <MenuToggleButton menu_state={ menu_state } />
        <menu className="header-menu" data-open={ is_open }>
          <nav className="md:flex uppercase tracking-wider ml-1">
            <LinkButton name="home" path="/home" clickHandler={ setOpen } />
            <LinkButton name="post" path="/post" clickHandler={ setOpen } />
            <LinkButton name="junction" path="/junction" clickHandler={ setOpen } />
            { user && <LinkButton name="New" path="/new" clickHandler={ setOpen } /> }
          </nav>
          { post_name && (
            <section className="hidden md:inline-flex gap-x-2 font-medium tracking-widest">
              <p>Current At</p>
              <p className="text-forest-green">{ `"${ post_name }"` }</p>
            </section>
          ) }
          <section className="md:flex">
            <ToggleColorSchemeButton />
            <UploadFileButton />
          </section>
        </menu>
      </div>
    </header>
  );
});
