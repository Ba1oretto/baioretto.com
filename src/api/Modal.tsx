import { useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import type { DomModalContext } from "../type";
import { ModalContext } from "../App";

// example additional class: grid-cols-modal550
export default function Modal({ children, className }: { className?: string, children: ReactNode }) {
  const { ref, setClassList, backToDefault } = useContext(ModalContext) as DomModalContext;

  useEffect(() => {
    if (className) setClassList(className);
    return () => {
      backToDefault();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(children, ref.current);
}