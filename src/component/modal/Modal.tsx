import React, { useEffect, useState } from "react";
import type { Children, SetStateAction } from "../../type";
import { createPortal } from "react-dom";
import { useEventListener } from "usehooks-ts";

// for accessibility
type ModalProps = {
  firstElement: React.MutableRefObject<HTMLButtonElement>,
  lastElement: React.MutableRefObject<HTMLButtonElement>,
  onLeaveFocusEl: React.MutableRefObject<HTMLButtonElement>,
  onEnterFocusEl?: React.RefObject<HTMLButtonElement>, // nullable
  setModalVisible: SetStateAction<boolean>,
} & Children;

/**
 * @param firstElement the first interactive element on modal
 * @param lastElement the last interactive element on modal
 * @param onLeaveFocusEl the element that makes this modal visible
 * @param children nested ReactNode
 * @param setStateAction state setter
 * @param onEnterFocusEl (optional) first focused element when modal appearing
 */
export default function Modal({
  firstElement,
  lastElement,
  onLeaveFocusEl,
  children,
  setModalVisible,
  onEnterFocusEl,
}: ModalProps) {
  const [ modalEl ] = useState(document.getElementById("modal") as HTMLDivElement);

  useEffect(() => {
    const classList = [ "opacity-0", "pointer-events-none" ];
    modalEl.classList.remove(...classList);
    return () => {
      modalEl.classList.add(...classList);
    };
  }, []);

  useEventListener("click", (e) => {
    if (modalEl === e.target) setModalVisible(false);
  });

  useEffect(() => {
    onEnterFocusEl?.current ? onEnterFocusEl.current.focus() : firstElement.current.focus();
    return () => {
      onLeaveFocusEl.current.focus();
    };
  }, []);

  return createPortal(
    <>
      <div tabIndex={0} onFocus={() => lastElement.current.focus()} />
      {children}
      <div tabIndex={0} onFocus={() => firstElement.current.focus()} />
    </>,
    modalEl,
  );
}