import { useContext, useId } from "react";
import { Link, useLocation, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { HeaderStateContext } from "~/components/header/Header";

type NavLinkArgs = {
  name: string,
  path: string,
};

export const _NavLinks: NavLinkArgs[] = [
  {
    name: "Home",
    path: "/home",
  },
  {
    name: "Post",
    path: "/post",
  },
  {
    name: "Junction",
    path: "/junction",
  },
  {
    name: "Escape Hatches",
    path: "/escape_hatches",
  },
];

export function PathLink({ name, path }: NavLinkArgs) {
  const setOpen = useContext(HeaderStateContext);
  const detail_id = useId();
  const { state } = useNavigation();
  const { pathname } = useLocation();

  if (state === "loading") return;
  const is_active = pathname === path;

  function handleClick() {
    setOpen(false);
    document.body.classList.remove("Freeze");
  }

  return (
    <Link
      to={ path }
      aria-describedby={ detail_id }
      aria-hidden={ is_active }
      tabIndex={ is_active ? -1 : undefined }
      onClick={ handleClick }
      className={ classNames(
        "flex items-center rounded-md font-bold text-xl md:text-lg mb-4 md:mb-0 md:mr-4 last:mr-0 p-6 md:px-4 md:py-2 transition-colors hover:bg-amber-200 hover:text-amber-800 group",
        is_active && "bg-blue-300 pointer-events-none",
      ) }
    >
      <p id={ detail_id } className="sr-only">Navigate to { name }</p>
      { name }
    </Link>
  );
}