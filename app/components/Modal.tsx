import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";

const FocusLock = (ReactFocusLock as any).default as typeof ReactFocusLock;

interface ModalArgs {
  class_prefix: string;
  addition_class?: string;
  children: ReactNode;
}

export interface ModalFunction {
  setOpen: (value: boolean) => void;
  setMouseInteraction: (value: boolean) => void;
}

export type CloseButtonFunction = (event: MouseEvent | KeyboardEvent) => void;

export function isClick(event: any): event is MouseEvent {
  return event?.type === "click";
}

export default forwardRef<ModalFunction, ModalArgs>(function Modal({ class_prefix, addition_class, children }, ref) {
  const modal_ref = useRef(null);
  const [ is_open, setOpen ] = useState(false);
  const [ is_mouse_interaction, setMouseInteraction ] = useState(true);

  useImperativeHandle(ref, () => ({
    setOpen,
    setMouseInteraction,
  }), []);

  function onBorderClick(event: MouseEvent) {
    event.stopPropagation();
    setOpen(false);
  }

  return (
    <CSSTransition
      in={ is_open }
      classNames={ class_prefix }
      nodeRef={ modal_ref }
      timeout={ 300 }
      mountOnEnter
      unmountOnExit
    >
      <dialog
        ref={ modal_ref }
        onClick={ onBorderClick }
        className={ classNames("modal-dialog", addition_class) }
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