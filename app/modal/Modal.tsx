import type { Dispatch, KeyboardEvent, MouseEvent, ReactNode, SetStateAction } from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import ReactFocusLock from "react-focus-lock";

const FocusLock = (ReactFocusLock as any).default as typeof ReactFocusLock;

interface ModalArgs {
  className?: string;
  children: ReactNode;
  freeze?: boolean;
  onModalOutsideClick?: (event: MouseEvent) => void;
  onModalEntering?: () => void;
}

interface ModalFunction {
  is_open: boolean;
  reference: HTMLDialogElement,
  setOpen: Dispatch<SetStateAction<boolean>>;
  setMouseInteraction: (value: boolean) => void;
}

export type CloseButtonFunction = (event: MouseEvent | KeyboardEvent) => void;

export function isClick(event: any): event is MouseEvent {
  return event?.type === "click";
}

export const ModalInit = {} as ModalFunction;

export default forwardRef<ModalFunction, ModalArgs>(function Modal({
  className,
  children,
  freeze = true,
  onModalOutsideClick,
  onModalEntering,
}, ref) {
  const modal_ref = useRef<HTMLDialogElement>(null);
  const [ is_open, setOpen ] = useState(false);
  const [ is_mouse_interaction, setMouseInteraction ] = useState(true);

  useImperativeHandle(ref, () => ({
    is_open,
    reference: modal_ref.current!,
    setOpen,
    setMouseInteraction,
  }), [ is_open ]);

  function onOutsideClick(event: MouseEvent) {
    event.stopPropagation();
    onModalOutsideClick && onModalOutsideClick(event);
  }

  useEffect(() => {
    freeze && document.body.classList[is_open ? "add" : "remove"]("modal-freeze");
  }, [ freeze, is_open ]);

  return (
    <CSSTransition
      in={ is_open }
      classNames="modal"
      nodeRef={ modal_ref }
      timeout={ 300 }
      onEntering={ onModalEntering }
      mountOnEnter
      unmountOnExit
    >
      <dialog
        ref={ modal_ref }
        onClick={ onOutsideClick }
        className={ className }
      >
        <div onClick={ e => e.stopPropagation() }>
          { FocusLock ? (
            <FocusLock returnFocus={ !is_mouse_interaction }>
              { children }
            </FocusLock>
          ) : (
            <ReactFocusLock returnFocus={ !is_mouse_interaction }>
              { children }
            </ReactFocusLock>
          ) }
        </div>
      </dialog>
    </CSSTransition>
  );
});