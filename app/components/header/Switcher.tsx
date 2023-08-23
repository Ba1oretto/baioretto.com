import type { ReactNode } from "react";
import { useContext } from "react";
import { HeaderStateContext } from "~/components/header/Header";

type SettingArgs = {
  children: ReactNode,
  fn?: () => void,
};

export default function Switcher({ children, fn }: SettingArgs) {
  const setOpen = useContext(HeaderStateContext);

  const handleClick = () => {
    fn && fn();
    document.body.classList.remove("Freeze");
    setOpen(false);
  };

  return (
    <button onClick={handleClick} className="RoundedButton">
      {children}
    </button>
  );
}