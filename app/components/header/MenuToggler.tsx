import type { Dispatch, SetStateAction } from "react";
import classNames from "classnames";

export default function MenuToggler({ open_state }: { open_state: [ boolean, Dispatch<SetStateAction<boolean>> ] }) {
  const [ open, setOpen ] = open_state;

  function handleClick() {
    setOpen(prevState => {
      const nextState = !prevState;
      document.body.classList[nextState ? "add" : "remove"]("Freeze");
      return nextState;
    });
  }

  return (
    <button className="md:hidden flex items-center py-8 pl-4 w-full dark:text-white-200" onClick={ handleClick }>
      <div className="[&>*]:h-1 [&>*]:w-8 [&>*]:top-0 [&>*]:relative [&>*]:bg-blue-1100 dark:[&>*]:bg-white-200 [&>*]:rounded-3xl [&>*]:transition-all [&>*]:ease-in-out [&>*]:duration-200">
        <div className={ classNames(open && "rotate-45 !top-2.5") } />
        <div className={ classNames("m-[6px_0]", open && "rotate-180 opacity-0") } />
        <div className={ classNames(open && "-rotate-45 !-top-2.5") } />
      </div>
      <span className="ml-4 font-bold text-xl">Toggle Menu</span>
    </button>
  );
}