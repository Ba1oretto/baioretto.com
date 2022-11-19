import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { DomElementContext, ElementChildren } from "../type";
import { ToggleVisibility } from "../component/header/PageHeader";
import { ElRefs } from "../App";

// example additional class: grid-cols-modal550
export default function Modal({ children, className }: ElementChildren & { className?: string }) {
  const { visible, setVisible } = useContext(ToggleVisibility);
  const { modalReference, rootReference } = useContext(ElRefs) as DomElementContext;
  const { modal, setter } = modalReference;

  useEffect(() => {
    const root = rootReference.current;
    if (className) setter(className);
    root.classList.add("mobile:overflow-hidden");
    return () => {
      setter("opacity-0 pointer-events-none");
      root.classList.remove("mobile:overflow-hidden");
      if (!visible) setVisible();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(children, modal.current);
}