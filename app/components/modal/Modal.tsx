import type { KeyboardEvent, ReactNode, UIEvent } from "react";
import { createContext, useContext, useReducer, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import ReactFocusLock from "react-focus-lock";

// :(
const FocusLock = (ReactFocusLock as any).default as typeof ReactFocusLock;

type ModalStateType = {
  visible: boolean,
  content: ReactNode,
  classname: string,
  close_by_mouse: boolean,
};

type ModalReducerActionType = {
  type: "show" | "hide",
  context: { [Property in keyof ModalStateType]: ModalStateType[Property] },
};

type ModalContextType = {
  showModal: (content: ReactNode, classname: string) => void,
  hideModal: (event: UIEvent<HTMLElement>) => void,
} & ModalStateType;

const ModalContext = createContext({} as ModalContextType);

function modalReducer(state: ModalStateType, { type, context }: ModalReducerActionType) {
  switch (type) {
    case "show":
      return {
        visible: context.visible,
        content: context.content,
        classname: context.classname,
        close_by_mouse: false,
      };
    case "hide":
      return {
        visible: context.visible,
        content: context.content,
        classname: context.classname,
        close_by_mouse: context.close_by_mouse,
      };
    default:
      throw Error("?");
  }
}

const _DefaultModalState: ModalStateType = {
  visible: false,
  content: null,
  classname: "",
  close_by_mouse: false,
};

function ModalProvider({ children }: { children: ReactNode }) {
  const [ modal_state, modalDispatch ] = useReducer(modalReducer, _DefaultModalState);

  /**
   * Need to wrap a top-level component(like React.Fragment) due to component initialize procedure.
   * @param content
   * @param classname
   */
  function showModal(content: ReactNode, classname: string) {
    modalDispatch({
      type: "show", context: {
        ...modal_state,
        visible: true,
        content,
        classname,
      },
    });
    document.body.classList.add("overflow-hidden");
  }

  function hideModal(event: UIEvent<HTMLElement>) {
    if (event.type === "keydown" && !((event as KeyboardEvent<HTMLElement>).key === "Enter"))
      return;
    event.preventDefault();
    modalDispatch({
      type: "hide", context: {
        ...modal_state,
        visible: false,
        close_by_mouse: event.type === "click",
      },
    });
    document.body.classList.remove("overflow-hidden");
  }

  return (
    <ModalContext.Provider value={ {
      ...modal_state,
      showModal,
      hideModal,
    } }>
      { children }
    </ModalContext.Provider>
  );
}

// ReactRouter-like component
function ModalOutlet() {
  const { visible, content, classname, close_by_mouse, hideModal } = useContext(ModalContext);
  const dialog_element_ref = useRef(null);

  return (
    <CSSTransition
      in={ visible }
      nodeRef={ dialog_element_ref }
      timeout={ 300 }
      classNames="modal"
      mountOnEnter
      unmountOnExit
    >
      <dialog
        ref={ dialog_element_ref }
        className={ classname }
        onClick={ hideModal }
      >
        <div onClick={ e => e.stopPropagation() }>
          { FocusLock ? (
            <FocusLock returnFocus={ !close_by_mouse }>
              { content }
            </FocusLock>
          ) : (
            <ReactFocusLock returnFocus={ !close_by_mouse }>
              { content }
            </ReactFocusLock>
          ) }
        </div>
      </dialog>
    </CSSTransition>
  );
}

export {
  ModalContext,
  ModalProvider,
  ModalOutlet,
};